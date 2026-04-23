export type SignalNotification = {
  id: number
  title: string
  detail: string
  time: string
}

export type Telemetry = {
  temperature: number
  humidity: number
  updatedAt: string
}
