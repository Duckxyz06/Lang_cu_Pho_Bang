/**
 * LĂNG CỤ PHÓ BẢNG 3D — Gom kết quả trò chơi từ MỌI MÁY về Google Trang tính.
 *
 * CÀI ĐẶT (khoảng 5 phút):
 *  1. Tải tệp Ket-qua-Lang-cu-Pho-Bang.xlsx lên Google Drive › chuột phải › Mở bằng › Google Trang tính
 *     (hoặc Tệp › Lưu dưới dạng Google Trang tính).
 *  2. Tiện ích mở rộng › Apps Script › xoá mã mẫu › dán toàn bộ tệp này › Lưu.
 *  3. Đổi KEY bên dưới thành chuỗi bí mật của bạn (dùng để admin đọc dữ liệu).
 *  4. Chọn hàm caiDat › Chạy (cấp quyền lần đầu) — định dạng sheet Ket qua: Times New Roman 14, kẻ ô đầy đủ.
 *  5. Triển khai › Tùy chọn triển khai mới › Loại: Ứng dụng web
 *       Thực thi dưới dạng: Tôi · Người có quyền truy cập: Bất kỳ ai › Triển khai.
 *     Sao chép "URL ứng dụng web" (…/exec).
 *  6. Gắn URL vào trang web (dòng const SYNC_URL='' trong index.html), hoặc đăng nhập admindthu@gmail.com
 *     › ⚙ Quản lý › dán URL và KEY › Lưu › "Tải dữ liệu mọi máy".
 *  Mỗi lần sửa mã: Triển khai › Quản lý các bản triển khai › Chỉnh sửa › Phiên bản mới › Triển khai (URL giữ nguyên).
 */
const KEY = 'doi-chuoi-bi-mat-nay';
const SHEET = 'Ket qua';
const HEAD = ['Thời gian', 'Email', 'Chủ đề', 'Kết quả', 'Quà', 'Mã nhận quà', 'Mã máy', 'Tên máy', 'IP'];
const WIDTH = [190, 270, 130, 105, 240, 145, 115, 330, 145];
const FONT = 'Times New Roman';
const SIZE = 14;

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); }
  if (sh.getLastRow() === 0) { sh.appendRow(HEAD); formatHeader_(sh); }
  return sh;
}

function formatHeader_(sh) {
  sh.getRange(1, 1, 1, HEAD.length)
    .setValues([HEAD])
    .setFontFamily(FONT).setFontSize(SIZE).setFontWeight('bold').setFontColor('#ffffff')
    .setBackground('#2356a7').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true)
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  sh.setFrozenRows(1);
  sh.setRowHeight(1, 36);
  WIDTH.forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// Định dạng các dòng dữ liệu: Times New Roman 14, kẻ ô đầy đủ, căn lề, định dạng ngày giờ
function formatRows_(sh, fromRow, n) {
  if (n <= 0) return;
  const r = sh.getRange(fromRow, 1, n, HEAD.length);
  r.setFontFamily(FONT).setFontSize(SIZE).setVerticalAlignment('middle').setWrap(true)
   .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(fromRow, 1, n, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
  [1, 3, 4, 6, 7, 9].forEach(c => sh.getRange(fromRow, c, n, 1).setHorizontalAlignment('center'));
  [2, 5, 8].forEach(c => sh.getRange(fromRow, c, n, 1).setHorizontalAlignment('left'));
}

/** Chạy một lần sau khi dán mã: định dạng toàn bộ sheet Ket qua (kẻ sẵn 1.000 dòng). */
function caiDat() {
  const sh = sheet_();
  formatHeader_(sh);
  const rows = Math.max(1000, sh.getLastRow() - 1);
  if (sh.getMaxRows() < rows + 1) sh.insertRowsAfter(sh.getMaxRows(), rows + 1 - sh.getMaxRows());
  formatRows_(sh, 2, rows);
  SpreadsheetApp.getActiveSpreadsheet().toast('Đã định dạng sheet "' + SHEET + '" (Times New Roman 14, kẻ ô).', 'Lăng Cụ Phó Bảng 3D', 5);
}

/** Máy chơi gửi kết quả lên (POST, nội dung JSON). */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);   // nhiều máy gửi cùng lúc không ghi đè nhau
    const d = JSON.parse(e.postData.contents);
    const s = v => String(v == null ? '' : v).slice(0, 200);
    const sh = sheet_();
    const row = [new Date(d.at || Date.now()), s(d.email), s(d.theme), d.ok ? 'Đúng' : 'Sai', s(d.gift), s(d.code), s(d.deviceId), s(d.deviceName), s(d.ip)];
    // ghi vào dòng trống đầu tiên sau dữ liệu (các dòng kẻ sẵn vẫn giữ định dạng)
    const r = lastDataRow_(sh) + 1;
    sh.getRange(r, 1, 1, row.length).setValues([row]);
    formatRows_(sh, r, 1);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// dòng cuối có email ở cột B (bỏ qua các dòng chỉ có định dạng)
function lastDataRow_(sh) {
  const n = sh.getLastRow();
  if (n < 2) return 1;
  const v = sh.getRange(2, 2, n - 1, 1).getValues();
  for (let i = v.length - 1; i >= 0; i--) if (String(v[i][0]).trim() !== '') return i + 2;
  return 1;
}

/** Admin đọc danh sách (GET ?key=…). */
function doGet(e) {
  const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
  if (((e && e.parameter && e.parameter.key) || '') !== KEY) return out({ error: 'key' });
  const sh = sheet_();
  const last = lastDataRow_(sh);
  if (last < 2) return out({ rows: [] });
  const v = sh.getRange(2, 1, last - 1, HEAD.length).getValues()
    .filter(r => String(r[1]).trim() !== '')
    .map(r => [r[0] instanceof Date ? r[0].toISOString() : r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]]);
  return out({ rows: v });
}
