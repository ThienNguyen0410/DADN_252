type TopbarProps = {
  displayName: string
  onLogout: () => void
}

function Topbar({ displayName, onLogout }: TopbarProps) {
  return (
    <header className="topbar glass-card">
      <div>
        <p className="topbar-label">Connected user</p>
        <h2>Hello, {displayName}</h2>
      </div>
      <button className="btn btn-ghost" onClick={onLogout} type="button">
        Log out
      </button>
    </header>
  )
}

export default Topbar
