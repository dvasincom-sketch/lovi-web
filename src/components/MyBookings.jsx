import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'

const API = 'https://insalon.onrender.com'
const WHATSAPP = 'https://wa.me/79164470569'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken() { return localStorage.getItem('lovi_token') }

function formatDate(dt) {
  const d = new Date(dt)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dt) {
  const d = new Date(dt)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(sec) {
  const m = Math.round(sec / 60)
  return m >= 60 ? `${Math.floor(m/60)} ч ${m%60 ? (m%60)+' мин' : ''}`.trim() : `${m} мин`
}

function isFuture(dt) { return new Date(dt) > new Date() }

function useCountdown(dt) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const update = () => setLeft(Math.max(0, Math.floor((new Date(dt) - Date.now()) / 1000)))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [dt])
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  if (left <= 0) return { str: 'Сейчас', urgent: true }
  if (h > 24) {
    const days = Math.floor(h / 24)
    return { str: `${days} ${days===1?'день':days<5?'дня':'дней'}`, urgent: false }
  }
  return {
    str: h > 0
      ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,
    urgent: left < 3600,
  }
}

// ─── Booking Code ─────────────────────────────────────────────────────────────

function BookingCode({ id }) {
  const code = `LV-${String(id).padStart(5, '0')}`
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
      borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
    }} onClick={copy}>
      <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#F97316', letterSpacing: '0.05em' }}>
        {code}
      </span>
      <span style={{ fontSize: 11, color: '#F97316', opacity: 0.7 }}>
        {copied ? '✓ скопировано' : 'чекин'}
      </span>
    </div>
  )
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function Countdown({ dt }) {
  const { str, urgent } = useCountdown(dt)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      color: urgent ? '#F97316' : 'var(--secondary)',
    }}>
      <span style={{ fontSize: 11, opacity: 0.6 }}>через</span>
      <span style={{
        fontFamily: 'monospace', fontSize: 15, fontWeight: 600,
        color: urgent ? '#F97316' : 'var(--dark)',
      }}>{str}</span>
    </div>
  )
}

// ─── Stars Rating ─────────────────────────────────────────────────────────────

function StarRating({ value, onChange, label }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, color: 'var(--secondary)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, padding: 0, lineHeight: 1,
              color: n <= (hover || value) ? '#F97316' : 'rgba(18,26,18,0.15)',
              transition: 'color 0.15s',
            }}
          >★</button>
        ))}
      </div>
    </div>
  )
}

// ─── Review Form ──────────────────────────────────────────────────────────────

