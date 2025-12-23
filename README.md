# FinCap - Expense Tracker

FinCap là ứng dụng quản lý chi tiêu cá nhân & nhóm, hỗ trợ theo dõi, phân tích và tối ưu hóa tài chính cá nhân.

## Tính năng chính
- Quản lý quỹ chi tiêu cá nhân và nhóm
- Đăng ký, phân loại danh mục chi tiêu
- Giao diện chat để nhập và quản lý giao dịch
- Thống kê, báo cáo chi tiêu trực quan
- Quản lý thành viên quỹ, phân quyền
- Đăng nhập xác thực người dùng

## Cài đặt & chạy dự án

### Yêu cầu
- Node.js >= 18
- Yarn hoặc npm

### Cài đặt

```bash
# Cài dependencies
npm install
# hoặc
yarn install
```

### Chạy ứng dụng

```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy ở địa chỉ: http://localhost:5173

## Cấu trúc thư mục
- `src/` - Mã nguồn chính
  - `apis/` - Giao tiếp API backend
  - `components/` - Các thành phần UI
  - `pages/` - Các trang chính
  - `redux/` - State management
  - `common/`, `lib/`, `hooks/` - Tiện ích, logic dùng chung

## Đóng góp
Mọi ý kiến đóng góp, báo lỗi hoặc đề xuất vui lòng tạo issue hoặc pull request.

## Giấy phép
MIT License
