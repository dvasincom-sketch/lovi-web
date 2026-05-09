import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const API = 'https://insalon.onrender.com'
const CRM_OPTIONS = ['YCLIENTS', '1С:Салон', 'Арника', 'Sycret', 'Другая', 'Не используем']

// dark=true — для тёмного фона (Partners page)
// dark=false — для светлого фона (HeroNew ComingSoonBlock)
export default function PartnerForm({ city = 'Москва', dark = false }) {
  const isMobile = useIsMobile()
  const [open, setOpen]           = useState(false)
  const [sent, setSent]           = useState(false)
  const [error, setError]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [biz, setBiz] = useState({ name: '', phone: '', salon: '', address: '', crm: '', email: '' })

  function handleChange(field) {
    return e => setBiz(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!biz.name.trim())  { setError('Введите имя'); return }
    if (!biz.phone.trim() || biz.phone.replace(/\D/g, '').length < 10) { setError('Введите корректный телефон'); return }
    if (!biz.salon.trim()) { setError('Введите название салона'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/lovi/city-partner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          name:       biz.name.trim(),
          phone:      biz.phone.trim(),
          salon_name: biz.salon.trim(),
          email:      biz.email.trim() || null,
          address:    biz.address.trim() || null,
          crm:        biz.crm || null,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Не удалось отправить. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  const borderColor = dark ? 'rgba(255,255,255,0.12)' : 'var(--border)'
  const bgColor     = dark ? 'rgba(255,255,255,0.06)' : '#FDFCF9'
  const textColor   = dark ? '#fff' : 'var(--dark)'
  const focusColor  = dark ? 'rgba(249,115,22,0.5)' : 'var(--dark)'

  const inputStyle = {
    width: '100%', border: `1px solid ${borderColor}`, borderRadius: 12,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    background: bgColor, boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', color: textColor,
    transition: 'border-color 0.2s',
  }

  const wrapStyle = dark ? {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '28px 24px',
  } : {
    border: '1px solid var(--border)',
    borderRadius: 20, padding: '24px',
    background: '#fff',
  }

  if (sent) {
    return (
      <div style={wrapStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
              <path d="M1 6.5l5 5 9-10" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: textColor, marginBottom: 3 }}>Заявка принята</div>
            <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'var(--secondary)' }}>
              Свяжемся в течение рабочего дня
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 500, color: textColor, lineHeight: 1.3 }}>
          Вы владелец салона?
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--accent)', background: 'rgba(249,115,22,0.1)',
          padding: '3px 10px', borderRadius: 20, flexShrink: 0, marginLeft: 12 }}>
          Для бизнеса
        </span>
      </div>

      <p style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,0.45)' : 'var(--secondary)',
        lineHeight: 1.7, margin: '0 0 16px' }}>
        Оставьте заявку — обсудим условия подключения.
      </p>

      {!open ? (
        <button onClick={() => setOpen(true)} style={{
          width: '100%', padding: '12px', borderRadius: 14,
          background: 'transparent',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.3)' : 'var(--dark)'}`,
          color: textColor, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.08)' : 'var(--dark)'; if (!dark) e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textColor }}>
          Оставить заявку на подключение
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
            <input value={biz.name} onChange={handleChange('name')}
              placeholder="Ваше имя" style={inputStyle}
              onFocus={e => e.target.style.borderColor = focusColor}
              onBlur={e => e.target.style.borderColor = borderColor} />
            <input value={biz.phone} placeholder="+7 999 000 00 00" type="tel" style={inputStyle}
              onChange={e => {
                let v = e.target.value.replace(/[^\d+]/g, '')
                if (!v.startsWith('+7')) v = '+7' + v.replace(/^\+?7?/, '')
                if (v.length > 12) v = v.slice(0, 12)
                setBiz(prev => ({ ...prev, phone: v }))
              }}
              onFocus={e => e.target.style.borderColor = focusColor}
              onBlur={e => e.target.style.borderColor = borderColor} />
          </div>
          <input value={biz.email} onChange={handleChange('email')}
            placeholder="Email для связи" type="email" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusColor}
            onBlur={e => e.target.style.borderColor = borderColor} />
          <input value={biz.salon} onChange={handleChange('salon')}
            placeholder="Название салона" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusColor}
            onBlur={e => e.target.style.borderColor = borderColor} />
          <input value={biz.address} onChange={handleChange('address')}
            placeholder="Адрес салона" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusColor}
            onBlur={e => e.target.style.borderColor = borderColor} />

          <div style={{ position: 'relative' }}>
            <select value={biz.crm} onChange={handleChange('crm')}
              style={{ ...inputStyle, appearance: 'none', paddingRight: 32,
                color: biz.crm ? textColor : (dark ? 'rgba(255,255,255,0.3)' : 'rgba(18,26,18,0.4)') }}>
              <option value="">Какая CRM используется?</option>
              {CRM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none"
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4 }}>
              <path d="M1 1l5 5 5-5" stroke={dark ? '#fff' : '#121A12'} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>{error}</div>
          )}

          <button type="submit" disabled={submitting}
            style={{ background: submitting ? 'rgba(249,115,22,0.5)' : '#F97316',
              color: '#fff', border: 'none', padding: '13px', borderRadius: 14,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'background 0.2s', marginTop: 2 }}>
            {submitting ? 'Отправляем...' : 'Отправить заявку'}
          </button>
        </form>
      )}
    </div>
  )
}