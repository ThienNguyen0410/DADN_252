import { useEffect, useRef, useState } from 'react'
import DeviceControlsCard from '../components/dashboard/DeviceControlsCard'
import NotificationsCard from '../components/dashboard/NotificationsCard'
import SecurityCameraCard from '../components/dashboard/SecurityCameraCard.tsx'
import SignalCenterCard from '../components/dashboard/SignalCenterCard'
import TelemetryCard from '../components/dashboard/TelemetryCard'
import Topbar from '../components/dashboard/Topbar'
import { signalTemplates } from '../data/signalTemplates'
import type { SignalNotification, Telemetry } from '../types/dashboard'
import { getCurrentTime } from '../utils/time'

function IndexPage() {
const API = '/api';
const [isProcessing, setIsProcessing] = useState(false);

  const [displayName] = useState('thien.iot')
  const [isLightOn, setIsLightOn] = useState(false)
  const [isFanOn, setIsFanOn] = useState(false)
  const [notifications, setNotifications] = useState<SignalNotification[]>([])

  const [telemetry, setTelemetry] = useState<Telemetry>({
    temperature: 25,
    humidity: 56,
    updatedAt: getCurrentTime(),
  })


  const[boundtelemetry, setBoundTelemetry] = useState<Telemetry>({
    temperature: 25,
    humidity: 25,
    updatedAt: getCurrentTime(),
  })

  // --- CÁC STATE MỚI CHO CAMERA ---
  const [cameraImage, setCameraImage] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState('Sẵn sàng hoạt động')
  const [isStranger, setIsStranger] = useState(false)

const processSecurityData = (data: any) => {
  if (data.status === "success" || data.triggerDetected) {
    const recognitionResult = Number(data.recognition);

    if (recognitionResult === 2) {
      setCameraImage(`${data.image}?t=${Date.now()}`); // Chỉ hiện ảnh khi là người lạ
      setCameraStatus('🚨 CẢNH BÁO: NGƯỜI LẠ!');
      setIsStranger(true);
    } else if (recognitionResult === 1) {
      setCameraImage(`${data.image}?t=${Date.now()}`); // Hiện ảnh khi là người quen
      setCameraStatus('✅ XÁC NHẬN: NGƯỜI QUEN');
      setIsStranger(false);
    } else {
      // FIX: Nếu không thấy mặt, ta xóa luôn ảnh cũ để tránh nhầm lẫn
      setCameraImage(null); 
      setCameraImage(`${data.image}?t=${Date.now()}`);
      setCameraStatus('🔍 Không phát hiện khuôn mặt rõ ràng.');
      setIsStranger(false);
    }
    return true;
  }
  return false;
};
  //const scanTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    updateTelemetry();
    const interval = setInterval(() => {
      updateTelemetry();
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    let timeout: number;

    if (telemetry.temperature > boundtelemetry.temperature) {
      if (!isFanOn)
        toggleFan();
    } else {
      if (isFanOn) {
        timeout = window.setTimeout(() => {
          toggleFan();
        }, 10000);
      
      }
    }

    return () => clearTimeout(timeout);
  }, [
    telemetry.temperature,
    boundtelemetry.temperature,
    isFanOn
  ]);

  useEffect(() => {
  const checkTrigger = async () => {
    if (!isProcessing) {
      try {
        // Hỏi Server xem có ai trigger không
        const res = await fetch(`${API}/security/check`);
        const data = await res.json();
        
        if (data.triggerDetected) { // Nếu Backend báo có trigger
          setIsProcessing(true);
          // Cập nhật giao diện từ dữ liệu Backend trả về
          processSecurityData(data);
          
          // Sau 10 giây cho phép nhận trigger mới
          setTimeout(() => setIsProcessing(false), 5000);
        }
      } catch (err) {
        console.log("Đang đợi tín hiệu từ Adafruit...");
      }
    }
  };

  const timer = setInterval(checkTrigger, 3000); // Check mỗi 3 giây
  return () => clearInterval(timer);
}, [isProcessing]);

  const addNotification = (title: string, detail: string) => {
    const newNotification: SignalNotification = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title,
      detail,
      time: getCurrentTime(),
    }

    setNotifications((prev) => [newNotification, ...prev].slice(0, 8))
  }

  const updateTelemetry = async () => {
  try {
    const res = await fetch(`${API}/humidity`)
    
    if (!res.ok) {
      throw new Error(`Humidity API failed: ${res.status}`)
    }
    
    const data = await res.json()
    const humidityData = Number(data?.[0]?.value)

    const tempAPI = await fetch(`${API}/temperature`)
    
    if (!tempAPI.ok) { 
      throw new Error(`Temperature API failed: ${tempAPI.status}`)
    }
    
    const tempData = await tempAPI.json()
    const temperature = Number(tempData?.[0]?.value)

    if (Number.isNaN(humidityData) || Number.isNaN(temperature)) {
      console.error('Invalid sensor data:', { humidityData, temperature, data, tempData })
      throw new Error('Invalid data from API')
    }

    
    setTelemetry({
      temperature,
      humidity: humidityData,
      updatedAt: getCurrentTime(),
    })
    //addNotification('Telemetry synced', 'Device metrics updated')
  } catch (err) {
    console.error('Telemetry fetch error:', err)  // ← Thêm log chi tiết
    addNotification('Telemetry error', err instanceof Error ? err.message : 'Failed to fetch data')
  }
}

  const toggleLight = () => {
    fetch(`${API}/light`, { 
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ status: !isLightOn })
    })
    const next = !isLightOn
    setIsLightOn(next)
    addNotification('Light control', next ? 'Living room light turned ON.' : 'Living room light turned OFF.')
    
  }

  const toggleFan = () => {
      fetch(`${API}/fan`, { method: 'POST' 
        , headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: !isFanOn })
      })
      setIsFanOn(!isFanOn)
      addNotification('Fan control', !isFanOn ? 'Living room fan turned ON.' : 'Living room fan turned OFF.')
  }


  const receiveSignal = () => {
    const sample = signalTemplates[Math.floor(Math.random() * signalTemplates.length)]
    addNotification(sample.title, sample.detail)
    updateTelemetry()
  }

  const submitSignal = async (temperature: number, humidity: number) => {
    try {
      const res = await fetch(`${API}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature, humidity })
      })
      if (res.ok) {
        addNotification('Signal submitted', `Temperature: ${temperature}°C, Humidity: ${humidity}%`)
        const newbound = {
          temperature,
          humidity,
          updatedAt: getCurrentTime()
        }
        localStorage.setItem("boundTelemetry", JSON.stringify(newbound))
        setBoundTelemetry(newbound)
      } else {
        addNotification('Signal error', 'Failed to submit signal')
      }
    } catch (error) {
      addNotification('Signal error', 'Failed to submit signal to server')
    }
  }

  const triggerCamera = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setCameraStatus('Đang yêu cầu Camera chụp ảnh...');
    try {
      const res = await fetch(`${API}/security/check?manual=true`); // Gọi cùng 1 API để Backend điều phối
      const data = await res.json();
      
      const hasResult = processSecurityData(data);
      if (!hasResult) setCameraStatus('Camera không phản hồi.');
      
    } catch (error) {
      setCameraStatus('Lỗi kết nối Server!');
    } finally {
      setIsProcessing(false);
    }
  };

    const approveStranger = async () => {
    try {
      setCameraStatus('Đang xử lý phê duyệt...');
      const res = await fetch(`${API}/security/approve`, { method: 'POST' });
      if (res.ok) {
        setCameraStatus('Đã phê duyệt. Chào mừng!');
        setIsStranger(false);
        setCameraImage(null);
        addNotification('Security', 'Đã cập nhật danh sách người quen.');
      }
    } catch (error) {
      setCameraStatus('Lỗi kết nối!');
    }
  };

  const rejectStranger = async () => {
    try {
      await fetch(`${API}/security/reject`, { method: 'POST' });
      setCameraStatus('Đã từ chối truy cập.');
      setIsStranger(false);
      setCameraImage(null);
      addNotification('Security', 'Đã xua đuổi người lạ.');
    } catch (error) {
      setCameraStatus('Lỗi kết nối!');
    }
  };

  const allowStranger = async () => {
    try {
      setCameraStatus('Đang mở cửa tạm thời...');
      const res = await fetch(`${API}/security/allow`, { method: 'POST' });
      if (res.ok) {
        setCameraStatus('Đã mở cửa (Không lưu mặt).');
        setIsStranger(false);
      }
    } catch (error) {
      setCameraStatus('Lỗi kết nối!');
    }
  };

  //TOPBAR LOGOUT AND RENDER NOTIFICATIONS
  const renderNotifications = () => {
    window.location.href = '/notification'
  }

  const handleLogout = () => {
    setNotifications([])
    setIsLightOn(false)
    setIsFanOn(false)
    setCameraImage(null)
    setIsStranger(false)
    window.location.href = '/login'
  }

  return (
    <main className="app-shell">
      <div className="bg-orb bg-orb-a" />
      <div className="bg-orb bg-orb-b" />

      <section className="dashboard-layout">
        <Topbar displayName={displayName} onLogout={handleLogout} 
            renderNotifications={renderNotifications} notifications={notifications} />

        <div className="dashboard-grid">
          <DeviceControlsCard
            isLightOn={isLightOn}
            isFanOn={isFanOn}
            onToggleLight={toggleLight}
            onToggleFan={toggleFan}
          />
          <SignalCenterCard onReceiveSignal={receiveSignal} onSyncTelemetry={updateTelemetry} submitSignal={submitSignal} />
          <TelemetryCard telemetry={telemetry} />
          <SecurityCameraCard 
            imageUrl={cameraImage}
            statusMessage={cameraStatus}
            isStranger={isStranger}
            onRequestTrigger={triggerCamera}
            onApprove={approveStranger}
            onReject={rejectStranger}
            onAllow={allowStranger} //
          />
          <NotificationsCard notifications={notifications} />
        </div>
      </section>
    </main>
  )
}

export default IndexPage