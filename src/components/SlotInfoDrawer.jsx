import { useState, useEffect, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const API = 'https://insalon.onrender.com'

const SALON = {
  name: 'HeadSpa Beauty',
  address: 'Москва, ул. Миклухо-Маклая 37',
  metro: '5 мин от м. Беляево · 1 этаж',
  phone: '+7 977 883-23-47',
  whatsapp: '79778832347',
  maps: 'https://yandex.ru/maps/?text=Москва+ул.+Миклухо-Маклая+37',
  photo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
}

const SERVICE_DESCRIPTIONS = {
  24560829: 'Премиальная программа восстановления волос и кожи головы. Включает диагностику, глубокое очищение, питательные маски и массаж по японской технике.',
  26949774: 'Авторская SPA-программа с использованием 9 целебных трав. Снимает стресс, восстанавливает баланс кожи головы и дарит ощущение полного перерождения.',
  19655588: 'Полный SPA-ритуал для мужчин: массаж головы, бороды и шеи. Глубокое расслабление и уход за кожей лица.',
  19658183: 'Локальная проработка мышц спины, снятие зажимов и болевых точек. Классический и точечный массаж.',
  19658189: 'Полный расслабляющий массаж тела. Снятие мышечного напряжения, улучшение кровообращения, глубокий релакс.',
  19658225: 'Быстрое снятие напряжения в шейно-воротниковой зоне. Эффективно при головных болях и усталости от работы за компьютером.',
  28219353: 'Романтическая SPA-программа для двоих. Синхронный массаж, ароматерапия, чай и атмосфера полного уединения.',
  19556779: 'Флагманская парная программа — 2,5 часа погружения. Ритуал очищения, массаж, флоатинг и завершающий уход.',
  19655561: 'SPA для двоих в будние дни со специальными условиями. Массаж, обёртывание и релакс в приватной зоне.',
  19556836: 'Компактная парная программа для тех, кто ценит время. Всё самое важное за 100 минут.',
}

function fmt(price) { return price?.toLocaleString('ru-RU') + ' ₽' }

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt.replace(' ', 'T'))
  return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
    + ' · ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function SlotInfoDrawer({ slot, onClose, onBook }) {
  const isMobile = useIsMobile()
  const [staff, setStaff] = useState(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    function handle(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!slot.datetime || !slot.service_id) return
    const dt = slot.datetime.replace('T', ' ')
    fetch(`${API}/api/booking/staff?datetime=${encodeURIComponent(dt)}&duration=${(slot.duration_min||60)*60}&service_id=${slot.service_id}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setStaff(data[0]) })
      .catch(() => {})
  }, [slot.service_id])

  function handleOverlay(e) {
    if (e.target === overlayRef.current) onClose()
  }

  const description = SERVICE_DESCRIPTIONS[slot.service_id] || 'Профессиональная процедура в уютной атмосфере HeadSpa Beauty.'

  const drawerStyle = {
    background: 'var(--bg)',
    borderRadius: isMobile ? '24px 24px 0 0' : '24px 0 0 24px',
    width: isMobile ? '100%' : 480,
    maxHeight: isMobile ? '92dvh' : '100dvh',
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
    animation: isMobile ? 'slideUp 0.35s cubic-bezier(0.2,1,0.2,1)' : 'slideRight 0.35s cubic-bezier(0.2,1,0.2,1)',
  }

  return (
    <div ref={overlayRef} onClick={handleOverlay} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(18,26,18,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: isMobile ? 'stretch' : 'flex-end',
    }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>

      <div style={drawerStyle}>
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
          </div>
        )}

        {/* Фото салона */}
        <div style={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden',
          borderRadius: isMobile ? '20px 20px 0 0' : '24px 0 0 0' }}>
          <img src={SALON.photo} alt={slot.service_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(18,26,18,0.7) 0%, transparent 50%)',
          }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: 'none', borderRadius: '50%', width: 36, height: 36,
            cursor: 'pointer', fontSize: 16, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
          <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 4 }}>Горящий слот</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20,
              color: '#fff', fontWeight: 500, lineHeight: 1.2 }}>{slot.service_name}</div>
          </div>
        </div>

        <div style={{ padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Время и дата */}
          <div style={{
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: 16, padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 4,
                letterSpacing: '0.06em', textTransform: 'uppercase' }}>Дата и время</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22,
                color: 'var(--accent)', fontWeight: 600 }}>{slot.time}</div>
              <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 2 }}>
                {formatDateTime(slot.datetime)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 4 }}>Длительность</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--dark)' }}>{slot.duration_min} мин</div>
            </div>
          </div>

          {/* Описание услуги */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--secondary)', marginBottom: 10 }}>Об услуге</div>
            <p style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.7, margin: 0 }}>
              {description}
            </p>
          </div>

          {/* Мастер */}
          {staff && (
            <div style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 16, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {staff.avatar
                ? <img src={staff.avatar} alt={staff.name} style={{ width: 44, height: 44,
                    borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: 18, color: '#fff',
                    fontFamily: 'Playfair Display, serif' }}>
                    {staff.name?.charAt(0)}
                  </div>
              }
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 2 }}>Ваш мастер</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dark)' }}>{staff.name}</div>
                {staff.specialization && (
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{staff.specialization}</div>
                )}
              </div>
              {staff.rating && (
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>★ {staff.rating}</div>
              )}
            </div>
          )}

          {/* Цена */}
          <div style={{
            background: 'var(--dark)', borderRadius: 16, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)',
                textDecoration: 'line-through', marginBottom: 2 }}>{fmt(slot.base_price)} в салоне</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: '#fff',
                letterSpacing: '-0.02em' }}>{fmt(slot.lovi_price)}</div>
            </div>
            <div style={{ background: 'var(--accent)', color: '#fff',
              fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 12 }}>
              -{slot.discount_pct}%
            </div>
          </div>

          {/* Адрес */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--secondary)', marginBottom: 10 }}>Адрес</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dark)', marginBottom: 4 }}>
              {SALON.address}
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 12 }}>
              {SALON.metro}
            </div>
            <button onClick={() => window.open(SALON.maps, '_blank')} style={{
              width: '100%', padding: '10px', borderRadius: 12,
              border: '1px solid var(--border)', background: 'transparent',
              fontSize: 13, color: 'var(--secondary)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              Построить маршрут в Яндекс Картах →
            </button>
          </div>

          {/* Контакты */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={`tel:${SALON.phone}`} style={{
              flex: 1, padding: '10px', borderRadius: 12,
              border: '1px solid var(--border)', background: 'transparent',
              fontSize: 13, color: 'var(--dark)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', textDecoration: 'none',
              textAlign: 'center',
            }}>
              📞 {SALON.phone}
            </a>
            <a href={`https://wa.me/${SALON.whatsapp}`} target="_blank" rel="noreferrer" style={{
              flex: 1, padding: '10px', borderRadius: 12,
              border: '1px solid var(--border)', background: 'transparent',
              fontSize: 13, color: 'var(--dark)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', textDecoration: 'none',
              textAlign: 'center',
            }}>
              💬 WhatsApp
            </a>
          </div>

          {/* Условия */}
          <div style={{ background: '#F1F0EC', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--secondary)', marginBottom: 12 }}>Условия визита</div>
            {[
              ['Приезжайте за 10 мин', 'мастер готовится к процедуре заранее'],
              ['При опоздании', 'мастер вправе сократить программу без изменения стоимости'],
              ['Отмена менее чем за 24 ч', 'предоплата не возвращается'],
              ['Перенос записи', 'возможен не позднее чем за 24 часа до начала'],
            ].map(([bold, text], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--secondary)',
                  flexShrink: 0, marginTop: 7 }} />
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5 }}>
                  <b style={{ color: 'var(--dark)', fontWeight: 500 }}>{bold}</b> — {text}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={onBook} style={{
            width: '100%', padding: '16px', borderRadius: 20,
            background: 'var(--accent)', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
          }}>
            Забрать за {fmt(slot.lovi_price)}
          </button>

          <p style={{ fontSize: 11, color: 'var(--secondary)', textAlign: 'center',
            margin: '0', lineHeight: 1.6 }}>
            Нажимая «Забрать», вы соглашаетесь с{' '}
            <span style={{ color: 'var(--dark)', textDecoration: 'underline', cursor: 'pointer' }}>
              условиями публичной оферты
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
