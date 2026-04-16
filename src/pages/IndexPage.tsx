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
  const API = 'http://localhost:3000/api';
const [isProcessing, setIsProcessing] = useState(false);

  const [displayName] = useState('thien.iot')
  const [isLightOn, setIsLightOn] = useState(false)
  const [isFanOn, setIsFanOn] = useState(false)
  const [notifications, setNotifications] = useState<SignalNotification[]>([])

  const [telemetry, setTelemetry] = useState<Telemetry>({
    temperature: 26.4,
    humidity: 56,
    voltage: 221,
    noise: 34,
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

  useEffect(() => {
    updateTelemetry();
  }, [])

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
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()
      const humidityData = Number(data?.[0]?.value)
      if (Number.isNaN(humidityData)) {
        throw new Error('Invalid humidity payload')
      }

      const nextTelemetry: Telemetry = {
        temperature: 24 + Math.random() * 8,
        humidity: humidityData,
        voltage: 214 + Math.random() * 15,
        noise: 28 + Math.random() * 18,
        updatedAt: getCurrentTime(),
      }

      setTelemetry(nextTelemetry)
      addNotification('Telemetry synced', 'Device metrics updated from gateway.')
    } catch {
      addNotification('Telemetry error', 'Failed to fetch telemetry data from device.')
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
        <Topbar displayName={displayName} onLogout={handleLogout} />

        <div className="dashboard-grid">
          <DeviceControlsCard
            isLightOn={isLightOn}
            isFanOn={isFanOn}
            onToggleLight={toggleLight}
            onToggleFan={toggleFan}
          />
          <SignalCenterCard onReceiveSignal={receiveSignal} onSyncTelemetry={updateTelemetry} />
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
