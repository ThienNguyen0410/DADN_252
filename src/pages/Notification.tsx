import { useState } from 'react'

type CameraEvent = {
  id: number
  timestamp: string
  personType: 'stranger' | 'known' | 'unknown'
  imageUrl: string
  status: string
}

type TemperatureEvent = {
  id: number
  timestamp: string
  temperature: number
  threshold: number
  action: string
  status: 'completed' | 'active'
}

// Mock data
const mockCameraEvents: CameraEvent[] = [
  {
    id: 1,
    timestamp: '14:35',
    personType: 'stranger',
    imageUrl: 'https://via.placeholder.com/300x250?text=Stranger+Detected',
    status: '🚨 CẢNH BÁO: NGƯỜI LẠ',
  },
  {
    id: 2,
    timestamp: '14:22',
    personType: 'known',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW_KIAPN6vtn6vN5YhBFBVQmQe4B57qm0050n3wnzw6XCYmn1ebBvtdAF3brUXoLCApdznVN8p3GZiR2bPn9ZqivoQg-vIj2DcmTvjtfE&s',
    status: '✅ XÁC NHẬN: NGƯỜI QUEN',
  },
  {
    id: 3,
    timestamp: '13:45',
    personType: 'unknown',
    imageUrl: 'https://via.placeholder.com/300x250?text=Unknown+Face',
    status: '🔍 Không phát hiện khuôn mặt',
  },
]

const mockTemperatureEvents: TemperatureEvent[] = [
  {
    id: 1,
    timestamp: '14:32',
    temperature: 32,
    threshold: 30,
    action: 'Bật quạt',
    status: 'completed',
  },
  {
    id: 2,
    timestamp: '13:50',
    temperature: 31.5,
    threshold: 30,
    action: 'Bật quạt',
    status: 'completed',
  },
  {
    id: 3,
    timestamp: '12:15',
    temperature: 29,
    threshold: 30,
    action: 'Tắt quạt',
    status: 'completed',
  },
]

export default function Notification() {
  const [selectedCamera, setSelectedCamera] = useState<CameraEvent | null>(mockCameraEvents[0])
  const [doorResponse, setDoorResponse] = useState<{ [key: number]: boolean | null }>({})

  const handleDoorAction = (eventId: number, open: boolean) => {
    setDoorResponse((prev) => ({ ...prev, [eventId]: open }))
    // Reset sau 3 giây
    setTimeout(() => {
      setDoorResponse((prev) => ({ ...prev, [eventId]: null }))
    }, 3000)
  }

  return (
    <div className="notification-page">
      {/* Camera Section */}
      <section className="notification-section">
        <div className="glass-card">
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>📷 Camera Notifications</h2>

          <div className="camera-container">
            {/* Camera Preview */}
            <div className="camera-preview">
              {selectedCamera && (
                <>
                  <img src={selectedCamera.imageUrl} alt="Camera feed" />
                  <div className="camera-status-badge">{selectedCamera.status}</div>
                </>
              )}
            </div>

            {/* Camera Events Timeline */}
            <div className="camera-events">
              <h4 style={{ margin: '0 0 0.8rem', color: 'var(--text-muted)' }}>History</h4>
              <ul className="event-timeline">
                {mockCameraEvents.map((event) => (
                  <li
                    key={event.id}
                    className={`event-item ${selectedCamera?.id === event.id ? 'active' : ''}`}
                    onClick={() => setSelectedCamera(event)}
                  >
                    <div className="event-header">
                      <span className="event-time">{event.timestamp}</span>
                      <span
                        className={`person-badge ${event.personType}`}
                      >
                        {event.personType === 'stranger' && 'Stranger'}
                        {event.personType === 'known' && 'Acquaintance'}
                        {event.personType === 'unknown' && 'Undefined'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Door Control */}
              {selectedCamera && selectedCamera.personType === 'stranger' && (
                <div className="door-control">
                  <p style={{ margin: '1rem 0 0.8rem', fontSize: '0.95rem', fontWeight: 600 }}>
                    Request: Open door?
                  </p>
                  <div className="door-buttons">
                    <button
                      className={`btn door-btn ${doorResponse[selectedCamera.id] === true ? 'accepted' : ''}`}
                      onClick={() => handleDoorAction(selectedCamera.id, true)}
                    >
                      ✓ Yes
                    </button>
                    <button
                      className={`btn door-btn ${doorResponse[selectedCamera.id] === false ? 'rejected' : ''}`}
                      onClick={() => handleDoorAction(selectedCamera.id, false)}
                    >
                      ✕ No
                    </button>
                  </div>
                  {doorResponse[selectedCamera.id] !== null && (
                    <div className="response-message">
                      {doorResponse[selectedCamera.id] ? 'Open door request was sent' : 'Declare to open door'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Temperature Section */}
      <section className="notification-section">
        <div className="glass-card">
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>🌡️ Temperature Notifications</h2>

          <ul className="temp-events-list">
            {mockTemperatureEvents.map((event) => (
              <li key={event.id} className={`temp-event ${event.status}`}>
                <div className="temp-event-content">
                  <div className="temp-event-header">
                    <span className="temp-value">
                      {event.temperature}°C
                      <span className="temp-threshold">
                        {event.temperature > event.threshold ? '⬆️' : '⬇️'} ({event.threshold}°C)
                      </span>
                    </span>
                    <span className="event-time">{event.timestamp}</span>
                  </div>
                  <div className="temp-event-info">
                    <span className="action-label">Action:</span>
                    <strong className="action-text">{event.action}</strong>
                    <span className="status-badge">{event.status === 'completed' ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {mockTemperatureEvents.length === 0 && (
            <p className="empty-state">No temerature notifications.</p>
          )}
        </div>
      </section>
    </div>
  )
}
