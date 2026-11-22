/**
 * Gom kết quả trò chơi từ MỌI MÁY về một Google Sheet.
 * Cài đặt (khoảng 5 phút):
 *  1. Tạo một Google Sheet mới (sheets.new), đặt tên tuỳ ý.
 *  2. Menu Tiện ích mở rộng › Apps Script, xoá mã mẫu, dán toàn bộ tệp này vào.
 *  3. Đổi KEY bên dưới thành một chuỗi bí mật của bạn (dùng để admin đọc dữ liệu).
 *  4. Bấm Triển khai › Tùy chọn triển khai mới › Loại: Ứng dụng web
 *       - Thực thi dưới dạng: Tôi
 *       - Người có quyền truy cập: Bất kỳ ai
 *     Bấm Triển khai, cấp quyền, rồi sao chép "URL ứng dụng web" (…/exec).
 *  5. Trong trò chơi: đăng nhập admindthu@gmail.com › ⚙ Quản lý › dán URL và KEY › Lưu.
 *     Để MỌI máy cùng gửi dữ liệu, dán URL vào dòng  const SYNC_URL=''  trong index.html (hoặc gửi URL cho người dựng web).
 */
const KEY = 'doi-chuoi-bi-mat-nay';
const SHEET = 'Ket qua';
const HEAD = ['Thời gian', 'Email', 'Chủ đề', 'Kết quả', 'Quà', 'Mã nhận quà', 'Mã máy', 'Tên máy', 'IP'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEAD);
  return sh;
}

// Máy chơi gửi kết quả lên (POST, nội dung JSON)
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const s = v => String(v == null ? '' : v).slice(0, 200);
    sheet_().appendRow([new Date(d.at || Date.now()), s(d.email), s(d.theme), d.ok ? 'Đúng' : 'Sai', s(d.gift), s(d.code), s(d.deviceId), s(d.deviceName), s(d.ip)]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  }
}

// Admin đọc danh sách (GET ?key=…)
function doGet(e) {
  const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
  if ((e.parameter.key || '') !== KEY) return out({ error: 'key' });
  const v = sheet_().getDataRange().getValues().slice(1)
    .map(r => [r[0] instanceof Date ? r[0].toISOString() : r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]]);
  return out({ rows: v });
}
