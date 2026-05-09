import { useState } from 'react'
import UpdateBanner from './components/UpdateBanner'
import InstallBanner from './components/InstallBanner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from "./components/Footer"
import Nav from './components/Nav'
import HeroNew from './components/HeroNew'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import AllSlots from './components/AllSlots'
import Ticker from './components/Ticker'
import ValueCard from './components/ValueCard'
import MyBookings from './components/MyBookings'
import UI from './pages/UI'
import Confirm from './pages/Confirm'
import ResetPassword from './pages/ResetPassword'
import Connect from './pages/Connect'
import SalonOnboarding from "./pages/SalonOnboarding"
import SalonDashboard from './pages/SalonDashboard'
import SalonLogin from './pages/SalonLogin'
import SalonAuth from './pages/SalonAuth'
import Unsubscribe from './pages/Unsubscribe'
import ComingSoon from './components/ComingSoon'

function PageWithLayout({ children }) {
  const [user, setUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  return (
    <>
      <Nav user={user} onUserChange={setUser} />
      {children}
      <Footer />
    </>
  )
}

function Home({ user, setUser, authOpen, setAuthOpen }) {
  const [city, setCity] = useState('Москва')
  const [searchQuery, setSearchQuery] = useState(null)
  const isMoscow = city === 'Москва'
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <Nav onCityChange={setCity} user={user} onUserChange={setUser} authOpen={authOpen} onAuthOpen={setAuthOpen} />
      <HeroNew city={city} />
      {isMoscow && (
        <>
          <BentoGrid />
          <AllSlots />
          <Hero onSearch={setSearchQuery} />
          <ValueCard searchQuery={searchQuery} />
          <Ticker />
          <Footer />
        </>
      )}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lovi_user')) } catch { return null }
  })
  return (
    <>
      <UpdateBanner />
      <InstallBanner />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} authOpen={authOpen} setAuthOpen={setAuthOpen} />} />
        <Route path="/ui" element={<UI />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/salon/dashboard" element={<SalonDashboard />} />
        <Route path="/about"    element={<PageWithLayout><ComingSoon title="О сервисе" /></PageWithLayout>} />
        <Route path="/pass"     element={<PageWithLayout><ComingSoon title="Lovi Pass" /></PageWithLayout>} />
        <Route path="/partners" element={<PageWithLayout><ComingSoon title="Партнёрам" /></PageWithLayout>} />
        <Route path="/privacy"  element={<PageWithLayout><ComingSoon title="Политика конфиденциальности" /></PageWithLayout>} />
        <Route path="/offer"    element={<PageWithLayout><ComingSoon title="Публичная оферта" /></PageWithLayout>} />
        <Route path="/salon/onboarding" element={<SalonOnboarding />} />
        <Route path="/salon/login" element={<SalonLogin />} />
        <Route path="/salon/auth" element={<SalonAuth />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/my-bookings" element={<MyBookings user={user} onUserChange={setUser} openAuth={() => setAuthOpen(true)} />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
