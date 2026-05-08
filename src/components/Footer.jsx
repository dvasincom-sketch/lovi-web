import { useIsMobile } from '../hooks/useIsMobile'

const ANCHORS = [
  { label: 'Ближайшие окошки', href: '#slots' },
  { label: 'О сервисе',        href: '#about' },
]

const PARTNER_LINKS = [
  { label: 'Подключить салон', href: '/salon/login' },
  { label: 'Кабинет партнёра', href: '/salon/dashboard' },
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Footer() {
  const isMobile = useIsMobile()

  const s = {
    wrap: {
      background: '#1C1F1C',
      color: 'rgba(255,255,255,0.55)',
      fontFamily: 'Inter, sans-serif',
      padding: isMobile ? '40px 20px 32px' : '56px 40px 40px',
    },
    inner: {
      maxWidth: 1200,
      margin: '0 auto',
    },
    top: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      gap: isMobile ? 32 : 48,
      marginBottom: isMobile ? 32 : 48,
      paddingBottom: isMobile ? 32 : 48,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    logo: {
      filter: 'brightness(0) invert(1)',
      opacity: 0.7,
      height: 24,
      marginBottom: isMobile ? 0 : 0,
    },
    colTitle: {
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)',
      marginBottom: 14,
    },
    link: {
      display: 'block',
      fontSize: 14,
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none',
      marginBottom: 10,
      cursor: 'pointer',
      transition: 'color 0.15s',
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
      color: 'rgba(255,255,255,0.25)',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.15s',
    },
  }

  return (
    <footer style={s.wrap}>
      <div style={s.inner}>
        <div style={s.top}>

          {/* Логотип */}
          <div>
            <img src="/logo.svg" alt="LOVI" style={s.logo} />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 12, lineHeight: 1.6 }}>
              Yield Management<br />для wellness-салонов
            </div>
          </div>

          {/* Навигация по главной */}
          <div>
            <div style={s.colTitle}>На странице</div>
            {ANCHORS.map(a => (
              <span key={a.href} style={s.link}
                onClick={() => scrollTo(a.href.replace('#', ''))}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                {a.label}
              </span>
            ))}
          </div>

          {/* Партнёрам */}
          <div>
            <div style={s.colTitle}>Партнёрам</div>
            {PARTNER_LINKS.map(l => (
              <a key={l.href} href={l.href} style={s.link}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                {l.label} →
              </a>
            ))}
          </div>

          {/* Контакты */}
          <div>
            <div style={s.colTitle}>Контакты</div>
            <a href="mailto:hello@lovi.today" style={s.link}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              hello@lovi.today
            </a>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 4, lineHeight: 1.6 }}>
              Москва, 2026
            </div>
          </div>

        </div>

        {/* Нижняя строка */}
        <div style={s.bottom}>
          <div style={s.copy}>© 2026 Lovi.today. Все права защищены.</div>
          <div style={s.legal}>
            <span style={s.legalLink}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
              Политика конфиденциальности
            </span>
            <span style={s.legalLink}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
              Публичная оферта
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}