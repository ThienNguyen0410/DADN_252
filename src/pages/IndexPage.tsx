import { useEffect, useRef, useState } from 'react'
import DeviceControlsCard from '../components/dashboard/DeviceControlsCard'
import NotificationsCard from '../components/dashboard/NotificationsCard'
import SecurityCameraCard from '../components/dashboard/SecurityCameraCard.tsx'
import SignalCenterCard from '../components/dashboard/SignalCenterCard'
import TelemetryCard from '../components/dashboard/TelemetryCard'
import Topbar from '../components/dashboard/Topbar'
import Login from './login.tsx'
import { signalTemplates } from '../data/signalTemplates'
import type { SignalNotification, Telemetry } from '../types/dashboard'
import { getCurrentTime } from '../utils/time'

function IndexPage() {
const API = '/api';
const CAMERA_API = 'http://10.120.253.220';
const [isProcessing, setIsProcessing] = useState(false);
const lastAutoApproveIdRef = useRef<number | null>(null)
const autoApproveInFlightRef = useRef(false)

  const [displayName] = useState(localStorage.getItem("username"))
  const [isLightOn, setIsLightOn] = useState(false)
  const [isFanOn, setIsFanOn] = useState(() => {
    const saved = localStorage.getItem('fan_status')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [notifications, setNotifications] = useState<SignalNotification[]>([])
  const [auto, setAuto] = useState(() => {
    const saved = localStorage.getItem('auto')
    return saved !== null ? JSON.parse(saved) : true
  })

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

  useEffect(() => {
    const fetchBoundary = async () => {
      try {
        const res = await fetch(`${API}/boundary`);

        if (!res.ok) {
          throw new Error("Failed to fetch API boundary");
        }

        const data = await res.json();

        setBoundTelemetry({
          temperature: data.temperature,
          humidity: data.humidity,
          updatedAt: getCurrentTime()
        });
      }
      catch (err) {
        console.log(err);
      }
    };

    fetchBoundary();

    const interval = setInterval(() => {
      fetchBoundary();
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // --- NEW CAMERA STATES ---
  const [cameraImage, setCameraImage] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState('Ready to operate')
  const [isStranger, setIsStranger] = useState(false)

const processSecurityData = (data: any) => {
  if (data.status === "success" || data.triggerDetected) {
    const recognitionResult = Number(data.recognition);

    if (recognitionResult === 2) {
      setCameraImage(`${data.image}?t=${Date.now()}`); // Show image for strangers only
      setCameraStatus('🚨 WARNING: STRANGER!');
      setIsStranger(true);
    } else if (recognitionResult === 1) {
      setCameraImage(`${data.image}?t=${Date.now()}`); // Show image for known persons
      setCameraStatus('✅ CONFIRMED: KNOWN PERSON');
      setIsStranger(false);
    } else {
      // FIX: If no face detected, clear old image to avoid confusion
      setCameraImage(null); 
      setCameraImage(`${data.image}?t=${Date.now()}`);
      setCameraStatus('🔍 No clear face detected.');
      setIsStranger(false);
    }
    return true;
  }
  return false;
};
  //const scanTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem('auto', JSON.stringify(auto))
  }, [auto])

  useEffect(() => {
    updateTelemetry();
    const interval = setInterval(() => {
      updateTelemetry();
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    let timeout: number;

    // If auto mode is enabled
    if (auto) {
      console.log("Auto mode ON - Auto controlling fan");
      
      if (telemetry.temperature > boundtelemetry.temperature) {
        // High temperature -> need to turn on fan
        if (!isFanOn) {
          console.log("Temperature high, turning ON fan");
          setIsFanOn(true);
          
          fetch(`${API}/fan`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: true })
          })
          localStorage.setItem("fan_status", JSON.stringify(true));
          sendNotifications("Temperature", telemetry.temperature, boundtelemetry.temperature, "AUTO TURN ON FAN");
        }
      } else {
        // Normal temperature -> need to turn off fan
        if (isFanOn) {
          timeout = window.setTimeout(() => {
            console.log("Temperature normal, turning OFF fan");
            setIsFanOn(false);
            
            fetch(`${API}/fan`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: false })
            })
            localStorage.setItem("fan_status", JSON.stringify(false));
            sendNotifications("Temperature", telemetry.temperature, boundtelemetry.temperature, "AUTO TURN OFF FAN");
          }, 5000);
        }
      }
    } else {
      console.log("Auto mode OFF - Manual control only");
    }

    return () => clearTimeout(timeout);
  }, [
    telemetry.temperature,
    boundtelemetry.temperature,
    isFanOn,
    auto
  ]);

  useEffect(() => {
  const checkTrigger = async () => {
    if (!isProcessing) {
      try {
        // Ask server if there's a trigger
        const res = await fetch(`${API}/security/check`);
        const data = await res.json();
        
        if (data.triggerDetected) { 
          setIsProcessing(true);
          processSecurityData(data);
          
          setTimeout(() => setIsProcessing(false), 5000);
        }
      } catch (err) {
        console.log("Waiting for signal from Adafruit...");
      }
    }
  };

  const timer = setInterval(checkTrigger, 3000); // Check every 3 seconds
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
    console.error('Telemetry fetch error:', err)  // ← Add detailed log
    addNotification('Telemetry error', err instanceof Error ? err.message : 'Failed to fetch data')
  }
}

  const sendNotifications = async (field:string, value: number, boundValue: number, action:string) => {
      try {
        await fetch(`${API}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({field, value, boundValue, action})
      })
    }
      catch(err) {
        console.error(err);
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
      // Turn off auto mode when user manually intervenes
      setAuto(false);
      localStorage.setItem("auto", JSON.stringify(false));

      // Toggle fan state
      const nextFanStatus = !isFanOn;
      setIsFanOn(nextFanStatus);
      
      // Send command to API
      fetch(`${API}/fan`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextFanStatus })
      })
      
      // Save to localStorage
      localStorage.setItem("fan_status", JSON.stringify(nextFanStatus));
      
      // Notification
      addNotification('Fan control', nextFanStatus ? 'Living room fan turned ON.' : 'Living room fan turned OFF.')
  }

  const toggleMode = () => {
    setAuto(!auto);
    localStorage.setItem("auto", JSON.stringify(!auto));
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
        localStorage.setItem("auto",JSON.stringify(false))
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
    setCameraStatus('Requesting camera to capture image...');
    try {
      const res = await fetch(`${API}/security/check?manual=true`); // Call the same API for backend coordination
      const data = await res.json();
      
      const hasResult = processSecurityData(data);
      if (!hasResult) setCameraStatus('Camera did not respond.');
      
    } catch (error) {
      setCameraStatus('Server connection error!');
    } finally {
      setIsProcessing(false);
    }
  };

    const approveStranger = async () => {
    try {
      localStorage.setItem("auto", JSON.stringify(true))
      setCameraStatus('Processing approval...');
      const res = await fetch(`${API}/security/approve`, { method: 'POST' });
      if (res.ok) {
        setCameraStatus('Approved. Welcome!');
        setIsStranger(false);
        setCameraImage(null);
        addNotification('Security', 'Update detailed');

      const status = 'Opened door'
      await fetch(`${API}/camera`, {
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify({
          status
        })
      })
      }
    } catch (error) {
      setCameraStatus('Connection error!');
    }
  };

  const rejectStranger = async () => {
    try {
      localStorage.setItem("auto", JSON.stringify(true))
      const status = 'Door rejected'
      const logRes = await fetch(`${API}/camera`, {
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify({
          status
        })
      })
      if (!logRes.ok) {
        throw new Error('Failed to save camera event')
      }

      await fetch(`${API}/security/reject`, { method: 'POST' });
      setCameraStatus('Access denied.');
      setIsStranger(false);
      setCameraImage(null);
      addNotification('Security', 'Intruder rejected.');
    } catch (error) {
      setCameraStatus('Connection error!');
    }
  };

  const allowStranger = async () => {
    try {
      localStorage.setItem("auto", JSON.stringify(true))
      setCameraStatus('Opening temp...');

      const status = 'Door opened temp'
      const logRes = await fetch(`${API}/camera`, {
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify({
          status
        })
      })
      if (!logRes.ok) {
        throw new Error('Failed to save camera event')
      }

      const res = await fetch(`${API}/security/allow`, { method: 'POST' });
      if (res.ok) {
        setCameraStatus('Door opened (Face not saved).');
        setIsStranger(false);
        addNotification('Security', 'Update detailed');
      }
    } catch (error) {
      setCameraStatus('Connection error!');
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
  
  let isLogged:boolean = localStorage.getItem("isLogin") == 'true'
  return (
<>
    {!isLogged? (<Login/>) : (  
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
            isChecked={auto}
            onToggleLight={toggleLight}
            onToggleFan={toggleFan}
            onToggleMode={toggleMode}
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
  </>
  )
}

export default IndexPage