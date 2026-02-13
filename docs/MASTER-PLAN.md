# MASTER PLAN: Expense Tracker Frontend

> **Status**: ✅ Completed
> **Last Updated**: 2026-02-13
> **Workflow**: Idea (User) → Master Plan (Agent) → Phase Detail Plan (Discuss) → Implementation.

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

## 🎯 Strategic Goals
1.  **Code Quality**: Clean Architecture, Type Safety, standard hooks/components.
2.  **Performance**: Optimize re-renders, bundle size, and data fetching (Infinite Scroll).
3.  **User Experience**: Smooth interactions (Optimistic UI), responsive design.

---

## 📅 Roadmap & Phases

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
