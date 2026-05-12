import { useState, useEffect } from 'react'
import {
  MapPin, ArrowRight, Check, Clock, Lock, Sparkles, X,
} from 'lucide-react'

// ─── Icon helper ────────────────────────────────────────────────────────────
const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5, style = {} }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0, ...style }} />
)

// ─── Хук мобильной адаптации ────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ─── Хук таймера ────────────────────────────────────────────────────────────
function useTimer(sec) {
  const [s, setS] = useState(0)
  useEffect(() => {
    if (!sec) return
    setS(sec)
    const t = setInterval(() => setS(v => v > 0 ? v - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [sec])
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const str = h > 0
    ? h + ':' + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0')
    : String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0')
  return { str, urgent: s <= 900, raw: s }
}

// ─── Хук подгрузки реального слота ──────────────────────────────────────────
// Логика та же, что в BentoGrid: сначала пробуем featured (лучший слот),
// если пусто — фоллбэк на первый из slots-stream (отсортированный по времени до окна)
function useLiveSlot() {
  const [slot, setSlot] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const BASE = 'https://insalon.onrender.com'

    fetch(`${BASE}/api/lovi/featured?date=${today}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        // featured возвращает массив до 3 слотов — берём первый (лучшее предложение)
        const slots = Array.isArray(data) ? data : (data?.slots || [])
        if (slots.length > 0) {
          setSlot(slots[0])
          return null
        }
        // Если featured пуст — фоллбэк на общий поток
        return fetch(`${BASE}/api/lovi/slots-stream?date=${today}`)
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(d => {
            const all = (d.slots || []).sort((a, b) => a.minutes_to_slot - b.minutes_to_slot)
            if (all.length > 0) setSlot(all[0])
          })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { slot, loading }
}

// ─── Кнопки ─────────────────────────────────────────────────────────────────
const BtnPrimary = ({ children, style = {}, ...props }) => (
  <button
    style={{
      background: 'var(--accent)', color: '#fff', border: 'none',
      padding: '14px 28px', borderRadius: 18, fontWeight: 600,
      cursor: 'pointer', fontSize: 14,
      boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
      transition: 'all 0.2s', fontFamily: 'Inter,sans-serif',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}
    {...props}
  >
    {children}
  </button>
)

const BtnDark = ({ children, style = {}, ...props }) => (
  <button
    style={{
      background: 'var(--dark)', color: '#fff', border: 'none',
      padding: '14px 28px', borderRadius: 18, fontWeight: 600,
      cursor: 'pointer', fontSize: 14, transition: 'all 0.2s',
      fontFamily: 'Inter,sans-serif',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
    {...props}
  >
    {children}
  </button>
)

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  border: '1px solid var(--border)',
  borderRadius: 14,
  fontSize: 14,
  background: '#fff',
  color: 'var(--dark)',
  fontFamily: 'Inter,sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

// ─── Поле ошибки в стиле UI (как в Nav.jsx) ─────────────────────────────────
const ErrorBox = ({ children }) => (
  <div style={{
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    color: '#DC2626',
  }}>
    {children}
  </div>
)

// ═══════════════════════════════════════════════════════════════════════════════
// МОДАЛКИ
// ═══════════════════════════════════════════════════════════════════════════════

function Modal({ open, onClose, children, maxWidth = 440 }) {
  const isMobile = useIsMobile()
  useEffect(() => {
    if (!open) return
    const onEsc = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(18,26,18,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          borderRadius: isMobile ? '20px 20px 0 0' : 20,
          padding: isMobile ? '24px 20px 32px' : '28px 28px',
          width: '100%',
          maxWidth: isMobile ? '100%' : maxWidth,
          maxHeight: isMobile ? '90vh' : '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(18,26,18,0.2)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          marginBottom: 8,
        }}>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              background: 'rgba(18,26,18,0.06)',
              border: 'none',
              cursor: 'pointer',
              width: 32, height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
            }}
          >
            <Icon i={X} size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function WaitlistModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async () => {
    setError('')
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Введите корректный email')
      return
    }
    setLoading(true)
    try {
      const r = await fetch('https://insalon.onrender.com/api/lovi/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kind: 'user' }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data.error || 'Ошибка сервера')
      }
      setSent(true)
    } catch (e) {
      setError(e.message === 'Failed to fetch'
        ? 'Нет связи с сервером. Попробуйте позже.'
        : 'Что-то пошло не так. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setEmail(''); setError(''); setSent(false); setLoading(false)
  }

  return (
    <Modal open={open} onClose={() => { onClose(); setTimeout(reset, 300) }}>
      {sent ? (
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{
            margin: '0 auto 16px',
            width: 56, height: 56, borderRadius: 18,
            background: 'rgba(249,115,22,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon i={Check} size={24} color="var(--accent)" stroke={2} />
          </div>
          <div style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 22, color: 'var(--dark)', marginBottom: 10,
          }}>
            Записали
          </div>
          <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Напишем одним письмом, когда лента откроется. Без рассылок.
          </div>
          <BtnDark onClick={() => { onClose(); setTimeout(reset, 300) }} style={{ width: '100%' }}>
            Закрыть
          </BtnDark>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 22, color: 'var(--dark)', marginBottom: 8,
            }}>
              Лента откроется этой осенью
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.55 }}>
              Бронирование через Лови запустим, когда подключим по 2 салона
              в каждой зоне спроса 4 районов ЮЗАО. Оставьте email — напишем
              одним письмом, когда всё готово.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              onFocus={e => e.target.style.borderColor = 'var(--dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="Email"
              style={inputStyle}
              autoFocus
            />
            {error && <ErrorBox>{error}</ErrorBox>}
            <button
              onClick={submit}
              disabled={loading || !email}
              style={{
                width: '100%',
                background: (!email || loading) ? 'rgba(18,26,18,0.4)' : 'var(--dark)',
                color: '#fff', border: 'none',
                padding: 14, borderRadius: 14,
                fontSize: 14, fontWeight: 600,
                cursor: (!email || loading) ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter,sans-serif',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Отправляем...' : 'Подписаться'}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

function PartnerModal({ open, onClose }) {
  const [salon, setSalon] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async () => {
    setError('')
    if (!salon.trim()) { setError('Укажите название салона'); return }
    if (!name.trim()) { setError('Укажите ваше имя'); return }
    if (!contact.trim()) { setError('Укажите email или телефон'); return }
    setLoading(true)
    try {
      const r = await fetch('https://insalon.onrender.com/api/lovi/partner-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salon, name, contact }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data.error || 'Ошибка сервера')
      }
      setSent(true)
    } catch (e) {
      setError(e.message === 'Failed to fetch'
        ? 'Нет связи с сервером. Попробуйте позже.'
        : 'Что-то пошло не так. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setSalon(''); setName(''); setContact('')
    setError(''); setSent(false); setLoading(false)
  }

  return (
    <Modal open={open} onClose={() => { onClose(); setTimeout(reset, 300) }} maxWidth={480}>
      {sent ? (
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{
            margin: '0 auto 16px',
            width: 56, height: 56, borderRadius: 18,
            background: 'rgba(249,115,22,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon i={Check} size={24} color="var(--accent)" stroke={2} />
          </div>
          <div style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 22, color: 'var(--dark)', marginBottom: 10,
          }}>
            Заявка принята
          </div>
          <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Свяжемся в ближайшие 1–2 рабочих дня и обсудим подключение к первой волне.
          </div>
          <BtnDark onClick={() => { onClose(); setTimeout(reset, 300) }} style={{ width: '100%' }}>
            Закрыть
          </BtnDark>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 22, color: 'var(--dark)', marginBottom: 8,
            }}>
              Заявка на подключение
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.55 }}>
              Свяжемся в течение 1–2 рабочих дней. Подключение в первой волне бесплатное.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              value={salon}
              onChange={e => setSalon(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'var(--dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="Название салона"
              style={inputStyle}
              autoFocus
            />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'var(--dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="Ваше имя"
              style={inputStyle}
            />
            <input
              value={contact}
              onChange={e => setContact(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              onFocus={e => e.target.style.borderColor = 'var(--dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="Email или телефон"
              style={inputStyle}
            />
            {error && <ErrorBox>{error}</ErrorBox>}
            <button
              onClick={submit}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(249,115,22,0.5)' : 'var(--accent)',
                color: '#fff', border: 'none',
                padding: 14, borderRadius: 14,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter,sans-serif',
                transition: 'background 0.2s',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(249,115,22,0.3)',
              }}
            >
              {loading ? 'Отправляем...' : 'Отправить заявку'}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// СЕКЦИИ
// ═══════════════════════════════════════════════════════════════════════════════

function NavBar({ isMobile }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(253,252,249,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '16px 20px' : '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <img src="/logo.svg" alt="Лови" style={{ height: isMobile ? 20 : 24 }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', border: '1px solid var(--border)',
          borderRadius: 20, fontSize: 12, color: 'var(--dark)',
        }}>
          <Icon i={MapPin} size={13} color="var(--accent)" />
          {isMobile ? 'ЮЗАО Москвы' : 'Юго-Запад Москвы'}
        </div>
      </div>
    </div>
  )
}

function Hero({ isMobile, onSubscribe }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '48px 20px 40px' : '80px 32px 56px',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', background: 'rgba(249,115,22,0.08)',
        border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: 20, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--accent)', marginBottom: isMobile ? 20 : 28,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent)',
          animation: 'lovi-pulse 1.8s ease-in-out infinite',
        }} />
        Открытый набор · 1-я волна
      </div>

      <h1 style={{
        fontFamily: 'Playfair Display,serif', fontWeight: 400,
        fontSize: isMobile ? 36 : 'clamp(40px, 5.5vw, 72px)',
        lineHeight: 1.05, color: 'var(--dark)',
        margin: 0, marginBottom: isMobile ? 18 : 24, maxWidth: 900,
      }}>
        Маркетплейс <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>горящих окон</em>
        {isMobile ? ' ' : <br />}
        в премиум-массаже
      </h1>

      <p style={{
        fontSize: isMobile ? 15 : 17, lineHeight: 1.55, color: 'var(--secondary)',
        maxWidth: 580, margin: `0 0 ${isMobile ? 32 : 44}px`,
      }}>
        Собираем по 2 салона в каждой зоне спроса в 4 районах ЮЗАО —
        Коньково, Обручевский, Ломоносовский, Черёмушки. Свободные слоты
        со скидкой за 1–3 часа до начала, без переписок и звонков.
      </p>

      <div style={{ maxWidth: 460, marginBottom: isMobile ? 28 : 36 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: isMobile ? 32 : 38, lineHeight: 1, color: 'var(--dark)',
            }}>1</span>
            <span style={{ fontSize: isMobile ? 13 : 14, color: 'var(--secondary)' }}>
              из 28 мест в 14 зонах спроса
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--secondary)',
          }}>
            4%
          </span>
        </div>
        <div style={{
          height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: '4%', background: 'var(--accent)',
            borderRadius: 2, transition: 'width 1.2s cubic-bezier(0.2,1,0.2,1)',
          }} />
        </div>
      </div>

      <BtnDark
        onClick={onSubscribe}
        style={{ width: isMobile ? '100%' : 'auto' }}
      >
        Узнать первым о запуске
      </BtnDark>
      <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 14 }}>
        Одно письмо на запуске. Без рассылок и спама.
      </div>
    </div>
  )
}

function LiveDemo({ isMobile, onSubscribe }) {
  const { slot, loading } = useLiveSlot()
  // Демо-данные, если API ничего не вернуло
  const fallback = {
    time: '17:00',
    service_name: '«Перерождение» (Premium Head SPA)',
    base_price: 5900,
    lovi_price: 5015,
    discount_pct: 15,
    minutes_to_slot: 139,
  }
  const s = slot || fallback
  const isReal = !!slot
  const timer = useTimer((s.minutes_to_slot || 0) * 60)
  const fmt = (n) => (n || 0).toLocaleString('ru-RU')

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '24px 20px 40px' : '40px 32px 80px',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--secondary)', marginBottom: 8, paddingBottom: 14,
        borderBottom: '1px solid var(--border)',
      }}>
        Уже в эфире · 1 салон
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
        gap: isMobile ? 16 : 24,
        marginTop: 24,
      }}>
        <div style={{
          background: 'var(--dark)', color: '#fff',
          borderRadius: isMobile ? 20 : 24,
          padding: isMobile ? '24px 22px' : 32,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: isMobile ? 280 : 320,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24, flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            }}>
              <span style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)', marginRight: 8,
                animation: 'lovi-pulse 1.8s ease-in-out infinite',
              }} />
              {loading
                ? 'Загружаем актуальный слот…'
                : isReal ? 'Реальный слот · сегодня' : 'Так это выглядит'}
            </span>
            {timer.raw > 0 && (
              <span style={{
                fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                color: timer.urgent ? 'var(--accent)' : 'rgba(255,255,255,0.7)',
              }}>
                {timer.str} до окна
              </span>
            )}
          </div>

          <div>
            <div style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: isMobile ? 64 : 'clamp(56px, 7vw, 88px)',
              color: 'var(--accent)',
              lineHeight: 1, marginBottom: 16,
            }}>
              {s.time}
            </div>
            <div style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: isMobile ? 18 : 22,
              marginBottom: 8,
            }}>
              {s.service_name}
            </div>
            <div style={{
              fontSize: isMobile ? 12 : 13,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 24, lineHeight: 1.5,
            }}>
              <Icon i={MapPin} size={13} color="rgba(255,255,255,0.5)" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
              Head Spa Beauty · ул. Миклухо-Маклая 37 · 5 мин от м. Беляево
            </div>

            <div style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 14, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 500 }}>
                  {fmt(s.base_price)} ₽
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  на сайте салона напрямую
                </div>
              </div>
              <div style={{
                background: 'rgba(249,115,22,0.18)', color: 'var(--accent)',
                padding: '8px 14px', borderRadius: 12,
                fontSize: 13, fontWeight: 600,
              }}>
                −{s.discount_pct}%
              </div>
              <div style={{
                marginLeft: isMobile ? 0 : 'auto',
                width: isMobile ? '100%' : 'auto',
                display: 'flex', flexDirection: 'column',
                alignItems: isMobile ? 'stretch' : 'flex-end',
                gap: 8,
              }}>
                <BtnPrimary
                  onClick={onSubscribe}
                  style={{ width: isMobile ? '100%' : 'auto' }}
                >
                  Забронировать за {fmt(s.lovi_price)} ₽
                </BtnPrimary>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                  justifyContent: isMobile ? 'flex-start' : 'flex-end',
                }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                    100% предоплата
                  </span>
                  {['СБП', 'Apple Pay', 'T-Pay'].map(p => (
                    <span key={p} style={{
                      fontSize: 9, fontWeight: 600,
                      color: 'rgba(255,255,255,0.45)',
                      background: 'rgba(255,255,255,0.07)',
                      padding: '2px 6px', borderRadius: 4,
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ExplainCard
            icon={Clock}
            title="Окно горит 1–3 часа"
            text="Слот появляется только когда у салона реально пусто. До начала остаётся время доехать."
          />
          <ExplainCard
            icon={Lock}
            title="100% предоплата"
            text="Бронь через приложение, оплата сразу. Салон уверен, что клиент придёт."
          />
          <ExplainCard
            icon={Sparkles}
            title="Премиум-сервис дешевле"
            text="Та же программа, тот же мастер. Скидка — за то, что вы пришли в пустой час."
          />
        </div>
      </div>
    </div>
  )
}

function ExplainCard({ icon, title, text }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 20, padding: '20px 22px',
      flex: 1, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <Icon i={icon} size={18} color="var(--accent)" />
      <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: 'var(--dark)' }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--secondary)' }}>
        {text}
      </div>
    </div>
  )
}

function PullQuote({ isMobile }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '56px 20px' : '80px 32px',
      textAlign: 'center',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        fontFamily: 'Playfair Display,serif', fontWeight: 400,
        fontSize: isMobile ? 28 : 'clamp(28px, 4vw, 48px)',
        lineHeight: 1.2, color: 'var(--dark)', maxWidth: 880, margin: '0 auto',
      }}>
        Время — это <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>единственная</em> валюта,
        {isMobile ? ' ' : <br />}
        которую нельзя вернуть.
      </div>
      <div style={{ marginTop: 20, fontSize: 13, color: 'var(--secondary)' }}>
        Пустой час салона — это убыток на 100%. Мы помогаем его поймать.
      </div>
    </div>
  )
}

function PartnerCallout({ isMobile, onApply }) {
  const [activeDistrictId, setActiveDistrictId] = useState(null)
  const [activeZone, setActiveZone] = useState(null)

  // ──────────────────────────────────────────────────────────────────
  // ВРЕМЕННАЯ КОНСТАНТА — geographic abstraction layer
  // Структура: округ ЮЗАО → 4 района → зоны спроса (по 2 слота)
  // Зона = пешеходный радиус 7–15 минут вокруг центра притяжения
  // taken: индексы кружков (0..slots-1), занятых салонами
  // ──────────────────────────────────────────────────────────────────
  const SLOTS_PER_ZONE = 2

  const DISTRICTS = [
    {
      id: 'konkovo',
      name: 'Коньково',
      zones: [
        { id: 'belyaevo-station',  name: 'У метро Беляево',     anchor: 'м. Беляево',     taken: [] },
        { id: 'konkovo-station',   name: 'У метро Коньково',    anchor: 'м. Коньково',    taken: [] },
        { id: 'vorontsovsky',      name: 'Воронцовский парк',   anchor: 'Парк, ул. Введенского', taken: [] },
        { id: 'troparyovo-border', name: 'Тропарёво (граница)', anchor: 'Профсоюзная, юг', taken: [] },
      ],
    },
    {
      id: 'obruchevsky',
      name: 'Обручевский',
      zones: [
        { id: 'kaluzhskaya', name: 'У метро Калужская',  anchor: 'м. Калужская',
          taken: [{ index: 0, salon: 'Head Spa Beauty', address: 'ул. Миклухо-Маклая 37' }] },
        { id: 'novatorskaya', name: 'У метро Новаторская', anchor: 'м. Новаторская', taken: [] },
        { id: 'leninsky-gagarin', name: 'Ленинский · Гагаринская', anchor: 'Ленинский пр., север', taken: [] },
      ],
    },
    {
      id: 'lomonosovsky',
      name: 'Ломоносовский',
      zones: [
        { id: 'universitet',         name: 'У метро Университет',  anchor: 'м. Университет',     taken: [] },
        { id: 'lomonosovsky-avenue', name: 'Ломоносовский проспект', anchor: 'Ломоносовский пр.', taken: [] },
        { id: 'vorobyovy-border',    name: 'Воробьёвы горы (граница)', anchor: 'Мичуринский пр.', taken: [] },
      ],
    },
    {
      id: 'cheremushki',
      name: 'Черёмушки',
      zones: [
        { id: 'novye-cheremushki',    name: 'Новые Черёмушки',     anchor: 'м. Новые Черёмушки', taken: [] },
        { id: 'profsoyuznaya-center', name: 'Профсоюзная (центр)', anchor: 'м. Профсоюзная',      taken: [] },
        { id: 'nakhimovsky',          name: 'Нахимовский',         anchor: 'Нахимовский пр.',     taken: [] },
        { id: 'akademicheskaya-border', name: 'Академическая граница', anchor: 'м. Академическая', taken: [] },
      ],
    },
  ]

  // Считаем плотность с учётом 2 слотов на зону
  const zoneTotal = (d) => d.zones.length * SLOTS_PER_ZONE
  const zoneTaken = (d) => d.zones.reduce((s, z) => s + z.taken.length, 0)

  const totalSlots = DISTRICTS.reduce((s, d) => s + zoneTotal(d), 0)
  const totalTaken = DISTRICTS.reduce((s, d) => s + zoneTaken(d), 0)
  const totalLeft = totalSlots - totalTaken
  const totalZones = DISTRICTS.reduce((s, d) => s + d.zones.length, 0)

  const activeDistrict = DISTRICTS.find(d => d.id === activeDistrictId) || null

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '24px 20px 56px' : '40px 32px 80px',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--secondary)', marginBottom: 8, paddingBottom: 14,
        borderBottom: '1px solid var(--border)',
      }}>
        Владельцам салонов ЮЗАО
      </div>

      <div style={{
        marginTop: isMobile ? 28 : 40,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr',
        gap: isMobile ? 24 : 40,
        alignItems: 'flex-start',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Playfair Display,serif', fontWeight: 400,
            fontSize: isMobile ? 32 : 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.1, color: 'var(--dark)',
            margin: '0 0 20px',
          }}>
            {totalLeft} мест в первом наборе
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16, lineHeight: 1.6, color: 'var(--secondary)',
            margin: '0 0 28px', maxWidth: 480,
          }}>
            Подключаем по 2 салона в каждой из {totalZones} зон спроса,
            покрывающих 4 района ЮЗАО. Один-два салона на пешеходный радиус —
            больше не будет. Дальше — только следующая волна.
          </p>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            marginBottom: 32,
          }}>
            {[
              'Эксклюзив: максимум 2 салона на пешеходную зону',
              'Бесплатное подключение и интеграция с YCLIENTS',
              'Нулевая комиссия первые 3 месяца',
              'Прямая связь с основателем, без отделов поддержки',
            ].map(item => (
              <div key={item} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 14, color: 'var(--dark)', lineHeight: 1.5,
              }}>
                <Icon i={Check} size={16} color="var(--accent)" style={{ marginTop: 4 }} />
                {item}
              </div>
            ))}
          </div>

          <BtnPrimary
            onClick={onApply}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center',
            }}
          >
            Подключить салон
            <Icon i={ArrowRight} size={14} color="#fff" />
          </BtnPrimary>
        </div>

        {/* Тёмная карточка с двухуровневой картой */}
        <div style={{
          background: 'var(--dark)',
          borderRadius: isMobile ? 20 : 24,
          padding: isMobile ? '24px 20px' : '28px 28px',
          color: '#fff',
        }}>
          {/* Заголовок карточки — меняется в зависимости от drill-уровня */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 22, gap: 12, minHeight: 24,
          }}>
            {activeDistrict ? (
              <>
                <button
                  onClick={() => setActiveDistrictId(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.65)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  ← все районы
                </button>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {zoneTaken(activeDistrict)} из {zoneTotal(activeDistrict)}
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                }}>
                  Карта зон спроса
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {totalTaken} из {totalSlots}
                </div>
              </>
            )}
          </div>

          {/* Drill: либо районы, либо зоны выбранного района */}
          {!activeDistrict ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? 10 : 12,
            }}>
              {DISTRICTS.map(d => (
                <DistrictCell
                  key={d.id}
                  name={d.name}
                  taken={zoneTaken(d)}
                  total={zoneTotal(d)}
                  zones={d.zones}
                  slotsPerZone={SLOTS_PER_ZONE}
                  onClick={() => setActiveDistrictId(d.id)}
                />
              ))}
            </div>
          ) : (
            <div>
              <div style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: isMobile ? 26 : 32,
                color: '#fff', marginBottom: 4, lineHeight: 1.1,
              }}>
                {activeDistrict.name}
              </div>
              <div style={{
                fontSize: 12, color: 'rgba(255,255,255,0.45)',
                marginBottom: 18,
              }}>
                {activeDistrict.zones.length} зон спроса · по {SLOTS_PER_ZONE} места
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 8,
              }}>
                {activeDistrict.zones.map(z => (
                  <ZoneRow
                    key={z.id}
                    zone={z}
                    slotsPerZone={SLOTS_PER_ZONE}
                    onClick={() => setActiveZone({ ...z, districtName: activeDistrict.name })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Легенда */}
          <div style={{
            marginTop: 20, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: 11, color: 'rgba(255,255,255,0.5)',
            display: 'flex', gap: 18, flexWrap: 'wrap',
          }}>
            <span><span style={{ color: 'var(--accent)' }}>●</span> подключён</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>○ свободно</span>
            <span style={{ marginLeft: isMobile ? 0 : 'auto', color: 'rgba(255,255,255,0.35)' }}>
              {activeDistrict ? 'нажмите зону' : 'нажмите район'}
            </span>
          </div>
        </div>
      </div>

      <ZoneDetailModal
        zone={activeZone}
        slotsPerZone={SLOTS_PER_ZONE}
        onClose={() => setActiveZone(null)}
        onApply={() => { setActiveZone(null); setTimeout(onApply, 200) }}
      />
    </div>
  )
}

// ─── Ячейка района (верхний уровень) ────────────────────────────────────────
function DistrictCell({ name, taken, total, zones, slotsPerZone, onClick }) {
  const [hov, setHov] = useState(false)
  const left = total - taken
  const filledZones = zones.filter(z => z.taken.length > 0).length

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hov
          ? '1px solid rgba(249,115,22,0.35)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '16px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'inherit',
        color: 'inherit',
        minHeight: 120,
      }}
    >
      <div>
        <div style={{
          fontSize: 15, fontWeight: 600,
          color: '#fff', lineHeight: 1.2,
          marginBottom: 4,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.02em',
        }}>
          {left} из {total} · {zones.length} зон
        </div>
      </div>

      {/* Мини-визуализация заполненности зон */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginTop: 'auto',
        flexWrap: 'wrap',
      }}>
        {zones.map(z => {
          const zoneFull = z.taken.length === slotsPerZone
          const zonePartial = z.taken.length > 0 && z.taken.length < slotsPerZone
          return (
            <div key={z.id} style={{
              flex: '1 1 0',
              minWidth: 18,
              height: 6,
              borderRadius: 3,
              background: zoneFull
                ? 'var(--accent)'
                : zonePartial
                  ? 'rgba(249,115,22,0.45)'
                  : 'rgba(255,255,255,0.1)',
            }} />
          )
        })}
      </div>
    </button>
  )
}

// ─── Строка зоны (второй уровень) ───────────────────────────────────────────
function ZoneRow({ zone, slotsPerZone, onClick }) {
  const [hov, setHov] = useState(false)
  const takenIndices = zone.taken.map(t => t.index)
  const left = slotsPerZone - zone.taken.length
  const isFull = left === 0

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hov
          ? '1px solid rgba(249,115,22,0.35)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'inherit',
        color: 'inherit',
      }}
    >
      {/* Слева — название и якорь */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#fff',
          marginBottom: 2, lineHeight: 1.3,
        }}>
          {zone.name}
        </div>
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.4)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {zone.anchor}
        </div>
      </div>

      {/* Справа — кружки слотов */}
      <div style={{
        display: 'flex', gap: 6, flexShrink: 0,
      }}>
        {Array.from({ length: slotsPerZone }).map((_, i) => {
          const taken = takenIndices.includes(i)
          return (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              background: taken ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
              border: taken ? 'none' : '1px solid rgba(255,255,255,0.14)',
            }} />
          )
        })}
      </div>

      {/* Статус */}
      <div style={{
        fontSize: 10, color: isFull ? 'rgba(255,255,255,0.4)' : 'var(--accent)',
        fontWeight: 600, letterSpacing: '0.04em',
        textTransform: 'uppercase',
        flexShrink: 0,
        minWidth: 42,
        textAlign: 'right',
      }}>
        {isFull ? 'занято' : `${left} своб.`}
      </div>
    </button>
  )
}

// ─── Модалка детализации зоны ───────────────────────────────────────────────
function ZoneDetailModal({ zone, slotsPerZone, onClose, onApply }) {
  if (!zone) return null

  const left = slotsPerZone - zone.taken.length
  const isFull = left === 0

  return (
    <Modal open={!!zone} onClose={onClose} maxWidth={460}>
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 8, fontWeight: 600,
        }}>
          {zone.districtName} · зона спроса
        </div>
        <div style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 26, color: 'var(--dark)', marginBottom: 6, lineHeight: 1.15,
        }}>
          {zone.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 4 }}>
          {zone.anchor}
        </div>
        <div style={{ fontSize: 14, color: 'var(--secondary)', marginTop: 10 }}>
          {isFull
            ? <>Все {slotsPerZone} места заняты в этой зоне</>
            : <>Свободно <strong style={{ color: 'var(--dark)' }}>{left}</strong> из {slotsPerZone} мест</>
          }
        </div>
      </div>

      {/* Сетка слотов */}
      <div style={{
        background: 'rgba(18,26,18,0.03)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 18,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${slotsPerZone}, 1fr)`,
          gap: 10,
          maxWidth: 200,
        }}>
          {Array.from({ length: slotsPerZone }).map((_, i) => {
            const taken = zone.taken.find(t => t.index === i)
            return (
              <div key={i} style={{
                aspectRatio: '1',
                borderRadius: 12,
                background: taken ? 'var(--accent)' : 'rgba(18,26,18,0.04)',
                border: taken ? 'none' : '1px dashed rgba(18,26,18,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: taken ? '#fff' : 'rgba(18,26,18,0.3)',
                fontSize: 16,
                fontWeight: 600,
              }}>
                {taken ? '●' : (i + 1)}
              </div>
            )
          })}
        </div>

        {zone.taken.length > 0 && (
          <div style={{
            marginTop: 14, paddingTop: 14,
            borderTop: '1px solid rgba(18,26,18,0.06)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {zone.taken.map(t => (
              <div key={t.salon} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 13,
              }}>
                <span style={{
                  color: 'var(--accent)', fontSize: 14, lineHeight: 1, marginTop: 2,
                }}>●</span>
                <div>
                  <div style={{ color: 'var(--dark)', fontWeight: 500 }}>{t.salon}</div>
                  <div style={{ color: 'var(--secondary)', fontSize: 12, marginTop: 2 }}>{t.address}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFull ? (
        <div style={{
          fontSize: 13, color: 'var(--secondary)', textAlign: 'center',
          padding: '14px 16px', background: 'rgba(18,26,18,0.04)', borderRadius: 14,
        }}>
          Эта зона уже закрыта в первой волне. Вы можете подать заявку
          в соседнюю зону или оставить email на следующую волну.
        </div>
      ) : (
        <>
          <BtnPrimary
            onClick={onApply}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Подать заявку в эту зону
            <Icon i={ArrowRight} size={14} color="#fff" />
          </BtnPrimary>
          <div style={{
            marginTop: 10, fontSize: 12, color: 'var(--secondary)', textAlign: 'center',
          }}>
            Эксклюзив: не больше {slotsPerZone} салонов на пешеходный радиус
          </div>
        </>
      )}
    </Modal>
  )
}

function SecondaryCTA({ isMobile, onSubscribe }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '24px 20px 64px' : '0 32px 100px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 18,
      }}>
        Хотите быть первым, когда лента откроется
      </div>
      <h3 style={{
        fontFamily: 'Playfair Display,serif', fontWeight: 400,
        fontSize: isMobile ? 26 : 'clamp(28px, 3.5vw, 44px)',
        lineHeight: 1.15,
        color: 'var(--dark)', margin: '0 0 32px', maxWidth: 700,
        marginInline: 'auto',
      }}>
        Одно письмо на запуске.
        {isMobile ? ' ' : <br />}
        Никаких рассылок.
      </h3>

      <BtnDark
        onClick={onSubscribe}
        style={{ width: isMobile ? '100%' : 'auto' }}
      >
        Подписаться на запуск
      </BtnDark>
    </div>
  )
}

