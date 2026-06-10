import type { Request, Response } from "express";
import AdafruitService from "../services/adaFruitservice.ts";


const CAMERA_API = 'http://10.120.253.220'; 

// --- GIAI ĐOẠN 2: QUYẾT ĐỊNH CỦA CHỦ NHÀ ---

export const approveStranger = (req: Request, res: Response) => {
  const service = AdafruitService.getInstance();
  
  // 1. "Bắn" lệnh tới Camera nhưng KHÔNG đợi (không dùng await)
  fetch(`${CAMERA_API}/approve`).catch(err => console.error("Cam Approve Error:", err));
  
  // 2. "Bắn" lệnh cập nhật Adafruit cũng KHÔNG đợi
  service.sendResult(1).catch(err => console.error("Adafruit Update Error:", err));
  
  // 3. Phản hồi cho Web ngay lập tức
  // Khi React nhận được cái này, nó sẽ chạy tiếp và reset UI về trạng thái cũ
  return res.json({ 
    success: true, 
    message: "Lệnh đã gửi, đang quay về trạng thái an toàn." 
  });
};

export const rejectStranger = (req: Request, res: Response) => {
  const service = AdafruitService.getInstance();

  // 1. Gửi lệnh đuổi người lạ ngầm
  fetch(`${CAMERA_API}/reject`).catch(err => console.error("Cam Reject Error:", err));

  // 2. Reset trạng thái Adafruit về 0 ngầm
  service.sendResult(0).catch(err => console.error("Adafruit Reset Error:", err));

  // 3. Thoát ra ngay lập tức
  return res.json({ 
    success: true, 
    message: "Đã từ chối, đang reset giao diện." 
  });
};

export const allowStranger = (req: Request, res: Response) => {
  const service = AdafruitService.getInstance();

  // 1. "Bắn" lệnh đuổi người lạ ngầm tới Camera 
  // (Mục đích là bắt Camera XÓA bức ảnh này đi, KHÔNG học khuôn mặt và reset lại AI)
  fetch(`${CAMERA_API}/reject`).catch(err => console.error("Cam Reject Error:", err));

  // 2. NHƯNG lại "Bắn" lệnh 1 lên Adafruit ngầm
  // (Mục đích là để Node vi điều khiển kia kích Relay MỞ CỬA cho khách vào)
  service.sendResult(1).catch(err => console.error("Adafruit Allow Error:", err));

  // 3. Phản hồi cho Web ngay lập tức
  return res.json({ 
    success: true, 
    message: "Đã mở cửa tạm thời (Không lưu khuôn mặt)." 
  });
};

// --- THÊM PHẦN CHẠY NGẦM NÀY VÀO TRƯỚC HÀM handleSecurityFlow ---

// Biến lưu trữ tạm thời trên RAM của Backend
let cachedTriggerValue = "0";
let isCheckingAdafruit = false;

// Cứ 4.5 giây, Backend sẽ tự động lên Adafruit lấy dữ liệu 1 lần
// => Khoảng 13 requests/phút (Cực kỳ an toàn, không bao giờ lo Adafruit khóa)
setInterval(async () => {
  if (isCheckingAdafruit) return;
  try {
    isCheckingAdafruit = true;
    const service = AdafruitService.getInstance();
    cachedTriggerValue = await service.getTriggerValue();
  } catch (error) {
    // Bỏ qua lỗi nếu mạng chập chờn để không làm sập server
  } finally {
    isCheckingAdafruit = false;
  }
}, 4500); 

// ---------------------------------------------------------------

export const handleSecurityFlow = async (req: Request, res: Response) => {
  try {
    const service = AdafruitService.getInstance();
    const isManual = req.query.manual === 'true';

    if (!isManual) {
      // BƯỚC ĐỘT PHÁ: Đọc dữ liệu từ biến Cache nội bộ thay vì gọi lên Adafruit!
      const triggerData = cachedTriggerValue; 
      
      // Nếu không có ai bấm chuông, báo cho Web biết và THOÁT NGAY. 
      // (Không tốn băng thông Adafruit nữa)
      if (triggerData !== "1") {
        return res.json({ triggerDetected: false, message: "Chưa có tín hiệu mới" });
      }

      console.log("===> Phát hiện tín hiệu thực! Đang reset Feed và gọi Cam...");
      
      // Reset biến nội bộ và reset trên Adafruit
      cachedTriggerValue = "0"; 
      await service.sendTriggerValue(0); 
    }

    console.log("===> STEP 3: Đang gọi Camera tại:", CAMERA_API);
    const camTrigger = await fetch(`${CAMERA_API}/trigger`).catch(e => {
        console.error("!!! LỖI GỌI CAMERA:", e.message);
        throw e;
    });

    console.log("===> STEP 4: Đang Reset Trigger trên Adafruit...");
    if (!isManual) await service.sendTriggerValue(0); 

    let isDone = false;
    let attempts = 0;

    while (!isDone && attempts < 30) {
      await new Promise(r => setTimeout(r, 1000));
      attempts++;
      console.log(`... Đang đợi Cam xử lý (Lần ${attempts})`);

      const camRes = await fetch(`${CAMERA_API}/status`);
      const camData = await camRes.json();

      if (camData.status === 2) {
        isDone = true;
        const aiGuess = Number(camData.result);
        console.log("===> STEP 5: AI xong! Kết quả:", aiGuess);
        
        let identifiedName = "Không xác định";
        let recognitionType = "Unknown";

        if (aiGuess === 1) {
          recognitionType = "Acquaintance";
          identifiedName = "Người quen (Chưa đặt tên)";
        } 
        else if (aiGuess === 2) {
          recognitionType = "Stranger";
          identifiedName = "Người lạ";
        } 
        else {
          recognitionType = "No_Face";
          identifiedName = "Kiểm tra an ninh (Không có người)";
        }

        // GỬI LÊN ADAFRUIT (Chỉ khi phân tích xong mới gửi)
        console.log("===> STEP 6: Đang đẩy kết quả lên Adafruit...");
        const adafruitRes = await service.sendResult(aiGuess);
        console.log("===> HỒI ĐÁP TỪ ADAFRUIT:", adafruitRes);

        return res.json({ status: "success", triggerDetected: true, recognition: aiGuess, image: `${CAMERA_API}/latest.jpg?t=${Date.now()}` });
      }
    }
    res.json({ status: "timeout" });
  } catch (err) {
    console.error("!!! LỖI HỆ THỐNG:", err);
    res.status(500).json({ error: "Security system error" });
  }
};