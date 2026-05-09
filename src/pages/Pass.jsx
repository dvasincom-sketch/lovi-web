import { useIsMobile } from '../hooks/useIsMobile'

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Приоритетный доступ',
    text: 'Вы видите окошки на 30 минут раньше, чем обычные пользователи. Этого достаточно, чтобы успеть забрать лучшее.',
  },
  {
    icon: '🎯',
    title: 'Персональная настройка',
    text: 'Укажите любимые станции метро, типы массажа, даже конкретных мастеров — и система будет искать только то, что нравится вам.',
  },
  {
    icon: '🔒',
    title: 'Особые часы',
    text: 'Некоторые салоны открывают для участников пасса отдельные слоты. Только для своих.',
  },
  {
    icon: '💎',
    title: 'Цена как для своих',
    text: 'Иногда цена для участников пасса дополнительно снижена. Потому что вы с нами всерьёз.',
  },
  {
    icon: '📲',
    title: 'Мгновенные уведомления',
    text: '«Ваш массаж спины через час у метро Беляево за 3 500 ₽ вместо 5 000».',
  },
]

const HOW_TO_JOIN = [
  { step: '01', title: 'Активируйте Pass', text: 'Нажмите кнопку ниже и внесите депозит 15 000 ₽.' },
  { step: '02', title: 'Настройте предпочтения', text: 'В личном кабинете выберите районы, услуги и время.' },
  { step: '03', title: 'Получайте уведомления', text: 'Лучшие окошки сами найдут вас раньше остальных.' },
  { step: '04', title: 'Бронируйте в один клик', text: 'Ваш депозит уже на счёте — оплата мгновенная.' },
]

