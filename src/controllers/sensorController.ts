import type { Request, Response } from "express";
import AdafruitService from "../services/adaFruitservice.ts";
import db from "../db.ts";

async function ensureSensorDevice(
  feedKey: string,
  deviceName: string
): Promise<number> {
  const [rows]: any = await db.query(
    "SELECT device_id FROM devices WHERE feed_key = ? LIMIT 1",
    [feedKey]
  );

  if (rows.length > 0) {
    return rows[0].device_id as number;
  }

  const [result]: any = await db.query(
    `INSERT INTO devices (room_id, device_name, device_type, status, protocol, feed_key)
     VALUES (1, ?, 'sensor', TRUE, 'Adafruit', ?)`,
    [deviceName, feedKey]
  );

  return result.insertId as number;
}

async function saveLatestSensorData(
  deviceId: number,
  temperature: number | null,
  humidity: number | null
): Promise<void> {
  if (
    (temperature !== null && isNaN(temperature)) ||
    (humidity !== null && isNaN(humidity))
  ) {
    return;
  }

  await db.query(
    `INSERT INTO sensor_data (device_id, temperature, humidity, recorded_at)
     VALUES (?, ?, ?, NOW())`,
    [deviceId, temperature, humidity]
  );
}

export const getTemperature = async (req: Request, res: Response) => {
  try {
    const service = AdafruitService.getInstance();
    const data = await service.getTemperature();

    if (Array.isArray(data) && data.length > 0) {
      try {
        const latest = data[0]; 
        const tempValue = parseFloat(latest.value);

        const deviceId = await ensureSensorDevice("temparature", "Temperature Sensor");
        await saveLatestSensorData(deviceId, tempValue, null);
      } catch (dbErr) {
        console.error("DB insert error (temperature):", dbErr);
      }
    }

    return res.json(data);
  } catch (err) {
    console.error("getTemperature error:", err);
    res.status(500).json({ error: "Failed to fetch temperature data" });
  }
};

export const getHumidity = async (req: Request, res: Response) => {
  try {
    const service = AdafruitService.getInstance();
    const data = await service.getHumidity();

    if (Array.isArray(data) && data.length > 0) {
      try {
        const latest = data[0]; // Adafruit trả mới nhất trước
        const humidValue = parseFloat(latest.value);

        const deviceId = await ensureSensorDevice("humidity", "Humidity Sensor");
        await saveLatestSensorData(deviceId, null, humidValue);
      } catch (dbErr) {
        console.error("DB insert error (humidity):", dbErr);
      }
    }

    return res.json(data);
  } catch (err) {
    console.error("getHumidity error:", err);
    res.status(500).json({ error: "Failed to fetch humidity data" });
  }
};
