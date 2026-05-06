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
  {"name":"Калининград","moscow_area":false,"lat":54.7104,"lon":20.4522},
  {"name":"Пенза","moscow_area":false,"lat":53.2007,"lon":44.9977},
]

const MOSCOW_CITIES = CITIES.filter(c => c.moscow_area)
const OTHER_CITIES  = CITIES.filter(c => !c.moscow_area)

// ─── Auth Modal ────────────────────────────────────────────────────────────────

function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login')
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const inputStyle = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 12,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    background: '#FDFCF9', boxSizing: 'border-box',
    fontFamily: 'Inter,sans-serif', color: 'var(--dark)',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(18,26,18,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div ref={ref} style={{
        background: '#fff', borderRadius: 24, padding: '32px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 32px 80px rgba(18,26,18,0.14)',
        animation: 'fadeUp 0.3s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <img src="/logo.svg" alt="LOVI" style={{ height: 22 }} />
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 18, color: 'var(--secondary)', lineHeight: 1,
          }}>✕</button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: '#F1F0EC', borderRadius: 12, padding: 4, marginBottom: 24,
        }}>
          {[['login', 'Войти'], ['register', 'Регистрация']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '8px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              background: tab === id ? '#fff' : 'transparent',
              color: tab === id ? 'var(--dark)' : 'var(--secondary)',
              boxShadow: tab === id ? '0 1px 4px rgba(18,26,18,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>

        {tab === 'login' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input style={inputStyle} type="tel" placeholder="Телефон или email" />
            <input style={inputStyle} type="password" placeholder="Пароль" />
            <button style={{
              width: '100%', background: 'var(--dark)', color: '#fff', border: 'none',
              padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', marginTop: 4, fontFamily: 'Inter,sans-serif',
            }}>Войти</button>
            <button style={{
              background: 'transparent', border: 'none', fontSize: 12,
              color: 'var(--secondary)', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              textAlign: 'center', marginTop: 4,
            }}>Забыли пароль?</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input style={inputStyle} type="text" placeholder="Имя" />
            <input style={inputStyle} type="tel" placeholder="Телефон" />
            <input style={inputStyle} type="email" placeholder="Email" />
            <input style={inputStyle} type="password" placeholder="Пароль" />
            <button style={{
              width: '100%', background: 'var(--dark)', color: '#fff', border: 'none',
              padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', marginTop: 4, fontFamily: 'Inter,sans-serif',
            }}>Создать аккаунт</button>
            <p style={{ fontSize: 11, color: 'var(--secondary)', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
              Регистрируясь, вы соглашаетесь с{' '}
              <span style={{ color: 'var(--dark)', textDecoration: 'underline', cursor: 'pointer' }}>условиями</span>
              {' '}и{' '}
              <span style={{ color: 'var(--dark)', textDecoration: 'underline', cursor: 'pointer' }}>политикой</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── City Modal ────────────────────────────────────────────────────────────────

function CityModal({ currentCity, onSelect, onClose }) {
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [locating, setLocating] = useState(false)
  const overlayRef = useRef(null)
  const searchRef = useRef(null)

  // Закрыть по оверлею
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

  // Фокус на поиск после появления
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
          const d = Math.sqrt(Math.pow(c.lat - latitude, 2) + Math.pow(c.lon - longitude, 2))
          if (d < minDist) { minDist = d; closest = c }
        })
        onSelect(closest.name)
      },
      () => setLocating(false)
    )
  }

  const filteredOther = search.trim()
    ? OTHER_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : OTHER_CITIES

  const filteredMoscow = search.trim()
    ? MOSCOW_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : MOSCOW_CITIES

  const showMoscowSection = filteredMoscow.length > 0
  const showOtherSection = filteredOther.length > 0

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(18,26,18,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes citySlideUp {
          from { transform: translateY(40px); opacity: 0 }
          to   { transform: translateY(0);   opacity: 1 }
        }
        @keyframes cityFadeIn {
          from { transform: scale(0.96); opacity: 0 }
          to   { transform: scale(1);    opacity: 1 }
        }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: isMobile ? '24px 24px 0 0' : 24,
        width: isMobile ? '100%' : 480,
        maxHeight: isMobile ? '88dvh' : '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(18,26,18,0.16)',
        animation: isMobile
          ? 'citySlideUp 0.32s cubic-bezier(0.2,1,0.2,1) both'
          : 'cityFadeIn 0.28s cubic-bezier(0.2,1,0.2,1) both',
        overflow: 'hidden',
      }}>

        {/* Хэндл на мобильном */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
          </div>
        )}

        {/* Шапка */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px 12px' : '24px 24px 16px',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontSize: 18, fontWeight: 600, color: 'var(--dark)',
              fontFamily: 'Playfair Display, serif',
            }}>Выберите город</div>
            <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>
              Показываем горящие окошки рядом с вами
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(18,26,18,0.06)', border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            fontSize: 16, color: 'var(--secondary)', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Геолокация + поиск — фиксированные */}
        <div style={{ padding: '0 20px 16px', flexShrink: 0 }}>
          <button
            onClick={detectLocation}
            disabled={locating}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--dark)', color: '#fff', border: 'none',
              padding: '11px', borderRadius: 14, fontSize: 13, fontWeight: 500,
              cursor: locating ? 'default' : 'pointer',
              opacity: locating ? 0.6 : 1,
              fontFamily: 'Inter,sans-serif', marginBottom: 12,
              transition: 'opacity 0.2s',
            }}
          >
            {locating ? '⏳ Определяем...' : '📍 Определить моё местоположение'}
          </button>

          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, opacity: 0.4, pointerEvents: 'none',
            }}>🔍</span>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск города..."
              style={{
                width: '100%', border: '1px solid var(--border)', borderRadius: 12,
                padding: '10px 12px 10px 34px', fontSize: 13, outline: 'none',
                background: '#FDFCF9', boxSizing: 'border-box',
                fontFamily: 'Inter,sans-serif', color: 'var(--dark)',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Скроллируемый список */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 24px' }}>

          {/* Москва и область */}
          {showMoscowSection && (
            <>
              <div style={{
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--secondary)', marginBottom: 10,
              }}>
                Москва и область
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {filteredMoscow.map(c => (
                  <button key={c.name} onClick={() => onSelect(c.name)} style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    border: '1px solid var(--border)', fontFamily: 'Inter,sans-serif',
                    background: currentCity === c.name ? 'var(--dark)' : 'transparent',
                    color: currentCity === c.name ? '#fff' : 'var(--dark)',
                    fontWeight: currentCity === c.name ? 500 : 400,
                    transition: 'all 0.15s',
                  }}>{c.name}</button>
                ))}
              </div>
            </>
          )}

          {/* Разделитель */}
          {showMoscowSection && showOtherSection && (
            <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
          )}

          {/* Другие города */}
          {showOtherSection && (
            <>
              <div style={{
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--secondary)', marginBottom: 10,
              }}>
                Другие города
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredOther.map(c => (
                  <button key={c.name} onClick={() => onSelect(c.name)} style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 10, fontSize: 14,
                    border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                    background: currentCity === c.name ? 'rgba(18,26,18,0.06)' : 'transparent',
                    color: 'var(--dark)',
                    fontWeight: currentCity === c.name ? 500 : 400,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { if (currentCity !== c.name) e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
                    onMouseLeave={e => { if (currentCity !== c.name) e.currentTarget.style.background = 'transparent' }}
                  >
                    {c.name}
                    {currentCity === c.name && (
                      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Ничего не найдено */}
          {!showMoscowSection && !showOtherSection && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--secondary)', fontSize: 14 }}>
              Город не найден
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Nav ───────────────────────────────────────────────────────────────────────

// Props:
//   onCityChange(cityName) — колбэк при смене города (прокидывать из App.jsx)

export default function Nav({ onCityChange }) {
  const isMobile = useIsMobile()
  const [city, setCity] = useState('Москва')
  const [cityOpen, setCityOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  function selectCity(name) {
    setCity(name)
    setCityOpen(false)
    onCityChange?.(name)
  }

  return (
    <>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '14px 16px' : '20px 40px',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(253,252,249,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <img src="/logo.svg" alt="LOVI.today" style={{ height: 28 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Кнопка выбора города */}
          <button
            onClick={() => setCityOpen(true)}
            style={{
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--border)',
              padding: '6px 14px', borderRadius: 20, color: 'var(--dark)',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'border-color 0.2s',
              fontFamily: 'Inter,sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--dark)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            {city}
            <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
          </button>

          {/* Войти */}
          <button
            onClick={() => setAuthOpen(true)}
            style={{
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: 'var(--dark)', color: '#fff',
              border: 'none', padding: '7px 18px', borderRadius: 20,
              fontFamily: 'Inter,sans-serif',
            }}
          >
            Войти
          </button>
        </div>
      </nav>

      {cityOpen && (
        <CityModal
          currentCity={city}
          onSelect={selectCity}
          onClose={() => setCityOpen(false)}
        />
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}
