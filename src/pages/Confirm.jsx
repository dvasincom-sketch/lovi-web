import { useEffect, useState } from 'react'

const SALON_ADDRESS = 'Москва, ул. Миклухо-Маклая 37'
const SALON_METRO   = '5 мин от м. Беляево · 1 этаж'
const SALON_PHONE   = '+7 977 883-23-47'
const WHATSAPP_NUM  = '79778832347'
const API           = 'https://insalon.onrender.com'

function fmt(price) { return price?.toLocaleString('ru-RU') + ' ₽' }

function formatDate(dt) {
  if (!dt) return ''
  const d = new Date(dt.replace(' ', 'T'))
  return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
}
function formatTime(dt) {
  if (!dt) return ''
  const d = new Date(dt.replace(' ', 'T'))
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
function arriveTime(dt) {
  if (!dt) return ''
  const d = new Date(dt.replace(' ', 'T'))
  d.setMinutes(d.getMinutes() - 10)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function MasterAvatar({ name, avatarUrl }) {
  const initial = name ? name.charAt(0).toUpperCase() : 'М'
  if (avatarUrl) return (
    <img src={avatarUrl} alt={name} style={{
      width: 48, height: 48, borderRadius: '50%',
      objectFit: 'cover', flexShrink: 0,
      border: '1.5px solid var(--border)',
    }} />
  )
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      background: 'var(--dark)', border: '1.5px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, fontSize: 18, fontWeight: 500, color: '#fff',
      fontFamily: 'Playfair Display, serif',
    }}>{initial}</div>
  )
}

