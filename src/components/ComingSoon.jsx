import { useIsMobile } from '../hooks/useIsMobile'

export default function ComingSoon({ title }) {
  const isMobile = useIsMobile()

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '60px 24px' : '80px 40px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>

        {/* Живая точка */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent)', display: 'inline-block',
            animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--secondary)' }}>
            {title || 'Скоро'}
          </span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: isMobile ? 32 : 44,
          fontWeight: 600,
          color: 'var(--dark)',
          lineHeight: 1.15,
          margin: '0 0 20px',
          letterSpacing: '-0.02em',
        }}>
          Хорошие слоты<br />долго не живут
        </h1>

        {/* H2 */}
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: isMobile ? 17 : 20,
          fontWeight: 400,
          color: 'var(--secondary)',
          lineHeight: 1.5,
          margin: '0 0 20px',
        }}>
          Эта страница ещё обновляется,<br />
          но новые предложения появляются<br />
          в системе каждую минуту.
        </h2>

        {/* Текст */}
        <p style={{
          fontSize: 14,
          color: 'rgba(18,26,18,0.4)',
          lineHeight: 1.7,
          margin: '0 0 40px',
        }}>
          Не уходите далеко — контент появится раньше,<br />
          чем вы нажмёте «Лови» на ближайшее окошко.
        </p>

        {/* CTA */}
        <a href="/" style={{
          display: 'inline-block',
          background: 'var(--dark)',
          color: '#fff',
          textDecoration: 'none',
          padding: '14px 32px',
          borderRadius: 14,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Смотреть окошки →
        </a>

      </div>
    </div>
  )
}