import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'

const API = 'https://insalon.onrender.com'
const WHATSAPP = 'https://wa.me/79164470569'

function getToken() { return localStorage.getItem('lovi_token') }

function formatDate(dt) {
  return new Date(dt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(dt) {
  return new Date(dt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
function formatDuration(sec) {
  const m = Math.round(sec / 60)
  return m >= 60 ? `${Math.floor(m/60)} ч ${m%60 ? (m%60)+' мин' : ''}`.trim() : `${m} мин`
}
function isFuture(dt) { return new Date(dt) > new Date() }
function plural(n) { return n === 1 ? 'запись' : n < 5 ? 'записи' : 'записей' }

function useCountdown(dt) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const update = () => setLeft(Math.max(0, Math.floor((new Date(dt) - Date.now()) / 1000)))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [dt])
  const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60
  if (left <= 0) return { str: 'Сейчас', urgent: true }
  if (h > 24) { const d = Math.floor(h/24); return { str: `${d} ${d===1?'день':d<5?'дня':'дней'}`, urgent: false } }
  return { str: h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`, urgent: left < 3600 }
}

function BookingCode({ id }) {
  const code = `LV-${String(id).padStart(5,'0')}`
  const [copied, setCopied] = useState(false)
  function copy() { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div onClick={copy} style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(249,115,22,0.08)',border:'1px solid rgba(249,115,22,0.2)',borderRadius:10,padding:'8px 14px',cursor:'pointer' }}>
      <span style={{ fontFamily:'monospace',fontSize:16,fontWeight:700,color:'#F97316',letterSpacing:'0.08em' }}>{code}</span>
      <span style={{ fontSize:11,color:'#F97316',opacity:0.7 }}>{copied ? '✓ скопировано' : 'нажмите'}</span>
    </div>
  )
}

function Countdown({ dt }) {
  const { str, urgent } = useCountdown(dt)
  return (
    <div style={{ display:'flex',alignItems:'center',gap:6 }}>
      <span style={{ fontSize:11,color:'var(--secondary)' }}>через</span>
      <span style={{ fontFamily:'monospace',fontSize:13,fontWeight:500,color:urgent?'#F97316':'var(--secondary)' }}>{str}</span>
    </div>
  )
}

function StarRating({ value, onChange, label }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:4 }}>
      <span style={{ fontSize:11,color:'var(--secondary)' }}>{label}</span>
      <div style={{ display:'flex',gap:3 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            style={{ background:'none',border:'none',cursor:'pointer',fontSize:20,padding:0,lineHeight:1,color:n<=(hover||value)?'#F97316':'rgba(18,26,18,0.15)',transition:'color 0.15s' }}>★</button>
        ))}
      </div>
    </div>
  )
}

function ReviewForm({ booking, onSubmit }) {
  const [rPlace, setRPlace] = useState(booking.rating_place || 0)
  const [rMaster, setRMaster] = useState(booking.rating_master || 0)
  const [rService, setRService] = useState(booking.rating_service || 0)
  const [text, setText] = useState(booking.review_text || '')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(!!(booking.rating_place))
  if (done) return (
    <div style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 0' }}>
      <span style={{ color:'#F97316',fontSize:16 }}>★★★★★</span>
      <span style={{ fontSize:12,color:'var(--secondary)' }}>Спасибо за отзыв</span>
    </div>
  )
  async function submit() {
    if (!rPlace||!rMaster||!rService) return
    setLoading(true)
    try {
      await fetch(`${API}/api/auth/rate`, { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${getToken()}`}, body:JSON.stringify({booking_id:booking.id,rating_place:rPlace,rating_master:rMaster,rating_service:rService,review_text:text}) })
      setDone(true); onSubmit?.()
    } finally { setLoading(false) }
  }
  return (
    <div style={{ borderTop:'1px solid var(--border)',paddingTop:14,marginTop:4 }}>
      <p style={{ fontSize:12,color:'var(--secondary)',margin:'0 0 12px' }}>Оцените визит</p>
      <div style={{ display:'flex',gap:20,flexWrap:'wrap',marginBottom:12 }}>
        <StarRating label="Место" value={rPlace} onChange={setRPlace} />
        <StarRating label="Мастер" value={rMaster} onChange={setRMaster} />
        <StarRating label="Lovi" value={rService} onChange={setRService} />
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Комментарий (необязательно)..."
        style={{ width:'100%',boxSizing:'border-box',border:'1px solid var(--border)',borderRadius:10,padding:'10px 12px',fontSize:13,resize:'none',height:72,fontFamily:'Inter,sans-serif',color:'var(--dark)',background:'#FDFCF9',outline:'none' }} />
      <button onClick={submit} disabled={loading||!rPlace||!rMaster||!rService}
        style={{ marginTop:10,padding:'9px 20px',borderRadius:10,border:'none',background:(!rPlace||!rMaster||!rService)?'rgba(18,26,18,0.1)':'var(--dark)',color:(!rPlace||!rMaster||!rService)?'var(--secondary)':'#fff',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'Inter,sans-serif' }}>
        {loading ? 'Отправляем...' : 'Отправить отзыв'}
      </button>
    </div>
  )
}


