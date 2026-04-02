import type { Telemetry } from '../../types/dashboard'

type TelemetryCardProps = {
  telemetry: Telemetry
}

function TelemetryCard({ telemetry }: TelemetryCardProps) {
  return (
    <article className="glass-card metrics-card">
      <h3>Telemetry</h3>
      <p>Live metrics from connected devices.</p>

      <div className="telemetry-grid">
        <div className="telemetry-item">
          <span>Temp</span>
          <strong>{telemetry.temperature.toFixed(1)} C</strong>
        </div>
        <div className="telemetry-item">
          <span>Humidity</span>
          <strong>{telemetry.humidity.toFixed(0)} %</strong>
        </div>
        <div className="telemetry-item">
          <span>Voltage</span>
          <strong>{telemetry.voltage.toFixed(0)} V</strong>
        </div>
        <div className="telemetry-item">
          <span>Noise</span>
          <strong>{telemetry.noise.toFixed(0)} dB</strong>
        </div>
      </div>

      <p className="telemetry-time">Updated at: {telemetry.updatedAt}</p>
    </article>
  )
}

export default TelemetryCard