export default function Confirm() {
  const params    = new URLSearchParams(window.location.search)
  const bookingId = params.get('booking_id')
  const [booking, setBooking] = useState(null)
  const [staff, setStaff]     = useState(null)
  const [copied, setCopied]   = useState(false)

  // Polling пока статус не paid
  useEffect(() => {
    if (!bookingId) return
    let attempts = 0
    const poll = async () => {
      try {
        const r = await fetch(`${API}/api/booking/${bookingId}`)
        const data = await r.json()
        if (data.error || data.detail) { setBooking({ notFound: true }); return }
        setBooking(data)
        if (data.status !== 'paid' && attempts < 12) {
          attempts++
          setTimeout(poll, 2500)
        }
      } catch (e) {
        setBooking({ notFound: true })
      }
    }
    poll()
  }, [bookingId])

  // Загружаем мастера
  useEffect(() => {
    if (!booking?.master_id || !booking?.datetime || !booking?.service_id) return
    fetch(`${API}/api/booking/staff?datetime=${booking.datetime}&duration=${booking.duration || 3600}&service_id=${booking.service_id}`)
      .then(r => r.json())
      .then(data => {
        const found = data.find(s => s.id === booking.master_id) || data[0]
        if (found) setStaff(found)
      })
      .catch(() => {})
  }, [booking?.master_id])

  const isPaid       = booking?.status === 'paid'
  const durationMin  = booking ? Math.floor((booking.duration || 0) / 60) : 0

  function copyLink() {
    navigator.clipboard.writeText(`https://lovi-web.onrender.com/confirm?booking_id=${bookingId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Skeleton пока грузится
  if (!booking) return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', color: 'var(--secondary)', fontSize: 14,
    }}>
      Загружаем детали брони...
    </div>
  )

  if (booking.notFound) return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', gap: 12, padding: 24,
    }}>
      <img src="/logo.svg" alt="LOVI" style={{height: 24, marginBottom: 8}} />
      <div style={{fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--dark)'}}>Бронь не найдена</div>
      <div style={{fontSize: 14, color: 'var(--secondary)', textAlign: 'center'}}>Проверьте ссылку или вернитесь на главную</div>
      <button onClick={() => window.location.href = '/'} style={{
        marginTop: 8, padding: '12px 28px', borderRadius: 20,
        background: 'var(--dark)', color: '#fff', border: 'none',
        fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
      }}>На главную → найти новое окошко</button>
    </div>
  )

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      fontFamily: 'Inter, sans-serif', color: 'var(--dark)',
    }}>
      <div style={{
        maxWidth: 480, margin: '0 auto',
        padding: '24px 20px 60px',
        animation: 'fadeUp 0.4s ease both',
      }}>

        {/* Лого */}
        <div style={{ marginBottom: 32 }}>
          <img src="/logo.svg" alt="LOVI" style={{ height: 24 }} />
        </div>

        {/* Статус */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 28,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: isPaid ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>
            {isPaid ? '✓' : '⏳'}
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>
              {isPaid ? 'Запись подтверждена' : 'Ожидаем оплату...'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 3 }}>
              {isPaid ? `Бронь №${bookingId}` : 'Обновляем статус автоматически'}
            </div>
          </div>
        </div>

        {(isPaid || booking?.status === 'waiting_payment') && (
          <>
            {/* Карточка брони */}
            <div style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 20, overflow: 'hidden', marginBottom: 16,
            }}>
              {/* Шапка карточки */}
              <div style={{
                background: 'var(--dark)', color: '#fff',
                padding: '20px 24px',
              }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 8 }}>
                  Горящий слот · Lovi
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
                  {booking.service_title}
                </div>
                <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
                  {formatTime(booking.datetime)}
                </div>
                <div style={{ fontSize: 13, opacity: 0.5, marginTop: 4, textTransform: 'capitalize' }}>
                  {formatDate(booking.datetime)}
                </div>
              </div>

              {/* Детали */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Мастер */}
                {(staff || booking.master_name) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MasterAvatar name={staff?.name || booking.master_name} avatarUrl={staff?.avatar} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 2 }}>Ваш мастер</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{staff?.name || booking.master_name}</div>
                      {staff?.specialization && (
                        <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{staff.specialization}</div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ height: 1, background: 'var(--border)' }} />

                {/* Приехать к */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--secondary)' }}>Приехать к</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>{arriveTime(booking.datetime)}</div>
                </div>

                {/* Длительность */}
                {durationMin > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--secondary)' }}>Длительность</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{durationMin} мин</div>
                  </div>
                )}

                {/* Оплачено */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--secondary)' }}>Оплачено</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#22c55e' }}>{fmt(booking.total_price)}</div>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                {/* Адрес */}
                <div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 6 }}>Адрес</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{SALON_ADDRESS}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 12 }}>{SALON_METRO}</div>
                  <button onClick={() => window.open(`https://yandex.ru/maps/?text=${encodeURIComponent(SALON_ADDRESS)}`, '_blank')}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 12,
                      border: '1px solid var(--border)', background: 'transparent',
                      fontSize: 13, color: 'var(--secondary)', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                    Построить маршрут в Яндекс Картах →
                  </button>
                </div>
              </div>

              {/* Ссылка на бронь */}
              <div style={{
                padding: '14px 24px',
                borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  lovi-web.onrender.com/confirm?booking_id={bookingId}
                </div>
                <button onClick={copyLink} style={{
                  fontSize: 11, fontWeight: 500,
                  color: copied ? '#22c55e' : 'var(--accent)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', flexShrink: 0, marginLeft: 8,
                }}>
                  {copied ? '✓ скопировано' : 'копировать'}
                </button>
              </div>
            </div>

            {/* Условия */}
            <div style={{ marginBottom: 16, padding: '16px 20px', background: '#fff', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 12 }}>
                Условия визита
              </div>
              {[
                [`Приходите к ${arriveTime(booking.datetime)}`, 'мастер готовится заранее'],
                ['При опоздании', 'мастер может сократить программу без изменения стоимости'],
                ['Отмена менее чем за 24 ч', 'предоплата не возвращается'],
                [SALON_PHONE, 'по любым вопросам'],
              ].map(([bold, text], i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border)', flexShrink: 0, marginTop: 6 }} />
                  <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5 }}>
                    <b style={{ color: 'var(--dark)', fontWeight: 500 }}>{bold}</b> — {text}
                  </div>
                </div>
              ))}
            </div>

            {/* Перенос / Отмена */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Перенести', text: 'Хочу перенести запись', danger: false },
                { label: 'Отменить', text: 'Хочу отменить запись', danger: true },
              ].map((btn, i) => (
                <button key={i}
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(`${btn.text} №${bookingId}`)}`, '_blank')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 20,
                    background: 'transparent',
                    border: `1px solid ${btn.danger ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                    color: btn.danger ? 'rgb(239,68,68)' : 'var(--secondary)',
                    fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                  {btn.label}
                </button>
              ))}
            </div>

            {/* CTA — вернуться */}
            <button onClick={() => window.location.href = '/'}
              style={{
                width: '100%', padding: '16px', borderRadius: 20,
                background: 'var(--dark)', color: '#fff', border: 'none',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>
              Смотреть другие окошки →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
