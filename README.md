# Đố vui 3D – Khu di tích Nguyễn Sinh Sắc

Mô hình 3D và trò chơi đố vui giới thiệu Khu di tích Nguyễn Sinh Sắc (Lăng Cụ Phó bảng, Cao Lãnh, Đồng Tháp), do nhóm nghiên cứu Trường Đại học Đồng Tháp (DThU) thực hiện.

**Mở trang web:** https://duckxyz06.github.io/Lang_cu_Pho_Bang/

## Nội dung
- Mô hình 3D dựng theo sơ đồ tham quan và ảnh flycam: Khu Mộ (vòm mộ, Hồ Sao), Đền thờ, Nghi Môn, Hồ sen có cầu, Nhà sàn Bác Hồ.
- Đứng một chỗ nhìn quanh 360° hoặc bật **🚶 Khám phá** để điều khiển nhân vật đi tham quan (W A S D / joystick, Chạy, Nhảy, Ngồi).
- 4 chủ đề: **Lăng mộ · Ao sen · Nhà sàn · Cổng**, mỗi chủ đề 20 câu hỏi A–B–C–D, nền là ảnh 360° chụp thực tế.
- Đăng nhập bằng email trước khi chơi; mỗi email chơi mỗi chủ đề 1 lần — trả lời xong chủ đề nào thì chủ đề đó bị khóa (dấu ✔). Dữ liệu lưu trên trình duyệt của thiết bị.
- Trả lời đúng nhận quà (móc khóa, sổ tay DThU, quà Ban Quản lý) kèm mã nhận quà.
- **Quản trị:** chỉ tài khoản `admindthu@gmail.com` (đăng nhập kèm mật khẩu quản trị) thấy nút **⚙ Quản lý**: danh sách các máy đạt phần thưởng kèm mã máy và IP, tên nhóm nghiên cứu, số lượng quà, số lượt thử, thống kê, xuất CSV, đổi mật khẩu.

## Gom dữ liệu từ mọi máy (Google Sheets)
Trang chạy trên GitHub Pages không có máy chủ, nên mặc định mỗi máy chỉ lưu dữ liệu của chính nó. Để admin xem danh sách máy đạt thưởng từ **tất cả** thiết bị:
1. Tải [`backend/Ket-qua-Lang-cu-Pho-Bang.xlsx`](backend/Ket-qua-Lang-cu-Pho-Bang.xlsx) lên Google Drive và mở bằng Google Trang tính (sheet mẫu: Times New Roman 14, kẻ ô, có sheet Thống kê tự tính). Mở **Tiện ích mở rộng › Apps Script**, dán nội dung [`backend/google-apps-script.gs`](backend/google-apps-script.gs), đổi `KEY` thành chuỗi bí mật, chạy hàm `caiDat` một lần.
2. **Triển khai › Tùy chọn triển khai mới › Ứng dụng web** (Thực thi: Tôi · Truy cập: Bất kỳ ai), sao chép URL `…/exec`.
3. Dán URL vào dòng `const SYNC_URL=''` trong `index.html` (để mọi máy cùng gửi), rồi trong ⚙ Quản lý nhập `KEY` và bấm **Tải dữ liệu mọi máy**.

Mỗi kết quả gửi lên gồm: thời gian, email, chủ đề, đúng/sai, quà, mã nhận quà, mã máy, tên máy, IP (IP lấy qua dịch vụ api.ipify.org).

## Ghi chú
- `index.html` là trang chính (~160 KB); ảnh 360° (`assets/pano/`) tải khi chọn chủ đề, nhân vật (`assets/nhanvat.glb`) tải nền. Cần Internet để tải thư viện three.js và phông chữ.
- Giao diện tự điều chỉnh cho máy tính, điện thoại xoay dọc và xoay ngang.
- Ảnh 360°: 360VR.com.vn · Phu Digital. Dữ kiện di tích: Cổng thông tin Du lịch Đồng Tháp, Sở VHTTDL Đồng Tháp.
- Mô hình là dựng hình minh họa theo sơ đồ, không phải bản vẽ kỹ thuật.
