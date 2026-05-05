import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import Ticker from './components/Ticker'
import UI from './pages/UI'

function Home() {
  return (
    <div style={{background:'var(--bg)',minHeight:'100vh',paddingBottom:60}}>
      <Nav />
      <Hero />
      <BentoGrid />
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
      </Routes>
    </BrowserRouter>
  )
}
