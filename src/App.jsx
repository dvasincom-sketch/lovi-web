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
import Partners from './pages/Partners'
import About from './pages/About'
import Pass from './pages/Pass'
import ScrollToTop from './components/ScrollToTop'
import Privacy from './pages/Privacy'
import Offer from './pages/Offer'
import PartnerLanding from './pages/PartnerLanding'

function PageWithLayout({ children }) {
  const [user, setUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav user={user} onUserChange={setUser} />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

function Home({ user, setUser, authOpen, setAuthOpen }) {
  const [city, setCity] = useState('Москва')
  const [searchQuery, setSearchQuery] = useState(null)
  const isMoscow = city === 'Москва'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav onCityChange={setCity} user={user} onUserChange={setUser} authOpen={authOpen} onAuthOpen={setAuthOpen} />
      <div style={{ flex: 1 }}>
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
      <Footer />
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lovi_user')) } catch { return null }
  })
  const [authOpen, setAuthOpen] = useState(false)
  return (
    <>
      <UpdateBanner />
      <InstallBanner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} authOpen={authOpen} setAuthOpen={setAuthOpen} />} />
          <Route path="/ui" element={<UI />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/salon/dashboard" element={<SalonDashboard />} />
          <Route path="/about" element={<PageWithLayout><About /></PageWithLayout>} />
          <Route path="/pass" element={<PageWithLayout><Pass /></PageWithLayout>} />
          <Route path="/partners" element={<PageWithLayout><Partners /></PageWithLayout>} />
          <Route path="/privacy" element={<PageWithLayout><Privacy /></PageWithLayout>} />
          <Route path="/offer" element={<PageWithLayout><Offer /></PageWithLayout>} />
          <Route path="/salon/onboarding" element={<SalonOnboarding />} />
          <Route path="/salon/login" element={<SalonLogin />} />
          <Route path="/salon/auth" element={<SalonAuth />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/PartnerLanding" element={<PageWithLayout><PartnerLanding /></PageWithLayout>} />
          <Route path="/my-bookings" element={<MyBookings user={user} onUserChange={setUser} openAuth={() => setAuthOpen(true)} authOpen={authOpen} setAuthOpen={setAuthOpen} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}