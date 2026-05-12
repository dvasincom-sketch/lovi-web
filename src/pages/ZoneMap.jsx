import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, AlertCircle, CheckCircle, Star, RefreshCw } from 'lucide-react'

// ─── Icon ────────────────────────────────────────────────────────────────────
const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5, style = {} }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0, ...style }} />
)

// ═══════════════════════════════════════════════════════════════════════════
// ДОМЕННАЯ МОДЕЛЬ v1
// Округ ЮЗАО → Район → Зона спроса → Слот партнёра
// Координаты — центроид зоны (точка минимального среднего расстояния до её краёв)
// Радиус — пешеходный охват зоны в метрах
// ВРЕМЕННО В КОДЕ — вынести в БД после накопления реальных данных
// ═══════════════════════════════════════════════════════════════════════════
const DISTRICTS = [
  // ── КОНЬКОВО ────────────────────────────────────────────────────────────
  {
    id: 'konkovo',
    name: 'Коньково',
    zones: [
      {
        id: 'yabloneviy-sad',
        name: 'Яблоневый сад',
        anchor: 'м. Беляево, выходы 1–2',
        // Западнее Профсоюзной, парк Яблоневый сад
        lat: 55.6455, lon: 37.5185, radius: 550,
        barrier: 'Профсоюзная (восток), Миклухо-Маклая (юг), Битцевский лес (запад)',
        slots: 2, taken: [],
      },
      {
        id: 'konkovskie-prudy',
        name: 'Коньковские пруды',
        anchor: 'м. Беляево вых. 3–4 / м. Коньково',
        // Южнее, у прудов, Битцевский лес на юге
        lat: 55.6370, lon: 37.5155, radius: 600,
        barrier: 'Профсоюзная (восток), Битцевский лес (юг и запад)',
        slots: 2, taken: [],
      },
      {
        id: 'derevlyovskiy-prud',
        name: 'Деревлёвский пруд',
        anchor: 'м. Беляево, выходы 7–8',
        // Восточнее Профсоюзной, к северу от Миклухо-Маклая
        lat: 55.6505, lon: 37.5490, radius: 580,
        barrier: 'Миклухо-Маклая (юг), Профсоюзная (запад), Севастопольский пр. (восток)',
        slots: 2, taken: [],
      },
      {
        id: 'belyaevo-center',
        name: 'Беляево центр',
        anchor: 'м. Беляево, выход 6',
        // Квартал вдоль Миклухо-Маклая к востоку от метро — здесь Head Spa Beauty
        lat: 55.6468, lon: 37.5360, radius: 480,
        barrier: 'Миклухо-Маклая (ось-юг), Профсоюзная (запад), Обручева (север)',
        slots: 2,
        taken: [{ index: 0, salon: 'Head Spa Beauty', address: 'ул. Миклухо-Маклая 37' }],
      },
      {
        id: 'obrucheva-st',
        name: 'Улица Обручева',
        anchor: 'ул. Обручева, авт. 616 от м. Беляево',
        // Полоса вдоль ул. Обручева, севернее Миклухо-Маклая, до Профсоюзной
        lat: 55.6560, lon: 37.5310, radius: 560,
        barrier: 'Профсоюзная (запад/барьер), ул. Обручева (ось)',
        slots: 2, taken: [],
      },
      {
        id: 'kaluzhskaya-border',
        name: 'Калужская (граница)',
        anchor: 'м. Калужская',
        // Северо-западный угол Коньково, у Калужской
        lat: 55.6635, lon: 37.5145, radius: 520,
        barrier: 'Профсоюзная (восток/барьер), граница с Обручевским',
        slots: 2, taken: [],
      },
    ],
  },

  // ── ОБРУЧЕВСКИЙ ──────────────────────────────────────────────────────────
  {
    id: 'obruchevsky',
    name: 'Обручевский',
    zones: [
      {
        id: 'rudn',
        name: 'РУДН',
        anchor: 'ул. Миклухо-Маклая, РУДН',
        // Кампус РУДН и жилые кварталы вокруг, восточная часть Обручевского
        lat: 55.6530, lon: 37.5655, radius: 600,
        barrier: 'Севастопольский пр. (запад), Миклухо-Маклая (юг)',
        slots: 2, taken: [],
      },
      {
        id: 'samorodinka',
        name: 'Лес на Самородинке',
        anchor: 'Восточная часть, р. Самородинка',
        // Лесопарк у реки Самородинка, восток Обручевского
        lat: 55.6620, lon: 37.5720, radius: 580,
        barrier: 'Севастопольский пр. (запад), Нахимовский пр. (север)',
        slots: 2, taken: [],
      },
      {
        id: 'vorontsovskaya',
        name: 'Воронцовская',
        anchor: 'Воронцовский парк, между Обручева и Наметкина',
        // Центральная часть Воронцовского парка и кварталы к востоку
        lat: 55.6680, lon: 37.5350, radius: 580,
        barrier: 'ул. Обручева (юг), ул. Наметкина (север)',
        slots: 2, taken: [],
      },
      {
        id: 'novye-cheremushki',
        name: 'Новые Черёмушки',
        anchor: 'м. Новые Черёмушки, от Наметкина до Гарибальди',
        // Квартал у м. Новые Черёмушки, между ул. Наметкина и Гарибальди
        lat: 55.6740, lon: 37.5440, radius: 560,
        barrier: 'ул. Наметкина (юг), ул. Гарибальди (север)',
        slots: 2, taken: [],
      },
      {
        id: 'novatorskaya',
        name: 'Новаторская',
        anchor: 'м. Новаторская (БКЛ), от Обручева до Ленинского',
        // Зона у м. Новаторская, между ул. Обручева и Ленинским пр., ул. Пилюгина
        lat: 55.6760, lon: 37.5210, radius: 570,
        barrier: 'ул. Обручева (юг), Ленинский пр. (север/запад), Акад. Пилюгина (восток)',
        slots: 2, taken: [],
      },
    ],
  },

  // ── ЧЕРЁМУШКИ ────────────────────────────────────────────────────────────
  {
    id: 'cheryomushki',
    name: 'Черёмушки',
    zones: [
      {
        id: 'cheremushki-north',
        name: 'Черёмушки — Север',
        anchor: 'От Обручева до Наметкина, у Севастопольского пр.',
        // Северная полоса Черёмушек, примыкает к Севастопольскому
        lat: 55.6650, lon: 37.5580, radius: 560,
        barrier: 'ул. Обручева (юг), ул. Наметкина (север), Севастопольский пр. (восток)',
        slots: 2, taken: [],
      },
      {
        id: 'cheremushki-center',
        name: 'Черёмушки — Центр',
        anchor: 'От Наметкина до Гарибальди',
        // Центральная полоса, м. Профсоюзная рядом
        lat: 55.6720, lon: 37.5600, radius: 560,
        barrier: 'ул. Наметкина (юг), ул. Гарибальди (север), Профсоюзная (запад)',
        slots: 2, taken: [],
      },
      {
        id: 'cheremushki-south',
        name: 'Черёмушки — Юг',
        anchor: 'От Гарибальди до Нахимовского пр.',
        // Южная полоса, граница с Обручевским/Академическим
        lat: 55.6790, lon: 37.5620, radius: 550,
        barrier: 'ул. Гарибальди (юг), Нахимовский пр. (север), Профсоюзная (запад)',
        slots: 2, taken: [],
      },
    ],
  },

  // ── ЛОМОНОСОВСКИЙ ────────────────────────────────────────────────────────
  {
    id: 'lomonosovsky',
    name: 'Ломоносовский',
    zones: [
      {
        id: 'lomonosovsky-vorontsovsky',
        name: 'Воронцовский — Ломоносовский',
        anchor: 'От Воронцовского парка до Гарибальди',
        // Западная часть района, у Воронцовского парка
        lat: 55.6710, lon: 37.5080, radius: 580,
        barrier: 'Воронцовский парк (восток), ул. Гарибальди (север)',
        slots: 2, taken: [],
      },
      {
        id: 'lomonosovsky-leninsky',
        name: 'Ленинский — Вернадского',
        anchor: 'От Ленинского до Вернадского, ул. Крупской и Строителей',
        // Центральная часть, жилые кварталы между Ленинским и Вернадского
        lat: 55.6820, lon: 37.5010, radius: 600,
        barrier: 'Ленинский пр. (север), пр. Вернадского (запад), ул. Крупской (ось)',
        slots: 2, taken: [],
      },
      {
        id: 'lomonosovsky-nakhimovsky',
        name: 'Ломоносовский — Нахимовский',
        anchor: 'От Гарибальди до Нахимовского пр.',
        // Восточная полоса, граница с Черёмушками
        lat: 55.6790, lon: 37.5170, radius: 560,
        barrier: 'ул. Гарибальди (юг), Нахимовский пр. (север), граница с Черёмушками (восток)',
        slots: 2, taken: [],
      },
    ],
  },
]

