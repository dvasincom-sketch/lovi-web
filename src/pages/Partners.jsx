import { useState } from 'react'
import PartnerForm from '../components/PartnerForm'
import { useIsMobile } from '../hooks/useIsMobile'

const API = "https://insalon.onrender.com"

const BENEFITS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Только горящие окна",
    text: "Скидка появляется за 1–3 часа до начала. Раньше никто не видит. Постоянные клиенты продолжают записываться как обычно.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: "Основной прайс не пострадает",
    text: "Мы не вывешиваем ваше название на баннере «Скидки!». Всё упаковано в нейтральный интерфейс премиального сервиса.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "Живые деньги в кассе",
    text: "Горящее окно, которое раньше уходило в ноль, приносит от 2 500 до 5 000 ₽ за слот. При нескольких окнах в неделю — ощутимая сумма.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Новая аудитория",
    text: "Клиенты, которые приходят через нас, часто возвращаются уже по полной цене. Дополнительный приток без рекламного бюджета.",
  },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Подключаетесь", text: "Один клик через маркетплейс YCLIENTS. Мы синхронизируем расписание автоматически." },
  { step: "02", title: "Выбираете услуги", text: "Отмечаете, какие услуги участвуют в программе. Можно не все — только те, где чаще бывают окна." },
  { step: "03", title: "Окна продаются", text: "За 1–3 часа до свободного слота он появляется в Lovi со скидкой. Клиент бронирует и оплачивает онлайн." },
  { step: "04", title: "Вы зарабатываете", text: "Запись появляется в вашем расписании YCLIENTS. Никаких звонков, никакой лишней работы." },
]

const REQUIREMENTS = [
  "Активный аккаунт в YCLIENTS",
  "Услуги для участия в программе",
  "Онлайн-оплата (мы всё настроим)",
]

export default function Partners() {
  const isMobile = useIsMobile()
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [salon, setSalon]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!name || !phone || !salon) return
    setLoading(true)
    try {
      await fetch(`${API}/api/lovi/city-partner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'Москва', name, phone, salon_name: salon })
      })
      setSent(true)
    } finally { setLoading(false) }
  }

  const s = {
    page:    { background: 'var(--bg)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    section: { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' },
    label:   { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 12 },
    input:   { width: '100%', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 16px', fontSize: 14, outline: 'none', background: '#FDFCF9', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif', color: 'var(--dark)', transition: 'border-color 0.2s' },
  }

  return (
    <div style={s.page}>

      {/* Hero */}
      <div style={{ background: '#121A12', color: '#fff', padding: isMobile ? '60px 20px 56px' : '80px 40px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Для партнёров</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 32 : 52, fontWeight: 600, lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-0.02em', maxWidth: 680 }}>
            Ваши пустые кушетки<br />
            <span style={{ color: '#F97316' }}>могут приносить деньги</span>
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, margin: '0 0 40px' }}>
            «Лови» продаёт именно те часы, которые иначе просто сгорят — без вреда для вашей основной цены.
          </p>
          <a href="#form" style={{ display: 'inline-block', background: '#F97316', color: '#fff', textDecoration: 'none', padding: isMobile ? '14px 28px' : '16px 36px', borderRadius: 16, fontSize: 15, fontWeight: 600, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Хочу подключить салон →
          </a>
        </div>
      </div>

      {/* Проблема */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#F1F0EC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Проблема</div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 22 : 32, color: 'var(--dark)', lineHeight: 1.4, margin: 0, maxWidth: 700 }}>
            Сколько времени мастер сидит без дела? Этот час уже нельзя вернуть. Он сгорает безвозвратно.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, marginTop: 20, maxWidth: 620 }}>
            Когда салон раздаёт скидки на всё подряд, клиенты привыкают ждать распродаж. Вы теряете в деньгах, и бренд страдает. Мы работаем иначе.
          </p>
        </div>
      </div>

      {/* Преимущества */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Почему это работает</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24, marginTop: 24 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: isMobile ? '24px 22px' : '28px 28px' }}>
                <div style={{ color: 'var(--accent)', marginBottom: 14 }}>{b.icon}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 18 : 20, color: 'var(--dark)', marginBottom: 10, lineHeight: 1.3 }}>{b.title}</div>
                <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7 }}>{b.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Как это работает */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#121A12', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ ...s.label, color: 'rgba(255,255,255,0.3)' }}>Как это работает</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: isMobile ? 24 : 32, marginTop: 32 }}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i}>
                <div style={{ fontSize: 36, fontWeight: 700, color: 'rgba(249,115,22,0.3)', fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>{h.step}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{h.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{h.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Что нужно */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={s.label}>Что от вас потребуется</div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 22 : 28, color: 'var(--dark)', lineHeight: 1.4, margin: '0 0 24px' }}>
              Минимум усилий с вашей стороны
            </p>
            {REQUIREMENTS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: 'var(--dark)' }}>{r}</span>
              </div>
            ))}
            <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.7, marginTop: 20 }}>
              Вся техническая часть на нас. Первый месяц — тестовый. Если не увидите прироста — просто отключаетесь, никаких штрафов.
            </p>
          </div>

          {/* Метрика */}
          <div style={{ background: '#F1F0EC', borderRadius: 24, padding: isMobile ? '28px 24px' : '36px 36px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 20 }}>Наша метрика</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 28 : 36, color: 'var(--dark)', lineHeight: 1.2, marginBottom: 12 }}>
              Сколько рублей<br />добавленной выручки
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Не «трафик», не «лиды» — живые деньги в кассе за неделю.
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)' }}>2 500 ₽</div>
                <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4 }}>минимум за слот</div>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#F97316' }}>5 000 ₽</div>
                <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4 }}>максимум за слот</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Форма */}
      <div id="form" style={{ padding: isMobile ? '48px 20px 64px' : '72px 40px 88px', background: '#121A12' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ ...s.label, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Стать партнёром</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 26 : 34, color: '#fff', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.3 }}>
            Хочу подключить салон
          </h2>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto', display: 'block' }}>
                  <circle cx="28" cy="28" r="28" fill="rgba(249,115,22,0.12)"/>
                  <path d="M18 28l8 8 14-14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Заявка получена</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Мы свяжемся с вами в течение рабочего дня и покажем цифры вашего же салона.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input style={{ ...s.input, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input style={{ ...s.input, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                placeholder="Телефон" value={phone}
                onChange={e => {
                  let v = e.target.value.replace(/[^\d+]/g, '')
                  if (!v.startsWith('+7')) v = '+7' + v.replace(/^\+?7?/, '')
                  if (v.length > 12) v = v.slice(0, 12)
                  setPhone(v)
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input style={{ ...s.input, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                placeholder="Название салона" value={salon} onChange={e => setSalon(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button disabled={loading || !name || !phone || !salon} onClick={submit}
                style={{ background: (!name||!phone||!salon||loading) ? 'rgba(249,115,22,0.4)' : '#F97316', color: '#fff', border: 'none', padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4, fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
                {loading ? 'Отправляем...' : 'Отправить заявку'}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', margin: 0 }}>
                Мы свяжемся в течение рабочего дня
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}