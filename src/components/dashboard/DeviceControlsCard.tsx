type DeviceControlsCardProps = {
  isLightOn: boolean
  isFanOn: boolean
  isChecked:  boolean
  onToggleLight: () => void
  onToggleFan: () => void
  onToggleMode: () => void
}

function DeviceControlsCard({ isLightOn, isFanOn,isChecked, onToggleLight, onToggleFan,onToggleMode}: DeviceControlsCardProps) {
  
  return (
    <article className="glass-card control-card">
      <h3>Device controls</h3>
      <p>Switch home devices with one tap.</p>
      <div className="device-list">
        <button className={`device-btn ${isLightOn ? 'active' : ''}`} onClick={onToggleLight} type="button">
          <span>Light</span>
          <strong>{isLightOn ? 'ON' : 'OFF'}</strong>
        </button>
        <button className={`device-btn ${isFanOn ? 'active' : ''}`} onClick={onToggleFan} type="button">
          <span>Fan</span>
          <strong>{isFanOn ? 'ON' : 'OFF'}</strong>
        </button>
        <div className="auto-mode-control">
          <label htmlFor="auto-mode-checkbox" className="auto-mode-label">
            <input
              id="auto-mode-checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={onToggleMode}
              className="auto-mode-checkbox"
            />
            <span className="auto-mode-text">Auto Mode {isChecked ? '🔄' : '⏸'}</span>
          </label>
        </div>
      </div>
    </article>
  )
}

export default DeviceControlsCard
