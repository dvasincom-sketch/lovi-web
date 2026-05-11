import { useIsMobile } from '../hooks/useIsMobile'
import { useNavigate } from 'react-router-dom'

// Якоря — скролл к элементу на главной
function scrollToAnchor(id, navigate) {
  if (window.location.pathname !== '/') {
    sessionStorage.setItem('scrollTo', id)
    navigate('/')
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
  { label: 'Библиотека',  href: '/library' },
]

const PARTNER_LINKS = [
  { label: 'Подключить салон', href: '/partners' },
  { label: 'Кабинет партнёра', href: '/salon/login' },
]

const COLLAB_LINKS = [
  { label: 'Инвесторам',     href: '/investor',         sub: 'Yield Management платформа' },
  { label: 'Маркетологам',   href: '/research',         sub: 'Исследования и данные' },
  { label: 'Исследователям', href: '/research/dataset', sub: 'Открытый датасет 2026' },
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
      padding: isMobile ? '0 0 36px' : '0 0 44px',
    },
    inner: {
      maxWidth: 1200,
      margin: '0 auto',
    },
    top: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : '1.2fr 1fr 1fr 1fr 1fr',
      gap: isMobile ? '32px 24px' : 40,
      marginBottom: isMobile ? 36 : 52,
      paddingBottom: isMobile ? 36 : 52,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    tagline: {
      fontSize: isMobile ? 22 : 24,
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
      alignItems: isMobile ? 'flex-start' : 'flex-start',
      gap: 24,
    },
    legalText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxWidth: isMobile ? '100%' : '65%',
    },
    copy: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.35)',
      lineHeight: 1.6,
    },
    disclaimer: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.25)',
      lineHeight: 1.6,
    },
    legal: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap',
      alignItems: 'center',
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

        {/* Top grid — два визуальных блока B2C / B2B */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          borderRadius: 0,
          overflow: 'hidden',
          marginBottom: isMobile ? 32 : 44,
        }}>
          {/* ── B2C зона — чуть светлее ─────────────────────────────────── */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: isMobile ? '32px 20px' : '40px 36px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1.4fr 1fr 1fr',
            gap: isMobile ? '28px 20px' : 40,
            borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)',
            borderBottom: isMobile ? '1px solid rgba(255,255,255,0.05)' : 'none',
            alignItems: 'start',
          }}>
            {/* Tagline */}
            <div style={{ ...s.tagline, gridColumn: isMobile ? 'span 2' : 'span 1' }}>
              Горящие окошки<br />рядом с вами
            </div>

            {/* Колонка — На странице */}
            <div>
              <div style={s.colTitle}>На странице</div>
              {NAV_LINKS.map(l => (
                <button key={l.anchor} style={s.link}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                  onClick={() => scrollToAnchor(l.anchor, navigate)}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Колонка — Сервис */}
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
          </div>

          {/* ── B2B зона — немного темнее ────────────────────────────────── */}
          <div style={{
            background: 'rgba(0,0,0,0.15)',
            padding: isMobile ? '32px 20px' : '40px 36px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr',
            gap: isMobile ? '28px 20px' : 40,
          }}>
            {/* Колонка — Партнёрам */}
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

            {/* Колонка — Сотрудничество */}
            <div>
              <div style={s.colTitle}>Сотрудничество</div>
              {COLLAB_LINKS.map(l => (
                <button
                  key={l.href}
                  style={{ ...s.link, marginBottom: 16 }}
                  onMouseEnter={e => {
                    e.currentTarget.querySelector('.collab-label').style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.querySelector('.collab-label').style.color = 'rgba(255,255,255,0.6)'
                  }}
                  onClick={() => navigate(l.href)}
                >
                  <div className="collab-label" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 3, transition: 'color 0.15s' }}>
                    {l.label} →
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                    {l.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Нижняя строка с юр. информацией */}
        <div style={{ ...s.bottom, padding: isMobile ? '0 20px' : '0 40px' }}>
          <div style={s.legalText}>
            <div style={s.copy}>
              © 2026 Lovi.today. Все права защищены. ОГРН 324774600002041, ИП Васин Дмитрий Вячеславович
            </div>
            <div style={s.disclaimer}>
              Оставляя заявку, вы подтверждаете согласие на обработку персональных данных в соответствии с законодательством Российской Федерации, в том числе ФЗ №152 «О персональных данных». Ваши данные используются исключительно для связи и информирования об услугах. Использование материалов сайта без согласия владельца запрещено.
            </div>
          </div>
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