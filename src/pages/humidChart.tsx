import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import './chart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

interface SensorEntry {
  time: string
  humidity: number
}

function HumidChart() {
  const [data, setData] = useState<SensorEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHumidity = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('http://localhost:3000/api/humidity')
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

        // Adafruit trả về mảng dạng mới nhất trước
        // Mỗi item: { value: "60.5", created_at: "2026-04-25T10:00:00Z", ... }
        const raw: { value: string; created_at: string }[] = await res.json()

        // Lấy 20 điểm gần nhất, đảo ngược để hiển thị theo thứ tự thời gian tăng dần
        const mapped: SensorEntry[] = raw
          .slice(0, 20)
          .reverse()
          .map((item) => ({
            time: formatTime(item.created_at),
            humidity: parseFloat(item.value),
          }))
          .filter((item) => !isNaN(item.humidity))

        setData(mapped)
      } catch (err: any) {
        console.error('Failed to fetch humidity data:', err)
        setError('Không thể tải dữ liệu độ ẩm. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    fetchHumidity()

    // Tự động cập nhật mỗi 30 giây
    const interval = setInterval(fetchHumidity, 30000)
    return () => clearInterval(interval)
  }, [])

  // Format ISO string thành "HH:MM" (giờ địa phương)
  const formatTime = (isoString: string): string => {
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return isoString
    }
  }

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: 'Humidity (%)',
        data: data.map((item) => item.humidity),
        borderColor: '#0f8ca0',
        backgroundColor: 'rgba(15, 140, 160, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0f8ca0',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#112641',
          font: {
            size: 14,
            family: "'Space Grotesk', sans-serif",
            weight: '600',
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 38, 65, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(15, 140, 160, 0.5)',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: {
        ticks: { color: '#4f6278', font: { size: 12 } },
        grid: { color: 'rgba(15, 140, 160, 0.1)', drawBorder: false },
      },
      x: {
        ticks: { color: '#4f6278', font: { size: 12 } },
        grid: { color: 'rgba(15, 140, 160, 0.1)', drawBorder: false },
      },
    },
  } as any

  return (
    <>
      <div className="button_back">
        <button
          className="btn btn-secondary"
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '10px 16px',
            fontSize: '14px',
            borderRadius: '4px',
            color: '#fff',
            backgroundColor: '#4f6278',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <h3 className="chart-title">Humidity Monitor</h3>

          {loading && (
            <p style={{ textAlign: 'center', color: '#4f6278' }}>Đang tải dữ liệu...</p>
          )}

          {error && (
            <p style={{ textAlign: 'center', color: '#e74c3c' }}>{error}</p>
          )}

          {!loading && !error && data.length === 0 && (
            <p style={{ textAlign: 'center', color: '#4f6278' }}>Không có dữ liệu.</p>
          )}

          {!loading && data.length > 0 && (
            <Line data={chartData} options={options} />
          )}
        </div>
      </div>
    </>
  )
}

export default HumidChart
