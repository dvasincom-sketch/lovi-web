import { useState, useEffect, useRef } from 'react'

const LOADING_PHRASES = [
  'Сверяем графики...',
  'Проверяем свободные окна...',
  'Анализируем доступность...',
  'Подбираем лучшие варианты...',
]

// fire-and-forget — сохраняем поисковый запрос для аналитики
async function saveSearchIntent(location, service) {
  try {
    await fetch('https://insalon.onrender.com/api/lovi/search-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: location.trim() || null,
        service:  service.trim()  || null,
      }),
    })
  } catch { /* не блокируем UX */ }
}

// Props:
//   onSearch({ location, service }) — вызывается после «загрузки», App прокидывает в BentoGrid
export default function Hero({ onSearch }) {
  const [count, setCount] = useState(342)
  const [location, setLocation] = useState('')
  const [service, setService] = useState('')
  const [loading, setLoading] = useState(false)
  const [phrase, setPhrase] = useState('')
  const intervalRef = useRef(null)
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    const t = setInterval(() => setCount(v => v + (Math.random() > 0.5 ? -1 : 1)), 3000)
    return () => clearInterval(t)
  }, [])

  function applyChip(chip) {
    if (chip === 'Рядом со мной') setLocation(chip)
    else setService(chip)
  }

  function handleSearch() {
    if (loading) return
    setLoading(true)
    setPhrase(LOADING_PHRASES[0])
    let idx = 0
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_PHRASES.length
      setPhrase(LOADING_PHRASES[idx])
    }, 500)

    saveSearchIntent(location, service)

    setTimeout(() => {
      clearInterval(intervalRef.current)
      setLoading(false)
      document.getElementById('bento-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      onSearch?.({ location, service })
    }, 1800)
  }

  return (
    <section style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '40px 16px 40px' : '80px 40px 60px',
      textAlign: 'center', animation: 'fadeUp 0.8s ease both',
    }}>

      {/* Счётчик */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
        fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--accent)',
      }}>
        <div style={{ position: 'relative', width: 6, height: 6, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
        </div>
        В эфире: {count} окна
      </div>

      {/* Заголовок */}
      <h1 style={{
        fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,4.5vw,58px)',
        fontWeight: 500, lineHeight: 1.08, marginBottom: 40, letterSpacing: '-0.02em',
      }}>
        Время — это <i style={{ color: 'var(--accent)', fontStyle: 'italic' }}>единственная</i> валюта,<br />которую нельзя вернуть.
      </h1>

      {/* Форма поиска */}
      <div style={{
        maxWidth: 760, margin: '0 auto',
        background: '#fff', padding: 10, borderRadius: isMobile ? 16 : 28,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto',
        gap: isMobile ? 8 : 0,
        boxShadow: '0 40px 100px rgba(15,23,15,0.05)',
        border: '1px solid var(--border)',
      }}>
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Район или метро"
          style={{
            border: 'none', padding: '16px 24px', fontSize: 16, outline: 'none',
            background: 'transparent', fontFamily: 'Inter, sans-serif',
            borderRight:  isMobile ? 'none' : '1px solid var(--border)',
            borderBottom: isMobile ? '1px solid var(--border)' : 'none',
          }}
        />
        <input
          value={service}
          onChange={e => setService(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Услуга или тип"
          style={{
            border: 'none', padding: '16px 24px', fontSize: 16, outline: 'none',
            background: 'transparent', fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            background: loading ? 'rgba(18,26,18,0.55)' : 'var(--dark)',
            color: '#fff', border: 'none',
            padding:      isMobile ? '16px' : '0 28px',
            borderRadius: isMobile ? 12 : 20,
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
            fontSize: 13, whiteSpace: 'nowrap',
            width:    isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : 170,
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.3s',
          }}
        >
          {loading ? phrase : 'Проверить доступность'}
        </button>
      </div>

      {/* Чипы */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
        {['Рядом со мной', 'Для двоих', 'Тайский', 'С душем', 'До 3 000 ₽'].map(c => (
          <button key={c} className="chip" onClick={() => applyChip(c)}>{c}</button>
        ))}
      </div>
    </section>
  )
}
