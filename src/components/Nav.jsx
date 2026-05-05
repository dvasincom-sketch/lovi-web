import { useState, useEffect, useRef } from 'react'
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
  {"name":"Казань","moscow_area":false,"lat":55.8304,"lon":49.0661},
  {"name":"Калининград","moscow_area":false,"lat":54.7104,"lon":20.4522},
  {"name":"Пенза","moscow_area":false,"lat":53.2007,"lon":44.9977},
]

const MOSCOW_CITIES = CITIES.filter(c => c.moscow_area)
const OTHER_CITIES  = CITIES.filter(c => !c.moscow_area)

export default function Nav() {
  const isMobile = useIsMobile()
  const [city, setCity] = useState('Москва')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [locating, setLocating] = useState(false)
  const popupRef = useRef(null)

  // Закрыть по клику снаружи
  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function selectCity(name) {
    setCity(name)
    setOpen(false)
    setSearch('')
  }

  function detectLocation() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        // Найдём ближайший город
        let closest = CITIES[0]
        let minDist = Infinity
        CITIES.forEach(c => {
          const d = Math.sqrt(Math.pow(c.lat - latitude, 2) + Math.pow(c.lon - longitude, 2))
          if (d < minDist) { minDist = d; closest = c }
        })
        setCity(closest.name)
        setOpen(false)
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const filtered = search.trim()
    ? OTHER_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : OTHER_CITIES

  return (
    <nav style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding: isMobile ? '14px 16px' : '20px 40px',
      position:'sticky', top:0, zIndex:100,
      background:'rgba(253,252,249,0.92)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--border)'
    }}>
      <img src="/logo.svg" alt="LOVI.today" style={{height:28}} />

      {/* Выбор города */}
      <div ref={popupRef} style={{position:'relative'}}>
        <button onClick={()=>setOpen(v=>!v)} style={{
          fontSize:13, fontWeight:500, cursor:'pointer',
          background:'transparent', border:'1px solid var(--border)',
          padding:'6px 14px', borderRadius:20, color:'var(--dark)',
          display:'flex', alignItems:'center', gap:6,
          transition:'border-color 0.2s',
          borderColor: open ? 'var(--dark)' : 'var(--border)'
        }}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)',flexShrink:0}}/>
          {city}
          <span style={{fontSize:10,opacity:0.5,transform:open?'rotate(180deg)':'none',transition:'transform 0.2s'}}>▼</span>
        </button>

        {open && (
          <div style={{
            position:'absolute', top:'calc(100% + 10px)', right:0,
            width: isMobile ? 'calc(100vw - 32px)' : 320,
            background:'#fff', border:'1px solid var(--border)',
            borderRadius:20, padding:'20px',
            boxShadow:'0 24px 64px rgba(18,26,18,0.10)',
            zIndex:200,
          }}>
            {/* Определить локацию */}
            <button onClick={detectLocation} style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              background:'var(--dark)', color:'#fff', border:'none',
              padding:'10px', borderRadius:12, fontSize:13, fontWeight:500,
              cursor:'pointer', marginBottom:16, opacity: locating ? 0.6 : 1
            }}>
              {locating ? '⏳ Определяем...' : '📍 Определить моё местоположение'}
            </button>

            {/* Москва и область */}
            <div style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',
              color:'var(--secondary)',marginBottom:10}}>
              Москва и область
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
              {MOSCOW_CITIES.map(c=>(
                <button key={c.name} onClick={()=>selectCity(c.name)} style={{
                  padding:'5px 12px', borderRadius:16, fontSize:12, cursor:'pointer',
                  border:'1px solid var(--border)',
                  background: city===c.name ? 'var(--dark)' : 'transparent',
                  color: city===c.name ? '#fff' : 'var(--dark)',
                  fontFamily:'Inter,sans-serif'
                }}>{c.name}</button>
              ))}
            </div>

            {/* Разделитель */}
            <div style={{height:1,background:'var(--border)',marginBottom:16}}/>

            {/* Поиск по другим городам */}
            <div style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',
              color:'var(--secondary)',marginBottom:8}}>
              Другие города
            </div>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Поиск города..."
              style={{
                width:'100%', border:'1px solid var(--border)', borderRadius:10,
                padding:'8px 12px', fontSize:13, outline:'none',
                background:'#FDFCF9', marginBottom:8, boxSizing:'border-box',
                fontFamily:'Inter,sans-serif'
              }}
            />
            <div style={{maxHeight:180,overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
              {filtered.map(c=>(
                <button key={c.name} onClick={()=>selectCity(c.name)} style={{
                  textAlign:'left', padding:'7px 10px', borderRadius:8, fontSize:13,
                  border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif',
                  background: city===c.name ? 'rgba(18,26,18,0.06)' : 'transparent',
                  color:'var(--dark)'
                }}>{c.name}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
