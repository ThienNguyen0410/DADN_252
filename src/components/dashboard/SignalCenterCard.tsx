type SignalCenterCardProps = {
  onReceiveSignal: () => void
  onSyncTelemetry: () => void
}

function SignalCenterCard({ onReceiveSignal, onSyncTelemetry }: SignalCenterCardProps) {
  return (
    <article className="glass-card signal-card">
      <h3>Signal center</h3>
      <p>Receive packet from device gateway.</p>
      <div className="signal-stack">
        <button className="btn btn-primary" onClick={onReceiveSignal} type="button">
          Receive Signal
        </button>
        <button className="btn btn-primary" onClick={onSyncTelemetry} type="button">
          Sync Telemetry
        </button>
      </div>
    </article>
  )
}

export default SignalCenterCard
