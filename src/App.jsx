import Nav from './components/Nav'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import Ticker from './components/Ticker'

export default function App() {
  return (
    <div style={{background:'var(--bg)',minHeight:'100vh',paddingBottom:60}}>
      <Nav />
      <Hero />
      <BentoGrid />
      <Ticker />
    </div>
  )
}
