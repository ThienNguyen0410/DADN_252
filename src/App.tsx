import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import Login from './pages/login'
import Register from './pages/register'
import HumidChart from './pages/humidChart'
import TempChart from './pages/tempChart'
import Notification from './pages/Notification'
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<IndexPage />} />
      <Route path="/humidChart" element={<HumidChart />} />
      <Route path="/tempChart" element={<TempChart />} />
      <Route path="/notification" element={<Notification />} />
    </Routes>
  )
}

export default App