// Плоский список всех зон — для отправки на бэкенд одним запросом
const ALL_ZONES = DISTRICTS.flatMap(d =>
  d.zones.map(z => ({ ...z, districtId: d.id, districtName: d.name }))
)

// ═══════════════════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════════════════
const API_BASE = 'https://insalon.onrender.com/api/lovi'

async function loadFromCache(zoneId) {
  const r = await fetch(`${API_BASE}/zones/search?zone_id=${zoneId}`)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

async function refreshAllZones(zones) {
  const r = await fetch(`${API_BASE}/zones/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      zones: zones.map(z => ({ id: z.id, lat: z.lat, lon: z.lon, radius: z.radius })),
    }),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${r.status}`)
  }
  return r.json()
}

// ═══════════════════════════════════════════════════════════════════════════
// УТИЛИТЫ
// ═══════════════════════════════════════════════════════════════════════════
function densityLabel(count) {
  if (count === null || count === undefined) return null
  if (count === 0)  return { text: 'нет объектов',    level: 'success' }
  if (count <= 2)   return { text: `${count} объекта`, level: 'success' }
  if (count <= 5)   return { text: `${count} объектов`, level: 'warning' }
  return               { text: `${count} объектов`, level: 'danger' }
}

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.1)',  color: '#065f46' },
  warning: { bg: 'rgba(245,158,11,0.1)', color: '#78350f' },
  danger:  { bg: 'rgba(239,68,68,0.1)',  color: '#7f1d1d' },
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// КОМПОНЕНТЫ
// ═══════════════════════════════════════════════════════════════════════════

