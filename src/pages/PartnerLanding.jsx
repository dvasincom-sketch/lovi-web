import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Zap, MapPin, Clock, Check, ArrowRight,
  Users, CreditCard, Settings, ToggleRight, Lock,
} from 'lucide-react'

const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5 }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0 }} />
)

// ── Данные ──────────────────────────────────────────────────────────────────

const LOGOS = ['SODA', '4hands', 'WAX&GQ', 'BRITVA', 'BEAUTICK']
const SPOTS = 12

const HOW = [
  { n: '01', icon: Settings,     title: 'Авторизация YCLIENTS', sub: 'Безопасный OAuth. Мы не видим ваши пароли.' },
  { n: '02', icon: ToggleRight,  title: 'Выбор услуг',          sub: 'Отметьте, какие услуги участвуют в акции.' },
  { n: '03', icon: Zap,          title: 'Выход в ленту Lovi',   sub: 'Ваши окна видны тысячам пользователей.' },
]

const FEATURES = [
  { icon: CreditCard, title: 'Без компромиссов в качестве', text: 'Премиальные салоны, которые вы любите' },
  { icon: Zap,        title: 'Особые условия',              text: 'Для тех, кто выбирает удобное время' },
  { icon: ToggleRight,title: 'Гибкость без усилий',         text: 'Включайте и выключайте услуги когда нужно' },
  { icon: Settings,   title: 'Полный контроль',             text: 'Вы управляете ценами, услугами и расписанием' },
]

const REVIEWS = [
  { text: 'За первую неделю получили 14 новых клиентов и заполнили вечерние окна на 80%.', name: 'Анна', role: 'владелец Studio 12, маникюрный салон, м. Белорусская' },
  { text: 'Интеграция заняла реально 5 минут. Никаких сложностей, всё интуитивно понятно.', name: 'Игорь', role: 'сеть BRITVA, барбершопы' },
  { text: 'Клиенты приходят с промокодами, оплачивают на месте. Выручка полностью у нас.', name: 'Мария', role: 'Wax&Go, сеть студий депиляции' },
]

// ── Counter ──────────────────────────────────────────────────────────────────

