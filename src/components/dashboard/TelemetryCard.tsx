import type { Telemetry } from '../../types/dashboard'

type TelemetryCardProps = {
  telemetry: Telemetry
}

function moveTohumidChart() {
  window.location.href = '/humidChart'
}

function moveToTempChart() {
  window.location.href = '/tempChart'
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
          <button className="btn btn-primary" onClick={moveToTempChart} type="button">View</button>
        </div>
        <div className="telemetry-item">
          <span>Humidity</span>
          <strong>{telemetry.humidity.toFixed(0)} %</strong>
          <button className="btn btn-primary"  onClick={moveTohumidChart} type="button">View</button>
        </div>
     
      </div>

      <p className="telemetry-time">Updated at: {telemetry.updatedAt}</p>
    </article>
  )
}

export default TelemetryCard
