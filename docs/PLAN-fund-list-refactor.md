# KẾ HOẠCH: Tái cấu trúc Danh sách Quỹ (Fund List Refactor)

> **Mục tiêu**: Tách logic hiển thị từng item quỹ (`FundItem`) ra khỏi `DrawerNavigation` để tăng khả năng tái sử dụng và giảm độ phức tạp của component cha.
> **Trạng thái**: Refactoring (UI Component).

---

## 🧠 Phân tích hiện trạng

Trong `DrawerNavigation.element.tsx`:
*   Logic render danh sách quỹ đang nằm trực tiếp trong vòng lặp `.map()`.
*   Code xử lý event (`onClick`, `StopPropagation` cho nút edit/delete) nằm lẫn lộn.
*   Logic tính toán style (`isActive`, icon color) bị lặp lại.

## 🏗️ Thiết kế Component Mới

### `FundItem` Component
Đường dẫn: `src/components/elements/fund/fund-item.element.tsx`
(Hoặc `src/pages/message/parts/sidebar/components/fund-item.tsx` nếu chỉ dùng cho message page, nhưng `Fund` là entity chung nên để ở `components/elements/fund` là hợp lý).

**Props Interface**:
```typescript
interface FundItemProps {
  fund: Fund;
  isActive?: boolean;
  onSelect: () => void;
  // Actions (Optional - nếu component dùng ở chỗ không được quyền sửa xóa thì không truyền)
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onViewMembers?: (e: React.MouseEvent) => void;
  
  // Role context
  isOwner?: boolean; // Để quyết định hiện nút edit/delete
}
```

## 📝 Các bước thực hiện

### Phase 1: Create `FundItem` Component
- [ ] Tạo file `src/components/elements/fund/fund-item.element.tsx`.
- [ ] Copy JSX/Styles từ `DrawerNavigation` sang.
- [ ] Định nghĩa Props chuẩn.

### Phase 2: Refactor `DrawerNavigation`
- [ ] Import `FundItem`.
- [ ] Thay thế block `.map(...)` bằng `<FundItem ... />`.
- [ ] Verify hành vi click/select và các nút action.

### Phase 3: Cleanup
- [ ] Xóa các imports thừa trong `DrawerNavigation` (ví dụ icon components nếu không dùng nữa).

---

## 🔎 Code Demo

```tsx
// DrawerNavigation.element.tsx
{funds.map((fund) => (
  <FundItem 
    key={fund.id}
    fund={fund}
    isActive={fund.id === currentFundId}
    isOwner={fund.membershipRole === "owner"}
    onSelect={() => handleSelectFund(fund.id)}
    onEdit={(e) => handleUpdateFund(e, fund.id)}
    onDelete={(e) => handleDeleteFund(e, fund.id)}
    onViewMembers={(e) => handleViewFundMembers(e, fund.id)}
  />
))}
```
