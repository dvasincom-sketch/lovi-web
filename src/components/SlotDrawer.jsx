import { useState, useEffect, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const API = 'https://insalon.onrender.com'

function fmt(price) { return price?.toLocaleString('ru-RU') + ' ₽' }

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt.replace(' ', 'T'))
  return d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
    + ' · ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function MasterAvatar({ name, avatar }) {
  const initial = name ? name.charAt(0).toUpperCase() : 'М'
  if (avatar) return (
    <img src={avatar} alt={name} style={{
      width: 44, height: 44, borderRadius: '50%',
      objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)'
    }} />
  )
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%',
      background: 'var(--dark)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
      fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#fff',
    }}>{initial}</div>
  )
}

export default function SlotDrawer({ slot, onClose }) {
  const isMobile = useIsMobile()
  const [staff, setStaff] = useState(null)
  const [staffLoading, setStaffLoading] = useState(true)
  const [name, setName] = useState(() => {
    try { const u = JSON.parse(localStorage.getItem('lovi_user')); return u?.name || '' } catch { return '' }
  })
  const [phone, setPhone] = useState(() => {
    try { const u = JSON.parse(localStorage.getItem('lovi_user')); return u?.phone || '' } catch { return '' }
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const loviUser = (() => { try { return JSON.parse(localStorage.getItem('lovi_user')) } catch { return null } })()
  const [expired, setExpired] = useState(false)
  const overlayRef = useRef(null)

  // Закрыть по клику на оверлей
  function handleOverlay(e) {
    if (e.target === overlayRef.current) onClose()
  }

  // Закрыть по Escape
  useEffect(() => {
    function handle(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [])

  // Блокируем скролл страницы
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Таймер исчезновения
  const [secondsLeft, setSecondsLeft] = useState(slot.minutes_to_slot * 60)
  useEffect(() => {
    if (secondsLeft <= 0) { setExpired(true); return }
    const t = setInterval(() => setSecondsLeft(v => {
      if (v <= 1) { setExpired(true); clearInterval(t); return 0 }
      return v - 1
    }), 1000)
    return () => clearInterval(t)
  }, [])
  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timerStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
  const urgent = secondsLeft <= 900

  // Загружаем мастера
  useEffect(() => {
    if (!slot.datetime || !slot.service_id) { setStaffLoading(false); return }
    const dt = slot.datetime.replace('T', ' ')
    fetch(`${API}/api/booking/staff?datetime=${encodeURIComponent(dt)}&duration=${(slot.duration_min||60)*60}&service_id=${slot.service_id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setStaff(data[0])
      })
      .catch(() => {})
      .finally(() => setStaffLoading(false))
  }, [slot.service_id])

  async function handleSubmit() {
    if (!name.trim()) { setError('Введите имя'); return }
    if (!phone.trim() || phone.replace(/\D/g,'').length < 10) { setError('Введите корректный телефон'); return }
    if (expired) { setError('Слот уже недоступен'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/lovi/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: slot.service_id,
          service_title: slot.service_name,
          datetime: slot.datetime,
          duration: (slot.duration_min || 60) * 60,
          lovi_price: slot.lovi_price,
          base_price: slot.base_price,
          staff_id: staff?.id,
          staff_name: staff?.name,
          client_name: name.trim(),
          client_phone: phone.trim(),
          client_email: loviUser?.email || '',
          user_id: loviUser?.id || null,
          discount_pct: slot.discount_pct || null,
        })
      })
      const data = await res.json()
      if (data.payment_url) {
        window.location.href = data.payment_url
      } else {
        setError('Ошибка создания платежа. Попробуйте ещё раз.')
        setSubmitting(false)
      }
    } catch (e) {
      setError('Ошибка соединения. Попробуйте ещё раз.')
      setSubmitting(false)
    }
  }

  // Expired state
  if (expired) return (
    <div ref={overlayRef} onClick={handleOverlay} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(18,26,18,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: isMobile ? 'stretch' : 'flex-end',
    }}>
      <div style={{
        background: 'var(--bg)', borderRadius: isMobile ? '24px 24px 0 0' : '24px 0 0 24px',
        padding: '40px 32px', width: isMobile ? '100%' : 420,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 40 }}>⏰</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--dark)' }}>
          Такое бывает
        </div>
        <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>
          Это окошко уже недоступно, но мы сейчас поищем похожие!
        </div>
        <button onClick={onClose} style={{
          width: '100%', padding: '14px', borderRadius: 20,
          background: 'var(--dark)', color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          Смотреть другие окошки
        </button>
      </div>
    </div>
  )

  const inputStyle = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 12,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    background: '#FDFCF9', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', color: 'var(--dark)',
  }

  return (
    <div ref={overlayRef} onClick={handleOverlay} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(18,26,18,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: isMobile ? 'stretch' : 'flex-end',
    }}>
      <div style={{
        background: 'var(--bg)',
        borderRadius: isMobile ? '24px 24px 0 0' : '24px 0 0 24px',
        width: isMobile ? '100%' : 440,
        maxHeight: isMobile ? '92dvh' : '100dvh',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        animation: isMobile ? 'slideUp 0.35s cubic-bezier(0.2,1,0.2,1)' : 'slideRight 0.35s cubic-bezier(0.2,1,0.2,1)',
      }}>
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
          @keyframes slideRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
        `}</style>

        {/* Хэндл на мобильном */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
          </div>
        )}

        <div style={{ padding: isMobile ? '16px 20px 40px' : '32px 32px 40px' }}>

          {/* Шапка */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Горящий слот
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--secondary)', lineHeight: 1, padding: 4,
            }}>✕</button>
          </div>

          {/* Услуга и время */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>
              {slot.service_name}
            </div>
            <div style={{ fontSize: 14, color: 'var(--secondary)' }}>
              {formatDateTime(slot.datetime)} · {slot.duration_min} мин
            </div>
          </div>

          {/* Таймер */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: urgent ? 'rgba(249,115,22,0.08)' : 'rgba(18,26,18,0.04)',
            border: `1px solid ${urgent ? 'rgba(249,115,22,0.2)' : 'var(--border)'}`,
            borderRadius: 12, padding: '10px 14px', marginBottom: 20,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: urgent ? 'var(--accent)' : 'var(--secondary)',
              animation: 'pulse 1.6s ease-in-out infinite', flexShrink: 0,
            }} />
            <span style={{ fontSize: 13, color: urgent ? 'var(--accent)' : 'var(--secondary)', fontWeight: urgent ? 600 : 400 }}>
              Исчезнет через {timerStr}
            </span>
          </div>

          {/* Мастер */}
          {!staffLoading && (staff ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: '#fff',
              border: '1px solid var(--border)', borderRadius: 16, marginBottom: 20,
            }}>
              <MasterAvatar name={staff.name} avatar={staff.avatar} />
              <div>
                <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 2 }}>Ваш мастер</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dark)' }}>{staff.name}</div>
                {staff.specialization && (
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{staff.specialization}</div>
                )}
              </div>
              {staff.rating && (
                <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>
                  ★ {staff.rating}
                </div>
              )}
            </div>
          ) : null)}

          {/* Цена */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 16, marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 4 }}>
                <span style={{ textDecoration: 'line-through' }}>{fmt(slot.base_price)}</span>
                {' '}в салоне напрямую
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--dark)', letterSpacing: '-0.02em' }}>
                {fmt(slot.lovi_price)}
              </div>
            </div>
            <div style={{
              background: 'var(--accent)', color: '#fff',
              fontSize: 14, fontWeight: 700,
              padding: '8px 16px', borderRadius: 12,
            }}>
              -{slot.discount_pct}%
            </div>
          </div>

          {/* Разделитель */}
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

          {/* Форма */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Ваши данные
            </div>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Имя" style={inputStyle}
            />
            <input
              value={phone}
              onChange={e => {
                let val = e.target.value.replace(/[^\d+]/g, '')
                if (!val.startsWith('+7')) {
                  val = '+7' + val.replace(/^\+?7?/, '')
                }
                if (val.length > 12) val = val.slice(0, 12)
                setPhone(val)
              }}
              placeholder="+7 999 000 00 00" type="tel" style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{error}</div>
          )}

          {/* Оплатить */}
          <button onClick={handleSubmit} disabled={submitting} style={{
            width: '100%', padding: '16px', borderRadius: 20,
            background: submitting ? 'rgba(18,26,18,0.4)' : 'var(--accent)',
            color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 600, cursor: submitting ? 'default' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: submitting ? 'none' : '0 8px 24px rgba(249,115,22,0.3)',
            transition: 'all 0.3s',
          }}>
            {submitting ? '⏳ Создаём бронь...' : `Оплатить ${fmt(slot.lovi_price)}`}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            {['100% предоплата', 'СБП', 'Apple Pay', 'T-Pay'].map(p => (
              <span key={p} style={{
                fontSize: 10, color: 'var(--secondary)',
                background: 'rgba(18,26,18,0.04)',
                padding: '3px 8px', borderRadius: 6,
              }}>{p}</span>
            ))}
          </div>

          <p style={{ fontSize: 11, color: 'var(--secondary)', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
            Нажимая «Оплатить», вы соглашаетесь с{' '}
            <span style={{ color: 'var(--dark)', textDecoration: 'underline', cursor: 'pointer' }}>условиями</span>
          </p>
        </div>
      </div>
    </div>
  )
}
