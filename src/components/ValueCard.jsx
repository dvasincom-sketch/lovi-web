import { useIsMobile } from '../hooks/useIsMobile'

// SVG-иконки
function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 2C5.24 2 3 4.24 3 7c0 3.5 5 8.5 5 8.5S13 10.5 13 7c0-2.76-2.24-5-5-5z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7.5" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="1.1" fill="currentColor"/>
    </svg>
  )
}

function IconVault() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="2.5" width="11" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="7" cy="7" r="0.7" fill="currentColor"/>
      <path d="M1.5 5h11" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

function IconInfinity() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c1.5 0 2.5 2 4 2s2.5-2 4-2 2 .9 2 2-.9 2-2 2-2-.9-2-2c-1.5 0-2.5 2-4 2z"
        stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

function IconTrend() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polyline points="1,10.5 4.5,6.5 7,8.5 10,4.5 13,2.5"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="10,2.5 13,2.5 13,5.5"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const FEATURES = [
  {
    Icon: IconPin,
    title: 'Снайпер локаций',
    text: 'Зафиксируйте любимый район. Пришлём пуш, как только в нём освободится горящее время.',
  },
  {
    Icon: IconGrid,
    title: 'Свобода выбора',
    text: 'Один абонемент — десятки направлений. Массаж, лицо, волосы. 5 сеансов — один ключ.',
  },
  {
    Icon: IconLock,
    title: 'Закрытый доступ',
    text: 'Первыми тестируйте топовые пространства до публичного запуска.',
  },
]

const DEPOSIT_ITEMS = [
  { Icon: IconVault,    title: 'Ваш баланс',        text: '15 000 ₽ зачисляются на личный счёт. Тратьте на любые услуги в системе.' },
  { Icon: IconInfinity, title: 'Не сгорает',         text: 'Пользуйтесь через неделю или через полгода — срока нет.' },
  { Icon: IconTrend,    title: 'Остаток работает',   text: 'На остаток начисляется бонус 10%. Деньги не простаивают.' },
]

// Props:
//   searchQuery — { location, service } | null
//   Компонент невидим пока searchQuery === null
export default function ValueCard({ searchQuery }) {
  const isMobile = useIsMobile()

  if (!searchQuery) return null

  const locationLabel = searchQuery.location || 'выбранном районе'

  return (
    <div
      id="value-card-section"
      style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '0 16px 48px' : '0 40px 64px',
        animation: 'fadeUp 0.5s cubic-bezier(0.2,1,0.2,1) both',
      }}
    >
      <div style={{
        background: '#121A12',
        borderRadius: isMobile ? 24 : 40,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Accent glow */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* ── Шапка ── */}
        <div style={{
          padding: isMobile ? '32px 24px 28px' : '48px 48px 36px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
            fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)',
              animation: 'pulse 1.6s ease-in-out infinite', flexShrink: 0,
            }}/>
            Private Beta
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 24 : 32,
            fontWeight: 500, lineHeight: 1.15, color: '#fff',
            marginBottom: 10,
          }}>
            Найдены окна по вашему запросу
          </div>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
            margin: 0, maxWidth: 520,
          }}>
            Сейчас Lovi работает в режиме Private Beta. Свободные слоты доступны
            только владельцам{' '}
            <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Lovi Pass</span>.
          </p>
        </div>

        {/* ── Тело ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        }}>

          {/* ── Левая: аргументы ── */}
          <div style={{
            padding: isMobile ? '28px 24px' : '40px 48px',
            borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
            borderBottom: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
            display: 'flex', flexDirection: 'column',
          }}>
            {FEATURES.map(({ Icon, title, text }, i) => (
              <div key={title} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                paddingBottom: i < FEATURES.length - 1 ? 28 : 0,
                marginBottom: i < FEATURES.length - 1 ? 28 : 0,
                borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <span style={{
                  flexShrink: 0, marginTop: 3,
                  color: 'var(--accent)', opacity: 0.7, display: 'flex',
                }}>
                  <Icon />
                </span>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: 'rgba(255,255,255,0.88)', marginBottom: 6,
                  }}>{title}</div>
                  <div style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65,
                  }}>{text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Правая: депозит + CTA ── */}
          <div style={{
            padding: isMobile ? '28px 24px 32px' : '40px 48px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>

            {/* Депозитный блок */}
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, overflow: 'hidden',
              background: 'rgba(255,255,255,0.04)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                }}>
                  Депозит, не расход
                </span>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(249,115,22,0.15)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: 20, padding: '3px 10px',
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 800,
                    color: 'var(--accent)', letterSpacing: '-0.01em',
                  }}>+10%</span>
                  <span style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500,
                  }}>на остаток</span>
                </div>
              </div>

              {DEPOSIT_ITEMS.map(({ Icon, title, text }, i) => (
                <div key={title} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 16px',
                  borderBottom: i < DEPOSIT_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span style={{
                    flexShrink: 0, marginTop: 2,
                    color: 'rgba(255,255,255,0.3)', display: 'flex',
                  }}>
                    <Icon />
                  </span>
                  <div>
                    <div style={{
                      fontSize: 12, fontWeight: 600,
                      color: 'rgba(255,255,255,0.75)', marginBottom: 2,
                    }}>{title}</div>
                    <div style={{
                      fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55,
                    }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <button style={{
                width: '100%', padding: '16px',
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 16, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                marginBottom: 10,
                boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.35)' }}
              >
                Активировать Lovi Pass — 15 000 ₽
              </button>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center',
              }}>
                 · Баланс не сгорает
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}