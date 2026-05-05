import { useState, useEffect, useRef } from 'react'

const CARDS = [
  {
    location: 'Патриаршие пруды',
    service: '«Массаж лица» Сияние',
    reason: 'Мастер освободился на 17:00',
    original: '4 500 ₽',
    price: '2 025 ₽',
    discount: '-55%',
    timer: '38 мин',
  },
  {
    location: 'Сити',
    service: 'Флоатинг для двоих',
    reason: 'Клиент отменил запись',
    original: '7 200 ₽',
    price: '3 600 ₽',
    discount: '-50%',
    timer: '1:12 ч',
  },
  {
    location: 'Арбат',
    service: 'Тайский ойл-массаж',
    reason: 'Горящий слот на 19:00',
    original: '5 800 ₽',
    price: '2 610 ₽',
    discount: '-55%',
    timer: '2:04 ч',
  },
  {
    location: 'Беляево',
    service: '«Перерождение» Head SPA',
    reason: 'Открылось окно сегодня',
    original: '5 900 ₽',
    price: '5 015 ₽',
    discount: '-15%',
    timer: '45 мин',
  },
  {
    location: 'Хамовники',
    service: 'SPA для мужчин «Самурай»',
    reason: 'Запись перенесена',
    original: '6 000 ₽',
    price: '2 700 ₽',
    discount: '-55%',
    timer: '1:30 ч',
  },
]

function useLiveNumber(target, duration = 1800) {
  const [value, setValue] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    let rafId
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setValue(target)
        function wobble() {
          setValue(v => Math.max(1, v + (Math.random() > 0.5 ? 1 : -1)))
          timerRef.current = setTimeout(wobble, 2500 + Math.random() * 2500)
        }
        timerRef.current = setTimeout(wobble, 2500 + Math.random() * 2500)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timerRef.current)
    }
  }, [target, duration])

  return value
}

function SlotCard({ card, state }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '22px 24px',
      zIndex: 2,
      transition: 'opacity 0.45s ease, transform 0.45s ease',
      opacity: state === 'visible' ? 1 : 0,
      transform:
        state === 'visible'
          ? 'translateY(0) scale(1)'
          : state === 'exiting'
          ? 'translateY(-18px) scale(0.97)'
          : 'translateY(20px) scale(0.97)',
      pointerEvents: state === 'visible' ? 'auto' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
          {card.location}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 500, color: 'var(--accent)',
          background: 'rgba(249,115,22,0.08)', padding: '3px 10px', borderRadius: 8,
        }}>
          {card.timer}
        </span>
      </div>

      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--dark)', lineHeight: 1.3, marginBottom: 8 }}>
        {card.service}
      </div>

      <div style={{ fontSize: 12, color: 'var(--secondary)', fontStyle: 'italic', marginBottom: 18 }}>
        {card.reason}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{card.original} в салоне</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--dark)', lineHeight: 1.2 }}>{card.price}</div>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#fff',
          background: 'var(--accent)', padding: '5px 14px', borderRadius: 10,
        }}>
          {card.discount}
        </div>
      </div>
    </div>
  )
}

export default function HeroNew() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const slots   = useLiveNumber(342, 1600)
  const salons  = useLiveNumber(52,  1200)
  const regions = useLiveNumber(7,   900)

  const [current, setCurrent] = useState(0)
  const [cardState, setCardState] = useState('visible')

  useEffect(() => {
    const id = setInterval(() => {
      setCardState('exiting')
      setTimeout(() => {
        setCurrent(v => (v + 1) % CARDS.length)
        setCardState('entering')
        requestAnimationFrame(() => requestAnimationFrame(() => setCardState('visible')))
      }, 450)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: isMobile ? '40px 16px 48px' : '72px 40px 64px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
      gap: isMobile ? 40 : 64,
      alignItems: 'start',
      animation: 'fadeUp 0.7s ease both',
    }}>

      {/* ── LEFT ── */}
      <div style={{ paddingTop: isMobile ? 0 : 10 }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: isMobile ? 30 : 'clamp(32px, 3.8vw, 50px)',
          fontWeight: 500,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--dark)',
          margin: '0 0 20px',
        }}>
          Лови: все{' '}
          <i style={{ color: 'var(--accent)', fontStyle: 'italic' }}>горящие окна</i>
          {' '}Москвы в одной ленте
        </h1>

        <p style={{
          fontSize: 16,
          color: 'var(--secondary)',
          lineHeight: 1.7,
          margin: '0 0 32px',
          maxWidth: 440,
        }}>
          Больше не нужно следить за соцсетями — все горящие предложения здесь, в одной ленте.
        </p>

        {/* ── ДАШБОРД СТАТУС ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440 }}>

          {/* плашка "Прямо сейчас" */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--dark)', color: '#fff',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 20,
            alignSelf: 'flex-start',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'pulse 1.6s ease-in-out infinite',
              flexShrink: 0,
            }} />
            Прямо сейчас
          </div>

          {/* три метрики */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {[
              { value: slots,   label: 'горящих окна' },
              { value: salons,  label: 'салонов' },
              { value: regions, label: 'районов' },
            ].map(({ value, label }) => (
              <div key={label} style={{
                background: 'var(--bg)',
                padding: '16px 20px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--dark)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {value}
                </span>
                <span style={{ fontSize: 12, color: 'var(--secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* стопка карточек */}
        <div style={{ position: 'relative', width: '100%', height: 210 }}>
          <div style={{
            position: 'absolute', bottom: -14, left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)', height: '100%',
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: 20, zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', bottom: -7, left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 16px)', height: '100%',
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: 20, zIndex: 1,
          }} />
          <SlotCard card={CARDS[current]} state={cardState} />
        </div>

        {/* точки */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
          {CARDS.map((_, i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: i === current ? 'var(--dark)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* объяснение механики */}
        <p style={{
          fontSize: 13,
          color: 'var(--secondary)',
          lineHeight: 1.65,
          margin: '4px 0 0',
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
        }}>
          Пустое окно для салона — это{' '}
          <span style={{ color: 'var(--dark)', fontWeight: 500 }}>100% убыток</span>.
          {' '}Поэтому они отдают нам свободные слоты на сегодня со скидкой{' '}
          <span style={{ color: 'var(--dark)', fontWeight: 500 }}>до 60%</span>.
        </p>
      </div>
    </section>
  )
}
