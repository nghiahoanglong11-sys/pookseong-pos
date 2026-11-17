# PookSeong POS — bản trải nghiệm

Ứng dụng React/Vite kèm API Express đơn giản để trải nghiệm bán hàng, đơn QR, màn hình bếp và báo cáo. Yêu cầu Node.js 18+.

## Chạy thử trên máy

```sh
npm install
npm run dev:full
```

Mở http://localhost:5173. Lệnh này khởi động giao diện Vite và API tại cổng 4000. Dữ liệu API lưu ở `server/data.json`; khi API không hoạt động, giao diện vẫn lưu dữ liệu cục bộ trong trình duyệt.

## Luồng trải nghiệm
- Bán hàng: chọn món, chọn hình thức thanh toán, xác nhận đơn. Tiền mặt được kiểm tra; chuyển khoản/thẻ chỉ ghi nhận thủ công, không xác minh giao dịch.
- Đơn QR: mở tab “Đặt món QR”, quét bằng điện thoại có thể truy cập cùng địa chỉ mạng, gửi đơn.
- Bếp: đơn mới → đang làm → sẵn sàng → hoàn tất. Cần backend hoạt động để đồng bộ giữa màn hình.
- Báo cáo: lọc hôm nay/7 ngày/30 ngày/toàn bộ, xuất CSV tương thích Excel hoặc dùng in/lưu PDF của trình duyệt.
- Sao lưu JSON: tải dữ liệu đang hiển thị về thiết bị.

## Build

```sh
npm run build
```

## Giới hạn an toàn
Đây là bản trải nghiệm nội bộ, chưa phải hệ thống production: API chưa có đăng nhập/phân quyền, cơ sở dữ liệu giao dịch, backup tự động hay tích hợp cổng thanh toán. JSON file không phù hợp nhiều tiến trình/ghi đồng thời hoặc public internet. Không đưa dữ liệu khách hàng/thanh toán thật vào, không mở server công khai. Để QR hoạt động trên điện thoại khác, dùng URL LAN/domain thay vì localhost.