function Footer({ isMobile }) {
  return (
    <div style={{
      background: '#1C1F1C', color: 'rgba(255,255,255,0.5)',
      padding: isMobile ? '32px 20px' : '40px 32px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 16 : 24,
        fontSize: 12,
      }}>
        <div>© 2026 Lovi.today · ОГРН 324774600002041 · ИП Васин Д. В.</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
            Политика конфиденциальности
          </a>
          <a href="/offer" style={{ color: 'inherit', textDecoration: 'none' }}>
            Публичная оферта
          </a>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const isMobile = useIsMobile()
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      color: 'var(--dark)', fontFamily: 'Inter,system-ui,sans-serif',
    }}>
      <style>{`
        @keyframes lovi-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
      `}</style>

      <NavBar isMobile={isMobile} />
      <Hero isMobile={isMobile} onSubscribe={() => setWaitlistOpen(true)} />
      <LiveDemo isMobile={isMobile} onSubscribe={() => setWaitlistOpen(true)} />
      <PullQuote isMobile={isMobile} />
      <PartnerCallout isMobile={isMobile} onApply={() => setPartnerOpen(true)} />
      <SecondaryCTA isMobile={isMobile} onSubscribe={() => setWaitlistOpen(true)} />
      <Footer isMobile={isMobile} />

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </div>
  )
}