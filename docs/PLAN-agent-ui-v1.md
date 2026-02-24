# PLAN: Agent UI v1 (Mock-first)

> **Status**: 🟡 Draft
> **Last Updated**: 2026-02-24
> **Phase**: 2026-A / A1.1
> **Related**: [MASTER-PLAN](./MASTER-PLAN.md), [PLAN-2026](./PLAN-2026.md)

## 1) Mục tiêu
- Thay `toast` placeholder hiện tại bằng **màn hình Agent UI riêng**.
- Cho người dùng có thể vào Agent từ nút CTA trong nav và tương tác lệnh tự nhiên.
- Chưa cần AI thật; chỉ cần shell + mock response để validate UX.

## 2) Phạm vi v1 (In Scope)
- Tạo `AgentPanel` trong khu vực main view của trang chat.
- Header hiển thị trạng thái context (fund hiện tại, ví đã chọn nếu có).
- Vùng hội thoại mock (welcome + placeholder responses).
- Input agent và nút gửi.
- Điều hướng qua lại giữa `Chat` và `Agent` bằng state trong `MessagePage`.

## 3) Ngoài phạm vi v1 (Out of Scope)
- Không triển khai NLP parser production.
- Không gọi API AI backend.
- Không đồng bộ lịch sử agent với message list server.

## 4) Thiết kế kỹ thuật
- `MessagePage` thêm `activeMainView: "chat" | "agent"`.
- `onOpenAgent` từ nav set `activeMainView = "agent"`.
- Khi user chọn fund hoặc wallet, context cập nhật và AgentPanel đọc context từ props.
- AgentPanel gửi mock response cục bộ (state array).

## 5) Tiêu chí hoàn thành
1. Bấm nút Agent trong nav mở Agent UI ngay trong cột main.
2. Agent UI có input, gửi được prompt và hiển thị phản hồi mock.
3. Có nút quay lại Chat.
4. Không phát sinh lỗi TypeScript.

## 6) Verify
- Manual flow: Chat → Agent → gửi prompt → nhận mock response → back Chat.
- Check TypeScript errors cho file mới/chỉnh sửa.
