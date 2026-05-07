import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

const CITIES = [
  {"name":"Москва","moscow_area":true,"lat":55.7558,"lon":37.6173},
  {"name":"Зеленоград","moscow_area":true,"lat":55.9833,"lon":37.1833},
  {"name":"Балашиха","moscow_area":true,"lat":55.7964,"lon":37.9378},
  {"name":"Подольск","moscow_area":true,"lat":55.4311,"lon":37.5444},
  {"name":"Химки","moscow_area":true,"lat":55.8887,"lon":37.4297},
  {"name":"Мытищи","moscow_area":true,"lat":55.9109,"lon":37.7306},
  {"name":"Люберцы","moscow_area":true,"lat":55.6786,"lon":37.8958},
  {"name":"Королёв","moscow_area":true,"lat":55.9167,"lon":37.8333},
  {"name":"Красногорск","moscow_area":true,"lat":55.8222,"lon":37.3306},
  {"name":"Одинцово","moscow_area":true,"lat":55.6778,"lon":37.2806},
  {"name":"Домодедово","moscow_area":true,"lat":55.4417,"lon":37.7667},
  {"name":"Электросталь","moscow_area":true,"lat":55.7833,"lon":38.4500},
  {"name":"Серпухов","moscow_area":true,"lat":54.9167,"lon":37.4167},
  {"name":"Щёлково","moscow_area":true,"lat":55.9167,"lon":38.0167},
  {"name":"Коломна","moscow_area":true,"lat":55.0833,"lon":38.7667},
  {"name":"Долгопрудный","moscow_area":true,"lat":55.9333,"lon":37.5000},
  {"name":"Пушкино","moscow_area":true,"lat":56.0167,"lon":37.8500},
  {"name":"Раменское","moscow_area":true,"lat":55.5667,"lon":38.2333},
  {"name":"Реутов","moscow_area":true,"lat":55.7606,"lon":37.8594},
  {"name":"Жуковский","moscow_area":true,"lat":55.5958,"lon":38.1167},
  {"name":"Ногинск","moscow_area":true,"lat":55.8500,"lon":38.4500},
  {"name":"Орехово-Зуево","moscow_area":true,"lat":55.8000,"lon":38.9833},
  {"name":"Видное","moscow_area":true,"lat":55.5500,"lon":37.7000},
  {"name":"Санкт-Петербург","moscow_area":false,"lat":59.9343,"lon":30.3351},
  {"name":"Новосибирск","moscow_area":false,"lat":54.9884,"lon":82.9879},
  {"name":"Екатеринбург","moscow_area":false,"lat":56.8389,"lon":60.6057},
  {"name":"Казань","moscow_area":false,"lat":55.8304,"lon":49.0661},
  {"name":"Красноярск","moscow_area":false,"lat":56.0153,"lon":92.8932},
  {"name":"Нижний Новгород","moscow_area":false,"lat":56.2965,"lon":43.9361},
  {"name":"Челябинск","moscow_area":false,"lat":55.1644,"lon":61.4368},
  {"name":"Уфа","moscow_area":false,"lat":54.7388,"lon":55.9721},
  {"name":"Краснодар","moscow_area":false,"lat":45.0328,"lon":38.9769},
  {"name":"Самара","moscow_area":false,"lat":53.2028,"lon":50.1408},
  {"name":"Ростов-на-Дону","moscow_area":false,"lat":47.2357,"lon":39.7015},
  {"name":"Омск","moscow_area":false,"lat":54.9885,"lon":73.3242},
  {"name":"Воронеж","moscow_area":false,"lat":51.6720,"lon":39.1843},
  {"name":"Пермь","moscow_area":false,"lat":58.0105,"lon":56.2502},
  {"name":"Волгоград","moscow_area":false,"lat":48.7080,"lon":44.5133},
  {"name":"Саратов","moscow_area":false,"lat":51.5924,"lon":46.0291},
  {"name":"Тюмень","moscow_area":false,"lat":57.1553,"lon":65.5412},
  {"name":"Тольятти","moscow_area":false,"lat":53.5303,"lon":49.3461},
  {"name":"Барнаул","moscow_area":false,"lat":53.3606,"lon":83.7636},
  {"name":"Ижевск","moscow_area":false,"lat":56.8527,"lon":53.2114},
  {"name":"Хабаровск","moscow_area":false,"lat":48.4827,"lon":135.0840},
  {"name":"Иркутск","moscow_area":false,"lat":52.2978,"lon":104.2964},
  {"name":"Владивосток","moscow_area":false,"lat":43.1155,"lon":131.8855},
  {"name":"Ярославль","moscow_area":false,"lat":57.6261,"lon":39.8845},
  {"name":"Ставрополь","moscow_area":false,"lat":45.0440,"lon":41.9690},
  {"name":"Калининград","moscow_area":false,"lat":54.7104,"lon":20.4522},
  {"name":"Пенза","moscow_area":false,"lat":53.2007,"lon":44.9977},
]

