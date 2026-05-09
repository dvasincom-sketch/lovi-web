import { useIsMobile } from '../hooks/useIsMobile'
import { useNavigate } from 'react-router-dom'

// Якоря — скролл к элементу на главной
function scrollToAnchor(id) {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const NAV_LINKS = [
  { label: 'Лучшее предложение', anchor: 'featured' },
  { label: 'Ближайшие окошки',   anchor: 'slots' },
  { label: 'Поиск скидок',       anchor: 'about' },
]

const SERVICE_LINKS = [
  { label: 'О сервисе',   href: '/about' },
  { label: 'Lovi Pass',   href: '/pass' },
  { label: 'Мои брони',   href: '/my-bookings' },
]

const PARTNER_LINKS = [
  { label: 'Подключить салон', href: '/partners' },,
  { label: 'Кабинет партнёра', href: '/salon/login' },
]

const LEGAL_LINKS = [
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Публичная оферта',            href: '/offer' },
]

export default function Footer() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const s = {
    wrap: {
      background: '#1C1F1C',
      fontFamily: 'Inter, sans-serif',
      padding: isMobile ? '48px 20px 36px' : '64px 40px 44px',
    },
    inner: {
      maxWidth: 1200,
      margin: '0 auto',
    },
    top: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : '1.2fr 1fr 1fr 1fr',
      gap: isMobile ? '32px 24px' : 48,
      marginBottom: isMobile ? 36 : 52,
      paddingBottom: isMobile ? 36 : 52,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    tagline: {
      fontSize: isMobile ? 22 : 26,
      color: 'rgba(255,255,255,0.75)',
      lineHeight: 1.4,
      fontWeight: 400,
      fontFamily: 'Playfair Display, serif',
      gridColumn: isMobile ? 'span 2' : 'span 1',
    },
    colTitle: {
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.28)',
      marginBottom: 16,
    },
    link: {
      display: 'block',
      fontSize: 14,
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none',
      marginBottom: 11,
      cursor: 'pointer',
      transition: 'color 0.15s',
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: 'Inter, sans-serif',
      textAlign: 'left',
    },
    bottom: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: 12,
    },
    copy: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.2)',
    },
    legal: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap',
    },
    legalLink: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.35)',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.15s',
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: 'Inter, sans-serif',
    },
  }

  function hoverOn(e)  { e.currentTarget.style.color = '#fff' }
  function hoverOff(e) { e.currentTarget.style.color = e.currentTarget.dataset.dim || 'rgba(255,255,255,0.6)' }

  return (
    <footer style={s.wrap}>
      <div style={s.inner}>
        <div style={s.top}>

          {/* Tagline */}
          <div style={s.tagline}>
            Горящие окошки<br />рядом с вами
          </div>

          {/* Колонка 1 — якоря */}
          <div>
            <div style={s.colTitle}>На странице</div>
            {NAV_LINKS.map(l => (
              <button key={l.anchor} style={s.link}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                onClick={() => scrollToAnchor(l.anchor)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Колонка 2 — сервис */}
          <div>
            <div style={s.colTitle}>Сервис</div>
            {SERVICE_LINKS.map(l => (
              <button key={l.href} style={s.link}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                onClick={() => navigate(l.href)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Колонка 3 — партнёрам */}
          <div>
            <div style={s.colTitle}>Партнёрам</div>
            {PARTNER_LINKS.map(l => (
              <button key={l.href} style={s.link}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                onClick={() => navigate(l.href)}>
                {l.label} →
              </button>
            ))}
            <div style={{ marginTop: 20 }}>
              <div style={s.colTitle}>Контакты</div>
              <a href="mailto:hello@lovi.today" style={s.link}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                hello@lovi.today
              </a>
            </div>
          </div>

        </div>

        {/* Нижняя строка */}
        <div style={s.bottom}>
          <div style={s.copy}>© 2026 Lovi.today. Все права защищены.</div>
          <div style={s.legal}>
            {LEGAL_LINKS.map(l => (
              <button key={l.href} style={s.legalLink}
                data-dim="rgba(255,255,255,0.35)"
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                onClick={() => navigate(l.href)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}