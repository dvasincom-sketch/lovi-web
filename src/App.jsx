import Header from './components/Header'
import Search from './components/Search'
import BentoGrid from './components/BentoGrid'
import Ticker from './components/Ticker'

export default function App() {
  return (
    <div style={{background:'var(--bg)',minHeight:'100vh',paddingBottom:80}}>
      <Header />
      <Search />
      <BentoGrid />
      <Ticker />
    </div>
  )
}
