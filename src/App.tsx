import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import Login from './pages/login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<IndexPage />} />
    </Routes>
  )
}

export default App
