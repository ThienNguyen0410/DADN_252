import { useState } from "react"

type SignalCenterCardProps = {
  onReceiveSignal: () => void
  onSyncTelemetry: () => void
  submitSignal: (temperature: number, humidity: number) => void
}
function SignalCenterCard({ onReceiveSignal, onSyncTelemetry, submitSignal }: SignalCenterCardProps) {
  const [temperature, setTemperature] = useState(25)
  const[humidity, setHumidity] = useState(25)

  return (
    <article className="glass-card signal-card">
      <h3>Set humid/temperature bound</h3>
      <p>Let's set boundary of temperature & humidity</p>
      <div className="signal-stack">
        <strong>Temperature:</strong>
        <input 
          type="number" 
          value={temperature}
          onChange={(e) => setTemperature(e.target.value === '' ? 30 : Number(e.target.value))}
          placeholder="Set temperature" />
        <strong>Humidity:</strong>
        <input 
        type="number" 
        value={humidity}
        onChange={(e) => setHumidity(e.target.value === '' ? 30 : Number(e.target.value))}
        placeholder="Set humidity" />
        <button className="btn btn-success" onClick = {() => submitSignal(temperature, humidity)} type="button">Submit</button>
        <button className="btn btn-primary" onClick={onReceiveSignal} type="button">Receive signal</button>
        <button className="btn btn-secondary" onClick={onSyncTelemetry} type="button">Sync telemetry</button>
      </div>
    </article>
  )
}

export default SignalCenterCard
