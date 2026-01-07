# Phân Tích Flow Đăng Nhập & Welcoming Screen

## 🔍 VẤN ĐỀ HIỆN TẠI

**Triệu chứng:**

- User đăng nhập thành công
- Được chuyển thẳng đến `/chat` route
- Không có loading screen, welcome screen, hoặc onboarding nào xuất hiện

---

## 📊 FLOW HIỆN TẠI (Chi Tiết)

### 1️⃣ **FormLogin.tsx** → Login Success

```
User nhập email/password
↓
handleSubmit() được gọi
↓
performAuth() được thực thi:
  - Gọi login() hoặc register() API
  - Gọi getListFunds({ page: 1, take: 1 })  [LIGHTWEIGHT CHECK]
  - Gọi getListWallets({ page: 1, take: 1 })  [LIGHTWEIGHT CHECK]
  - Set localStorage flags: mustCreateFund, mustCreateWallet, has_onboarded
  - Preload full data cho SWR cache (non-blocking)
↓
setTimeout(() => { onLogin(session) }) - 800ms delay
```

### 2️⃣ **LoginRoute.tsx** → Navigation

```
handleLogin(session) được gọi:
  - login(session) - cập nhật AuthContext
  - sessionStorage.setItem('justLoggedIn', 'true')
  - navigate('/chat', { state: { fromLogin: true } })

⚠️ ĐÂY LÀ NƠI PHÁT SINH VẤN ĐỀ
Navigate NGAY LẬP TỨC đến /chat mà không chờ...
```

### 3️⃣ **MessageRoute.tsx** → Render MessagePage

```
MessageRoute được mount:
  - Khởi tạo state & hooks (useFund, useMessage, useSWR)
  - Thực thi useSWR cho walletData
  - Render MessagePage với props

⚠️ MessageRoute KHÔNG KIỂM TRA ScreenWelcome ở đây
```

### 4️⃣ **MessagePage.tsx** → Render UI

```
MessagePage được render:
  ❌ KHÔNG CÓ LOGIC KIỂM TRA ScreenWelcome
  ❌ KHÔNG RENDER <ScreenWelcome /> component
  ↓
Hiển thị trực tiếp chat UI
  - walletData đang loading (từ SWR useSWR('wallets', ...))
  - funds đang loading (từ MessageRoute)
  - Nhưng UI không chờ loading xong
```

---

## ❌ ROOT CAUSES (Nguyên Nhân Gốc Rễ)

### Issue 1: **ScreenWelcome Không Được Render Ở Đúng Vị Trí**

- `ScreenWelcome.tsx` được tạo nhưng **KHÔNG BỨNG DÙNG ở MessagePage.tsx**
- `MessagePage.tsx` không có:
  ```tsx
  if (showWelcomeScreen) {
    return <ScreenWelcome ... />;
  }
  ```

### Issue 2: **Navigation Quá Nhanh (Race Condition)**

```
T=0ms: Login thành công
T=0ms: Navigate đến /chat (NGAY LẬP TỨC)
T=1ms: MessageRoute mount, useSWR bắt đầu fetch
T=500ms: Data bắt đầu về từ server

⚠️ By the time ScreenWelcome logic chạy, user đã ở /chat
```

### Issue 3: **Flags Không Được Check Ở Đúng Thời Điểm**

- Flags được set trong FormLogin.tsx
- Nhưng không có component nào kiểm tra chúng ở layer routing
- ScreenWelcome.tsx tồn tại nhưng **không được render bất kỳ nơi nào**

### Issue 4: **No Intermediate Loading State**

- Không có "loading screen" nào hiển thị khi:
  - Đang fetch dữ liệu initial
  - Đang kiểm tra onboarding status
  - User đang chờ welcome screen

---

## 🔧 GIẢI PHÁP ĐƯỢC ĐỀ XUẤT

### ✅ **Cách 1: Thêm ScreenWelcome vào MessagePage** (Recommended - Simple)

**File:** `src/pages/message/message.page.tsx`

