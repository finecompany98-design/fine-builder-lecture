import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import Home from './pages/Home'
import Competitions from './pages/Competitions'
import CompetitionDetail from './pages/Competitions/CompetitionDetail'
import AIRecommend from './pages/AIRecommend'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import MyPage from './pages/MyPage'
import './styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/competitions/:id" element={<CompetitionDetail />} />
        <Route path="/ai-recommend" element={<AIRecommend />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mypage" element={
          <ProtectedRoute><MyPage /></ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
