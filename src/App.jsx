import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Competitions from './pages/Competitions'
import AIRecommend from './pages/AIRecommend'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import './styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/ai-recommend" element={<AIRecommend />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