// ─── InstallBanner — установка PWA ───────────────────────────────────────────
function InstallBanner() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('lovi_install_dismissed')) return
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
    const isAndroid = /Android/.test(ua)
    if (isIOS) { setPlatform('ios'); setShow(true) }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (isAndroid || !isIOS) { setPlatform('android'); setShow(true) }
    })
    window.addEventListener('appinstalled', () => setInstalled(true))
  }, [])

  function dismiss() {
    localStorage.setItem('lovi_install_dismissed', '1')
    setShow(false)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setShow(false)
  }

  if (!show || installed) return null

  return (
    <div style={{ marginTop:24,borderRadius:20,background:'#F1F0EC',border:'1px solid var(--border)',padding:'18px 20px',position:'relative' }}>
      <button onClick={dismiss} style={{ position:'absolute',top:14,right:14,background:'none',border:'none',cursor:'pointer',color:'var(--secondary)',fontSize:18,lineHeight:1,padding:2 }}>×</button>
      <div style={{ display:'flex',alignItems:'flex-start',gap:14 }}>
        <div style={{ width:44,height:44,borderRadius:12,flexShrink:0,background:'var(--dark)',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v13M7 9l5 6 5-6"/><path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
          </svg>
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:14,fontWeight:600,color:'var(--dark)',marginBottom:4 }}>Добавить Lovi на экран</div>
          {platform === 'ios' ? (
            <div style={{ fontSize:12,color:'var(--secondary)',lineHeight:1.6 }}>
              Нажмите <svg style={{ display:'inline',verticalAlign:'middle',margin:'0 2px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> в браузере → «На экран "Домой"»
            </div>
          ) : (
            <div style={{ fontSize:12,color:'var(--secondary)',lineHeight:1.6 }}>Быстрый доступ к горящим окошкам без браузера</div>
          )}
          {platform === 'android' && deferredPrompt && (
            <button onClick={install} style={{ marginTop:10,padding:'8px 16px',borderRadius:10,background:'var(--dark)',border:'none',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif' }}>Установить</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── BookingCard — приоритизированная подача данных ───────────────────────────
function BookingCard({ booking, defaultOpen = false, isNearest = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const future = isFuture(booking.datetime)
  const savings = booking.base_price && booking.total_price ? booking.base_price - booking.total_price : 0
  const statusMap = {
    paid:      { bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.2)',  color:'#16A34A', label:'Оплачено' },
    confirmed: { bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.2)',  color:'#16A34A', label:'Подтверждено' },
    cancelled: { bg:'rgba(18,26,18,0.06)',   border:'var(--border)',         color:'var(--secondary)', label:'Отменено' },
    completed: { bg:'rgba(18,26,18,0.04)',   border:'var(--border)',         color:'var(--secondary)', label:'Завершено' },
  }
  const sc = statusMap[booking.status] || statusMap.confirmed

  return (
    <div style={{ border:`1px solid ${open?'rgba(18,26,18,0.12)':'var(--border)'}`,borderRadius:16,background:open?'#fff':'transparent',transition:'all 0.2s',overflow:'hidden' }}>
      {/* Шапка */}
      <div onClick={() => setOpen(v => !v)} style={{ padding:'16px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:14 }}>
        <div style={{ minWidth:48,textAlign:'center',background:future&&isNearest?'var(--dark)':'rgba(18,26,18,0.06)',borderRadius:12,padding:'8px 6px',flexShrink:0 }}>
          <div style={{ fontSize:18,fontWeight:700,color:future&&isNearest?'#fff':'var(--secondary)',fontFamily:'Playfair Display,serif',lineHeight:1 }}>{new Date(booking.datetime).getDate()}</div>
          <div style={{ fontSize:10,color:future&&isNearest?'rgba(255,255,255,0.6)':'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:2 }}>{new Date(booking.datetime).toLocaleDateString('ru-RU',{month:'short'})}</div>
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:14,fontWeight:600,color:'var(--dark)',marginBottom:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{booking.service_title}</div>
          <div style={{ fontSize:12,color:'var(--secondary)' }}>{formatTime(booking.datetime)} · {formatDuration(booking.duration)} · {booking.master_name||'Мастер'}</div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0 }}>
          {future ? <Countdown dt={booking.datetime} /> : (booking.status!=='cancelled'&&savings>0) && <span style={{ fontSize:12,color:'#16A34A',fontWeight:600 }}>сэкономили {savings.toLocaleString()} ₽</span>}
          <span style={{ fontSize:11,padding:'2px 8px',borderRadius:6,background:sc.bg,border:`1px solid ${sc.border}`,color:sc.color }}>{sc.label}</span>
        </div>
        <span style={{ fontSize:12,color:'var(--secondary)',marginLeft:4,transform:open?'rotate(180deg)':'none',transition:'transform 0.2s' }}>▾</span>
      </div>

      {/* Раскрытое тело */}
      {open && (
        <div style={{ padding:'0 20px 20px',borderTop:'1px solid var(--border)' }}>
          <div style={{ paddingTop:16,display:'flex',flexDirection:'column',gap:16 }}>

            {/* Приоритет 1: для предстоящих — дата+время + код */}
            {future && booking.status!=='cancelled' && (
              <div style={{ background:'#F8F7F4',borderRadius:14,padding:'16px' }}>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4 }}>Дата</div>
                    <div style={{ fontSize:15,fontWeight:700,color:'var(--dark)' }}>{formatDate(booking.datetime)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4 }}>Время</div>
                    <div style={{ fontSize:15,fontWeight:700,color:'var(--dark)' }}>{formatTime(booking.datetime)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4 }}>Длительность</div>
                    <div style={{ fontSize:15,fontWeight:700,color:'var(--dark)' }}>{formatDuration(booking.duration)}</div>
                  </div>
                </div>
                <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>Код для чекина — назовите администратору</div>
                <BookingCode id={booking.id} />
              </div>
            )}

            {/* Для завершённых — компактная сетка */}
            {!future && (
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10 }}>
                {[
                  ['Дата', formatDate(booking.datetime)],
                  ['Время', formatTime(booking.datetime)],
                  ['Длительность', formatDuration(booking.duration)],
                  ['Итого', `${booking.total_price?.toLocaleString()} ₽`],
                  booking.base_price ? ['Цена в салоне', `${booking.base_price?.toLocaleString()} ₽`] : null,
                  booking.discount_pct ? ['Скидка', `${booking.discount_pct}%`] : null,
                ].filter(Boolean).map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:14,fontWeight:500,color:'var(--dark)' }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Приоритет 2: финансы для предстоящих */}
            {future && booking.status!=='cancelled' && (
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10 }}>
                {[
                  ['Итого', `${booking.total_price?.toLocaleString()} ₽`],
                  booking.base_price ? ['Цена в салоне', `${booking.base_price?.toLocaleString()} ₽`] : null,
                  booking.discount_pct ? ['Скидка Lovi', `−${booking.discount_pct}%`] : null,
                ].filter(Boolean).map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:14,fontWeight:600,color: label==='Скидка Lovi'?'#16A34A':'var(--dark)' }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Адрес */}
            <div style={{ fontSize:13,color:'var(--secondary)',display:'flex',gap:6,alignItems:'flex-start' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink:0,marginTop:1 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Head Spa Beauty · ул. Миклухо-Маклая 37 · 5 мин от м. Беляево</span>
            </div>

            {/* Кнопка переноса */}
            {future && booking.status!=='cancelled' && (
              <a href={`${WHATSAPP}?text=Хочу перенести или отменить запись ${String(booking.id).padStart(5,'0')} на ${formatDate(booking.datetime)} ${formatTime(booking.datetime)}`}
                target="_blank" rel="noreferrer"
                style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',borderRadius:12,border:'1px solid var(--border)',fontSize:13,fontWeight:500,color:'var(--dark)',textDecoration:'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Отменить или перенести
              </a>
            )}

            {/* Отзыв */}
            {!future && booking.status!=='cancelled' && <ReviewForm booking={booking} />}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Safety FAQ ───────────────────────────────────────────────────────────────
function ProblemFAQ() {
  const items = [
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, q: 'Салон закрыт', a: 'Заморозим выплату салону и вернём деньги в течение 24 часов.' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, q: 'Просят ждать', a: 'Вы не обязаны ждать более 10 минут. Зафиксируем нарушение.' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, q: 'Двойная бронь', a: 'Покажите код чекина. Вернём деньги и начислим бонусы.' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, q: 'Плохой сервис', a: 'Оставьте отзыв — это влияет на рейтинг салона в Lovi.' },
  ]
  return (
    <div style={{ marginTop:40,background:'#F1F0EC',borderRadius:24,padding:'24px' }}>
      <div style={{ background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.12)',borderRadius:16,padding:'16px 20px',marginBottom:16,display:'flex',alignItems:'flex-start',gap:14 }}>
        <div style={{ width:36,height:36,borderRadius:10,background:'rgba(239,68,68,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <div style={{ fontSize:14,fontWeight:700,color:'var(--dark)',marginBottom:4 }}>Центр безопасности и гарантий</div>
          <div style={{ fontSize:12,color:'var(--secondary)',lineHeight:1.6 }}>Деньги удерживаются платформой и не передаются салону до подтверждения визита. Вы защищены в любой ситуации.</div>
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
        {items.map((item,i) => (
          <div key={i} style={{ background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'14px' }}>
            <div style={{ marginBottom:8,color:'var(--secondary)' }}>{item.icon}</div>
            <div style={{ fontSize:13,fontWeight:600,color:'var(--dark)',marginBottom:4 }}>{item.q}</div>
            <div style={{ fontSize:12,color:'var(--secondary)',lineHeight:1.5,marginBottom:10 }}>{item.a}</div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ fontSize:11,fontWeight:600,color:'#25D366',textDecoration:'none' }}>WhatsApp →</a>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyBookings({ user, onUserChange }) {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/auth/my-bookings`, { headers:{ Authorization:`Bearer ${getToken()}` } })
        const data = await res.json()
        setBookings(data.bookings || [])
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  const upcoming = bookings.filter(b => isFuture(b.datetime) && b.status!=='cancelled').sort((a,b) => new Date(a.datetime)-new Date(b.datetime))
  const history  = bookings.filter(b => !isFuture(b.datetime) || b.status==='cancelled').sort((a,b) => new Date(b.datetime)-new Date(a.datetime))
  const totalSavings = bookings.reduce((sum,b) => sum+(b.base_price&&b.total_price?b.base_price-b.total_price:0), 0)

  function goUpcoming() { setTab('upcoming'); setTimeout(() => document.getElementById('bookings-list')?.scrollIntoView({ behavior:'smooth' }), 50) }

  return (
    <div style={{ background:'var(--bg)',minHeight:'100vh' }}>
      <Nav user={user} onUserChange={onUserChange} />
      <div style={{ maxWidth:960,margin:'0 auto',padding:'24px 16px 80px' }}>

        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontFamily:'Playfair Display,serif',fontSize:28,fontWeight:700,color:'var(--dark)',margin:0 }}>Мои брони</h1>
        </div>

        {/* Bento — одна строка из трёх плашек */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:28 }}>

          {/* 1. Следующий визит — первый, кликабельный */}
          <div
            onClick={goUpcoming}
            style={{ background:'#F1F0EC',borderRadius:20,padding:'18px 20px',display:'flex',flexDirection:'column',gap:4,cursor:upcoming.length>0?'pointer':'default',transition:'background 0.15s' }}
            onMouseEnter={e => { if(upcoming.length>0) e.currentTarget.style.background='#E8E6DE' }}
            onMouseLeave={e => e.currentTarget.style.background='#F1F0EC'}
          >
            <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.12em' }}>Следующий визит</div>
            {upcoming.length>0 ? (
              <>
                <div style={{ fontSize:22,fontWeight:700,color:'var(--dark)',fontFamily:'Playfair Display,serif',lineHeight:1,marginTop:4 }}>
                  {new Date(upcoming[0].datetime).toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}
                </div>
                <div style={{ fontSize:11,color:'var(--secondary)',marginTop:2 }}>{upcoming[0].service_title.split('(')[0].trim()} →</div>
              </>
            ) : (
              <div style={{ fontSize:13,color:'var(--secondary)',marginTop:4 }}>Нет записей</div>
            )}
          </div>

          {/* 2. Экономия */}
          <div style={{ background:'#F1F0EC',borderRadius:20,padding:'18px 20px',display:'flex',flexDirection:'column',gap:4 }}>
            <div style={{ fontSize:10,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.12em' }}>Ваша экономия</div>
            <div style={{ fontSize:22,fontWeight:700,color:'var(--dark)',fontFamily:'Playfair Display,serif',lineHeight:1,marginTop:4 }}>
              {totalSavings>0?`${totalSavings.toLocaleString()} ₽`:'0 ₽'}
            </div>
            <div style={{ fontSize:11,color:'var(--secondary)',marginTop:2 }}>за {bookings.length} {plural(bookings.length)}</div>
          </div>

          {/* 3. Lovi Pass — градиент как Private Beta */}
          <div style={{
            borderRadius:20,padding:'18px 20px',display:'flex',flexDirection:'column',justifyContent:'space-between',gap:12,
            background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            position:'relative',overflow:'hidden',
          }}>
            {/* Блик */}
            <div style={{ position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:'rgba(249,115,22,0.15)',filter:'blur(20px)',pointerEvents:'none' }} />
            <div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:4 }}>Lovi Pass</div>
              <div style={{ fontSize:14,fontWeight:600,color:'#fff',lineHeight:1.3 }}>Единый абонемент</div>
            </div>
            <div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:4 }}>15 000 ₽</div>
              <button style={{ background:'#F97316',border:'none',borderRadius:8,padding:'7px 10px',fontSize:11,fontWeight:600,color:'#fff',cursor:'pointer',fontFamily:'Inter,sans-serif' }}>
                Активировать
              </button>
            </div>
          </div>

        </div>

        {/* Табы */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',background:'#F1F0EC',borderRadius:14,padding:4,marginBottom:20 }}>
          {[['upcoming',`Предстоящие${upcoming.length?` · ${upcoming.length}`:''}`],['history','История']].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding:'9px',borderRadius:10,fontSize:13,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'Inter,sans-serif',background:tab===id?'#fff':'transparent',color:tab===id?'var(--dark)':'var(--secondary)',boxShadow:tab===id?'0 1px 4px rgba(18,26,18,0.08)':'none',transition:'all 0.2s' }}>{label}</button>
          ))}
        </div>

        {/* Контент */}
        <div id="bookings-list">
        {loading ? (
          <div style={{ textAlign:'center',padding:'48px 0',color:'var(--secondary)',fontSize:14 }}>Загружаем брони...</div>
        ) : tab==='upcoming' ? (
          upcoming.length===0 ? (
            <div style={{ padding:'32px 0' }}>
              <div style={{ background:'var(--dark)',borderRadius:20,padding:'24px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:6 }}>Сегодня пользователи Lovi уже сэкономили</div>
                  <div style={{ fontSize:28,fontWeight:700,color:'#fff',fontFamily:'Playfair Display,serif' }}>6 400 ₽</div>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:4 }}>Присоединяйтесь — горящие окошки ждут</div>
                </div>
                <div style={{ fontSize:40 }}>🔥</div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10 }}>
                <a href="/" style={{ display:'flex',flexDirection:'column',gap:4,padding:'16px',borderRadius:16,background:'#F1F0EC',textDecoration:'none',border:'1px solid var(--border)' }}>
                  <span style={{ fontSize:20 }}>💆</span>
                  <span style={{ fontSize:13,fontWeight:600,color:'var(--dark)' }}>Массаж рядом</span>
                  <span style={{ fontSize:11,color:'var(--secondary)' }}>Горящие окошки</span>
                </a>
                <a href="/" style={{ display:'flex',flexDirection:'column',gap:4,padding:'16px',borderRadius:16,background:'#F1F0EC',textDecoration:'none',border:'1px solid var(--border)' }}>
                  <span style={{ fontSize:20 }}>✨</span>
                  <span style={{ fontSize:13,fontWeight:600,color:'var(--dark)' }}>Head SPA</span>
                  <span style={{ fontSize:11,color:'var(--secondary)' }}>Премиум со скидкой</span>
                </a>
              </div>
              <a href="/" style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px',borderRadius:14,background:'var(--dark)',color:'#fff',textDecoration:'none',fontSize:14,fontWeight:600,fontFamily:'Inter,sans-serif' }}>
                Смотреть все горящие окошки →
              </a>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {upcoming.map((b,i) => <BookingCard key={b.id} booking={b} defaultOpen={i===0} isNearest={i===0} />)}
            </div>
          )
        ) : (
          history.length===0 ? (
            <div style={{ textAlign:'center',padding:'48px 16px' }}>
              <div style={{ fontSize:32,marginBottom:12 }}>📋</div>
              <div style={{ fontSize:16,fontWeight:600,color:'var(--dark)',marginBottom:6 }}>История пуста</div>
              <div style={{ fontSize:13,color:'var(--secondary)' }}>Завершённые визиты появятся здесь</div>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {history.map(b => <BookingCard key={b.id} booking={b} />)}
              {/* Retention блок */}
              <div style={{ marginTop:6,borderRadius:20,padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,background:'linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:-20,right:60,width:100,height:100,borderRadius:'50%',background:'rgba(249,115,22,0.1)',filter:'blur(24px)',pointerEvents:'none' }} />
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:'#fff',marginBottom:4 }}>Хотите снова?</div>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5 }}>Узнайте какую скидку можно получить<br/>на ближайшее окошко</div>
                </div>
                <a href="/" style={{ flexShrink:0,background:'#F97316',border:'none',borderRadius:10,padding:'10px 18px',fontSize:13,fontWeight:600,color:'#fff',textDecoration:'none',whiteSpace:'nowrap' }}>
                  Смотреть →
                </a>
              </div>
            </div>
          )
        )}
        </div>

        <InstallBanner />
        <ProblemFAQ />

      </div>
    </div>
  )
}