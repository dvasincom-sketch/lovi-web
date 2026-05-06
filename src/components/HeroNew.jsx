import { useState, useEffect, useRef } from 'react'

const TITLES = [
  'Успейте перехватить это окно',
  'Последнее предложение на сегодня в этом районе',
  'Слот сгорает — лови момент',
  'Лови: мастер освободился прямо сейчас',
  'Цена актуальна, пока окно не занято',
]

const REASONS = [
  'Клиент не смог прийти',
  'Окно открылось только что',
  'Мастер освободился раньше графика',
  'Отмена записи — слот свободен',
  'Слот не был подтверждён',
  'У клиента изменились планы',
  'Слот освободился после сверки графика',
  'Окно появилось в результате переноса',
  'Запись не была подтверждена вовремя',
]

const SERVICES = [
  'Скульптурный массаж лица',
  'Массаж головы и шейно-воротниковой зоны',
  'Массаж лица',
  'Антистресс-массаж',
  'Массаж спины',
  'Лимфодренажный массаж',
]

const SERVICE_DESCRIPTIONS = {
  'Скульптурный массаж лица': 'Глубокая проработка мышц для чёткого контура',
  'Массаж головы и шейно-воротниковой зоны': 'Быстрое снятие умственного напряжения',
  'Массаж лица': 'Техника для лифтинга и здорового цвета кожи',
  'Антистресс-массаж': 'Глубокое расслабление нервной системы',
  'Массаж спины': 'Локальная проработка самой зажатой зоны',
  'Лимфодренажный массаж': 'Снятие отёков и детоксикация организма',
}

const DISCOUNTS = [
  'Массаж по цене ужина в кафе',
  'Премиальный Head Spa по цене обычного мытья головы',
  '90 минут релакса по цене 60-ти',
  'Справедливая цена за твою решительность',
  'Час глубокого релакса по цене такси до дома',
  'Массаж по цене латте',
  'Полноценный уход по цене набора тканевых масок',
  'Чистая стоимость услуги без маркетинговых надбавок',
]

const LOCATIONS = [
  'Арбат', 'Басманный', 'Замоскворечье', 'Пресненский', 'Таганский',
  'Тверской', 'Хамовники', 'Якиманка', 'Аэропорт', 'Беговой',
  'Савёловский', 'Сокол', 'Тимирязевский', 'Алексеевский', 'Бибирево',
  'Останкинский', 'Отрадное', 'Свиблово', 'Сокольники', 'Измайлово',
  'Перово', 'Преображенское', 'Люблино', 'Марьино', 'Нижегородский',
  'Текстильщики', 'Даниловский', 'Донской', 'Царицыно', 'Академический',
  'Коньково', 'Черёмушки', 'Ясенево', 'Крылатское', 'Кунцево',
  'Раменки', 'Солнцево', 'Митино', 'Строгино', 'Щукино',
]

const TIMERS = ['Через 1 час', 'Через 2 часа', 'Через 3 часа', 'Через 4 часа']

const CARD_PALETTES = [
  { bg: '#8F8475', text: '#fff', subtext: 'rgba(255,255,255,0.6)', ctxBg: 'rgba(255,255,255,0.1)', timerBg: '#fff', timerColor: '#121A12', glow: 'rgba(180,168,150,0.35)' },
  { bg: '#6B6358', text: '#fff', subtext: 'rgba(255,255,255,0.55)', ctxBg: 'rgba(255,255,255,0.09)', timerBg: '#fff', timerColor: '#121A12', glow: 'rgba(140,128,110,0.35)' },
  { bg: '#E8E4DC', text: '#121A12', subtext: '#8F8475', ctxBg: 'rgba(18,26,18,0.06)', timerBg: '#121A12', timerColor: '#fff', glow: 'rgba(255,252,245,0.6)' },
  { bg: '#3D3830', text: '#fff', subtext: 'rgba(255,255,255,0.5)', ctxBg: 'rgba(255,255,255,0.08)', timerBg: '#fff', timerColor: '#121A12', glow: 'rgba(90,80,65,0.4)' },
  { bg: '#C8BFB0', text: '#121A12', subtext: 'rgba(18,26,18,0.55)', ctxBg: 'rgba(18,26,18,0.06)', timerBg: '#121A12', timerColor: '#fff', glow: 'rgba(220,212,200,0.5)' },
]

function pick(arr, seed, offset = 0) {
  return arr[Math.abs(seed + offset) % arr.length]
}

function generateCard(seed) {
  const service = pick(SERVICES, seed)
  return {
    title:       pick(TITLES, seed, 1),
    reason:      pick(REASONS, seed, 2),
    service,
    description: SERVICE_DESCRIPTIONS[service],
    discount:    pick(DISCOUNTS, seed, 3),
    location:    pick(LOCATIONS, seed, 4),
    timer:       pick(TIMERS, seed, 5),
    palette:     CARD_PALETTES[Math.abs(seed) % CARD_PALETTES.length],
  }
}