```tsx
import { ScreenWelcome } from "@/components/ScreenWelcome";

export function MessagePage({ ... }: MessagePageProps) {
  // ... existing code ...

  // ADD THIS: Check if user needs onboarding
  const shouldShowWelcome =
    !isLoadingFunds &&
    (!walletData || funds.length === 0);

  // ADD THIS: Render ScreenWelcome if needed
  if (shouldShowWelcome) {
    return (
      <ScreenWelcome
        userName={currentUserName}
        walletData={walletData}
        onWalletMutate={onRefreshFunds}
        onCreateFund={onCreateFund}
        currentUserId={currentUserId}
        allUsers={currentUser ? [currentUser] : []}
        onComplete={() => {
          // When onboarding done, reload page to show main UI
          window.location.reload();
        }}
        onLogout={onLogout}
        funds={funds}
        isLoadingFunds={isLoadingFunds}
      />
    );
  }

  // Rest of existing MessagePage code...
  return (
    <React.Fragment>
      {/* Existing UI */}
    </React.Fragment>
  );
}
```

---

### ✅ **Cách 2: Tạo Loading Screen Giữa Login & Chat** (Better UX)

**File:** `src/routes/MessageRoute.tsx`

```tsx
import { LoadingScreenZen } from "@/components/LoadingScreenZen";
import { ScreenWelcome } from "@/components/ScreenWelcome";

export function MessageRoute() {
  const { fundId } = useParams();
  const navigate = useNavigate();
  const { currentUserId, currentUserName, currentUser, logout } = useAuth();

  // Fetch dữ liệu
  const { fundList, isLoading: isLoadingFunds, mutateList } = useFund(...);
  const { data: walletData, mutate: mutateWallets } = useSWR(...);

  // Logic: Check onboarding status
  const hasWallets = walletData?.data?.length > 0;
  const hasFunds = fundList?.data?.length > 0;
  const needsOnboarding = !hasWallets || !hasFunds;

  // Logic: Show loading screen khi dữ liệu đang fetch
  const isInitialLoading = isLoadingFunds || !walletData;

  // Nếu dữ liệu còn loading, hiển thị loading screen
  if (isInitialLoading) {
    return <LoadingScreenZen />;
  }

  // Nếu user cần onboarding, hiển thị welcome screen
  if (needsOnboarding) {
    return (
      <ScreenWelcome
        userName={currentUserName}
        walletData={walletData}
        onWalletMutate={mutateWallets}
        onCreateFund={async (name, type) => {
          // create fund...
          await mutateList(); // Refresh funds list
        }}
        currentUserId={currentUserId}
        allUsers={currentUser ? [currentUser] : []}
        onComplete={async () => {
          // After onboarding, refetch and show main UI
          await mutateList();
          await mutateWallets();
        }}
        onLogout={logout}
        funds={fundList?.data || []}
        isLoadingFunds={isLoadingFunds}
      />
    );
  }

  // Nếu không cần onboarding, render MessagePage bình thường
  return (
    <MessagePage
      fund={selectedFund}
      funds={visibleFunds}
      // ... rest props ...
    />
  );
}
```

---

### ✅ **Cách 3: Tạo Dedicated OnboardingRoute** (Most Structured)

**File:** `src/routes/AppRoutes.tsx`

```tsx
import { Navigate, useNavigate } from "react-router-dom";
import { MessageRoute } from "./MessageRoute";
import { LoginRoute } from "./LoginRoute";
import { OnboardingRoute } from "./OnboardingRoute";
import { useAuth } from "@/hooks/useAuth";

export function AppRoutes() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  // Nếu chưa auth, hiển thị login
  if (!isAuthed) {
    return <LoginRoute />;
  }

  // Nếu vừa login, check onboarding status
  const justLoggedIn = sessionStorage.getItem("justLoggedIn") === "true";
  if (justLoggedIn) {
    return <OnboardingRoute />;
  }

  // Nếu xong onboarding, vào main app
  return <MessageRoute />;
}
```

**File:** `src/routes/OnboardingRoute.tsx`