function Counter({ value, min, max, step = 1, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', alignSelf: 'flex-start' }}>
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: 18, color: value <= min ? 'rgba(18,26,18,0.2)' : 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
        onMouseEnter={e => { if (value > min) e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >−</button>
      <div style={{ width: 56, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: 'var(--dark)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
        {value.toLocaleString('ru-RU')}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: 18, color: value >= max ? 'rgba(18,26,18,0.2)' : 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
        onMouseEnter={e => { if (value < max) e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >+</button>
    </div>
  )
}

// ── Calculator ───────────────────────────────────────────────────────────────

function Calculator({ isMobile }) {
  const [slots, setSlots] = useState(2)
  const [check, setCheck] = useState(1500)
  const [days,  setDays]  = useState(30)

  const lost      = slots * check * days
  const potential = Math.round(lost * 0.65)

  const rows = [
    { label: 'Пустых окна в день',   value: slots, min: 1,   max: 20,    step: 1,   set: setSlots },
    { label: 'Средний чек (₽)',       value: check, min: 500, max: 10000, step: 500, set: setCheck },
    { label: 'Рабочих дней в месяц', value: days,  min: 1,   max: 31,    step: 1,   set: setDays  },
  ]

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 24, padding: isMobile ? '28px 20px' : '36px 36px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ fontSize: 14, color: 'var(--dark)' }}>{r.label}</div>
          <Counter value={r.value} min={r.min} max={r.max} step={r.step} onChange={r.set} />
        </div>
      ))}

      {/* Result */}
      <div style={{ marginTop: 20, background: 'var(--dark)', borderRadius: 16, padding: '24px 24px' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          Вы теряете в месяц
        </div>
        <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 40 : 52, fontWeight: 500, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 12 }}>
          {lost.toLocaleString('ru-RU')} ₽
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
          Потенциальная выручка с Lovi —{' '}
          <span style={{ color: '#fff', fontWeight: 500 }}>{potential.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: 'var(--secondary)', lineHeight: 1.65 }}>
        Даже 2 пустых окна в день — это десятки тысяч рублей, которые уходят к конкурентам.
      </div>
    </div>
  )
}

// ── Inline form (вместо PartnerForm) ─────────────────────────────────────────

function PartnerForm({ dark = false }) {
  const [form, setForm]     = useState({ name: '', phone: '', salon: '' })
  const [sent, setSent]     = useState(false)

  const inputStyle = (d) => ({
    width: '100%', boxSizing: 'border-box',
    border: `1px solid ${d ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
    borderRadius: 12, padding: '13px 16px', fontSize: 14,
    background: d ? 'rgba(255,255,255,0.06)' : '#fff',
    color: d ? '#fff' : 'var(--dark)', outline: 'none',
    transition: 'border-color 0.2s',
    '::placeholder': { color: 'red' },
  })

  const fields = [
    { key: 'name',  placeholder: 'Ваше имя',        type: 'text' },
    { key: 'phone', placeholder: 'Телефон',          type: 'tel'  },
    { key: 'salon', placeholder: 'Название салона',  type: 'text' },
  ]

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon i={Check} size={22} color="#4ADE80" stroke={2} />
      </div>
      <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: dark ? '#fff' : 'var(--dark)', marginBottom: 8 }}>
        Заявка принята
      </div>
      <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'var(--secondary)' }}>
        Свяжемся в течение 15 минут
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {fields.map(f => (
        <input
          key={f.key}
          type={f.type}
          placeholder={f.placeholder}
          value={form[f.key]}
          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
          style={inputStyle(dark)}
          onFocus={e => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.3)' : 'var(--dark)' }}
          onBlur={e => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.12)' : 'var(--border)' }}
        />
      ))}
      <button
        onClick={() => form.name && form.phone && setSent(true)}
        style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          padding: '15px', borderRadius: 14, fontWeight: 600, fontSize: 15,
          cursor: 'pointer', marginTop: 4, width: '100%',
          boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}
      >
        Получить доступ
      </button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function PartnerLanding() {
  const isMobile = useIsMobile()

  const wrap = { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }
  const eyebrow = {
    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--secondary)', marginBottom: 14,
  }

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO — тёмный fullscreen ────────────────────────────────────────── */}
      <div style={{
        position: 'relative', minHeight: isMobile ? '100svh' : '95vh',
        display: 'flex', alignItems: 'center',
        background: 'var(--dark)', overflow: 'hidden',
      }}>
        <img
          src="https://images.unsplash.com/photo-1600334089648-b8d9d8b39a42?w=1800&q=85"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22, pointerEvents: 'none' }}
        />
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,rgba(18,26,18,0.92) 40%,rgba(18,26,18,0.6) 100%)', pointerEvents: 'none' }} />
        {/* Dot texture */}
        <div style={{ position: 'absolute', top: 40, right: 80, width: 180, height: 180, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.12) 1px, transparent 1px)', backgroundSize: '14px 14px', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{
          position: 'relative', ...wrap,
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
          gap: isMobile ? 40 : 64, alignItems: 'center',
          padding: isMobile ? '100px 20px 60px' : '0 40px',
        }}>
          {/* Left */}
          <div>
            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.15)', color: 'var(--accent)', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.6s ease-in-out infinite' }} />
              Для первых {SPOTS} салонов Москвы
            </div>

            <h1 style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: isMobile ? 42 : 64, fontWeight: 500, lineHeight: 1.05,
              color: '#fff', margin: '0 0 24px', letterSpacing: '-0.025em',
            }}>
              Премиальный сервис<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>по особым условиям</em>
            </h1>

            <p style={{ fontSize: isMobile ? 15 : 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 460 }}>
              Получайте новых клиентов в свободные окна —
              без скидок, без комиссий, без лишних усилий.
            </p>

            {/* 4 stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px', marginBottom: 40 }}>
              {[
                ['Оплата на месте', '100% выручка у вас'],
                ['Интеграция', 'за 5 минут'],
                ['Отключение', 'одной кнопкой'],
                ['Без договоров', 'и вложений'],
              ].map(([t, s], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Icon i={Check} size={13} color="var(--accent)" stroke={2.5} style={{ marginTop: 3 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{t}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* YCLIENTS badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px' }}>
              <span style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 600 }}>YCLIENTS</span>
              <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Интеграция в 1 клик</span>
            </div>
          </div>

          {/* Right — форма-карточка */}
          <div style={{
            background: '#fff', borderRadius: 24,
            padding: isMobile ? '28px 20px' : '32px 28px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: 'var(--dark)', lineHeight: 1.3 }}>
                Получите доступ<br />на специальных условиях
              </div>
              <div style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--accent)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, flexShrink: 0, marginLeft: 12, whiteSpace: 'nowrap' }}>
                {SPOTS} мест
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Свяжемся в течение 15 минут
            </p>
            <PartnerForm dark={false} />
          </div>
        </div>
      </div>

      {/* ── ЛОГОТИП-СТРОКА ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', gap: isMobile ? 20 : 0, flexWrap: 'wrap', padding: isMobile ? '20px 20px' : '0' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(18,26,18,0.25)', flexShrink: 0, padding: isMobile ? '0' : '22px 40px 22px 0', borderRight: isMobile ? 'none' : '1px solid var(--border)' }}>
            Уже с нами
          </div>
          {LOGOS.map((l, i) => (
            <div key={l} style={{
              padding: isMobile ? '0' : '22px 32px',
              borderRight: !isMobile && i < LOGOS.length - 1 ? '1px solid var(--border)' : 'none',
              fontSize: isMobile ? 14 : 16, fontWeight: 700,
              letterSpacing: '0.06em', color: 'rgba(18,26,18,0.18)',
              fontFamily: 'Playfair Display,serif',
            }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* ── КАК ЭТО РАБОТАЕТ — шаги ─────────────────────────────────────────── */}
      <div style={{ padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={eyebrow}>Как это работает</div>
          <h2 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: isMobile ? 30 : 42, fontWeight: 500, color: 'var(--dark)',
            margin: '0 0 64px', lineHeight: 1.15, maxWidth: 520,
          }}>
            От подключения до новых клиентов — 5 минут
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 40 : 0 }}>
            {HOW.map((h, i) => (
              <div key={h.n} style={{
                padding: isMobile ? '0' : '0 40px 0 0',
                borderRight: !isMobile && i < HOW.length - 1 ? '1px solid var(--border)' : 'none',
                marginRight: !isMobile && i < HOW.length - 1 ? 40 : 0,
              }}>
                <div style={{
                  fontFamily: 'Playfair Display,serif', fontSize: 52, fontWeight: 500,
                  color: 'rgba(18,26,18,0.06)', lineHeight: 1, marginBottom: 16,
                  letterSpacing: '-0.02em',
                }}>
                  {h.n}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'rgba(18,26,18,0.04)', marginBottom: 14 }}>
                  <Icon i={h.icon} size={18} color="var(--dark)" stroke={1.5} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>{h.title}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.7 }}>{h.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── КАЛЬКУЛЯТОР ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#F1F0EC', padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 72, alignItems: 'start' }}>
            <div>
              <div style={eyebrow}>Считаем вместе</div>
              <h2 style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: isMobile ? 30 : 40, fontWeight: 500, color: 'var(--dark)',
                margin: '0 0 20px', lineHeight: 1.2,
              }}>
                Сколько вы теряете<br />на пустых окнах?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, margin: '0 0 32px' }}>
                Настройте параметры под свой салон и увидите реальную сумму упущенной выручки.
              </p>
              {/* Mini-features */}
              {[
                { i: Zap,         text: 'Мгновенное бронирование клиентом' },
                { i: CreditCard,  text: '100% предоплата — деньги сразу у вас' },
                { i: Users,       text: 'Аудитория Lovi — новые лица в вашем салоне' },
              ].map(({ i, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(18,26,18,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon i={i} size={14} color="var(--dark)" stroke={1.5} />
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
            <Calculator isMobile={isMobile} />
          </div>
        </div>
      </div>

      {/* ── FEATURE-БЛОКИ — тёмный ──────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '64px 0' : '88px 0' }}>
        <div style={wrap}>
          <div style={eyebrow}>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Для партнёров</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 0 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderLeft: i > 0 && !isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
                borderTop: isMobile && i > 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon i={f.icon} size={17} color="rgba(255,255,255,0.7)" stroke={1.5} />
                </div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 14 : 16, fontWeight: 500, color: '#fff', marginBottom: 8, lineHeight: 1.35 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ОТЗЫВЫ ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={eyebrow}>Что говорят первые партнёры</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 40 : 48, marginTop: 40 }}>
            {REVIEWS.map((r, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 16, lineHeight: 1.65, color: 'var(--dark)', fontStyle: 'italic', marginBottom: 20 }}>
                  «{r.text}»
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 3, lineHeight: 1.5 }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ФИНАЛЬНАЯ CTA — тёмный с формой ─────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '72px 0 88px' : '104px 0 120px' }}>
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,26,18,0.88)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', ...wrap }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'start' }}>

            {/* Left */}
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
                Ограниченный доступ
              </div>
              <h2 style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: isMobile ? 32 : 48, fontWeight: 500, color: '#fff',
                margin: '0 0 24px', lineHeight: 1.1, letterSpacing: '-0.02em',
              }}>
                Успейте в число<br />первых {SPOTS} салонов
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 0 36px' }}>
                Получите доступ на специальных условиях и начните принимать новых клиентов уже сегодня.
              </p>
              {[
                ['0% комиссии', 'первые 3 месяца'],
                ['Интеграция', 'за 5 минут'],
                [`${SPOTS} мест`, 'осталось'],
              ].map(([t, s], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{t}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>{s}</span>
                </div>
              ))}
            </div>

            {/* Right — form */}
            <div>
              <PartnerForm dark={true} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                <Icon i={Lock} size={11} color="rgba(255,255,255,0.2)" stroke={1.5} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                  Мы не передаём ваши данные третьим лицам
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}