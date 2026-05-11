import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Zap, TrendingUp, Database, Lock, Globe,
  BarChart2, Users, CreditCard, Layers, Check, Mail, Phone,
} from 'lucide-react'

const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5 }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0 }} />
)

// ── Данные ───────────────────────────────────────────────────────────────────

const PRODUCT = [
  {
    n: '01', tag: 'B2C', icon: Zap,
    title: 'Мгновенная конверсия',
    items: [
      'Таймеры, scarcity-сигналы, гео-привязка',
      'Импульсное бронирование «охотников за выгодой»',
      '100% предоплата — ноль возвратов и неявок',
    ],
  },
  {
    n: '02', tag: 'B2B', icon: Layers,
    title: 'Zero-Waste интеграция',
    items: [
      'Прямая связка с CRM (API YClients) — слоты в real-time',
      'Автоматическая перепродажа отмен',
      'Выплаты салонам на следующий день',
    ],
  },
  {
    n: '03', tag: 'Data', icon: Database,
    title: 'LOVI Data Intelligence',
    items: [
      'CAC в 2–3 раза ниже традиционных каналов',
      'A/B-тесты на реальных деньгах — не в лаборатории',
      'Предсказание спроса и цены на основе живых транзакций',
    ],
  },
]

const MOAT = [
  { n: '01', icon: Lock,     title: 'Operational Lock-in', text: 'Когда салон привыкает к загрузке 95%, отключиться от LOVI означает мгновенно потерять 25–35% выручки. Это не контрактная зависимость — физиологическая, от денежного потока.' },
  { n: '02', icon: Globe,    title: 'Сетевой эффект',      text: 'Каждый новый салон увеличивает ценность для клиентов (больше окошек) и точность алгоритмов (больше данных). Чем плотнее покрытие — тем ниже CAC для всей сети.' },
  { n: '03', icon: Database, title: 'Data Moat',            text: 'Проприетарный датасет: миллионы реальных бронирований с гео-привязкой, глубиной скидки и контрольными группами. Никто в мире не предоставляет такие полевые A/B-данные по рынку услуг.' },
]

const ROADMAP = [
  {
    year: '2026', title: 'Захват Москвы', active: true,
    items: ['1 000+ активных салонов', '10% онлайн-бронирований Wellness', 'Запуск предиктивной аналитики', 'Data Lake с A/B-тестами'],
  },
  {
    year: '2027', title: 'Масштабирование', active: false,
    items: ['СПб, Варшава, Будапешт', 'Подписка на аналитику для сетей', 'Открытый обезличенный датасет', '~15% дохода от Data-продуктов'],
  },
  {
    year: '2028', title: 'Category King', active: false,
    items: ['Стоматология, медицина, детские услуги', 'FinTech-слой на базе float', '~30% дохода от Data-продуктов', 'Серия B, международная экспансия'],
  },
]

const METRICS = [
  { label: 'Активные салоны',        v2026: '1 000+',  v2027: '3 500',   v2028: '7 000+' },
  { label: 'Города присутствия',     v2026: '1',        v2027: '4–5',     v2028: '10+' },
  { label: 'Средний Fill Rate',      v2026: '85–90%',   v2027: '92%+',    v2028: '95%+' },
  { label: 'Снижение CAC партнёров', v2026: '−30%',     v2027: '−50%',    v2028: '−60%+' },
  { label: 'Доля дохода от Data',    v2026: '0%',       v2027: '~15%',    v2028: '~30%' },
]

const MONETIZATION = [
  { icon: CreditCard, n: '01', title: 'Take Rate',    text: 'Комиссия с каждой успешной брони при подтверждённом визите', dark: true },
  { icon: BarChart2,  n: '02', title: 'B2B-подписка', text: 'Доступ к бенчмаркам, отчётам по эластичности, кастомные A/B-эксперименты', dark: false },
  { icon: Database,   n: '03', title: 'Data-продукты',text: 'Датасеты и предиктивные модели для корпораций, EdTech и девелоперов', dark: false },
  { icon: TrendingUp, n: '04', title: 'FinTech-слой', text: 'Revenue-Based Financing для партнёров на основе реального Fill Rate. 100% предоплата — мы управляем ликвидностью', dark: false },
]

// ── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [sent, setSent] = useState(false)

  const inputBase = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '13px 16px', fontSize: 14,
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'Inter, sans-serif', resize: 'none',
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon i={Check} size={22} color="#4ADE80" stroke={2} />
      </div>
      <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, color: '#fff', marginBottom: 8 }}>Заявка отправлена</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Свяжемся в течение 24 часов</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { key: 'name',    placeholder: 'Имя',             type: 'text' },
          { key: 'company', placeholder: 'Компания / фонд', type: 'text' },
        ].map(f => (
          <input key={f.key} type={f.type} placeholder={f.placeholder} value={form[f.key]}
            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
            style={inputBase}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.28)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      <input type="email" placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={inputBase}
        onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.28)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
      />
      <textarea placeholder="Комментарий" value={form.message} rows={3}
        onChange={e => setForm({ ...form, message: e.target.value })}
        style={inputBase}
        onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.28)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
      />
      <button
        onClick={() => form.name && form.email && setSent(true)}
        style={{
          width: '100%', background: 'var(--accent)', color: '#fff', border: 'none',
          padding: '15px', borderRadius: 14, fontWeight: 600, fontSize: 15,
          cursor: 'pointer', boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
          transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', marginTop: 4,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}
      >
        Обсудить инвестиции
      </button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function InvestorLanding() {
  const isMobile = useIsMobile()

  const wrap    = { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }
  const eyebrow = { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 14 }
  const sec     = { padding: isMobile ? '72px 0' : '104px 0' }

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        background: 'var(--dark)', overflow: 'hidden',
        padding: isMobile ? '80px 0 64px' : '72px 0 64px',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', ...wrap, padding: isMobile ? '0 20px' : '0 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '5px 12px', marginBottom: 24 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
              Инвестиционная возможность · Lovi.today
            </span>
          </div>

          {/* 2-колоночный layout: заголовок слева, стата справа */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64, alignItems: 'center' }}>

            {/* Левая — заголовок + описание */}
            <div>
              <h1 style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: isMobile ? 40 : 64, fontWeight: 500,
                color: '#fff', margin: '0 0 16px',
                lineHeight: 1.05, letterSpacing: '-0.025em',
              }}>
                Операционная система<br />
                <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>доходности.</em>
              </h1>
              <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, margin: 0, maxWidth: 440 }}>
                Пустующие временные слоты → гарантированная выручка.
                Без владения ни одним салоном. Asset-Light, маржа 70%+.
              </p>
            </div>

            {/* Правая — три стата */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* €20 млрд + 65% в одну строку */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { value: '€20 млрд', label: 'Рынок услуг\nВосточной Европы' },
                  { value: '65%',      label: 'Средняя загрузка\nсалонов' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 34, fontWeight: 500, color: '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* €400 млн — акцентный */}
              <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.55)', marginBottom: 8 }}>
                  Потери рынка ежегодно · только Москва
                </div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 42 : 52, fontWeight: 500, color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.025em', marginBottom: 6 }}>
                  €400 млн
                </div>
                <div style={{ fontSize: 11, color: 'rgba(249,115,22,0.45)' }}>
                  €1.2 млн каждый день уходит в никуда
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── РЫНОК ─────────────────────────────────────────────────────────── */}
      <div style={{ ...sec, background: '#F1F0EC' }}>
        <div style={wrap}>
          <div style={eyebrow}>Рынок</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 30 : 40, fontWeight: 500, color: 'var(--dark)', margin: '0 0 20px', lineHeight: 1.15 }}>
                Огромные потери,<br />которые мы конвертируем<br />в капитал
              </h2>
              <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: '0 0 28px' }}>
                Рынок услуг в Восточной Европе — более €20 млрд. Системы управления доходностью,
                давно ставшие стандартом в авиации и отелях, сюда ещё не пришли. Мы занимаем это место.
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '16px 18px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 14 }}>
                <Icon i={Zap} size={16} color="var(--accent)" stroke={2} style={{ marginTop: 2 }} />
                <div style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.65 }}>
                  <strong>€1.2 млн в день</strong> — столько теряет рынок услуг только в Москве.
                  Мы — единственная технология, превращающая этот «цифровой мусор» в чистый кэшфлоу.
                </div>
              </div>
            </div>

            {/* Stats — 2×2 grid с крупными цифрами */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderRadius: 20, overflow: 'hidden' }}>
              {[
                { value: '35%',    label: 'Средний простой\nмощностей',        sub: '65% средняя загрузка', accent: false },
                { value: '80%',    label: 'Без динамического\nценообразования', sub: 'Нет yield management',  accent: false },
                { value: '15–20%', label: 'No-show rate',                       sub: 'Сжигают маржу ежедневно', accent: false },
                { value: '70%+',   label: 'Валовая маржа\nLovi',                sub: 'Asset-Light модель',    accent: true  },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.accent ? 'var(--dark)' : '#fff',
                  border: `1px solid ${s.accent ? 'transparent' : 'rgba(18,26,18,0.07)'}`,
                  borderRadius: 14,
                  padding: '24px 20px',
                }}>
                  <div style={{
                    fontFamily: 'Playfair Display,serif',
                    fontSize: isMobile ? 32 : 40, fontWeight: 500,
                    color: s.accent ? 'var(--accent)' : 'var(--dark)',
                    lineHeight: 1, marginBottom: 10, letterSpacing: '-0.02em',
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: s.accent ? 'rgba(255,255,255,0.55)' : 'var(--dark)', fontWeight: 500, marginBottom: 4, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, color: s.accent ? 'rgba(255,255,255,0.28)' : 'var(--secondary)' }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ПРОДУКТ ───────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '64px 0' : '88px 0' }}>
        <div style={wrap}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Продукт</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: '#fff', margin: '0 0 48px', lineHeight: 1.2, maxWidth: 520 }}>
            Три компонента — взаимно усиливающаяся спираль
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden' }}>
            {PRODUCT.map((p, i) => (
              <div key={i} style={{ background: 'var(--dark)', padding: '32px 28px', position: 'relative' }}>
                {/* Номер крупный за контентом */}
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  fontFamily: 'Playfair Display,serif', fontSize: 64, fontWeight: 500,
                  color: 'rgba(255,255,255,0.04)', lineHeight: 1, letterSpacing: '-0.02em',
                  userSelect: 'none', pointerEvents: 'none',
                }}>
                  {p.n}
                </div>

                {/* Tag + иконка в одной строке */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon i={p.icon} size={17} color="rgba(255,255,255,0.65)" stroke={1.5} />
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: i === 0 ? 'rgba(249,115,22,0.15)' : i === 1 ? 'rgba(99,179,237,0.12)' : 'rgba(154,205,50,0.12)',
                    color: i === 0 ? 'var(--accent)' : i === 1 ? '#63B3ED' : '#9ACD32',
                    padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {p.tag}
                  </div>
                </div>

                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 19, fontWeight: 500, color: '#fff', marginBottom: 20, lineHeight: 1.3 }}>
                  {p.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Icon i={Check} size={13} color="var(--accent)" stroke={2.5} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ЗАЩИТНЫЙ РОВ ──────────────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={eyebrow}>Защитный ров</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 7fr', gap: isMobile ? 32 : 80, alignItems: 'start', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: 'var(--dark)', margin: 0, lineHeight: 1.15 }}>
              Почему нас не скопировать и не отключить
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: 0, paddingTop: isMobile ? 0 : 6 }}>
              Три параллельных барьера, каждый из которых усиливается со временем. Сеть, данные и операционная зависимость работают вместе.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 32 : 0 }}>
            {MOAT.map((m, i) => (
              <div key={i} style={{
                padding: isMobile ? '28px 24px' : '32px 36px 32px 0',
                borderRight: !isMobile && i < MOAT.length - 1 ? '1px solid var(--border)' : 'none',
                marginRight: !isMobile && i < MOAT.length - 1 ? 36 : 0,
                borderTop: isMobile && i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 500, color: 'rgba(18,26,18,0.15)', lineHeight: 1 }}>
                    {m.n}
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(18,26,18,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon i={m.icon} size={17} color="var(--dark)" stroke={1.5} />
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--dark)', marginBottom: 12 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.8 }}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ДОРОЖНАЯ КАРТА ────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '64px 0' : '88px 0', overflow: 'hidden' }}>
        <div style={wrap}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Дорожная карта</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: '#fff', margin: '0 0 56px', lineHeight: 1.2 }}>
            Трёхлетний план
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 0 : 2 }}>
            {ROADMAP.map((r, i) => (
              <div key={i} style={{
                background: r.active ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.03)',
                border: r.active ? '1px solid rgba(249,115,22,0.22)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '32px 28px',
                marginBottom: isMobile ? 12 : 0,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Активный год — glow */}
                {r.active && (
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                )}

                {/* Dot + year в одной строке */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: r.active ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                    boxShadow: r.active ? '0 0 12px rgba(249,115,22,0.6)' : 'none',
                  }} />
                  <div style={{
                    fontFamily: 'Playfair Display,serif',
                    fontSize: isMobile ? 40 : 52, fontWeight: 500,
                    color: r.active ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
                    lineHeight: 1, letterSpacing: '-0.02em',
                  }}>
                    {r.year}
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 600, color: r.active ? 'rgba(249,115,22,0.7)' : 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>
                  {r.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {r.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: r.active ? 'var(--accent)' : 'rgba(255,255,255,0.2)', marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: r.active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── МЕТРИКИ ───────────────────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={eyebrow}>Ключевые метрики</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 64, alignItems: 'end', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: 'var(--dark)', margin: 0, lineHeight: 1.2 }}>
              Цели на три года
            </h2>
            <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
              Колонка 2026 — текущий фокус. Значения на 2027–2028 отражают консервативный сценарий масштабирования.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr repeat(3,72px)' : '2fr repeat(3,1fr)', background: 'var(--dark)', padding: '16px 28px', gap: 16 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Метрика</div>
              {[
                { y: '2026', active: true },
                { y: '2027', active: false },
                { y: '2028', active: false },
              ].map(({ y, active }) => (
                <div key={y} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: active ? 'var(--accent)' : 'rgba(255,255,255,0.4)', fontFamily: 'Playfair Display,serif' }}>{y}</div>
                  {active && <div style={{ fontSize: 9, color: 'rgba(249,115,22,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Сейчас</div>}
                </div>
              ))}
            </div>

            {METRICS.map((m, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr repeat(3,72px)' : '2fr repeat(3,1fr)',
                padding: '18px 28px', gap: 16, alignItems: 'center',
                background: i % 2 === 0 ? '#fff' : 'rgba(18,26,18,0.012)',
                borderTop: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 13, color: 'var(--secondary)' }}>{m.label}</div>
                {[m.v2026, m.v2027, m.v2028].map((v, j) => (
                  <div key={j} style={{
                    fontFamily: 'Playfair Display,serif',
                    fontSize: j === 0 ? (isMobile ? 16 : 20) : (isMobile ? 14 : 17),
                    fontWeight: 500,
                    color: j === 0 ? 'var(--accent)' : 'var(--dark)',
                    textAlign: 'right',
                  }}>
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── БИЗНЕС-МОДЕЛЬ ─────────────────────────────────────────────────── */}
      <div style={{ background: '#F1F0EC', ...sec }}>
        <div style={wrap}>
          <div style={eyebrow}>Бизнес-модель</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 64, alignItems: 'end', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: 'var(--dark)', margin: 0, lineHeight: 1.2 }}>
              Четыре уровня монетизации
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
              Take rate — только первый слой. Истинная ценность раскрывается в последующих.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 10 }}>
            {MONETIZATION.map((m, i) => (
              <div key={i} style={{
                background: m.dark ? 'var(--dark)' : '#fff',
                border: `1px solid ${m.dark ? 'transparent' : 'var(--border)'}`,
                borderRadius: 20, padding: '28px 28px',
                display: 'flex', gap: 20, alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!m.dark) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(18,26,18,0.07)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: m.dark ? 'rgba(255,255,255,0.08)' : 'rgba(18,26,18,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <Icon i={m.icon} size={20} color={m.dark ? 'rgba(255,255,255,0.6)' : 'var(--dark)'} stroke={1.5} />
                  </div>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500, color: m.dark ? 'rgba(255,255,255,0.08)' : 'rgba(18,26,18,0.07)', lineHeight: 1 }}>{m.n}</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: m.dark ? '#fff' : 'var(--dark)', marginBottom: 8 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: m.dark ? 'rgba(255,255,255,0.4)' : 'var(--secondary)', lineHeight: 1.7 }}>{m.text}</div>
                  {m.dark && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 14, background: 'rgba(249,115,22,0.12)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Базовый уровень
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ПОЧЕМУ МЫ ─────────────────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'start' }}>
            <div>
              <div style={eyebrow}>Почему именно мы</div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: 'var(--dark)', margin: '0 0 20px', lineHeight: 1.2 }}>
                То, что обычно<br />существует раздельно
              </h2>
              <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: '0 0 32px' }}>
                LOVI.TODAY не зависит от одного источника дохода, не боится копирования на уровне интерфейса
                и создаёт ценность, которая только растёт с каждой новой транзакцией.
              </p>
              {[
                'Операционный бизнес с контролем ликвидности и денежным потоком',
                'Алгоритмическая лаборатория, снижающая CAC и повышающая LTV',
                'Инфраструктурный слой — стандарт доходности в индустрии',
              ].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon i={Check} size={14} color="var(--accent)" stroke={2.5} />
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.7 }}>{w}</span>
                </div>
              ))}
            </div>

            {/* Right — dark card с нумерованными пунктами */}
            <div style={{ background: 'var(--dark)', borderRadius: 24, padding: isMobile ? '32px 24px' : '40px 36px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
                Лучший момент войти
              </div>
              {[
                'Технологическая архитектура отлажена и генерирует выручку',
                'Алгоритмическое ядро запускается в ближайшие месяцы',
                'Operational Lock-in формируется на первой тысяче салонов',
                'Рынок не имеет явного лидера — мы стоим на пороге тиражирования',
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 16, paddingBottom: i < 3 ? 20 : 0, marginBottom: i < 3 ? 20 : 0,
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', alignItems: 'flex-start',
                }}>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 500, color: 'var(--accent)', lineHeight: 1, flexShrink: 0, marginTop: 2, opacity: 0.6 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '72px 0 88px' : '104px 0 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', ...wrap }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                Обсудить инвестиции
              </div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 32 : 48, fontWeight: 500, color: '#fff', margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Мы открыты<br />для инвесторов
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, margin: '0 0 40px' }}>
                Венчурные инвестиции, стратегические партнёрства с корпорациями,
                частные инвесторы — если вы понимаете ценность инфраструктурных бизнесов
                с сильным data-компонентом.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { i: Mail,  text: 'investors@lovi.today' },
                  { i: Phone, text: 'Доступно по запросу' },
                ].map(({ i, text }, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon i={i} size={14} color="rgba(255,255,255,0.4)" stroke={1.5} />
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>

    </div>
  )
}