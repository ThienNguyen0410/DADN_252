import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type CameraEvent = {
  face_id: number
  img_url: string
  status: string
  created_at: string
}

type TemperatureEvent = {
  notification_id: number
  field: string
  value: number
  boundValue: number
  action: string
  time: string
}



export default function Notification() {
  const navigate = useNavigate()
  const API = "/api";
  const [selectedCamera, setSelectedCamera] = useState<CameraEvent | null>()
  const [notifications, setNotifications] = useState<TemperatureEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [cameraEvent, setcameraEvent] = useState<CameraEvent[]> ([])
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
  
  useEffect(() => {
    const fetchCamera = async() => {
      try {
        const res = await fetch(`${API}/camera`)
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await res.json()
        setcameraEvent(data)

        if (data.length >= 5) {
          await fetch(`${API}/camera`, {
            method: "DELETE"
          })
        }
      }
      catch(err){
        console.log(err);
      }
      finally {
        setLoading(false)
      }
    }
    fetchCamera()
  },[])

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
                  <img src={selectedCamera.img_url} alt="Camera feed" />
                  <div className="camera-status-badge">{selectedCamera.status}</div>
                </>
              )}
            </div>

            {/* Camera Events Timeline */}
            <div className="camera-events">
              <h4 style={{ margin: '0 0 0.8rem', color: 'var(--text-muted)' }}>History</h4>
              <ul className="event-timeline">
                {cameraEvent.map((event) => (
                  <li
                    key={event.face_id}
                    className={`event-item ${selectedCamera?.face_id === event.face_id ? 'active' : ''}`}
                    onClick={() => setSelectedCamera(event)}
                  >
                    <div className="event-header">
                      <span style={{ fontWeight: 'bold' }}>{event.created_at}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{event.status}</span>
                    </div>
                  </li>
                ))}
              </ul>            
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
