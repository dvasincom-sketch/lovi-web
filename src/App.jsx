import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import HeroNew from './components/HeroNew'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import AllSlots from './components/AllSlots'
import Ticker from './components/Ticker'
import UI from './pages/UI'
import Confirm from './pages/Confirm'

function Home() {
  return (
    <div style={{background:'var(--bg)',minHeight:'100vh',paddingBottom:60}}>
      <Nav />
      <HeroNew />
      <BentoGrid />
      <AllSlots />
      <Hero />
      <Ticker />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ui" element={<UI />} />
        <Route path="/confirm" element={<Confirm />} />
      </Routes>
    </BrowserRouter>
  )
}