const _seed = Math.floor(Math.random() * 99999)
const CARDS = Array.from({ length: 5 }, (_, i) => generateCard(_seed + i * 37))

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

function SlotCard({ card, zIndex, offset, isLeaving, isRising }) {
  const isBackCard = offset > 0
  const style = {
    position: 'absolute',
    inset: 0,
    border: 'none',
    borderRadius: 20,
    padding: '22px 24px',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    background: isBackCard
      ? card.palette.bg
      : `radial-gradient(ellipse at 75% 8%, rgba(255,255,255,0.32) 0%, transparent 50%), ${card.palette.bg}`,
    zIndex,
    willChange: 'transform, opacity',
    transition: isLeaving
      ? 'transform 0.45s cubic-bezier(0.4,0,1,1), opacity 0.35s ease'
      : 'transform 0.45s cubic-bezier(0.2,1,0.2,1)',
    transform: isLeaving
      ? 'translateX(115%) rotate(14deg)'
      : isRising
      ? `translateY(${(offset - 1) * 10}px) scale(${1 - (offset - 1) * 0.05})`
      : `translateY(${offset * 10}px) scale(${1 - offset * 0.05})`,
    opacity: isLeaving ? 0 : offset > 2 ? 0 : 1,
    pointerEvents: offset === 0 && !isLeaving ? 'auto' : 'none',
  }
  return (
    <div style={style}>

      {/* 1. Навигация & Срочность */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: card.palette.subtext,
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>
          {card.location}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: card.palette.timerColor,
          background: card.palette.timerBg, padding: '4px 10px',
          borderRadius: 8, flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          {card.timer}
        </div>
      </div>

      {/* 2. Услуга — главный акцент */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 600, color: card.palette.text, lineHeight: 1.2, marginBottom: 4 }}>
          {card.service}
        </div>
        <div style={{ fontSize: 12, color: card.palette.subtext, lineHeight: 1.5 }}>
          {card.description}
        </div>
      </div>

      {/* 3. Контекст — заголовок + причина */}
      <div style={{
        background: card.palette.ctxBg, borderRadius: 10,
        padding: '10px 12px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: card.palette.text, marginBottom: 3 }}>
          {card.title}
        </div>
        <div style={{ fontSize: 11, color: card.palette.subtext, fontStyle: 'italic' }}>
          {card.reason}
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

  const [deck, setDeck] = useState(CARDS.map((_, i) => i))
  const [leaving, setLeaving] = useState(null)
  const [rising, setRising] = useState(false)
  const deckRef = useRef(deck)
  deckRef.current = deck

  useEffect(() => {
    const id = setInterval(() => {
      const top = deckRef.current[0]
      setLeaving(top)
      setRising(true)
      setTimeout(() => {
        setDeck(prev => {
          const [first, ...rest] = prev
          return [...rest, first]
        })
        setLeaving(null)
        setTimeout(() => setRising(false), 50)
      }, 450)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      position: 'relative',
      background: `
        radial-gradient(ellipse at 38% 40%, rgba(255,255,255,0.7) 0%, transparent 60%),
        linear-gradient(180deg, #FDFCF9 0%, #E8E4DC 100%)
      `,
      overflow: 'hidden',
    }}>
      {/* SVG grain */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025, pointerEvents: 'none', zIndex: 0 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)"/>
      </svg>
      <div style={{
        position: 'relative', zIndex: 1,
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
        <div style={{ position: 'relative', width: '100%', height: 240 }}>
          {deck.slice(0, 4).map((cardIdx, i) => {
            const offset = i
            const isTop = i === 0
            const isLeaving = isTop && leaving !== null
            const isRising = rising && i === 1
            return (
              <SlotCard
                key={cardIdx}
                card={CARDS[cardIdx]}
                zIndex={4 - i}
                offset={offset}
                isLeaving={isLeaving}
                isRising={isRising}
              />
            )
          })}
        </div>

        {/* точки */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          {CARDS.map((_, i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: i === deck[0] ? 'var(--dark)' : 'var(--border)',
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

          paddingTop: 16,
        }}>
          Пустое окно для салона — это{' '}
          <span style={{ color: 'var(--dark)', fontWeight: 500 }}>100% убыток</span>.
          {' '}Поэтому они отдают нам свободные слоты на сегодня со скидкой{' '}
          <span style={{ color: 'var(--dark)', fontWeight: 500 }}>до 60%</span>.
        </p>
      </div>
      </div>
    </section>
  )
}
