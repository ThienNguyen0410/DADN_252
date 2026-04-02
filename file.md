# Cac thay doi da lam

## 1) Xay dung lai UI tong the
- Thay the giao dien mac dinh Vite trong src/App.tsx bang giao dien he thong IoT nha thong minh.
- Tao 2 man hinh trong cung mot app:
  - Man hinh dang nhap.
  - Man hinh dashboard sau khi dang nhap thanh cong.

## 2) Chuc nang trang dang nhap
- Them form dang nhap gom username va password.
- Them validate don gian: bat buoc nhap du thong tin.
- Dang nhap thanh cong thi vao dashboard va tao mot thong bao chao mung.

## 3) Dashboard IoT
- Them khu vuc topbar hien thi user dang ket noi.
- Them nut Log out de quay lai man hinh dang nhap.

### Dieu khien thiet bi
- Them nut bat/tat den (Light).
- Them nut bat/tat quat (Fan).
- Moi thao tac bat/tat deu tao thong bao trong danh sach notifications.

### Thong bao khi nhan tin hieu
- Them khu vuc Signal center.
- Them nut Receive Signal de mo phong tin hieu cam bien.
- Moi lan nhan tin hieu se sinh thong bao moi kem thoi gian.

### Noi quet QR code
- Them khu vuc QR scan zone voi khung quet.
- Them nut Start QR Scan de mo phong qua trinh quet.
- Co trang thai Scanning... va ket qua gan device sau khi quet xong.
- Sau khi quet thanh cong, he thong tao thong bao moi.

## 4) Nang cap giao dien theo yeu cau tre trung, nang dong
- Viet lai toan bo CSS trong src/App.css:
  - Nen gradient sang + hieu ung orb.
  - Card giao dien kieu glassmorphism.
  - Nut bam, trang thai active, hieu ung hover.
  - Animation nhe cho load, orb va vach quet QR.
- Chinh sua src/index.css:
  - Them font Lexend + Space Grotesk.
  - Reset style co ban va toi uu hien thi.

## 5) Responsive
- Them media query de giao dien hien thi tot tren desktop va mobile.
- Tu dong sap xep lai cac card tren man hinh nho.

## 6) File da thay doi
- src/App.tsx
- src/App.css
- src/index.css
- file.md (file nay)
