import { useIsMobile } from '../hooks/useIsMobile'

export default function About() {
  const isMobile = useIsMobile()

  const s = {
    page:    { background: 'var(--bg)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    section: { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' },
    label:   { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 12 },
  }

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={{
        background: `radial-gradient(ellipse at 75% 8%, rgba(255,255,255,0.32) 0%, transparent 50%), #3D3830`,
        color: '#fff',
        padding: isMobile ? '60px 20px 56px' : '80px 40px 72px'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ ...s.label, color: 'rgba(255,255,255,0.3)' }}>О сервисе</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 32 : 52,
            fontWeight: 600,
            lineHeight: 1.15,
            margin: '0 0 24px',
            letterSpacing: '-0.02em',
            maxWidth: 680
          }}>
            Мы верим, что сервис должен работать на человека
          </h1>
          <p style={{
            fontSize: isMobile ? 15 : 18,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: 0
          }}>
            А не наоборот.
          </p>
        </div>
      </div>

      {/* Кто мы */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#F1F0EC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Кто мы</div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 22 : 32, color: 'var(--dark)', lineHeight: 1.4, margin: '0 0 24px', maxWidth: 700 }}>
            Мы не вчерашние студенты. За плечами у нас — создание сложных цифровых сервисов для самых разных сфер: от медицины до рынка труда.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620, marginBottom: 20 }}>
            Мы автоматизировали процессы, где раньше всё держалось на бумаге и звонках. И каждый раз видели, как правильный сервис освобождает людям время, нервы и деньги.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620 }}>
            Нас объединяет простая любовь: мы любим рынок услуг. Там, где один человек помогает другому — массажем, уходом, заботой. И нам больно видеть, как много в этой индустрии теряется из-за неэффективности. Мастер сидит без клиента. Клиент не может найти свободное окно. Салон теряет деньги на пустом кресле.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620, marginTop: 20 }}>
            Мы решили это исправить. Так появился «Лови».
          </p>
        </div>
      </div>

      {/* Наш принцип */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Наш принцип</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 26 : 34, color: 'var(--dark)', lineHeight: 1.3, margin: '0 0 24px' }}>
            Выигрывают все
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
            {[
              { title: 'Клиент', text: 'Получает премиальный сервис дешевле, в удобное время, без долгих поисков.' },
              { title: 'Мастер', text: 'Остаётся при деле, не простаивает.' },
              { title: 'Салон', text: 'Зарабатывает на тех часах, которые раньше просто сгорали.' },
              { title: 'Без компромиссов', text: 'Качество и цены основного потока остаются нетронутыми. Так работают лучшие мировые практики, и мы аккуратно принесли их в мир услуг.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: isMobile ? '24px 22px' : '28px 28px'
              }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--dark)', marginBottom: 10, lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Как мы работаем и Почему именно Лови */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#F1F0EC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Как мы работаем</div>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620, margin: '0 0 32px' }}>
            Каждый день мы на связи с владельцами салонов и мастерами. Тестируем гипотезы, спрашиваем, что неудобно, и тут же переделываем. Сбор обратной связи — не галочка, а основа нашей работы.
          </p>

          <div style={{ margin: '48px 0' }}>
            <div style={s.label}>Почему именно «Лови»</div>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620, margin: '0 0 20px' }}>
              Мы не строим очередной маркетплейс с миллионом категорий. Мы сфокусировались на одной задаче: помочь салонам продать то, что иначе пропадёт. Без вреда для бренда, без скидочной гонки. Только честная дополнительная выручка.
            </p>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620 }}>
              Наш опыт научил нас главному: автоматизация не должна быть сложной для пользователя. Она должна быть незаметной, как хорошо работающий кондиционер — вы чувствуете комфорт, но не думаете о механизмах. В «Лови» всё работает так же: запись появляется в расписание, деньги приходят на счёт, клиент доволен — и ничего лишнего.
            </p>
          </div>
        </div>
      </div>

      {/* Наша цель + кнопки */}
      <div style={{ padding: isMobile ? '48px 20px 64px' : '72px 40px 88px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={s.label}>Наша цель</div>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 22 : 32,
            color: 'var(--dark)',
            lineHeight: 1.4,
            maxWidth: 700,
            margin: '0 auto 32px'
          }}>
            Мы хотим, чтобы через три года любой владелец салона в России знал: пустое кресло — это не убыток, а возможность.
          </p>
          <p style={{
            fontSize: 15,
            color: 'var(--secondary)',
            lineHeight: 1.7,
            maxWidth: 620,
            margin: '0 auto 40px',
            textAlign: 'center'
          }}>
            Мы будем двигаться маленькими шагами, без распыления. Сейчас — Москва, массаж, одна простая механика. Дальше — больше городов, категорий и возможностей. Но всегда с одной мыслью: упрощать жизнь людям и помогать бизнесу.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href="/" style={{
              display: 'inline-block',
              background: 'var(--dark)',
              color: '#fff',
              textDecoration: 'none',
              padding: isMobile ? '14px 28px' : '16px 36px',
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 600,
              transition: 'opacity 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Попробовать
            </a>
            <a href="/partners" style={{
              display: 'inline-block',
              background: '#F97316',
              color: '#fff',
              textDecoration: 'none',
              padding: isMobile ? '14px 28px' : '16px 36px',
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 600,
              transition: 'opacity 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Стать партнёром
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}