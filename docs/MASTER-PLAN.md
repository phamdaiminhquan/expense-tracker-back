# MASTER PLAN: FinCap Product Evolution (Frontend + AI Agent)

> **Status**: 🟡 In Progress (2026 Pivot Active)
> **Last Updated**: 2026-02-25
> **Workflow**: Idea (User) → Master Plan (Agent) → Phase Detail Plan (Discuss) → Implementation.
> **Reference Plans**: [PLAN-2026](./PLAN-2026.md)

## 📜 CORE PROTOCOL (Strict)
1.  **Reference Driven**: Luôn tham chiếu và tuân thủ thứ tự trong Master Plan. Không nhảy cóc.
2.  **Adaptive Planning & Prioritization**:
    *   **Task Nền tảng** (Core/Architecture): Ưu tiên chèn vào **đầu** hoặc trước cá feature liên quan.
    *   **New Feature**: Phân tích và xếp vào vị trí hợp lý trong roadmap, không làm gián đoạn flow hiện tại trừ khi khẩn cấp.
3.  **Step-by-Step Execution Loop**:
    *   **B1. Analyze**: Tạo plan chi tiết cho *riêng* step đó (`docs/PLAN-{step}.md`).
    *   **B2. Discuss**: Thảo luận và đợi User Confirm plan.
    *   **B3. Implement**: Code theo plan đã duyệt.
    *   **B4. Verify**: Kiểm tra kỹ lưỡng (Build, Log check).
    *   **B5. Clean-up**: Sau khi User Confirm hoàn thành → **Xóa/Archive `PLAN-{step}.md` cũ** để docs gọn gàng.

---

## 🧭 2026 Strategic Pivot (Active)
- Định vị FinCap từ app ghi chép thành **AI Financial Agent**.
- Tập trung tạo trải nghiệm người dùng mở app mỗi ngày vì insight/chủ động từ AI.
- Giai đoạn ngắn hạn ưu tiên **validate UX nhanh bằng mock data** trước khi có API đầy đủ.

### Kiến trúc Agent đã chốt
- **Một Agent Tổng Quản** (orchestrator) là não trung tâm.
- **Fund/Wallet là switch chính**, còn **Agent là entry riêng bằng CTA lớn** trong nav; tất cả vẫn là ngữ cảnh của cùng một agent.
- Agent sử dụng các skill nội bộ: chọn fund, chọn ví, ghi giao dịch, giải thích quyết định.

---

## 🚀 Active Roadmap 2026 (Execution)

### 🔵 Phase 2026-A: MVP Mock (Now)
> **Goal**: Ra nhanh trải nghiệm mới với switch Fund/Wallet + Agent CTA riêng, không chờ API.

- [x] **A1. Nav Switch (Fund / Wallet) + Agent CTA**
  - Nâng cấp sidebar: switch chỉ gồm **Fund/Wallet** và thêm **nút Agent lớn riêng** như một entry độc lập.
  - Giữ context đã chọn khi đổi qua lại Fund/Wallet và khi vào Agent từ CTA.
- [ ] **A1.1 Agent UI Shell (Bước 1 khởi tạo Agent)**
  - Tạo màn hình Agent UI riêng để người dùng tương tác thay vì toast placeholder.
  - Màn hình gồm header Agent, vùng hội thoại rỗng (state initial), ô nhập lệnh tự nhiên.
- [x] **A2. Wallet Transaction View (Main View)**
  - API: `GET /wallets/:walletId/transactions` → `WalletTransactionsResponse`.
  - Click ví trong drawer → main view chuyển sang hiển thị giao dịch của ví (thay thế chat).
  - 5 loại transaction card theo `TransactionType`: EXPENSE (rose), INCOME (emerald), INTERNAL (blue), DEBT (amber), REVERSAL (gray).
  - Summary bar: tổng chi tiêu / thu nhập / số giao dịch.
  - **TODO (chờ BE)**: INTERNAL cần `fromWallet`/`toWallet`; DEBT cần `debtorName`/`dueDate`; REVERSAL cần `originalTransactionId`.
- [ ] **A3. Direct Wallet Transaction Mock**
  - Ghi chi tiêu thủ công trực tiếp vào ví.
  - Tự trừ tiền ở ví tương ứng.
- [x] **A3.1. Người dùng không thể xoá giao dịch**
  - Giao dịch chỉ có thể bị **đảo ngược (REVERSAL)**, không xoá khỏi hệ thống.
  - Đảm bảo tính toàn vẹn dữ liệu tài chính (audit trail).
