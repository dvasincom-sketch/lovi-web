import { useState, useEffect, useRef } from 'react'
import {
  MapPin, ArrowRight, Check, Clock, Lock, Sparkles, X, MessageCircle, Tag,
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
function useLiveSlot() {
  const [slot, setSlot] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const BASE = 'https://insalon.onrender.com'

    fetch(`${BASE}/api/lovi/featured?date=${today}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const slots = Array.isArray(data) ? data : (data?.slots || [])
        if (slots.length > 0) {
          setSlot(slots[0])
          return null
        }
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

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE CONFIG — геополитическая константа, районная принадлежность неизменна.
// Данные объектов (count, items) приходят из zone_cache через API.
// taken — будущая таблица zone_partner_slots; пока хардкод подтверждённых партнёров.
// ═══════════════════════════════════════════════════════════════════════════════
const API_BASE = 'https://insalon.onrender.com/api/lovi'

// Маппинг zone_id → district (из ZoneMap.jsx, source of truth)
const ZONE_CONFIG = [
  // ── КОНЬКОВО ────────────────────────────────────────────────
  { id: 'yabloneviy-sad',     name: 'Яблоневый сад',       anchor: 'м. Беляево, выходы 1–2',       districtId: 'konkovo',      districtName: 'Коньково' },
  { id: 'konkovskie-prudy',   name: 'Коньковские пруды',   anchor: 'м. Беляево вых. 3–4 / Коньково', districtId: 'konkovo',    districtName: 'Коньково' },
  { id: 'derevlyovskiy-prud', name: 'Деревлёвский пруд',  anchor: 'м. Беляево, выходы 7–8',       districtId: 'konkovo',      districtName: 'Коньково' },
  { id: 'belyaevo-center',    name: 'Беляево центр',       anchor: 'м. Беляево, выход 6',          districtId: 'konkovo',      districtName: 'Коньково' },
  { id: 'obrucheva-st',       name: 'Улица Обручева',      anchor: 'ул. Обручева, авт. 616',       districtId: 'konkovo',      districtName: 'Коньково' },
  { id: 'kaluzhskaya-border', name: 'Калужская (граница)', anchor: 'м. Калужская',                 districtId: 'konkovo',      districtName: 'Коньково' },
  // ── ОБРУЧЕВСКИЙ ─────────────────────────────────────────────
  { id: 'rudn',               name: 'РУДН',                anchor: 'ул. Миклухо-Маклая, РУДН',    districtId: 'obruchevsky',  districtName: 'Обручевский' },
  { id: 'samorodinka',        name: 'Лес на Самородинке',  anchor: 'Восточная часть, р. Самородинка', districtId: 'obruchevsky', districtName: 'Обручевский' },
  { id: 'vorontsovskaya',     name: 'Воронцовская',        anchor: 'Воронцовский парк',            districtId: 'obruchevsky',  districtName: 'Обручевский' },
  { id: 'novye-cheremushki',  name: 'Новые Черёмушки',     anchor: 'м. Новые Черёмушки',           districtId: 'obruchevsky',  districtName: 'Обручевский' },
  { id: 'novatorskaya',       name: 'Новаторская',         anchor: 'м. Новаторская (БКЛ)',         districtId: 'obruchevsky',  districtName: 'Обручевский' },
  // ── ЧЕРЁМУШКИ ───────────────────────────────────────────────
  { id: 'cheremushki-north',  name: 'Черёмушки — Север',  anchor: 'От Обручева до Наметкина',     districtId: 'cheryomushki', districtName: 'Черёмушки' },
  { id: 'cheremushki-center', name: 'Черёмушки — Центр',  anchor: 'От Наметкина до Гарибальди',   districtId: 'cheryomushki', districtName: 'Черёмушки' },
  { id: 'cheremushki-south',  name: 'Черёмушки — Юг',     anchor: 'От Гарибальди до Нахимовского', districtId: 'cheryomushki', districtName: 'Черёмушки' },
  // ── ЛОМОНОСОВСКИЙ ───────────────────────────────────────────
  { id: 'lomonosovsky-vorontsovsky', name: 'Воронцовский — Ломоносовский', anchor: 'От Воронцовского парка до Гарибальди', districtId: 'lomonosovsky', districtName: 'Ломоносовский' },
  { id: 'lomonosovsky-leninsky',     name: 'Ленинский — Вернадского',      anchor: 'Ленинский пр., ул. Крупской',         districtId: 'lomonosovsky', districtName: 'Ломоносовский' },
  { id: 'lomonosovsky-nakhimovsky',  name: 'Ломоносовский — Нахимовский',  anchor: 'От Гарибальди до Нахимовского пр.',   districtId: 'lomonosovsky', districtName: 'Ломоносовский' },
]

// Подтверждённые партнёры — ХАРДКОД до создания таблицы zone_partner_slots.
// Формат: { zone_id, dgis_id, salon, address }
// dgis_id позволяет подсветить объект среди объектов рынка в модалке.
// zone_id = 'yabloneviy-sad' — именно там Head Spa Beauty в zone_cache и на ZoneMap.
const CONFIRMED_PARTNERS = [
  {
    zone_id: 'yabloneviy-sad',
    dgis_id: '70000001101285984',
    salon: 'Head Spa Beauty',
    address: 'ул. Миклухо-Маклая 37',
  },
]

// ─── Хук данных зон из zone_cache ────────────────────────────────────────────
// Делает 17 параллельных запросов (по одному на zone_id).
// Promise.allSettled — частичный фейл не ронял всё.
// Возвращает: { zoneData: { [zone_id]: { count, items } | null }, loading, error }
function useZoneData() {
  const [zoneData, setZoneData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const results = await Promise.allSettled(
          ZONE_CONFIG.map(z =>
            fetch(`${API_BASE}/zones/search?zone_id=${z.id}`)
              .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
              .then(data => ({ zoneId: z.id, data }))
          )
        )

        if (cancelled) return

        const map = {}
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            const { zoneId, data } = result.value
            // API возвращает объект зоны: { zone_id, count, items, fetched_at }
            // или массив — нормализуем
            const zone = Array.isArray(data) ? data[0] : data
            map[zoneId] = zone || null
          }
          // fulfilled но zone не найдена → null (зона в конфиге, но нет в кэше)
        })

        setZoneData(map)
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { zoneData, loading, error }
}

// ─── Строим структуру DISTRICTS из ZONE_CONFIG + zoneData ───────────────────
// slotsPerZone = Math.max(1, Math.floor(count / 4)), минимум 1, максимум 5
function buildDistricts(zoneData, loading) {
  // Группируем зоны по районам
  const districtMap = {}
  ZONE_CONFIG.forEach(zc => {
    if (!districtMap[zc.districtId]) {
      districtMap[zc.districtId] = { id: zc.districtId, name: zc.districtName, zones: [] }
    }

    const cacheEntry = zoneData[zc.id]
    const count = cacheEntry?.count ?? null

    // Слоты: 1 на каждые 4 объекта, минимум 1, максимум 5
    const slotsPerZone = count !== null
      ? Math.min(5, Math.max(1, Math.floor(count / 4)))
      : 2 // дефолт пока грузится

    // Партнёры этой зоны
    const partners = CONFIRMED_PARTNERS.filter(p => p.zone_id === zc.id)
    const taken = partners.map((p, i) => ({ index: i, salon: p.salon, address: p.address, dgis_id: p.dgis_id }))

    districtMap[zc.districtId].zones.push({
      id: zc.id,
      name: zc.name,
      anchor: zc.anchor,
      count,            // кол-во объектов из zone_cache (null = нет данных)
      items: cacheEntry?.items ?? [],
      slotsPerZone,
      taken,
      loading: loading && count === null,
    })
  })

  return Object.values(districtMap)
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
              Бронирование через «Лови» запустим, когда подключим по 2 салона
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

// ─── SalonSelect — кастомный дропдаун в стиле UI Kit (SelectField из UI.jsx) ─
// items: массив объектов из zone_cache { dgis_id, name }
// value: string (имя салона) | ''
// onChange: fn(value: string)  — передаёт name или '__custom__'
function SalonSelect({ items, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)

  const displayValue = value && value !== '__custom__' ? value : null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: `1px solid ${open ? 'var(--dark)' : 'var(--border)'}`,
          borderRadius: 14,
          padding: '13px 16px',
          background: '#fff',
          cursor: 'pointer',
          fontSize: 14,
          color: displayValue ? 'var(--dark)' : 'var(--secondary)',
          transition: 'border-color 0.2s',
          textAlign: 'left',
          fontFamily: 'Inter,sans-serif',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue || placeholder}
        </span>
        <span style={{
          color: 'var(--secondary)', fontSize: 11, flexShrink: 0, marginLeft: 8,
          transition: 'transform 0.2s',
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▾</span>
      </button>

      {open && (
        <>
          {/* Overlay для закрытия по клику вне */}
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 16,
            zIndex: 100,
            boxShadow: '0 16px 40px rgba(18,26,18,0.1)',
            overflow: 'hidden',
            maxHeight: 280,
            overflowY: 'auto',
          }}>
            {items.map(item => (
              <button
                key={item.dgis_id}
                onClick={() => { onChange(item.name); setOpen(false) }}
                style={{
                  width: '100%', padding: '12px 16px', border: 'none',
                  background: value === item.name ? 'rgba(18,26,18,0.04)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s',
                  fontFamily: 'Inter,sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.background = value === item.name ? 'rgba(18,26,18,0.04)' : 'transparent' }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)', lineHeight: 1.35 }}>
                  {item.name}
                </div>
              </button>
            ))}
            {/* Разделитель + «Меня здесь нет» */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
            <button
              onClick={() => { onChange('__custom__'); setOpen(false) }}
              style={{
                width: '100%', padding: '12px 16px', border: 'none',
                background: 'transparent',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s',
                fontFamily: 'Inter,sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ fontSize: 13, color: 'var(--secondary)', fontStyle: 'italic' }}>
                Меня здесь нет — ввести вручную
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// PartnerModal принимает опциональный preselectedZone и preselectedSalon
function PartnerModal({ open, onClose, preselectedZone = null, preselectedSalon = null, zoneData = {} }) {
  // Шаг 1 — выбор зоны, шаг 2 — данные
  const [step, setStep] = useState(1)
  const [selectedZoneId, setSelectedZoneId] = useState(preselectedZone?.id || '')
  const [salonMode, setSalonMode] = useState('select') // 'select' | 'custom'
  const [salonSelected, setSalonSelected] = useState('') // из выпадающего
  const [salonCustom, setSalonCustom] = useState('')     // свободный ввод
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  // При открытии с preselectedZone — сразу на шаг 2; если есть preselectedSalon — выбираем его
  useEffect(() => {
    if (open && preselectedZone?.id) {
      setSelectedZoneId(preselectedZone.id)
      setStep(2)
    }
    if (open && preselectedSalon?.name) {
      setSalonMode('select')
      setSalonSelected(preselectedSalon.name)
    }
  }, [open, preselectedZone, preselectedSalon])

  const selectedZoneConfig = ZONE_CONFIG.find(z => z.id === selectedZoneId) || null

  // Объекты выбранной зоны из zone_cache, отсортированные по отзывам
  const zoneItems = selectedZoneId && zoneData[selectedZoneId]?.items
    ? [...zoneData[selectedZoneId].items].sort((a, b) => (b.reviews_count ?? -1) - (a.reviews_count ?? -1))
    : []

  const salonValue = salonMode === 'custom' ? salonCustom : salonSelected

  const submit = async () => {
    setError('')
    if (!salonValue.trim()) { setError('Укажите название салона'); return }
    if (!name.trim()) { setError('Укажите ваше имя'); return }
    if (!contact.trim()) { setError('Укажите email или телефон'); return }
    setLoading(true)
    try {
      const r = await fetch('https://insalon.onrender.com/api/lovi/partner-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon: salonValue,
          name,
          contact,
          zone_id: selectedZoneId || undefined,
          zone_name: selectedZoneConfig?.name || undefined,
        }),
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
    setStep(preselectedZone ? 2 : 1)
    setSelectedZoneId(preselectedZone?.id || '')
    setSalonMode('select')
    setSalonSelected(preselectedSalon?.name || '')
    setSalonCustom('')
    setName(''); setContact('')
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

          {/* Шаг 1: выбор зоны (только если зона не предвыбрана) */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                Выберите вашу зону
              </div>
              {/* Группируем по районам */}
              {Object.entries(
                ZONE_CONFIG.reduce((acc, z) => {
                  if (!acc[z.districtName]) acc[z.districtName] = []
                  acc[z.districtName].push(z)
                  return acc
                }, {})
              ).map(([districtName, zones]) => (
                <div key={districtName}>
                  <div style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 6, paddingLeft: 2 }}>
                    {districtName}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {zones.map(z => (
                      <button
                        key={z.id}
                        onClick={() => { setSelectedZoneId(z.id); setStep(2) }}
                        style={{
                          background: 'rgba(18,26,18,0.03)',
                          border: '1px solid var(--border)',
                          borderRadius: 12, padding: '10px 14px',
                          cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'inherit', transition: 'all 0.15s',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(249,115,22,0.04)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(18,26,18,0.03)' }}
                      >
                        <div>
                          <div style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 500 }}>{z.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>{z.anchor}</div>
                        </div>
                        <Icon i={ArrowRight} size={14} color="var(--secondary)" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setSelectedZoneId(''); setStep(2) }}
                style={{
                  background: 'transparent', border: 'none',
                  fontSize: 13, color: 'var(--secondary)',
                  cursor: 'pointer', padding: '6px 0',
                  fontFamily: 'inherit', textAlign: 'left',
                  textDecoration: 'underline', textDecorationColor: 'rgba(18,26,18,0.2)',
                }}
              >
                Моя зона не в списке
              </button>
            </div>
          )}

          {/* Шаг 2: данные салона */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Выбранная зона + возможность сменить */}
              {selectedZoneConfig && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(249,115,22,0.06)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 12, padding: '10px 14px',
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 2 }}>
                      Зона спроса
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 500 }}>
                      {selectedZoneConfig.name}
                    </div>
                  </div>
                  {!preselectedZone && (
                    <button
                      onClick={() => { setStep(1); setSalonMode('select'); setSalonSelected('') }}
                      style={{
                        background: 'transparent', border: 'none',
                        fontSize: 12, color: 'var(--secondary)',
                        cursor: 'pointer', fontFamily: 'inherit',
                        textDecoration: 'underline',
                      }}
                    >
                      изменить
                    </button>
                  )}
                </div>
              )}

              {/* Кастомный Select в стиле UI Kit (SelectField из UI.jsx) */}
              {salonMode === 'select' ? (
                <div>
                  <SalonSelect
                    items={zoneItems}
                    value={salonSelected}
                    onChange={val => {
                      if (val === '__custom__') {
                        setSalonMode('custom')
                        setSalonSelected('')
                      } else {
                        setSalonSelected(val)
                      }
                    }}
                    placeholder={zoneItems.length > 0 ? 'Выберите салон из вашей зоны' : 'Название вашего салона'}
                  />
                  {zoneItems.length === 0 && (
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--secondary)' }}>
                      Нет данных по зоне — введите название вручную
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    value={salonCustom}
                    onChange={e => setSalonCustom(e.target.value)}
                    placeholder="Название вашего салона"
                    style={inputStyle}
                    autoFocus
                    onFocus={e => e.target.style.borderColor = 'var(--dark)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button
                    onClick={() => { setSalonMode('select'); setSalonCustom('') }}
                    style={{
                      background: 'transparent', border: 'none',
                      fontSize: 12, color: 'var(--secondary)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      marginTop: 6, padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    ← выбрать из списка
                  </button>
                </div>
              )}

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
          )}
        </>
      )}
    </Modal>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// СЕКЦИИ
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ClientPromise — откуда клиенты ─────────────────────────────────────────
// ─── Переиспользуемый градиент для тёмных плашек ────────────────────────────
// Оранжевое свечение в правом верхнем углу — из UI.jsx
const DarkGlow = () => (
  <div style={{
    position: 'absolute', top: -60, right: -60,
    width: 240, height: 240, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  }} />
)

// ─── ProblemSolution — почему текущие решения не работают ──────────────────
function ProblemSolution({ isMobile }) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
  })

  const card = (delay, tone) => ({
    ...anim(delay),
    padding: isMobile ? '20px 22px' : '24px 26px',
    borderRadius: 16,
    background: tone === 'dark' ? 'var(--dark)' : 'var(--bg)',
    border: `1px solid ${tone === 'dark' ? 'rgba(255,255,255,0.08)' : 'var(--border)'}`,
    position: 'relative', overflow: 'hidden',
  })

  const eyebrow = {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--secondary)',
  }

  const ttl = (tone) => ({
    fontSize: isMobile ? 15 : 16, fontWeight: 600,
    color: tone === 'dark' ? '#fff' : 'var(--dark)',
    marginBottom: 8, lineHeight: 1.3,
  })

  const body = (tone) => ({
    fontSize: isMobile ? 13 : 14, lineHeight: 1.65,
    color: tone === 'dark' ? 'rgba(255,255,255,0.68)' : 'var(--secondary)',
    margin: 0,
  })

  return (
    <div ref={containerRef} style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '32px 20px 40px' : '56px 32px 72px',
    }}>
      <div style={{ ...anim(0), marginBottom: isMobile ? 28 : 40 }}>
        <div style={{ ...eyebrow, marginBottom: 12 }}>
          Как сейчас работают пустые окна
        </div>
        <h2 style={{
          fontFamily: 'Playfair Display,serif', fontWeight: 400,
          fontSize: isMobile ? 26 : 'clamp(28px, 3.2vw, 40px)',
          lineHeight: 1.15, color: 'var(--dark)', margin: 0, maxWidth: 720,
        }}>
          Привычные способы{isMobile ? ' ' : <br />}не приводят новых клиентов
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 28 : 40, alignItems: 'stretch',
      }}>
        {/* ЛЕВАЯ — обычный подход */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...anim(100), ...eyebrow }}>Обычный подход</div>

          {[
            { icon: MessageCircle, title: 'Публикация в соцсетях',  text: 'Видят только лояльные — новых клиентов нет',       delay: 200 },
            { icon: Clock,         title: 'Лист ожидания',           text: 'Окно открылось, но дозвониться уже некогда',       delay: 300 },
            { icon: Tag,           title: 'Велкам-скидка для новых', text: 'Приходят раз и не возвращаются',                   delay: 400 },
          ].map(({ icon: I, title, text, delay }) => (
            <div key={title} style={{
              ...card(delay, 'light'),
              display: 'flex', alignItems: 'stretch',
              gap: 0, padding: 0, overflow: 'hidden',
            }}>
              <div style={{ flex: 1, padding: isMobile ? '20px 22px' : '24px 26px' }}>
                <div style={ttl('light')}>{title}</div>
                <p style={{ ...body('light'), fontStyle: 'italic' }}>{text}</p>
              </div>
              <div style={{
                width: isMobile ? 56 : 72, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderLeft: '1px solid var(--border)',
                background: 'rgba(18,26,18,0.02)',
              }}>
                <Icon i={I} size={isMobile ? 22 : 28} color="var(--secondary)" stroke={1.2} />
              </div>
            </div>
          ))}
        </div>

        {/* ПРАВАЯ — Лови */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...anim(250), ...eyebrow }}>Подход «Лови»</div>

          {[
            { icon: Sparkles,   title: 'Мгновенное заполнение',     text: 'Клиент видит, бронирует и платит за минуты',                delay: 350 },
            { icon: MapPin,     title: 'Новая аудитория района',     text: 'Не подписчики — те, кто ищет массаж рядом прямо сейчас',  delay: 500 },
            { icon: ArrowRight, title: 'Возвращаются в пустые окна', text: 'Их формат — горящие слоты, а не скидка на прайс',         delay: 650 },
          ].map(({ icon: I, title, text, delay }) => (
            <div key={title} style={{
              ...card(delay, 'dark'),
              display: 'flex', alignItems: 'stretch',
              gap: 0, padding: 0, overflow: 'hidden',
            }}>
              <DarkGlow />
              <div style={{ flex: 1, padding: isMobile ? '20px 22px' : '24px 26px' }}>
                <div style={ttl('dark')}>{title}</div>
                <p style={{ ...body('dark'), fontStyle: 'italic' }}>{text}</p>
              </div>
              <div style={{
                width: isMobile ? 56 : 72, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(249,115,22,0.04)',
              }}>
                <Icon i={I} size={isMobile ? 22 : 28} color="var(--accent)" stroke={1.2} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Финал */}
      <div style={{
        ...anim(800),
        marginTop: isMobile ? 36 : 56,
        maxWidth: 760, marginLeft: 'auto', marginRight: 'auto',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'Playfair Display,serif', fontWeight: 400,
          fontSize: isMobile ? 22 : 'clamp(24px, 2.6vw, 32px)',
          lineHeight: 1.3, color: 'var(--dark)',
        }}>
          Вы получаете новых клиентов, которые приходят регулярно —{' '}
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
            именно туда, где у вас простой.
          </em>
        </div>
      </div>
    </div>
  )
}

function ClientPromise({ isMobile }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '24px 20px 40px' : '32px 32px 56px',
    }}>
      <div style={{
        background: 'var(--dark)', color: '#fff',
        borderRadius: isMobile ? 20 : 24,
        padding: isMobile ? '28px 24px' : '44px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 24 : 56,
        alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <DarkGlow />
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--accent)',
            marginBottom: 16,
          }}>
            Откуда клиенты
          </div>
          <div style={{
            fontFamily: 'Playfair Display,serif', fontWeight: 400,
            fontSize: isMobile ? 26 : 36, lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Летом 2026 запускаем приложение «Лови»
            {isMobile ? ' ' : <br />}
            для клиентов — iOS и Android.
          </div>
          <p style={{
            fontSize: isMobile ? 14 : 15, lineHeight: 1.65,
            color: 'rgba(255,255,255,0.65)',
            margin: 0,
          }}>
            Привлечение клиентов и реклама — на нашей стороне.
            У нас уже есть база лояльных пользователей, на которую
            мы запускаем приложение. Вы получаете готовых клиентов
            в свои пустые окна — без затрат на маркетинг.
          </p>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {[
            ['Приложение клиентам', 'бесплатно, лето 2026'],
            ['Маркетинг и реклама', 'на стороне «Лови»'],
            ['Стоимость для салона', 'первые 3 месяца — 0 ₽'],
            ['Привлечение клиентов', 'мы платим, не вы'],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', gap: 16,
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function FAQ({ isMobile }) {
  const [openIdx, setOpenIdx] = useState(null)

  const items = [
    {
      q: 'Бесплатно сейчас — а потом сколько это будет стоить?',
      a: 'Первые 3 месяца — бесплатно для всех салонов первой волны. Дальнейшие условия мы зафиксируем индивидуально с каждым партнёром по результатам этих 3 месяцев — когда у нас будет реальная статистика по вашему салону. Никаких сюрпризов: ценообразование обсудим до конца бесплатного периода.',
    },
    {
      q: 'Как именно происходит механика, когда клиент приходит?',
      a: 'У вас в CRM появилось свободное окно — «Лови» видит это через интеграцию. Окно публикуется в приложении со скидкой, которую вы установили. Клиент бронирует и оплачивает 100% сразу. Бронь автоматически появляется в вашей CRM как обычная запись. Вы получаете выплату после визита клиента.',
    },
    {
      q: 'Какие скидки и кто их устанавливает?',
      a: 'Скидки устанавливаете вы сами для каждой услуги. Можно задать минимум и максимум — «Лови» будет работать в этих рамках. Можно вообще выключить скидки для конкретных услуг или мастеров.',
    },
    {
      q: 'Откуда возьмутся клиенты — у вас же ещё нет приложения?',
      a: 'Приложение «Лови» запускаем летом 2026 года для iOS и Android. У нас уже есть база лояльных клиентов, на которую мы будем продвигать приложение и делать рекламную кампанию. Привлечение клиентов и маркетинг — полностью на нашей стороне, для салона это бесплатно.',
    },
    {
      q: 'Что если клиент со скидкой потом будет приходить только по скидке?',
      a: '«Лови» работает только с пустыми окнами в реальном времени — слот открывается за 1–3 часа до начала и исчезает после. Клиент не может «забронировать заранее» по скидке, потому что скидки на будущие даты в системе нет. Это защищает ваш основной прайс.',
    },
    {
      q: 'Можно ли ограничить какие услуги попадают на витрину?',
      a: 'Да. Вы выбираете в кабинете партнёра, какие услуги, мастера и часы участвуют в «Лови». Например, можно включить только массаж и SPA, исключить «звёздных» мастеров и работать только с 11:00 до 17:00 в будни.',
    },
    {
      q: 'Что если я хочу попробовать и потом отключиться?',
      a: 'Отключение в один клик в кабинете партнёра. Никаких штрафов, договоров с обязательствами и периодов уведомления. Активные брони доводятся до конца, новые слоты не публикуются.',
    },
    {
      q: 'Какие данные вы получаете при интеграции? Не будет ли утечки?',
      a: '«Лови» получает только одно: наличие свободных временных окон в вашем расписании. Мы не собираем финансовую информацию, данные о клиентах, историю записей или любые другие чувствительные данные. Интеграция работает через стандартный API вашей CRM — это тот же механизм, который используют другие партнёрские сервисы.',
    },
    {
      q: 'Как технически работает интеграция с CRM?',
      a: 'Сейчас первоочередная интеграция — YCLIENTS. Dikidi и другие популярные CRM в разработке. Подключение занимает 5 минут: вы выдаёте «Лови» доступ через стандартный механизм партнёров. Никакого нового софта устанавливать не нужно. После подключения «Лови» работает в фоне, ваш персонал ничего не меняет в привычной работе.',
    },
  ]

  return (
    <div id="how" style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '32px 20px 40px' : '56px 32px 80px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--secondary)',
        marginBottom: 16,
      }}>
        Частые вопросы
      </div>
      <h2 style={{
        fontFamily: 'Playfair Display,serif', fontWeight: 400,
        fontSize: isMobile ? 28 : 'clamp(32px, 4vw, 48px)',
        lineHeight: 1.15, color: 'var(--dark)',
        margin: '0 0 32px', maxWidth: 720,
      }}>
        Что обычно спрашивают{isMobile ? ' ' : <br />}владельцы салонов
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => {
          const isOpen = openIdx === i
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'border-color 0.15s',
                borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: '100%',
                  padding: isMobile ? '18px 18px' : '22px 28px',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 16,
                }}
              >
                <span style={{
                  fontSize: isMobile ? 15 : 17,
                  fontWeight: 500, color: 'var(--dark)',
                  lineHeight: 1.4,
                }}>
                  {item.q}
                </span>
                <span style={{
                  flexShrink: 0,
                  width: 28, height: 28, borderRadius: '50%',
                  background: isOpen ? 'var(--accent)' : 'rgba(18,26,18,0.06)',
                  color: isOpen ? '#fff' : 'var(--dark)',
                  fontSize: 18, fontWeight: 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div style={{
                  padding: isMobile ? '0 18px 20px' : '0 28px 24px',
                  fontSize: isMobile ? 14 : 15, lineHeight: 1.65,
                  color: 'var(--secondary)',
                  maxWidth: 760,
                }}>
                  {item.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── EarningsCalculator — сколько денег приносят пустые окна ────────────────
function EarningsCalculator({ isMobile, onApply }) {
  const FILL_RATE = 0.70

  const [slotsWeek, setSlotsWeek] = useState(5)
  const [price, setPrice]         = useState(4000)
  const [discount, setDiscount]   = useState(25)

  const slotsMonth = slotsWeek * 4
  const filled     = Math.round(slotsMonth * FILL_RATE)
  const avgCheck   = Math.round(price * (1 - discount / 100))
  const revenue    = filled * avgCheck

  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n))

  const sliderStyle = {
    width: '100%',
    height: 4,
    appearance: 'none',
    background: 'var(--border)',
    borderRadius: 2,
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '24px 20px 40px' : '32px 32px 56px',
    }}>
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: isMobile ? 20 : 24,
        padding: isMobile ? '28px 24px' : '44px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 28 : 56,
        alignItems: 'flex-start',
      }}>
        {/* Левая колонка — слайдеры */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--accent)',
            marginBottom: 16,
          }}>
            Калькулятор
          </div>
          <div style={{
            fontFamily: 'Playfair Display,serif', fontWeight: 400,
            fontSize: isMobile ? 24 : 30, lineHeight: 1.2,
            color: 'var(--dark)', marginBottom: 12,
          }}>
            Сколько денег приносят пустые окна вашего салона
          </div>
          <p style={{
            fontSize: isMobile ? 14 : 15, lineHeight: 1.6,
            color: 'var(--secondary)', margin: '0 0 28px',
          }}>
            Подвиньте слайдеры под свой салон — посчитаем потенциал заполнения через «Лови»
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Окна в неделю */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 10,
              }}>
                <label style={{ fontSize: 13, color: 'var(--secondary)' }}>
                  Свободных окон в неделю
                </label>
                <span style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 22, color: 'var(--dark)',
                }}>
                  {slotsWeek}
                </span>
              </div>
              <input
                type="range" min={1} max={20} step={1}
                value={slotsWeek}
                onChange={e => setSlotsWeek(Number(e.target.value))}
                style={sliderStyle}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'var(--secondary)', marginTop: 6,
              }}>
                <span>1</span><span>20</span>
              </div>
            </div>

            {/* Средний чек */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 10,
              }}>
                <label style={{ fontSize: 13, color: 'var(--secondary)' }}>
                  Средний чек услуги
                </label>
                <span style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 22, color: 'var(--dark)',
                }}>
                  {fmt(price)} ₽
                </span>
              </div>
              <input
                type="range" min={2000} max={10000} step={500}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                style={sliderStyle}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'var(--secondary)', marginTop: 6,
              }}>
                <span>2 000 ₽</span><span>10 000 ₽</span>
              </div>
            </div>

            {/* Глубина скидки */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 10,
              }}>
                <label style={{ fontSize: 13, color: 'var(--secondary)' }}>
                  Глубина скидки на пустые окна
                </label>
                <span style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 22, color: 'var(--dark)',
                }}>
                  {discount}%
                </span>
              </div>
              <input
                type="range" min={10} max={40} step={5}
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                style={sliderStyle}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'var(--secondary)', marginTop: 6,
              }}>
                <span>10%</span><span>40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка — результат */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          position: isMobile ? 'static' : 'sticky',
          top: isMobile ? 'auto' : 100,
        }}>
          <div style={{
            background: 'var(--dark)',
            borderRadius: 20,
            padding: isMobile ? '24px 22px' : '32px 28px',
            color: '#fff',
            position: 'relative', overflow: 'hidden',
          }}>
            <DarkGlow />
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
              marginBottom: 14,
            }}>
              Потенциальная выручка
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <span style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: isMobile ? 40 : 52, fontWeight: 400,
                color: 'var(--accent)', lineHeight: 1,
              }}>
                {fmt(revenue)} ₽
              </span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>в месяц</span>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
              paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                  Заполненных окон
                </div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>
                  {filled} из {slotsMonth}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                  Средний чек со скидкой
                </div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>
                  {fmt(avgCheck)} ₽
                </div>
              </div>
            </div>
          </div>

          <p style={{
            fontSize: 12, color: 'var(--secondary)',
            lineHeight: 1.55, margin: 0,
          }}>
            Расчёт исходит из 70% заполняемости пустых окон на стабильной фазе работы «Лови».
            В первые 1–2 месяца после запуска приложения заполняемость может быть ниже.
            Цифры — потенциал, а не обещание выручки.
          </p>

          <BtnPrimary
            onClick={() => onApply(null)}
            style={{ width: '100%' }}
          >
            Подать заявку на подключение
          </BtnPrimary>
        </div>
      </div>
    </div>
  )
}

function NavBar({ isMobile }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(253,252,249,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: isMobile ? '12px 20px' : '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <a href="/" style={{ textDecoration: 'none' }}>
        <img src="/logo.svg" alt="«Лови»" style={{ height: isMobile ? 22 : 26 }} />
      </a>
    </div>
  )
}

function Hero({ isMobile, onApply }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: isMobile ? '56px 20px 48px' : '80px 32px 72px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--accent)',
        marginBottom: 20,
      }}>
        «Лови» · для салонов ЮЗАО Москвы
      </div>

      <h1 style={{
        fontFamily: 'Playfair Display,serif', fontWeight: 400,
        fontSize: isMobile ? 38 : 'clamp(44px, 6vw, 72px)',
        lineHeight: 1.08, color: 'var(--dark)',
        margin: '0 0 28px', maxWidth: 820,
      }}>
        Пустое окно — это{isMobile ? ' ' : <br />}
        <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>не отмена,</em>
        {isMobile ? ' ' : <br />}
        а упущенная выручка.
      </h1>

      <p style={{
        fontSize: isMobile ? 15 : 18, lineHeight: 1.65,
        color: 'var(--secondary)', margin: '0 0 36px',
        maxWidth: 580,
      }}>
      Сервис «Лови» превращает пустые окна в записи, не трогая ваш основной прайс.
      </p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <BtnPrimary
          onClick={() => onApply(null)}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Подать заявку
        </BtnPrimary>
        <a
          href="#how"
          style={{
            padding: '14px 28px', borderRadius: 18,
            fontSize: 14, fontWeight: 600,
            color: 'var(--dark)', textDecoration: 'none',
            border: '1px solid var(--border)',
            display: 'inline-flex', alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          Как это работает
        </a>
      </div>
    </div>
  )
}

function LiveDemo({ isMobile, onSubscribe }) {
  const { slot, loading } = useLiveSlot()

  const fmt = n => n?.toLocaleString('ru-RU') ?? '—'

  const s = slot ? {
    time: new Date(slot.start_at || slot.datetime || Date.now()).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    service_name: slot.service_name || 'Классический массаж 60 мин',
    base_price: slot.base_price || 4500,
    lovi_price: slot.lovi_price || 3200,
    discount_pct: slot.discount_pct || 29,
    minutes_to_slot: slot.minutes_to_slot || 0,
  } : {
    time: '14:30',
    service_name: 'Классический массаж 60 мин',
    base_price: 4500,
    lovi_price: 3200,
    discount_pct: 29,
    minutes_to_slot: 0,
  }

  const isReal = !!slot
  const timer = useTimer(isReal ? s.minutes_to_slot * 60 : 0)

  return (
    <div id="how" style={{
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
                marginLeft: isMobile ? 0 : 'auto',
                width: isMobile ? '100%' : 'auto',
                display: 'flex', flexDirection: 'column',
                alignItems: isMobile ? 'stretch' : 'flex-end',
                gap: 8,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 8,
                  width: isMobile ? '100%' : 'auto',
                }}>
                  <div style={{
                    background: 'rgba(249,115,22,0.18)',
                    color: 'var(--accent)',
                    padding: '0 14px',
                    borderRadius: 18,
                    fontSize: 14, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    −{s.discount_pct}%
                  </div>
                  <BtnPrimary
                    onClick={onSubscribe}
                    style={{ flex: isMobile ? 1 : '0 0 auto' }}
                  >
                    Поймать за {fmt(s.lovi_price)} ₽
                  </BtnPrimary>
                </div>
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
            title="Окно открывается заранее"
            text="Партнёры настраивают окно сами — от нескольких часов до 72 часов. Успеете спланировать поездку."
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

// ═══════════════════════════════════════════════════════════════════════════════
// PARTNER CALLOUT — блок «Карта зон спроса»
// Данные: zone_cache через /api/lovi/zones/search?zone_id=
// Структура: 4 района → 17 зон → slotsPerZone = floor(count/4), min 1
// taken: CONFIRMED_PARTNERS (хардкод до zone_partner_slots)
// ═══════════════════════════════════════════════════════════════════════════════
function PartnerCallout({ isMobile, onApply, zoneData = {} }) {
  const [activeDistrictId, setActiveDistrictId] = useState(null)
  const [activeZone, setActiveZone] = useState(null)

  const zonesLoading = Object.keys(zoneData).length === 0

  // Строим структуру районов из конфига + данных API
  const DISTRICTS = buildDistricts(zoneData, zonesLoading)

  // Агрегаты для заголовка
  const totalZones = DISTRICTS.reduce((s, d) => s + d.zones.length, 0)
  const totalSlots = DISTRICTS.reduce((s, d) =>
    s + d.zones.reduce((ss, z) => ss + z.slotsPerZone, 0), 0)
  const totalTaken = DISTRICTS.reduce((s, d) =>
    s + d.zones.reduce((ss, z) => ss + z.taken.length, 0), 0)
  const totalLeft = totalSlots - totalTaken

  // Суммарное кол-во объектов в базе (из zone_cache)
  const totalObjects = Object.values(zoneData).reduce((s, d) => s + (d?.count ?? 0), 0)

  const zoneTotal = (d) => d.zones.reduce((s, z) => s + z.slotsPerZone, 0)
  const zoneTaken = (d) => d.zones.reduce((s, z) => s + z.taken.length, 0)

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
        {/* Левая колонка — текст + CTA */}
        <div>
          <h2 style={{
            fontFamily: 'Playfair Display,serif', fontWeight: 400,
            fontSize: isMobile ? 32 : 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.1, color: 'var(--dark)',
            margin: '0 0 20px',
          }}>
            {zonesLoading
              ? '— мест в первом наборе'
              : `${totalLeft} мест в первом наборе`}
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16, lineHeight: 1.6, color: 'var(--secondary)',
            margin: '0 0 16px', maxWidth: 480,
          }}>
            Подключаем по{' '}
            <strong style={{ color: 'var(--dark)' }}>1 салон на каждые 4 конкурента</strong>{' '}
            в зоне. В каждой из {totalZones} зон спроса, покрывающих 4 района ЮЗАО.
          </p>

          {/* Data-driven суб-тезис — появляется когда данные загружены */}
          {totalObjects > 0 && (
            <div style={{
              fontSize: 13, color: 'var(--secondary)',
              margin: '0 0 24px',
              padding: '12px 16px',
              background: 'rgba(18,26,18,0.03)',
              borderRadius: 12,
              borderLeft: '2px solid var(--accent)',
              maxWidth: 480,
            }}>
              В базе {totalObjects} объектов рынка массажа по 4 районам — мы знаем
              реальный спрос в каждой зоне до того, как принять партнёра.
            </div>
          )}

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            marginBottom: 32,
          }}>
            {[
              'Эксклюзив: 1 слот на каждые 4 конкурента в зоне',
              'Бесплатное подключение и интеграция с CRM',
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

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <BtnPrimary
              onClick={onApply}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
              }}
            >
              Подать заявку
              <Icon i={ArrowRight} size={14} color="#fff" />
            </BtnPrimary>

          </div>
        </div>

        {/* Правая колонка — тёмная карточка с картой зон */}
        <div style={{
          background: 'var(--dark)',
          borderRadius: isMobile ? 20 : 24,
          padding: isMobile ? '24px 20px' : '28px 28px',
          color: '#fff',
          minWidth: 0,
          overflow: 'hidden',
          position: 'relative',
        }}>
          <DarkGlow />
          {/* Заголовок карточки */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 22, gap: 12, minHeight: 24,
          }}>
            {activeDistrict ? (
              <>
                <button
                  onClick={() => setActiveDistrictId(null)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'rgba(255,255,255,0.65)',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.04em', padding: 0,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  ← все районы
                </button>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {zoneTaken(activeDistrict)} из {zoneTotal(activeDistrict)} занято
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
                  {zonesLoading
                    ? 'загружаем…'
                    : `${totalTaken} из ${totalSlots} занято`}
                </div>
              </>
            )}
          </div>

          {/* Drill: либо сетка районов, либо зоны выбранного района */}
          {!activeDistrict ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? 10 : 12,
            }}>
              {DISTRICTS.map(d => (
                <DistrictCell
                  key={d.id}
                  district={d}
                  onClick={() => setActiveDistrictId(d.id)}
                  loading={zonesLoading}
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
                {activeDistrict.zones.length} зон спроса
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeDistrict.zones.map(z => (
                  <ZoneRow
                    key={z.id}
                    zone={z}
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
            <span><span style={{ color: 'var(--accent)' }}>●</span> партнёр</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>○ свободно</span>
            {totalObjects > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                {totalObjects} объектов в базе
              </span>
            )}
            <span style={{ marginLeft: isMobile ? 0 : 'auto', color: 'rgba(255,255,255,0.35)' }}>
              {activeDistrict ? 'нажмите зону' : 'нажмите район'}
            </span>
          </div>
        </div>
      </div>

      {/* Модалка детализации зоны */}
      <ZoneDetailModal
        zone={activeZone}
        onClose={() => setActiveZone(null)}
        onApply={() => { setActiveZone(null); setTimeout(() => onApply(activeZone), 200) }}
        onApplyWithItem={(item) => {
          setActiveZone(null)
          setTimeout(() => onApply(activeZone, item), 200)
        }}
      />
    </div>
  )
}

// ─── Ячейка района ───────────────────────────────────────────────────────────
function DistrictCell({ district, onClick, loading }) {
  const [hov, setHov] = useState(false)

  const total = district.zones.reduce((s, z) => s + z.slotsPerZone, 0)
  const taken = district.zones.reduce((s, z) => s + z.taken.length, 0)
  const left = total - taken
  // Суммарно объектов в базе по всем зонам района
  const objects = district.zones.reduce((s, z) => s + (z.count ?? 0), 0)

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
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', gap: 12,
        fontFamily: 'inherit', color: 'inherit',
        minHeight: 120,
      }}
    >
      <div>
        <div style={{
          fontSize: 15, fontWeight: 600,
          color: '#fff', lineHeight: 1.2, marginBottom: 4,
        }}>
          {district.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>
          {loading
            ? `${district.zones.length} зон`
            : `${left} из ${total} · ${district.zones.length} зон`}
        </div>
        {!loading && objects > 0 && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
            {objects} объектов рынка
          </div>
        )}
      </div>

      {/* Полоски заполненности зон */}
      <div style={{ display: 'flex', gap: 4, marginTop: 'auto', flexWrap: 'wrap' }}>
        {district.zones.map(z => {
          const hasTaken = z.taken.length > 0
          return (
            <div key={z.id} style={{
              flex: '1 1 0', minWidth: 18, height: 6, borderRadius: 3,
              background: hasTaken ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
            }} />
          )
        })}
      </div>
    </button>
  )
}

// ─── Строка зоны (второй уровень) ────────────────────────────────────────────
function ZoneRow({ zone, onClick }) {
  const [hov, setHov] = useState(false)
  const left = zone.slotsPerZone - zone.taken.length
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
        borderRadius: 12, padding: '12px 14px',
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'inherit', color: 'inherit',
        width: '100%', boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Название и якорь */}
      <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#fff',
          marginBottom: 2, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {zone.name}
        </div>
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.4)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {zone.anchor}
          {zone.count !== null && (
            <span style={{ marginLeft: 6, color: 'rgba(255,255,255,0.25)' }}>
              · {zone.count} объектов
            </span>
          )}
        </div>
      </div>

      {/* Кружки слотов */}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        {Array.from({ length: zone.slotsPerZone }).map((_, i) => {
          const taken = zone.taken.find(t => t.index === i)
          return (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: '50%',
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
        textTransform: 'uppercase', flexShrink: 0,
        whiteSpace: 'nowrap',
      }}>
        {isFull ? 'занято' : `${left} своб.`}
      </div>
    </button>
  )
}

// ─── Модалка детализации зоны ─────────────────────────────────────────────────
function ZoneDetailModal({ zone, onClose, onApply, onApplyWithItem }) {
  if (!zone) return null

  const isFull = zone.taken.length >= zone.slotsPerZone && zone.slotsPerZone > 0
  const left = zone.slotsPerZone - zone.taken.length

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

        {/* Статистика зоны */}
        <div style={{
          display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap',
        }}>
          {zone.count !== null && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'Playfair Display,serif', color: 'var(--dark)' }}>
                {zone.count}
              </div>
              <div style={{ fontSize: 11, color: 'var(--secondary)' }}>объектов рынка</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'Playfair Display,serif', color: 'var(--dark)' }}>
              {zone.slotsPerZone}
            </div>
            <div style={{ fontSize: 11, color: 'var(--secondary)' }}>
              {zone.count !== null
                ? `слот${zone.slotsPerZone !== 1 ? 'а' : ''} (1 на 4 объекта)`
                : 'места в зоне'}
            </div>
          </div>
          {!isFull && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'Playfair Display,serif', color: 'var(--accent)' }}>
                {left}
              </div>
              <div style={{ fontSize: 11, color: 'var(--secondary)' }}>свободно</div>
            </div>
          )}
        </div>
      </div>

      {/* Сетка слотов */}
      <div style={{
        background: 'rgba(18,26,18,0.03)',
        borderRadius: 14, padding: 16, marginBottom: 18,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${zone.slotsPerZone}, 1fr)`,
          gap: 10, maxWidth: 200,
        }}>
          {Array.from({ length: zone.slotsPerZone }).map((_, i) => {
            const taken = zone.taken.find(t => t.index === i)
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 12,
                background: taken ? 'var(--accent)' : 'rgba(18,26,18,0.04)',
                border: taken ? 'none' : '1px dashed rgba(18,26,18,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: taken ? '#fff' : 'rgba(18,26,18,0.3)',
                fontSize: 16, fontWeight: 600,
              }}>
                {taken ? '●' : (i + 1)}
              </div>
            )
          })}
        </div>

        {/* Подключённые партнёры */}
        {zone.taken.length > 0 && (
          <div style={{
            marginTop: 14, paddingTop: 14,
            borderTop: '1px solid rgba(18,26,18,0.06)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {zone.taken.map(t => (
              <div key={t.salon} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13,
              }}>
                <span style={{ color: 'var(--accent)', fontSize: 14, lineHeight: 1, marginTop: 2 }}>●</span>
                <div>
                  <div style={{ color: 'var(--dark)', fontWeight: 500 }}>{t.salon}</div>
                  <div style={{ color: 'var(--secondary)', fontSize: 12, marginTop: 2 }}>{t.address}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Все объекты из zone_cache — отсортированы по отзывам */}
      {zone.items && zone.items.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--secondary)',
            marginBottom: 10,
          }}>
            Объекты рынка в зоне
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...zone.items]
              .sort((a, b) => (b.reviews_count ?? -1) - (a.reviews_count ?? -1))
              .map(item => {
                const isPartner = zone.taken.some(t => t.dgis_id === item.dgis_id)
                return (
                  <button
                    key={item.dgis_id}
                    onClick={() => onApplyWithItem
                      ? onApplyWithItem(item)
                      : onApply()
                    }
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '8px 10px', borderRadius: 10,
                      background: isPartner ? 'rgba(249,115,22,0.06)' : 'rgba(18,26,18,0.02)',
                      border: isPartner ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(18,26,18,0)',
                      width: '100%', textAlign: 'left',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!isPartner) e.currentTarget.style.background = 'rgba(18,26,18,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(18,26,18,0.1)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isPartner ? 'rgba(249,115,22,0.06)' : 'rgba(18,26,18,0.02)'
                      e.currentTarget.style.borderColor = isPartner ? 'rgba(249,115,22,0.2)' : 'rgba(18,26,18,0)'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, color: 'var(--dark)', fontWeight: isPartner ? 600 : 400,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {item.name}
                        {isPartner && (
                          <span style={{
                            marginLeft: 8, fontSize: 10, fontWeight: 600,
                            color: 'var(--accent)', letterSpacing: '0.04em',
                          }}>
                            ПАРТНЁР
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: 11, color: 'var(--secondary)', marginTop: 2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {item.address}
                      </div>
                    </div>
                    {item.reviews_count > 0 && (
                      <div style={{
                        fontSize: 10, color: 'var(--secondary)',
                        flexShrink: 0, whiteSpace: 'nowrap', alignSelf: 'center',
                      }}>
                        {item.reviews_count} отз.
                      </div>
                    )}
                  </button>
                )
              })}
          </div>
        </div>
      )}

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
            Эксклюзив: не больше {zone.slotsPerZone} салон{zone.slotsPerZone > 1 ? 'а' : 'а'} в пешеходном радиусе
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
        <div>© 2026 Lovi.today · ОГРН 324774600002041</div>
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
  const [partnerZone, setPartnerZone] = useState(null)  // зона из ZoneDetailModal

  const [partnerSalon, setPartnerSalon] = useState(null)   // { name } из объекта рынка

  // Загружаем данные зон на уровне Home — шарим между PartnerCallout и PartnerModal
  const { zoneData } = useZoneData()

  const openPartner = (zone = null, item = null) => {
    setPartnerZone(zone)
    setPartnerSalon(item ? { name: item.name } : null)
    setPartnerOpen(true)
  }

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
      <Hero isMobile={isMobile} onApply={openPartner} />
      <ProblemSolution isMobile={isMobile} />
      <ClientPromise isMobile={isMobile} />
      <EarningsCalculator isMobile={isMobile} onApply={openPartner} />
      <LiveDemo isMobile={isMobile} onSubscribe={() => setWaitlistOpen(true)} />
      <PullQuote isMobile={isMobile} />
      <PartnerCallout isMobile={isMobile} onApply={openPartner} zoneData={zoneData} />
      <FAQ isMobile={isMobile} />
      <SecondaryCTA isMobile={isMobile} onSubscribe={() => setWaitlistOpen(true)} />
      <Footer isMobile={isMobile} />

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <PartnerModal
        open={partnerOpen}
        onClose={() => { setPartnerOpen(false); setPartnerZone(null); setPartnerSalon(null) }}
        preselectedZone={partnerZone}
        preselectedSalon={partnerSalon}
        zoneData={zoneData}
      />
    </div>
  )
}