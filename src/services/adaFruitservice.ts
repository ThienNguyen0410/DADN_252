import dotenv from 'dotenv';
dotenv.config();

class AdafruitService {
  private static instance: AdafruitService;
  private readonly AIO_KEY = process.env.VITE_AIO_KEY || '';
  private readonly USERNAME = process.env.VITE_USERNAME || '';
  
  // Tạo URL dựa trên Username đã lấy
  private readonly BASE_URL = `https://io.adafruit.com/api/v2/${this.USERNAME}/feeds`;

  private constructor() {}

  public static getInstance(): AdafruitService {
    if (!AdafruitService.instance) {
      AdafruitService.instance = new AdafruitService();
    }
    return AdafruitService.instance;
  }

  private getHeaders() {
    return {
      'X-AIO-Key': this.AIO_KEY,
      'Content-Type': 'application/json'
    };
  }

  async getHumidity() {
    const res = await fetch(
      `${this.BASE_URL}/humidity/data`, {
        headers: this.getHeaders()
      }
    );
    //in ra gia tri dau tien cua res
    const data = await res.json();
    return data;
  }

  async getTemperature() {
    const res = await fetch(
      `${this.BASE_URL}/temparature/data` ,{
        headers: this.getHeaders()
      }
    );
    const data = await res.json();
    console.log(data);
    return data;
  }

  async getTriggerValue() {
    // FIX: Thêm headers để Adafruit cho phép đọc dữ liệu
    const res = await fetch(`${this.BASE_URL}/trigger-cam/data/last`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.value; 
  }

  async sendResult(resultValue: number | string) {
    // FIX: Sử dụng đúng endpoint /data
    const url = `${this.BASE_URL}/acquaintance/data`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ value: resultValue.toString() })
    });
    return await res.json();
  }

  // Trong file src/services/adaFruitservice.ts

async sendTriggerValue(value: number) {
    // FIX 3: Sử dụng USERNAME và AIO_KEY của Class thay vì process.env bị lỗi
    try {
      const response = await fetch(`${this.BASE_URL}/trigger-cam/data`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ value: value.toString() }),
      });

      if (!response.ok) console.error("Lỗi khi reset trigger trên Adafruit");
    } catch (error) {
      console.error("Network error khi gọi Adafruit:", error);
    }
  }
}

export default AdafruitService;