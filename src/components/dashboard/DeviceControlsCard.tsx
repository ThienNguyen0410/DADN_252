type DeviceControlsCardProps = {
  isLightOn: boolean
  isFanOn: boolean
  onToggleLight: () => void
  onToggleFan: () => void
}

function DeviceControlsCard({ isLightOn, isFanOn, onToggleLight, onToggleFan }: DeviceControlsCardProps) {
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
      </div>
    </article>
  )
}

export default DeviceControlsCard