- [ ] **A3.2. Chuyển khoản nội bộ (Internal Transfer)**
  - Cho phép chuyển tiền giữa các ví của cùng một người dùng.
  - Tạo giao dịch type `INTERNAL` với `fromWallet` → `toWallet`, trừ ví nguồn + cộng ví đích.
  - UI: chọn ví nguồn, ví đích, nhập số tiền, xác nhận.
- [ ] **A4. Agent Auto-Route Mock**
  - Agent tự tìm đúng fund + ví để tạo giao dịch tự động.
  - Có fallback mặc định khi câu lệnh thiếu dữ kiện.

### 🟣 Phase 2026-B: API Integration & Hardening (Next)
- [ ] Thay mock bằng API thật cho wallet history, create transaction, balance sync.
- [ ] Bổ sung optimistic/rollback cho luồng ghi nhanh nhiều giao dịch.
- [ ] Chuẩn hóa query key/cache key theo fundId-walletId.

### 🟢 Phase 2026-C: Product Scale (Later)
- [ ] Persona system + proactive insight.
- [ ] Analytics nâng cao (heartbeat, subscription hunter, doomsday warning).
- [ ] Shared space/social finance + monetization rollout.

---

## ✅ Exit Criteria cho Phase 2026-A
1. Chuyển switch Fund/Wallet mượt; vào Agent qua nút riêng không làm mất context đã chọn.
2. Tạo giao dịch thủ công tại ví làm giảm số dư đúng ví đó.
3. Mở lịch sử ví thấy đúng giao dịch vừa tạo.
4. Agent nhập liệu tự nhiên có thể tự chọn fund/ví đúng trên bộ câu test mẫu.

---

## 🎯 Strategic Goals
1.  **Code Quality**: Clean Architecture, Type Safety, standard hooks/components.
2.  **Performance**: Optimize re-renders, bundle size, and data fetching (Infinite Scroll).
3.  **User Experience**: Smooth interactions (Optimistic UI), responsive design.

---

## 📚 Baseline History (Completed Phases - Legacy)
> Giữ nguyên để tham chiếu tiến trình kỹ thuật đã hoàn thành trước pivot 2026.

### ✅ Phase 0: Foundation Clean-up (Completed)
- [x] Basic restructure (lib, contexts, components folders).
- [x] Remove critical `any` types.
- [x] Setup Testing (Vitest).

### ✅ Phase 1: Page Components Refactor (Completed)
> **Goal**: Decompose "God Components" into manageable, isolated parts.

- [x] **1.1 Message Chat Refactor** (Core Logic)
  - Extract Hooks: `useOptimisticChat`, `useScrollToBottom`.
  - Extract Components: `ChatList`, `ChatInput`.
- [x] **1.2 Infinite Scroll Implementation** 🌟
  - Implement Server-side pagination hook (`useInfiniteMessage`).
  - Integrate with `ChatList` skeleton.
- [x] **1.3 Client-side Money Parser (Optimistic AI)** 🚀
  - Create `useClientMoneyParser` hook (Regex logic).
  - Integrate with `useOptimisticChat` to show parsed amount immediately.
- [x] **1.4 Message Page Structure**
  - Extract Sidebar & Dialogs logic from `message.page.tsx`.
- [x] **1.5 Fund List Refactor**
  - Extract `FundCard` components.
  - Simplify `DrawerNavigation`.

### ✅ Phase 2: Architecture & State Management (Completed)
> **Goal**: Unify data flow and reduce prop drilling.

- [x] **Migrate to Zustand** (Replaced Redux for system state).
- [x] **Slim MessageRoute**: Moved message logic to MessagePage, reduced prop drilling.
- [x] **Unified API Layer**: All calls use standardized `axiosRequest` instance.

### ✅ Phase 3: Performance Optimization (Completed)
- [x] **Bundle Analysis**: Removed 6 unused dependencies (~300KB saved).
- [x] **Lazy Loading**: Route-level code splitting → Initial JS **-91%** (462→42 KB gz).
- [ ] **Lighthouse Audit**: (TODO) Formal Core Web Vitals audit.

### ✅ Phase 4: UI/UX Enhancements (Completed)
- [x] **Chat Message Animations**: Framer-motion slide-in with spring physics.
- [x] **Page Transition Animations**: Smooth fade between routes.
- [x] **Skeleton Loading Polish**: Staggered appearance with varied sizes.
- [ ] **Dark Mode Polish**: (TODO) Enable toggle + theme all components.

---

## 📌 Implementation Rules
1.  **Detailed Plan First**: Before starting any Phase, create a specific `PLAN-{feature}.md`.
2.  **Verify**: Always build and test before marking done.
3.  **Vietnamese**: All communication in Vietnamese.
