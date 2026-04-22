import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import Login from './pages/login'
import HumidChart from './pages/humidChart'
import TempChart from './pages/tempChart'
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<IndexPage />} />
      <Route path="/humidChart" element={<HumidChart />} />
      <Route path="/tempChart" element={<TempChart />} />
    </Routes>
  )
}

export default App