export default function Pass() {
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
          <div style={{ ...s.label, color: 'rgba(255,255,255,0.3)' }}>Для участников</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 32 : 52,
            fontWeight: 600,
            lineHeight: 1.15,
            margin: '0 0 24px',
            letterSpacing: '-0.02em',
            maxWidth: 680
          }}>
            Ваш личный ключ к лучшим окошкам
          </h1>
          <p style={{
            fontSize: isMobile ? 15 : 18,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '0 0 40px'
          }}>
            Lovi Pass — участие в закрытом клубе, где горячие слоты находят вас сами.
            По вашим правилам, в ваших любимых местах.
          </p>
          <a href="#join" style={{
            display: 'inline-block',
            background: '#F97316',
            color: '#fff',
            textDecoration: 'none',
            padding: isMobile ? '14px 28px' : '16px 36px',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 600,
            transition: 'opacity 0.2s',
            boxShadow: '0 8px 20px rgba(249,115,22,0.3)'
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Активировать Lovi Pass →
          </a>
        </div>
      </div>

      {/* Что такое Lovi Pass */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#F1F0EC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Что такое Lovi Pass</div>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 22 : 32,
            color: 'var(--dark)',
            lineHeight: 1.4,
            margin: '0 0 20px',
            maxWidth: 700
          }}>
            Как персональный консьерж, который тихо сообщает: «Ваше окно открылось, идите».
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620 }}>
            Вы вносите депозит — и становитесь приоритетным участником. Когда в выбранном вами районе или салоне появляется горячее окошко, система уведомляет вас раньше всех. Вы видите предложение первым и можете забронировать, пока остальные ещё не знают.
          </p>
        </div>
      </div>

      {/* Депозит, который растёт */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={s.label}>Депозит, который работает на вас</div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: isMobile ? 26 : 34,
              color: 'var(--dark)',
              lineHeight: 1.3,
              margin: '0 0 20px'
            }}>
              Ваш взнос не сгорает. Никогда.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 450, marginBottom: 20 }}>
              Он лежит на вашем счёте и ждёт своего часа. А чтобы лежать было веселее, мы начисляем <strong style={{ color: 'var(--accent)' }}>10% на остаток</strong>.
            </p>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 450 }}>
              Lovi Pass — вклад в ваш комфорт, который ещё и растёт.
            </p>
          </div>

          {/* Визуальная карточка депозита */}
          <div style={{
            background: '#F1F0EC',
            borderRadius: 24,
            padding: isMobile ? '28px 24px' : '36px 36px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: isMobile ? 28 : 36,
              color: 'var(--dark)',
              lineHeight: 1.2,
              marginBottom: 12
            }}>
              15 000 ₽
            </div>
            <div style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 24 }}>
              Депозит, который открывает доступ ко всем привилегиям
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                flex: 1,
                background: '#fff',
                borderRadius: 14,
                padding: '16px',
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)' }}>10%</div>
                <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4 }}>
                  начисляем на остаток
                </div>
              </div>
              <div style={{
                flex: 1,
                background: '#fff',
                borderRadius: 14,
                padding: '16px',
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#F97316' }}>0 ₽</div>
                <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4 }}>
                  комиссия за вывод
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#F1F0EC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Что вы получаете как участник</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: isMobile ? 16 : 24,
            marginTop: 24
          }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: isMobile ? '24px 22px' : '28px 28px'
              }}>
                <div style={{ fontSize: 24, marginBottom: 14 }}>{b.icon}</div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: isMobile ? 18 : 20,
                  color: 'var(--dark)',
                  marginBottom: 10,
                  lineHeight: 1.3
                }}>{b.title}</div>
                <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7 }}>{b.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Почему выгодно */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Почему это выгодно</div>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 22 : 32,
            color: 'var(--dark)',
            lineHeight: 1.4,
            margin: '0 0 20px',
            maxWidth: 700
          }}>
            Даже если вы берёте окошко раз в месяц, Lovi Pass экономит ваши деньги и время.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620, marginBottom: 20 }}>
            Вы не мониторите приложение, не сравниваете — вы просто берёте свой идеальный слот тогда, когда он появляется.
            А 10% на остаток делают ожидание приятным.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620 }}>
            Для тех, кто уже влюбился в Lovi и планирует пользоваться регулярно, это и вовсе must-have.
            Депозит быстро окупается за счёт повышенных скидок и отсутствия конкуренции за лучшие места.
          </p>
        </div>
      </div>

      {/* Кто уже с нами */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px', background: '#F1F0EC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={s.label}>Кто уже с нами</div>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 22 : 32,
            color: 'var(--dark)',
            lineHeight: 1.4,
            margin: '0 0 20px',
            maxWidth: 700
          }}>
            Первые участники клуба — занятые люди, которые ценят время и качество.
          </p>
          <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 620, marginBottom: 20 }}>
            Они не охотятся за скидками, они просто знают, что хороший массаж должен быть доступен тогда, когда нужно.
            Lovi Pass даёт эту свободу.
          </p>
          <div style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '24px',
            display: 'inline-block',
            marginTop: 8
          }}>
            <div style={{ fontSize: 14, color: 'var(--secondary)', fontStyle: 'italic' }}>
              Это не массовый продукт. Мы намеренно делаем его камерным, чтобы сохранить качество сервиса. Поэтому количество мест ограничено.
            </div>
          </div>
        </div>
      </div>

      {/* Как присоединиться */}
      <div style={{ padding: isMobile ? '48px 20px' : '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ ...s.label, textAlign: 'center' }}>Как присоединиться</div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 26 : 34,
            color: 'var(--dark)',
            textAlign: 'center',
            margin: '0 0 48px',
            lineHeight: 1.3
          }}>
            Четыре простых шага
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? 24 : 32,
            marginBottom: 48
          }}>
            {HOW_TO_JOIN.map((h, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: 'rgba(249,115,22,0.3)',
                  fontFamily: 'Playfair Display, serif',
                  marginBottom: 12
                }}>{h.step}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--dark)', marginBottom: 10 }}>{h.title}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.7 }}>{h.text}</div>
              </div>
            ))}
          </div>

          {/* Кнопка и гарантия возврата */}
          <div style={{ textAlign: 'center' }} id="join">
            <button style={{
              background: '#F97316',
              color: '#fff',
              border: 'none',
              padding: '16px 48px',
              borderRadius: 18,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
              marginBottom: 16
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.3)';
              }}>
              Активировать Lovi Pass
            </button>
            <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              В любой момент вы можете вернуть неиспользованный остаток. Мы вернём деньги в течение трёх дней, без вопросов.
              Но уверены, что вы не захотите уходить.
            </p>
          </div>
        </div>
      </div>

      {/* Нижний колонтитул-мотиватор */}
      <div style={{
        padding: isMobile ? '48px 20px' : '72px 40px',
        background: '#121A12',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 22 : 28,
            lineHeight: 1.4,
            margin: '0 0 16px'
          }}>
            Не копите стресс — копите привилегии.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>
            Lovi Pass: ваш покой дороже.
          </p>
        </div>
      </div>
    </div>
  )
}