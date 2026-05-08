import { useState } from 'react'
import UpdateBanner from './components/UpdateBanner'
import InstallBanner from './components/InstallBanner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import SalonDashboard from './pages/SalonDashboard'
import Unsubscribe from './pages/Unsubscribe'

function Home({ user, setUser }) {
  const [city, setCity] = useState('Москва')
  const [searchQuery, setSearchQuery] = useState(null)
  const isMoscow = city === 'Москва'
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <Nav onCityChange={setCity} user={user} onUserChange={setUser} />
      <HeroNew city={city} />
      {isMoscow && (
        <>
          <BentoGrid />
          <AllSlots />
          <Hero onSearch={setSearchQuery} />
          <ValueCard searchQuery={searchQuery} />
          <Ticker />
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
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/ui" element={<UI />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/salon/dashboard" element={<SalonDashboard />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/my-bookings" element={<MyBookings user={user} />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
