import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type CameraEvent = {
  id: number
  timestamp: string
  personType: 'stranger' | 'known' | 'unknown'
  imageUrl: string
  status: string
}

type TemperatureEvent = {
  notification_id: number
  field: string
  value: number
  boundValue: number
  action: string
  time: string
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


export default function Notification() {
  const navigate = useNavigate()
  const API = "/api";
  const [selectedCamera, setSelectedCamera] = useState<CameraEvent | null>(mockCameraEvents[0])
  const [doorResponse, setDoorResponse] = useState<{ [key: number]: boolean | null }>({})
  const [notifications, setNotifications] = useState<TemperatureEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async() => {
      try {
        const res = await fetch(`${API}/notifications`);

        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await res.json();
        setNotifications(data);

        if (data.length >= 10) {
          await fetch(`${API}/notifications`, {
            method: "DELETE"
          })
        }
      }
      catch(err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  },[]);
  

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
            {notifications.map((event) => (
              <li key={event.notification_id}>
                <div className="temp-event-content">
                  <div className="temp-event-header">
                    <span className="temp-value">
                      {event.value}°C
                      <span className="temp-threshold">
                        {event.value > event.boundValue ? '⬆️' : '⬇️'} ({event.boundValue}°C)
                      </span>
                    </span>
                    <span className="event-time">{event.time}</span>
                  </div>
                  <div className="temp-event-info">
                    <span className="action-label">Action:</span>
                    <strong className="action-text">{event.action}</strong>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {notifications.length === 0 && (
            <p className="empty-state">No temerature notifications.</p>
          )}
        </div>
      </section>
    </div>
  )
}