function ReviewForm({ booking, onSubmit }) {
  const [rPlace, setRPlace]     = useState(booking.rating_place || 0)
  const [rMaster, setRMaster]   = useState(booking.rating_master || 0)
  const [rService, setRService] = useState(booking.rating_service || 0)
  const [text, setText]         = useState(booking.review_text || '')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(!!(booking.rating_place))

  if (done) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 0' }}>
      <span style={{ color: '#F97316', fontSize: 16 }}>★★★★★</span>
      <span style={{ fontSize: 12, color: 'var(--secondary)' }}>Спасибо за отзыв</span>
    </div>
  )

  async function submit() {
    if (!rPlace || !rMaster || !rService) return
    setLoading(true)
    try {
      await fetch(`${API}/api/auth/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ booking_id: booking.id, rating_place: rPlace, rating_master: rMaster, rating_service: rService, review_text: text }),
      })
      setDone(true)
      onSubmit?.()
    } finally { setLoading(false) }
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 4 }}>
      <p style={{ fontSize: 12, color: 'var(--secondary)', margin: '0 0 12px' }}>Оцените визит</p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
        <StarRating label="Место" value={rPlace} onChange={setRPlace} />
        <StarRating label="Мастер" value={rMaster} onChange={setRMaster} />
        <StarRating label="Lovi" value={rService} onChange={setRService} />
      </div>
      <textarea
        value={text} onChange={e => setText(e.target.value)}
        placeholder="Комментарий (необязательно)..."
        style={{
          width: '100%', boxSizing: 'border-box', border: '1px solid var(--border)',
          borderRadius: 10, padding: '10px 12px', fontSize: 13, resize: 'none', height: 72,
          fontFamily: 'Inter,sans-serif', color: 'var(--dark)', background: '#FDFCF9',
          outline: 'none',
        }}
      />
      <button
        onClick={submit} disabled={loading || !rPlace || !rMaster || !rService}
        style={{
          marginTop: 10, padding: '9px 20px', borderRadius: 10, border: 'none',
          background: (!rPlace || !rMaster || !rService) ? 'rgba(18,26,18,0.1)' : 'var(--dark)',
          color: (!rPlace || !rMaster || !rService) ? 'var(--secondary)' : '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'Inter,sans-serif', transition: 'all 0.2s',
        }}
      >
        {loading ? 'Отправляем...' : 'Отправить отзыв'}
      </button>
    </div>
  )
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, defaultOpen = false, isNearest = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const future = isFuture(booking.datetime)
  const savings = booking.base_price && booking.total_price
    ? booking.base_price - booking.total_price : 0

  const statusColors = {
    paid:      { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',  color: '#16A34A', label: 'Оплачено' },
    confirmed: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', color: '#F97316', label: 'Подтверждено' },
    cancelled: { bg: 'rgba(18,26,18,0.06)',   border: 'var(--border)',         color: 'var(--secondary)', label: 'Отменено' },
    completed: { bg: 'rgba(18,26,18,0.04)',   border: 'var(--border)',         color: 'var(--secondary)', label: 'Завершено' },
  }
  const sc = statusColors[booking.status] || statusColors.confirmed

  return (
    <div style={{
      border: `1px solid ${open ? 'rgba(18,26,18,0.12)' : 'var(--border)'}`,
      borderRadius: 16,
      background: open ? '#fff' : 'transparent',
      transition: 'all 0.2s',
      overflow: 'hidden',
    }}>
      {/* Шапка карточки */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        {/* Дата-время блок */}
        <div style={{
          minWidth: 48, textAlign: 'center',
          background: future ? 'var(--dark)' : 'rgba(18,26,18,0.06)',
          borderRadius: 12, padding: '8px 6px',
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: future ? '#fff' : 'var(--secondary)', fontFamily: 'Playfair Display,serif', lineHeight: 1 }}>
            {new Date(booking.datetime).getDate()}
          </div>
          <div style={{ fontSize: 10, color: future ? 'rgba(255,255,255,0.6)' : 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
            {new Date(booking.datetime).toLocaleDateString('ru-RU', { month: 'short' })}
          </div>
        </div>

        {/* Инфо */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {booking.service_title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
            {formatTime(booking.datetime)} · {formatDuration(booking.duration)} · {booking.master_name || 'Мастер'}
          </div>
        </div>

        {/* Правая часть */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          {future ? (
            <Countdown dt={booking.datetime} />
          ) : (
            savings > 0 && (
              <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>−{savings.toLocaleString()} ₽</span>
            )
          )}
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 6,
            background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
          }}>{sc.label}</span>
        </div>

        <span style={{ fontSize: 12, color: 'var(--secondary)', marginLeft: 4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {/* Раскрытое тело */}
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Детали */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Дата', formatDate(booking.datetime)],
                ['Время', formatTime(booking.datetime)],
                ['Длительность', formatDuration(booking.duration)],
                ['Итого', `${booking.total_price?.toLocaleString()} ₽`],
                booking.base_price && ['Цена в салоне', `${booking.base_price?.toLocaleString()} ₽`],
                booking.discount_pct && ['Скидка', `${booking.discount_pct}%`],
              ].filter(Boolean).map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dark)' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Код чекина */}
            {future && booking.status !== 'cancelled' && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Код для чекина</div>
                <BookingCode id={booking.id} />
              </div>
            )}

            {/* Адрес */}
            <div style={{ fontSize: 13, color: 'var(--secondary)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span>📍</span>
              <span>Head Spa Beauty · ул. Миклухо-Маклая 37 · 5 мин от м. Беляево</span>
            </div>

            {/* Кнопка переноса/отмены */}
            {future && booking.status !== 'cancelled' && (
              <a
                href={`${WHATSAPP}?text=Хочу перенести или отменить запись ${String(booking.id).padStart(5,'0')} на ${formatDate(booking.datetime)} ${formatTime(booking.datetime)}`}
                target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px', borderRadius: 12, border: '1px solid var(--border)',
                  fontSize: 13, fontWeight: 500, color: 'var(--dark)',
                  textDecoration: 'none', background: 'transparent', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(18,26,18,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Отменить или перенести
              </a>
            )}

            {/* Отзыв для завершённых */}
            {!future && booking.status !== 'cancelled' && (
              <ReviewForm booking={booking} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FAQ Problem Block ─────────────────────────────────────────────────────────

function ProblemFAQ() {
  const items = [
    { icon: '🚪', q: 'Салон закрыт', a: 'Заморозим выплату салону и вернём деньги в течение 24 часов.' },
    { icon: '⏳', q: 'Просят ждать', a: 'Вы не обязаны ждать более 10 минут. Зафиксируем нарушение и компенсируем визит.' },
    { icon: '👥', q: 'Двойная бронь', a: 'Покажите код чекина. Вернём деньги и начислим бонусы.' },
    { icon: '⭐', q: 'Плохой сервис', a: 'Оставьте отзыв — это влияет на рейтинг салона в Lovi.' },
  ]
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 20, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🛡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>Центр безопасности и гарантий</div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6 }}>Деньги удерживаются платформой и не передаются салону до подтверждения визита. Вы защищены в любой ситуации.</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginBottom: 4 }}>{item.q}</div>
            <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.5, marginBottom: 12 }}>{item.a}</div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#25D366', textDecoration: 'none' }}>
              WhatsApp →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MyBookings({ user, onUserChange }) {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('upcoming') // upcoming | history

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/auth/my-bookings`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        const data = await res.json()
        setBookings(data.bookings || [])
      } catch { /* silent */ } finally { setLoading(false) }
    }
    load()
  }, [])

  const upcoming = bookings.filter(b => isFuture(b.datetime) && b.status !== 'cancelled').sort((a,b) => new Date(a.datetime) - new Date(b.datetime))
  const history  = bookings.filter(b => !isFuture(b.datetime) || b.status === 'cancelled')

  // Статистика
  const totalSavings = bookings.reduce((sum, b) => {
    return sum + (b.base_price && b.total_price ? b.base_price - b.total_price : 0)
  }, 0)

  return (
    <div style={{ background:'var(--bg)',minHeight:'100vh' }}>
      <Nav user={user} onUserChange={onUserChange} />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px 80px' }}>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, color: 'var(--dark)', margin: '0 0 4px' }}>
          Мои брони
        </h1>
        <p style={{ fontSize: 14, color: 'var(--secondary)', margin: 0 }}>
          {user?.name || 'Личный кабинет'}
        </p>
      </div>

      {/* Bento Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: 10, marginBottom: 28 }}>

        {/* Экономия — большой квадрат */}
        <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3', background: 'var(--dark)', borderRadius: 20, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Ваша экономия</div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display,serif', lineHeight: 1.1 }}>
              {totalSavings > 0 ? `${totalSavings.toLocaleString()}` : '0'}
            </div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>₽ с LOVI</div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>за всё время</div>
        </div>

        {/* Lovi Pass — вытянутый */}
        <div style={{ gridColumn: '2 / 4', gridRow: '1', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 20, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(249,115,22,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Lovi Pass</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--dark)' }}>Не активен</div>
            <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 3 }}>Единый абонемент · Скоро</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎟</div>
        </div>

        {/* Баллы */}
        <div style={{ gridColumn: '2', gridRow: '2', background: '#F1F0EC', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Баллы</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--dark)', fontFamily: 'Playfair Display,serif' }}>0</div>
          <div style={{ fontSize: 11, color: 'var(--secondary)' }}>кешбэк за брони</div>
        </div>

        {/* Визиты */}
        <div style={{ gridColumn: '3', gridRow: '2', background: '#F1F0EC', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Визитов</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--dark)', fontFamily: 'Playfair Display,serif' }}>{bookings.length}</div>
          <div style={{ fontSize: 11, color: 'var(--secondary)' }}>всего с Lovi</div>
        </div>

      </div>

      {/* Табы */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: '#F1F0EC', borderRadius: 14, padding: 4, marginBottom: 20,
      }}>
        {[['upcoming', `Предстоящие${upcoming.length ? ` · ${upcoming.length}` : ''}`], ['history', 'История']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '9px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
            background: tab === id ? '#fff' : 'transparent',
            color: tab === id ? 'var(--dark)' : 'var(--secondary)',
            boxShadow: tab === id ? '0 1px 4px rgba(18,26,18,0.08)' : 'none',
            transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {/* Контент */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--secondary)', fontSize: 14 }}>
          Загружаем брони...
        </div>
      ) : tab === 'upcoming' ? (
        upcoming.length === 0 ? (
          <div style={{ padding: '32px 0' }}>
            {/* Сообщество */}
            <div style={{ background: 'var(--dark)', borderRadius: 20, padding: '24px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Сегодня пользователи Lovi уже сэкономили</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display,serif' }}>6 400 ₽</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Присоединяйтесь — горящие окошки ждут</div>
              </div>
              <div style={{ fontSize: 40 }}>🔥</div>
            </div>
            {/* CTA кнопки */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
              <a href="/" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '16px', borderRadius: 16, background: '#F1F0EC', textDecoration: 'none', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20 }}>💆</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>Массаж рядом</span>
                <span style={{ fontSize: 11, color: 'var(--secondary)' }}>Горящие окошки</span>
              </a>
              <a href="/" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '16px', borderRadius: 16, background: '#F1F0EC', textDecoration: 'none', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>Head SPA</span>
                <span style={{ fontSize: 11, color: 'var(--secondary)' }}>Премиум со скидкой</span>
              </a>
            </div>
            <a href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 14, background: 'var(--dark)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>
              Смотреть все горящие окошки →
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map((b, i) => <BookingCard key={b.id} booking={b} defaultOpen={i === 0} isNearest={i === 0} />)}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>История пуста</div>
            <div style={{ fontSize: 13, color: 'var(--secondary)' }}>Завершённые визиты появятся здесь</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        )
      )}

      {/* FAQ — всегда внизу */}
      <ProblemFAQ />
      </div>
    </div>
  )
}