import type { SignalNotification } from '../../types/dashboard'

type NotificationsCardProps = {
  notifications: SignalNotification[]
}

function NotificationsCard({ notifications }: NotificationsCardProps) {
  return (
    <article className="glass-card notification-card">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p className="empty-state">No notifications yet. Trigger a signal or control a device.</p>
      ) : (
        <ul className="notify-list">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.detail}</p>
              </div>
              <span>{notification.time}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default NotificationsCard
