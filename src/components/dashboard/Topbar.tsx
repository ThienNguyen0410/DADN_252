import type { SignalNotification } from '../../types/dashboard'

type TopbarProps = {
  displayName: string | null
  onLogout: () => void
  renderNotifications?: () => void
  notifications?: SignalNotification[]
}

function Topbar({ displayName, onLogout, renderNotifications, notifications = [] }: TopbarProps) {
  const autoMode = localStorage.getItem("auto")
  const hasUnreadNotifications = notifications && notifications.length > 0 && autoMode == 'true'
  
  return (
    <header className="topbar glass-card">
      <div>
        <p className="topbar-label">Connected user</p>
        <h2>Hello, {displayName}</h2>
      </div>
      <div className="flex justify-end items-center gap-3 pr-4 p-4">
        <button className="btn btn-ghost p-2 notification-btn" onClick={renderNotifications}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M18 8c0-3-2-6-6-6s-6 3-6 6c0 7-3 9-3 9h18s-3-2-3-9"/>
          </svg>
          {hasUnreadNotifications && <span className="notification-badge" />}
        </button>

        <button className="btn btn-ghost px-4 py-2" onClick={onLogout} type="button">
          Log out
        </button>
      </div>
    </header>
  )
}

export default Topbar