const MOSCOW_CITIES = CITIES.filter(c => c.moscow_area)
const OTHER_CITIES  = CITIES.filter(c => !c.moscow_area)

// ─── Auth helpers ──────────────────────────────────────────────────────────────

function getStoredUser() {
  try {
    const raw = localStorage.getItem('lovi_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function storeUser(user, token) {
  localStorage.setItem('lovi_user', JSON.stringify(user))
  localStorage.setItem('lovi_token', token)
}

function clearUser() {
  localStorage.removeItem('lovi_user')
  localStorage.removeItem('lovi_token')
}

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}

// ─── ForgotModal ───────────────────────────────────────────────────────────────

function ForgotModal({ onClose, onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 50)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handle) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function submit() {
    if (!email) return
    setLoading(true); setError('')
    try {
      await fetch('https://insalon.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch { setError('Ошибка соединения') } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 12,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    background: '#FDFCF9', boxSizing: 'border-box',
    fontFamily: 'Inter,sans-serif', color: 'var(--dark)', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1100,background:'rgba(18,26,18,0.4)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
      <style>{`@keyframes authFadeUp{from{transform:scale(0.96) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>
      <div ref={ref} style={{ background:'#fff',borderRadius:24,padding:'32px',width:'100%',maxWidth:400,boxShadow:'0 32px 80px rgba(18,26,18,0.14)',animation:'authFadeUp 0.28s cubic-bezier(0.2,1,0.2,1) both' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
          <img src="/logo.svg" alt="LOVI" style={{ height:22 }} />
          <button onClick={onClose} style={{ background:'rgba(18,26,18,0.06)',border:'none',cursor:'pointer',width:32,height:32,borderRadius:'50%',fontSize:16,color:'var(--secondary)',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign:'center',padding:'16px 0' }}>
            <div style={{ marginBottom:16,display:'flex',justifyContent:'center' }}>
              <div style={{ width:48,height:48,borderRadius:14,background:'rgba(18,26,18,0.06)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--dark)" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
            </div>
            <div style={{ fontSize:16,fontWeight:700,color:'var(--dark)',marginBottom:8 }}>Письмо отправлено</div>
            <div style={{ fontSize:13,color:'var(--secondary)',lineHeight:1.6,marginBottom:24 }}>Проверьте почту — ссылка действительна 2 часа.</div>
            <button onClick={onClose} style={{ width:'100%',background:'var(--dark)',color:'#fff',border:'none',padding:'14px',borderRadius:14,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif' }}>Закрыть</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:18,fontWeight:700,color:'var(--dark)',marginBottom:6,fontFamily:'Playfair Display,serif' }}>Забыли пароль?</div>
              <div style={{ fontSize:13,color:'var(--secondary)',lineHeight:1.5 }}>Введите email — пришлём ссылку для сброса.</div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              <input style={inputStyle} type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key==='Enter' && submit()}
                onFocus={e => e.target.style.borderColor='var(--dark)'}
                onBlur={e => e.target.style.borderColor='var(--border)'}
              />
              {error && <div style={{ background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#DC2626' }}>{error}</div>}
              <button onClick={submit} disabled={loading||!email}
                style={{ width:'100%',background:(!email||loading)?'rgba(18,26,18,0.4)':'var(--dark)',color:'#fff',border:'none',padding:'14px',borderRadius:14,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',transition:'background 0.2s' }}>
                {loading ? 'Отправляем...' : 'Отправить ссылку'}
              </button>
              <button onClick={onBack}
                style={{ background:'transparent',border:'none',fontSize:12,color:'var(--secondary)',cursor:'pointer',fontFamily:'Inter,sans-serif',textAlign:'center' }}>
                ← Вернуться ко входу
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── AuthModal ─────────────────────────────────────────────────────────────────

function AuthModal({ onClose, onLogin }) {
  const isMobile = useIsMobile()
  const [tab, setTab]           = useState('login')
  const [forgotOpen, setForgotOpen] = useState(false)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) { if (forgotOpen) return; if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [forgotOpen])

  useEffect(() => {
    function handle(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function switchTab(t) {
    setTab(t); setError('')
    setName(''); setEmail(''); setPassword('')
  }

  async function handleSubmit() {
    setError('')
    if (!email || !password) { setError('Заполните все поля'); return }
    if (tab === 'register' && !name.trim()) { setError('Введите имя'); return }
    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = tab === 'login' ? { email, password } : { name: name.trim(), email, password }
      const res = await fetch(`https://insalon.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Ошибка сервера'); return }
      storeUser(data.user, data.token)
      onLogin(data.user)
      onClose()
    } catch { setError('Нет соединения с сервером') } finally { setLoading(false) }
  }

  function handleKey(e) { if (e.key === 'Enter') handleSubmit() }

  const inputStyle = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 12,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    background: '#FDFCF9', boxSizing: 'border-box',
    fontFamily: 'Inter,sans-serif', color: 'var(--dark)', transition: 'border-color 0.2s',
  }

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(18,26,18,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 16,
      }}>
        <style>{`
          @keyframes authSlideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
          @keyframes authFadeUp  { from{transform:scale(0.96) translateY(8px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        `}</style>

        <div ref={ref} style={{
          background: '#fff',
          borderRadius: isMobile ? '24px 24px 0 0' : 24,
          padding: '32px',
          width: '100%',
          maxWidth: isMobile ? '100%' : 400,
          boxShadow: '0 32px 80px rgba(18,26,18,0.14)',
          animation: isMobile ? 'authSlideUp 0.32s cubic-bezier(0.2,1,0.2,1) both' : 'authFadeUp 0.28s cubic-bezier(0.2,1,0.2,1) both',
        }}>
          {isMobile && (
            <div style={{ display:'flex',justifyContent:'center',marginBottom:20 }}>
              <div style={{ width:36,height:4,borderRadius:2,background:'var(--border)' }} />
            </div>
          )}

          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
            <img src="/logo.svg" alt="LOVI" style={{ height:22 }} />
            <button onClick={onClose} style={{ background:'rgba(18,26,18,0.06)',border:'none',cursor:'pointer',width:32,height:32,borderRadius:'50%',fontSize:16,color:'var(--secondary)',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',background:'#F1F0EC',borderRadius:12,padding:4,marginBottom:24 }}>
            {[['login','Войти'],['register','Регистрация']].map(([id,label]) => (
              <button key={id} onClick={() => switchTab(id)} style={{
                padding:'8px',borderRadius:9,fontSize:13,fontWeight:500,
                border:'none',cursor:'pointer',fontFamily:'Inter,sans-serif',
                background:tab===id?'#fff':'transparent',
                color:tab===id?'var(--dark)':'var(--secondary)',
                boxShadow:tab===id?'0 1px 4px rgba(18,26,18,0.08)':'none',
                transition:'all 0.2s',
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {tab === 'register' && (
              <input style={inputStyle} type="text" placeholder="Ваше имя"
                value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey}
                onFocus={e => e.target.style.borderColor='var(--dark)'}
                onBlur={e => e.target.style.borderColor='var(--border)'}
              />
            )}
            <input style={inputStyle} type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey}
              onFocus={e => e.target.style.borderColor='var(--dark)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />
            <input style={inputStyle} type="password"
              placeholder={tab==='login'?'Пароль':'Придумайте пароль'}
              value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}
              onFocus={e => e.target.style.borderColor='var(--dark)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />

            {error && (
              <div style={{ background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#DC2626' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width:'100%',background:loading?'rgba(18,26,18,0.4)':'var(--dark)',color:'#fff',border:'none',padding:'14px',borderRadius:14,fontSize:14,fontWeight:600,cursor:loading?'default':'pointer',marginTop:4,fontFamily:'Inter,sans-serif',transition:'background 0.2s' }}>
              {loading ? '...' : tab==='login' ? 'Войти' : 'Создать аккаунт'}
            </button>

            {tab === 'login' && (
              <button onClick={() => setForgotOpen(true)}
                style={{ background:'transparent',border:'none',fontSize:12,color:'var(--secondary)',cursor:'pointer',fontFamily:'Inter,sans-serif',textAlign:'center',marginTop:4 }}>
                Забыли пароль?
              </button>
            )}

            {tab === 'register' && (
              <p style={{ fontSize:11,color:'var(--secondary)',textAlign:'center',margin:0,lineHeight:1.6 }}>
                Регистрируясь, вы соглашаетесь с{' '}
                <span style={{ color:'var(--dark)',textDecoration:'underline',cursor:'pointer' }}>условиями</span>
                {' '}и{' '}
                <span style={{ color:'var(--dark)',textDecoration:'underline',cursor:'pointer' }}>политикой</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ForgotModal поверх AuthModal */}
      {forgotOpen && (
        <ForgotModal
          onClose={() => { setForgotOpen(false); onClose() }}
          onBack={() => setForgotOpen(false)}
        />
      )}
    </>
  )
}

// ─── UserDropdown ──────────────────────────────────────────────────────────────

function UserDropdown({ user, onClose, onLogout, onNavigate }) {
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 50)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handle) }
  }, [])

  const itemStyle = {
    display:'block',width:'100%',textAlign:'left',
    padding:'10px 16px',fontSize:13,fontFamily:'Inter,sans-serif',
    border:'none',background:'transparent',cursor:'pointer',
    color:'var(--dark)',borderRadius:8,transition:'background 0.15s',
  }

  return (
    <div ref={ref} style={{
      position:'absolute',top:'calc(100% + 8px)',right:0,
      background:'#fff',borderRadius:16,minWidth:200,
      boxShadow:'0 8px 32px rgba(18,26,18,0.12)',
      border:'1px solid var(--border)',padding:'8px',
      animation:'authFadeUp 0.2s ease both',zIndex:200,
    }}>
      <style>{`@keyframes authFadeUp{from{transform:scale(0.96) translateY(4px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>

      <div style={{ padding:'8px 16px 12px',borderBottom:'1px solid var(--border)',marginBottom:6 }}>
        <div style={{ fontSize:14,fontWeight:600,color:'var(--dark)' }}>{user.name}</div>
        <div style={{ fontSize:12,color:'var(--secondary)',marginTop:2 }}>{user.email}</div>
      </div>

      <button style={itemStyle}
        onMouseEnter={e => e.currentTarget.style.background='rgba(18,26,18,0.04)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}
        onClick={() => { onClose(); onNavigate('/my-bookings') }}>
        📋 Мои брони
      </button>

      <button style={{ ...itemStyle,color:'#DC2626',marginTop:4,borderTop:'1px solid var(--border)',paddingTop:14 }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(220,38,38,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}
        onClick={onLogout}>
        Выйти
      </button>
    </div>
  )
}

// ─── CityModal ─────────────────────────────────────────────────────────────────

function CityModal({ currentCity, onSelect, onClose }) {
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [locating, setLocating] = useState(false)
  const overlayRef = useRef(null)
  const searchRef = useRef(null)

  function handleOverlay(e) { if (e.target === overlayRef.current) onClose() }

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
    const t = setTimeout(() => searchRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  function detectLocation() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        let closest = CITIES[0], minDist = Infinity
        CITIES.forEach(c => {
          const d = Math.sqrt(Math.pow(c.lat-latitude,2)+Math.pow(c.lon-longitude,2))
          if (d < minDist) { minDist = d; closest = c }
        })
        onSelect(closest.name)
      },
      () => setLocating(false)
    )
  }

  const filteredOther  = search.trim() ? OTHER_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : OTHER_CITIES
  const filteredMoscow = search.trim() ? MOSCOW_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : MOSCOW_CITIES
  const showMoscowSection = filteredMoscow.length > 0
  const showOtherSection  = filteredOther.length > 0

  return (
    <div ref={overlayRef} onClick={handleOverlay} style={{
      position:'fixed',inset:0,zIndex:1000,
      background:'rgba(18,26,18,0.45)',backdropFilter:'blur(4px)',
      display:'flex',alignItems:isMobile?'flex-end':'center',justifyContent:'center',
    }}>
      <style>{`
        @keyframes citySlideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes cityFadeIn  { from{transform:scale(0.96);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      <div style={{
        background:'#fff',
        borderRadius:isMobile?'24px 24px 0 0':24,
        width:isMobile?'100%':480,
        maxHeight:isMobile?'88dvh':'80vh',
        display:'flex',flexDirection:'column',
        boxShadow:'0 32px 80px rgba(18,26,18,0.16)',
        animation:isMobile?'citySlideUp 0.32s cubic-bezier(0.2,1,0.2,1) both':'cityFadeIn 0.28s cubic-bezier(0.2,1,0.2,1) both',
        overflow:'hidden',
      }}>
        {isMobile && (
          <div style={{ display:'flex',justifyContent:'center',padding:'12px 0 0' }}>
            <div style={{ width:36,height:4,borderRadius:2,background:'var(--border)' }} />
          </div>
        )}

        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'16px 20px 12px':'24px 24px 16px',flexShrink:0 }}>
          <div>
            <div style={{ fontSize:18,fontWeight:600,color:'var(--dark)',fontFamily:'Playfair Display,serif' }}>Выберите город</div>
            <div style={{ fontSize:12,color:'var(--secondary)',marginTop:2 }}>Показываем горящие окошки рядом с вами</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(18,26,18,0.06)',border:'none',cursor:'pointer',width:32,height:32,borderRadius:'50%',fontSize:16,color:'var(--secondary)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>✕</button>
        </div>

        <div style={{ padding:'0 20px 16px',flexShrink:0 }}>
          <button onClick={detectLocation} disabled={locating} style={{
            width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            background:'var(--dark)',color:'#fff',border:'none',padding:'11px',borderRadius:14,
            fontSize:13,fontWeight:500,cursor:locating?'default':'pointer',opacity:locating?0.6:1,
            fontFamily:'Inter,sans-serif',marginBottom:12,transition:'opacity 0.2s',
          }}>
            {locating ? '⏳ Определяем...' : '📍 Определить моё местоположение'}
          </button>

          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:14,opacity:0.4,pointerEvents:'none' }}>🔍</span>
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск города..."
              style={{ width:'100%',border:'1px solid var(--border)',borderRadius:12,padding:'10px 12px 10px 34px',fontSize:13,outline:'none',background:'#FDFCF9',boxSizing:'border-box',fontFamily:'Inter,sans-serif',color:'var(--dark)',transition:'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor='var(--dark)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />
          </div>
        </div>

        <div style={{ overflowY:'auto',flex:1,padding:'0 20px 24px' }}>
          {showMoscowSection && (
            <>
              <div style={{ fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--secondary)',marginBottom:10 }}>Москва и область</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:20 }}>
                {filteredMoscow.map(c => (
                  <button key={c.name} onClick={() => onSelect(c.name)} style={{
                    padding:'6px 14px',borderRadius:20,fontSize:13,cursor:'pointer',
                    border:'1px solid var(--border)',fontFamily:'Inter,sans-serif',
                    background:currentCity===c.name?'var(--dark)':'transparent',
                    color:currentCity===c.name?'#fff':'var(--dark)',
                    fontWeight:currentCity===c.name?500:400,transition:'all 0.15s',
                  }}>{c.name}</button>
                ))}
              </div>
            </>
          )}

          {showMoscowSection && showOtherSection && (
            <div style={{ height:1,background:'var(--border)',marginBottom:20 }} />
          )}

          {showOtherSection && (
            <>
              <div style={{ fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--secondary)',marginBottom:10 }}>Другие города</div>
              <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
                {filteredOther.map(c => (
                  <button key={c.name} onClick={() => onSelect(c.name)} style={{
                    textAlign:'left',padding:'10px 12px',borderRadius:10,fontSize:14,
                    border:'none',cursor:'pointer',fontFamily:'Inter,sans-serif',
                    background:currentCity===c.name?'rgba(18,26,18,0.06)':'transparent',
                    color:'var(--dark)',fontWeight:currentCity===c.name?500:400,
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    transition:'background 0.15s',
                  }}
                    onMouseEnter={e => { if(currentCity!==c.name) e.currentTarget.style.background='rgba(18,26,18,0.04)' }}
                    onMouseLeave={e => { if(currentCity!==c.name) e.currentTarget.style.background='transparent' }}
                  >
                    {c.name}
                    {currentCity===c.name && <span style={{ fontSize:11,color:'var(--accent)',fontWeight:600 }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {!showMoscowSection && !showOtherSection && (
            <div style={{ textAlign:'center',padding:'32px 0',color:'var(--secondary)',fontSize:14 }}>Город не найден</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Nav ───────────────────────────────────────────────────────────────────────

export default function Nav({ onCityChange, user: userProp, onUserChange }) {
  const isMobile = useIsMobile()
  const [city, setCity]         = useState('Москва')
  const [cityOpen, setCityOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const navigate                = useNavigate()
  const [user, setUser]         = useState(userProp ?? getStoredUser())
  const [dropOpen, setDropOpen] = useState(false)

  function selectCity(name) {
    setCity(name); setCityOpen(false); onCityChange?.(name)
  }

  function handleLogin(u) {
    storeUser(u, localStorage.getItem('lovi_token') || '')
    setUser(u)
    onUserChange?.(u)
    setAuthOpen(false)
    navigate('/my-bookings')
  }

  function handleLogout() {
    clearUser()
    setUser(null)
    onUserChange?.(null)
    setDropOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav style={{
        display:'flex',justifyContent:'space-between',alignItems:'center',
        padding:isMobile?'14px 16px':'20px 40px',
        position:'sticky',top:0,zIndex:100,
        background:'rgba(253,252,249,0.92)',backdropFilter:'blur(12px)',
        borderBottom:'1px solid var(--border)',
      }}>
        <img src="/logo.svg" alt="LOVI.today" style={{ height:28 }} />

        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <button onClick={() => setCityOpen(true)} style={{
            fontSize:13,fontWeight:500,cursor:'pointer',
            background:'transparent',border:'1px solid var(--border)',
            padding:'6px 14px',borderRadius:20,color:'var(--dark)',
            display:'flex',alignItems:'center',gap:6,
            transition:'border-color 0.2s',fontFamily:'Inter,sans-serif',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--dark)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
          >
            <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',flexShrink:0 }} />
            {city}
            <span style={{ fontSize:10,opacity:0.5 }}>▼</span>
          </button>

          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setDropOpen(v => !v)} style={{
                width:36,height:36,borderRadius:'50%',
                background:'var(--dark)',color:'#fff',
                border:'none',cursor:'pointer',
                fontSize:13,fontWeight:600,fontFamily:'Inter,sans-serif',
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
              }}>
                {getInitials(user.name)}
              </button>
              {dropOpen && (
                <UserDropdown user={user} onClose={() => setDropOpen(false)} onLogout={handleLogout} onNavigate={navigate} />
              )}
            </div>
          ) : (
            <button onClick={() => setAuthOpen(true)} style={{
              fontSize:13,fontWeight:500,cursor:'pointer',
              background:'var(--dark)',color:'#fff',
              border:'none',padding:'7px 18px',borderRadius:20,
              fontFamily:'Inter,sans-serif',
            }}>
              Войти
            </button>
          )}
        </div>
      </nav>

      {cityOpen && <CityModal currentCity={city} onSelect={selectCity} onClose={() => setCityOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={handleLogin} />}
    </>
  )
}