```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreenZen } from "@/components/LoadingScreenZen";
import { ScreenWelcome } from "@/components/ScreenWelcome";
import { getListFunds } from "@/apis/funds/fund.api";
import { getListWallets } from "@/apis/wallets/wallet.api";
import { useAuth } from "@/hooks/useAuth";
import useSWR from "swr";

export function OnboardingRoute() {
  const navigate = useNavigate();
  const { currentUserName, currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dữ liệu
  const { data: fundsData, mutate: mutateFunds } = useSWR(
    "onboarding-funds",
    async () => getListFunds({ page: 1, take: 10 })
  );

  const { data: walletsData, mutate: mutateWallets } = useSWR(
    "onboarding-wallets",
    async () => getListWallets({ page: 1, take: 10 })
  );

  // Kiểm tra khi dữ liệu ready
  useEffect(() => {
    if (fundsData && walletsData) {
      setIsLoading(false);
    }
  }, [fundsData, walletsData]);

  // Nếu còn loading, hiển thị loading screen
  if (isLoading) {
    return <LoadingScreenZen />;
  }

  // Nếu không cần onboarding, chuyển sang main app
  const hasFunds = fundsData?.data?.length > 0;
  const hasWallets = walletsData?.data?.length > 0;

  if (hasFunds && hasWallets) {
    sessionStorage.removeItem("justLoggedIn");
    navigate("/chat", { replace: true });
    return null;
  }

  // Hiển thị welcome screen nếu cần
  return (
    <ScreenWelcome
      userName={currentUserName}
      walletData={walletsData}
      onWalletMutate={mutateWallets}
      onCreateFund={async (name, type) => {
        // Handle fund creation
        await mutateFunds();
      }}
      currentUserId={currentUser?.id}
      allUsers={currentUser ? [currentUser] : []}
      onComplete={async () => {
        // After onboarding, go to main app
        sessionStorage.removeItem("justLoggedIn");
        navigate("/chat", { replace: true });
      }}
      onLogout={logout}
      funds={fundsData?.data || []}
      isLoadingFunds={false}
    />
  );
}
```

---

## 📋 COMPARISON TABLE

| Aspect                     | Cách 1 (Simple) | Cách 2 (Better) | Cách 3 (Best)    |
| -------------------------- | --------------- | --------------- | ---------------- |
| **Độ phức tạp**            | ⭐ (Simple)     | ⭐⭐ (Medium)   | ⭐⭐⭐ (Complex) |
| **User Experience**        | ⭐⭐            | ⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐       |
| **Code Organization**      | ⭐⭐            | ⭐⭐⭐          | ⭐⭐⭐⭐⭐       |
| **Separation of Concerns** | ⭐⭐            | ⭐⭐⭐          | ⭐⭐⭐⭐         |
| **Testability**            | ⭐⭐            | ⭐⭐⭐          | ⭐⭐⭐⭐         |
| **Implementation Time**    | 5 min           | 15 min          | 30 min           |

---

## 🎯 KHUYẾN CÁO

### 🏆 **Recommended: Cách 2 (Medium)**

- Đủ đơn giản để implement nhanh
- UX flow rõ ràng: Loading → Welcome → Main
- Đủ flexible để mở rộng sau
- Không quá "over-engineered"

### 🚀 **For Future Scale: Cách 3 (Best)**

- Khi ứng dụng phức tạp hơn
- Nhiều routes với onboarding logic khác nhau
- Cần testing riêng cho onboarding flow

---

## 🔄 IMPLEMENTATION CHECKLIST (Cách 2)

- [ ] Thêm ScreenWelcome import vào MessageRoute.tsx
- [ ] Thêm useSWR hook để fetch wallets data
- [ ] Thêm logic check `needsOnboarding` state
- [ ] Thêm loading screen (chỉ render khi isInitialLoading)
- [ ] Thêm welcome screen (chỉ render khi needsOnboarding)
- [ ] Thêm fallback: render MessagePage bình thường
- [ ] Test flow: New User → Welcome → Fund Created → Main App
- [ ] Test flow: Existing User → Direct → Main App

---

## 📝 NOTES

1. **Race Condition:** Flags được set trong FormLogin, nhưng component render ranh nhanh hơn
2. **SWR Preload:** Dữ liệu đã được preload trong FormLogin, nên MessageRoute sẽ có instant cache hit
3. **Loading State:** Quan trọng để UX không bị jump/flash
4. **Cleanup:** Nhớ remove `justLoggedIn` flag khi xong onboarding

---
