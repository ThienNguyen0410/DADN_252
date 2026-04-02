import { useEffect, useRef, useState } from 'react'
import DeviceControlsCard from '../components/dashboard/DeviceControlsCard'
import NotificationsCard from '../components/dashboard/NotificationsCard'
import QrScannerCard from '../components/dashboard/QrScannerCard'
import SignalCenterCard from '../components/dashboard/SignalCenterCard'
import TelemetryCard from '../components/dashboard/TelemetryCard'
import Topbar from '../components/dashboard/Topbar'
import { signalTemplates } from '../data/signalTemplates'
import type { SignalNotification, Telemetry } from '../types/dashboard'
import { getCurrentTime } from '../utils/time'

function IndexPage() {
  const API = '/api'

  const [displayName] = useState('thien.iot')
  const [isLightOn, setIsLightOn] = useState(false)
  const [isFanOn, setIsFanOn] = useState(false)
  const [notifications, setNotifications] = useState<SignalNotification[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [volume, setVolume] = useState(0)
  const [scanStatus, setScanStatus] = useState('Ready to scan QR device.')
  const [telemetry, setTelemetry] = useState<Telemetry>({
    temperature: 26.4,
    humidity: 56,
    voltage: 221,
    noise: 34,
    updatedAt: getCurrentTime(),
  })


  const scanTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    updateTelemetry();
    return () => {
      if (scanTimeoutRef.current) {
        window.clearTimeout(scanTimeoutRef.current)
      }
    }
  }, [])

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

  const startQrScan = () => {
    if (isScanning) {
      return
    }

    setIsScanning(true)
    setScanStatus('Scanning QR code...')

    scanTimeoutRef.current = window.setTimeout(() => {
      const deviceCode = `IOT-${Math.floor(1000 + Math.random() * 9000)}`
      setScanStatus(`Device linked: ${deviceCode}`)
      setIsScanning(false)
      addNotification('QR linked', `${deviceCode} has been added to your system.`)
    }, 1600)
  }

  const handleLogout = () => {
    setNotifications([])
    setIsLightOn(false)
    setIsFanOn(false)
    setIsScanning(false)
    setScanStatus('Ready to scan QR device.')
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
          <QrScannerCard isScanning={isScanning} scanStatus={scanStatus} onStartScan={startQrScan} />
          <NotificationsCard notifications={notifications} />
        </div>
      </section>
    </main>
  )
}

export default IndexPage