function Badge({ level, text }) {
  const c = COLORS[level]
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600,
      padding: '3px 8px', borderRadius: 6,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {text}
    </span>
  )
}

function SlotDots({ zone }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: zone.slots }).map((_, i) => (
        <div key={i} style={{
          width: 9, height: 9, borderRadius: '50%',
          background: i < (zone.taken?.length ?? 0) ? '#F97316' : 'rgba(18,26,18,0.15)',
          border: i < (zone.taken?.length ?? 0) ? 'none' : '1px solid rgba(18,26,18,0.2)',
        }} />
      ))}
      <span style={{ fontSize: 11, color: '#8F8475', marginLeft: 4 }}>
        {zone.slots - (zone.taken?.length ?? 0)} из {zone.slots}
      </span>
    </div>
  )
}

function ZoneCard({ zone, data, loading, active, onClick }) {
  const label = data && !data.cache_miss ? densityLabel(data.count) : null

  return (
    <div
      onClick={onClick}
      style={{
        background: active ? '#fff' : 'rgba(255,255,255,0.6)',
        border: active ? '1.5px solid #F97316' : '1px solid rgba(18,26,18,0.08)',
        borderRadius: 16,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 6, gap: 8,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#121A12', lineHeight: 1.25, flex: 1 }}>
          {zone.name}
        </div>
        {loading && <span style={{ fontSize: 11, color: '#8F8475', flexShrink: 0 }}>загрузка…</span>}
        {label && !loading && <Badge level={label.level} text={label.text} />}
        {data?.cache_miss && !loading && (
          <span style={{ fontSize: 11, color: '#8F8475', flexShrink: 0 }}>нет данных</span>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#8F8475', marginBottom: 10 }}>{zone.anchor}</div>
      <SlotDots zone={zone} />
    </div>
  )
}

function ZoneDetail({ zone, data, loading, onClose }) {
  if (!zone) return null

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(18,26,18,0.08)',
      borderRadius: 20,
      padding: 24,
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 140px)',
    }}>
      <button
        onClick={onClose}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#8F8475', fontSize: 12, fontWeight: 600,
          padding: 0, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit',
        }}
      >
        <Icon i={ChevronLeft} size={14} /> все зоны
      </button>

      <div style={{ fontSize: 22, fontFamily: 'Playfair Display,serif', color: '#121A12', marginBottom: 4 }}>
        {zone.name}
      </div>
      <div style={{ fontSize: 13, color: '#8F8475', marginBottom: 20 }}>{zone.anchor}</div>

      {[
        ['Барьеры', zone.barrier],
        ['Радиус', `${zone.radius} м`],
        ['Слоты', `${zone.slots - (zone.taken?.length ?? 0)} свободно из ${zone.slots}`],
        ['Данные обновлены', data?.fetched_at ? fmt(data.fetched_at) : '—'],
      ].map(([label, val]) => (
        <div key={label} style={{
          display: 'flex', gap: 12, fontSize: 13,
          padding: '8px 0', borderBottom: '1px solid rgba(18,26,18,0.06)',
        }}>
          <span style={{ color: '#8F8475', minWidth: 130 }}>{label}</span>
          <span style={{ color: '#121A12' }}>{val}</span>
        </div>
      ))}

      {/* Наш партнёр */}
      {(zone.taken?.length ?? 0) > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#8F8475', marginBottom: 8,
          }}>
            Наш партнёр
          </div>
          {zone.taken.map(t => (
            <div key={t.salon} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              background: 'rgba(249,115,22,0.06)',
              border: '1px solid rgba(249,115,22,0.2)',
              borderRadius: 10, padding: '10px 12px',
            }}>
              <Icon i={CheckCircle} size={16} color="#F97316" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#121A12' }}>{t.salon}</div>
                <div style={{ fontSize: 12, color: '#8F8475', marginTop: 2 }}>{t.address}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Объекты 2GIS */}
      <div style={{ marginTop: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#8F8475', marginBottom: 10,
        }}>
          Объекты в зоне
        </div>

        {loading && (
          <div style={{ fontSize: 13, color: '#8F8475' }}>Читаем из кэша…</div>
        )}

        {!loading && (!data || data.cache_miss) && (
          <div style={{
            fontSize: 13, color: '#8F8475',
            background: 'rgba(18,26,18,0.03)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            Данных нет. Нажмите «Обновить данные» в шапке чтобы загрузить из 2GIS.
          </div>
        )}

        {!loading && data && !data.cache_miss && data.count === 0 && (
          <div style={{
            fontSize: 13, color: '#065f46',
            background: 'rgba(16,185,129,0.08)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            Объектов в зоне не найдено — хорошая возможность.
          </div>
        )}

        {!loading && data?.items?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.items.map((item, i) => (
              <div key={item.dgis_id ?? i} style={{
                background: 'rgba(18,26,18,0.03)',
                border: '1px solid rgba(18,26,18,0.06)',
                borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#121A12', flex: 1, marginRight: 8 }}>
                    {item.name}
                  </div>
                  {item.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <Icon i={Star} size={12} color="#F97316" />
                      <span style={{ fontSize: 12, color: '#121A12', fontWeight: 500 }}>{item.rating}</span>
                      {item.reviews_count && (
                        <span style={{ fontSize: 11, color: '#8F8475' }}>({item.reviews_count})</span>
                      )}
                    </div>
                  )}
                </div>
                {item.address && (
                  <div style={{ fontSize: 12, color: '#8F8475', marginTop: 3 }}>{item.address}</div>
                )}
                {item.rubrics?.length > 0 && (
                  <div style={{ fontSize: 11, color: '#8F8475', marginTop: 4 }}>
                    {item.rubrics.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ГЛАВНАЯ СТРАНИЦА
// ═══════════════════════════════════════════════════════════════════════════
export default function ZoneMap() {
  const [activeDistrictId, setActiveDistrictId] = useState(DISTRICTS[0].id)
  const [activeZoneId, setActiveZoneId] = useState(null)
  const [zoneData, setZoneData]   = useState({})
  const [loadingMap, setLoadingMap] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [refreshedAt, setRefreshedAt] = useState(null)

  const activeDistrict = DISTRICTS.find(d => d.id === activeDistrictId)
  const activeZone = ALL_ZONES.find(z => z.id === activeZoneId)

  // При монтировании — читаем все зоны из кэша параллельно
  useEffect(() => {
    async function loadAll() {
      await Promise.all(
        ALL_ZONES.map(async (z) => {
          setLoadingMap(prev => ({ ...prev, [z.id]: true }))
          try {
            const data = await loadFromCache(z.id)
            setZoneData(prev => ({ ...prev, [z.id]: data }))
          } catch {
            // не блокируем — просто нет данных
          } finally {
            setLoadingMap(prev => ({ ...prev, [z.id]: false }))
          }
        })
      )
    }
    loadAll()
  }, [])

  // Кнопка «Обновить данные» — запрашивает 2GIS и обновляет кэш
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    setError(null)
    try {
      await refreshAllZones(ALL_ZONES)
      // После сохранения в кэш — перечитываем
      await Promise.all(
        ALL_ZONES.map(async (z) => {
          try {
            const data = await loadFromCache(z.id)
            setZoneData(prev => ({ ...prev, [z.id]: data }))
          } catch { /* ignore */ }
        })
      )
      setRefreshedAt(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const totalZones   = ALL_ZONES.length
  const cachedZones  = Object.values(zoneData).filter(d => d && !d.cache_miss).length
  const totalObjects = Object.values(zoneData).reduce((s, d) => s + (d?.count ?? 0), 0)

  return (
    <div style={{
      background: '#FDFCF9', minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif', color: '#121A12',
    }}>
      {/* Шапка */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(253,252,249,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(18,26,18,0.08)',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.svg" alt="Лови" style={{ height: 20 }} />
          <span style={{
            fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#8F8475', fontWeight: 600,
          }}>
            Аналитика зон спроса · ЮЗАО
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {cachedZones > 0 && (
            <span style={{ fontSize: 12, color: '#8F8475' }}>
              данные по {cachedZones}/{totalZones} зонам
              {refreshedAt && ` · обновлено ${fmt(refreshedAt.toISOString())}`}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              background: refreshing ? 'rgba(18,26,18,0.3)' : '#121A12',
              color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: 12,
              fontSize: 13, fontWeight: 600,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <Icon i={refreshing ? Search : RefreshCw} size={14} color="#fff" />
            {refreshing ? 'Загружаем из 2GIS…' : 'Обновить данные'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          margin: '16px 32px 0',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', gap: 10, alignItems: 'center',
          fontSize: 13, color: '#7f1d1d',
        }}>
          <Icon i={AlertCircle} size={16} color="#dc2626" />
          {error}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px' }}>

        {/* Табы районов */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {DISTRICTS.map(d => {
            const cached = d.zones.filter(z => zoneData[z.id] && !zoneData[z.id].cache_miss).length
            const isActive = d.id === activeDistrictId
            return (
              <button
                key={d.id}
                onClick={() => { setActiveDistrictId(d.id); setActiveZoneId(null) }}
                style={{
                  background: isActive ? '#121A12' : 'transparent',
                  color: isActive ? '#fff' : '#121A12',
                  border: isActive ? 'none' : '1px solid rgba(18,26,18,0.15)',
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {d.name}
                {cached > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(18,26,18,0.08)',
                    fontSize: 10, padding: '2px 6px', borderRadius: 6,
                  }}>
                    {cached}/{d.zones.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Двухколоночный лейаут */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: activeZone ? '340px 1fr' : '1fr',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          {/* Список зон текущего района */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeDistrict?.zones.map(zone => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                data={zoneData[zone.id]}
                loading={!!loadingMap[zone.id]}
                active={activeZoneId === zone.id}
                onClick={() => setActiveZoneId(prev => prev === zone.id ? null : zone.id)}
              />
            ))}
          </div>

          {/* Детальная панель */}
          {activeZone && (
            <div style={{ position: 'sticky', top: 72 }}>
              <ZoneDetail
                zone={activeZone}
                data={zoneData[activeZone.id]}
                loading={!!loadingMap[activeZone.id]}
                onClose={() => setActiveZoneId(null)}
              />
            </div>
          )}
        </div>

        {/* Сводная статистика */}
        {cachedZones > 0 && (
          <div style={{
            marginTop: 40, paddingTop: 28,
            borderTop: '1px solid rgba(18,26,18,0.08)',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#8F8475', marginBottom: 16,
            }}>
              Сводка по всем загруженным зонам
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}>
              {[
                { label: 'Всего объектов', value: totalObjects },
                {
                  label: 'Зон без объектов',
                  value: Object.values(zoneData).filter(d => d && !d.cache_miss && d.count === 0).length,
                },
                {
                  label: 'Высокая плотность (6+)',
                  value: Object.values(zoneData).filter(d => d && !d.cache_miss && d.count >= 6).length,
                },
                { label: 'Зон с данными', value: `${cachedZones} / ${totalZones}` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(18,26,18,0.03)',
                  border: '1px solid rgba(18,26,18,0.06)',
                  borderRadius: 14, padding: '14px 16px',
                }}>
                  <div style={{
                    fontSize: 24, fontWeight: 600, color: '#121A12',
                    fontFamily: 'Playfair Display,serif',
                  }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 12, color: '#8F8475', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
