import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Database, Check, X, MapPin, Users, BarChart2,
  ArrowRight, Mail, Lock, ChevronRight,
} from 'lucide-react'

const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5 }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0 }} />
)

// ── Данные ───────────────────────────────────────────────────────────────────

const COLUMNS = ['Датасет', 'Тип данных', 'Отрасль', 'Эксперимент?', 'Гео-фактор', 'Доступ']

const DATASETS = [
  {
    name: 'T-ECD',
    sub: 'Т-Технологии',
    data: '135 млрд взаимодействий, 44 млн пользователей',
    industry: 'E-commerce (товары)',
    experiment: { yes: false, note: 'Наблюдения без контрольной группы' },
    geo: { yes: true, note: 'Частично (регионы доставки)' },
    access: 'Только утверждённые исследователи',
    lovi: false,
  },
  {
    name: 'Dunnhumby',
    sub: 'Carbo-Loading',
    data: 'Транзакции за 2 года',
    industry: 'Продуктовый ретейл',
    experiment: { yes: false, note: 'Панельные данные домохозяйств' },
    geo: { yes: true, note: 'По магазинам' },
    access: 'Открытый для соревнований',
    lovi: false,
  },
  {
    name: 'MIT Open',
    sub: 'e-commerce 1.0',
    data: '1.8 млн покупок, 5 000 пользователей',
    industry: 'E-commerce (Amazon reviews)',
    experiment: { yes: false, note: 'Исторические данные' },
    geo: { yes: false, note: 'Нет' },
    access: 'Открытый, данные устаревшие',
    lovi: false,
  },
  {
    name: 'Hallie Marshall',
    sub: 'A/B-test',
    data: '285k синтетических промо-акций',
    industry: 'Условный e-commerce',
    experiment: { yes: true, note: 'Синтетический (обучающий проект)' },
    geo: { yes: false, note: 'Нет' },
    access: 'Полностью открытый',
    lovi: false,
  },
  {
    name: 'EVIDENT',
    sub: 'H2020',
    data: 'Choice Experiment (опросные данные)',
    industry: 'Энергоэффективная техника',
    experiment: { yes: true, note: 'Контролируемый опрос' },
    geo: { yes: false, note: 'Нет' },
    access: 'Открытый, лабораторный выбор',
    lovi: false,
  },
  {
    name: 'LOVI Research',
    sub: 'Dataset',
    data: '1 млн+ реальных бронирований, быстро растёт',
    industry: 'Wellness (массаж, косметология)',
    experiment: { yes: true, note: 'Рандомизированные полевые A/B-тесты' },
    geo: { yes: true, note: 'До walking distance и погоды' },
    access: 'Открытый для исследователей в 2026',
    lovi: true,
  },
]

const PILLARS = [
  {
    n: '01',
    icon: BarChart2,
    title: 'Реальные полевые A/B-тесты, а не наблюдения',
    text: 'У нас есть контрольная группа и случайное распределение. Это означает, что мы выявляем причинно-следственные связи, а не просто корреляции. Когда мы говорим «таймер увеличил конверсию на 15%» — это заслуга именно таймера, а не дневного трафика или другой случайности.',
  },
  {
    n: '02',
    icon: MapPin,
    title: 'Привязка к реальной локации и времени',
    text: 'Почти все открытые e-commerce данные «оторваны от земли». Мы знаем не только что и когда купили, но и как далеко клиент находился от салона, какая была погода и как менялся спрос в конкретном районе. Это позволяет исследовать поведенческую географию на качественно ином уровне.',
  },
  {
    n: '03',
    icon: Database,
    title: 'Полный путь клиента, а не только покупка',
    text: 'Мы фиксируем влияние каждой скидки и сигнала на возвращаемость (LTV), отказы и удовлетворённость после визита. Ни один из существующих открытых датасетов по услугам не даёт такого замкнутого цикла от первого касания до повторного визита.',
  },
]

const OPENNESS = [
  { icon: Check,    text: 'Каждое исследование получает DOI и входит в мировую систему цитирования' },
  { icon: Database, text: 'Обезличенные датасеты с воспроизводимым кодом — любой студент или профессор может проверить выводы' },
  { icon: Users,    text: 'Мы закрываем уникальную нишу: рынок услуг, об экономике поведения которого известно прискорбно мало' },
]

// ── Yes/No chip ───────────────────────────────────────────────────────────────

function YesNo({ yes, note, isLovi }) {
  const [hover, setHover] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 10px', borderRadius: 20, cursor: 'default',
          fontSize: 11, fontWeight: 600,
          background: yes
            ? (isLovi ? 'rgba(74,222,128,0.18)' : 'rgba(74,222,128,0.1)')
            : 'rgba(18,26,18,0.06)',
          color: yes
            ? (isLovi ? '#16A34A' : '#16A34A')
            : (isLovi ? 'rgba(255,255,255,0.3)' : 'var(--secondary)'),
        }}
      >
        {yes
          ? <Icon i={Check} size={10} color="#16A34A" stroke={2.5} />
          : <Icon i={X} size={10} color={isLovi ? 'rgba(255,255,255,0.3)' : 'var(--secondary)'} stroke={2} />
        }
        {yes ? 'Да' : 'Нет'}
      </div>
      {/* Tooltip */}
      {hover && note && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%',
          transform: 'translateX(-50%)', marginBottom: 6,
          background: 'var(--dark)', color: '#fff',
          fontSize: 11, lineHeight: 1.5, padding: '6px 10px',
          borderRadius: 8, whiteSpace: 'nowrap', maxWidth: 220,
          whiteSpace: 'normal', zIndex: 10,
          boxShadow: '0 4px 16px rgba(18,26,18,0.2)',
        }}>
          {note}
        </div>
      )}
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────

function ComparisonTable({ isMobile }) {
  const COL_WIDTHS = ['160px', '200px', '180px', '130px', '160px', '200px']

  const tableContent = (
    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: isMobile ? 900 : 'auto' }}>
      {/* Header */}
      <thead>
        <tr style={{ background: 'var(--dark)' }}>
          {COLUMNS.map((col, i) => (
            <th key={col} style={{
              padding: '14px 20px', textAlign: 'left',
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', fontWeight: 500,
              width: COL_WIDTHS[i], whiteSpace: 'nowrap',
              borderRight: i < COLUMNS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {DATASETS.map((d, i) => (
          <tr
            key={d.name}
            style={{
              background: d.lovi ? 'var(--dark)' : i % 2 === 0 ? '#fff' : 'rgba(18,26,18,0.015)',
              borderTop: '1px solid var(--border)',
              ...(d.lovi ? {
                outline: '2px solid var(--accent)',
                outlineOffset: '-2px',
                position: 'relative',
              } : {}),
            }}
          >
            {/* Name */}
            <td style={{ padding: '16px 20px', borderRight: `1px solid ${d.lovi ? 'rgba(255,255,255,0.07)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {d.lovi && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, boxShadow: '0 0 6px rgba(249,115,22,0.6)' }} />
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: d.lovi ? '#fff' : 'var(--dark)' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: d.lovi ? 'rgba(255,255,255,0.35)' : 'var(--secondary)', marginTop: 2 }}>{d.sub}</div>
                </div>
              </div>
            </td>

            {/* Data */}
            <td style={{ padding: '16px 20px', borderRight: `1px solid ${d.lovi ? 'rgba(255,255,255,0.07)' : 'var(--border)'}` }}>
              <div style={{ fontSize: 12, color: d.lovi ? 'rgba(255,255,255,0.55)' : 'var(--secondary)', lineHeight: 1.55 }}>{d.data}</div>
            </td>

            {/* Industry */}
            <td style={{ padding: '16px 20px', borderRight: `1px solid ${d.lovi ? 'rgba(255,255,255,0.07)' : 'var(--border)'}` }}>
              <div style={{ fontSize: 12, color: d.lovi ? 'rgba(255,255,255,0.55)' : 'var(--secondary)', lineHeight: 1.55 }}>{d.industry}</div>
            </td>

            {/* Experiment */}
            <td style={{ padding: '16px 20px', borderRight: `1px solid ${d.lovi ? 'rgba(255,255,255,0.07)' : 'var(--border)'}` }}>
              <YesNo yes={d.experiment.yes} note={d.experiment.note} isLovi={d.lovi} />
            </td>

            {/* Geo */}
            <td style={{ padding: '16px 20px', borderRight: `1px solid ${d.lovi ? 'rgba(255,255,255,0.07)' : 'var(--border)'}` }}>
              <YesNo yes={d.geo.yes} note={d.geo.note} isLovi={d.lovi} />
            </td>

            {/* Access */}
            <td style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: d.lovi ? 'var(--accent)' : 'var(--secondary)', lineHeight: 1.55, fontWeight: d.lovi ? 600 : 400 }}>
                {d.access}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  if (isMobile) {
    return (
      <div>
        {/* Scroll hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--secondary)', fontSize: 12 }}>
          <Icon i={ChevronRight} size={13} color="var(--secondary)" stroke={1.5} />
          Прокрутите вправо для сравнения
        </div>
        <div style={{
          overflowX: 'auto', borderRadius: 16, border: '1px solid var(--border)',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent',
        }}>
          {tableContent}
        </div>
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
      {tableContent}
    </div>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', role: '' })
  const [sent, setSent]   = useState(false)

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '13px 16px', fontSize: 14,
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'Inter, sans-serif',
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon i={Check} size={22} color="#4ADE80" stroke={2} />
      </div>
      <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: '#fff', marginBottom: 8 }}>Заявка принята</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Свяжемся в ближайшее время</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
        { key: 'name',  placeholder: 'Имя',                    type: 'text' },
        { key: 'email', placeholder: 'Email',                   type: 'email' },
        { key: 'role',  placeholder: 'Роль (исследователь, журналист, университет...)', type: 'text' },
      ].map(f => (
        <input
          key={f.key}
          type={f.type}
          placeholder={f.placeholder}
          value={form[f.key]}
          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.28)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
        />
      ))}
      <button
        onClick={() => form.name && form.email && setSent(true)}
        style={{
          width: '100%', background: 'var(--accent)', color: '#fff',
          border: 'none', padding: '15px', borderRadius: 14,
          fontWeight: 600, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
          transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
          marginTop: 4,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}
      >
        Запросить ранний доступ
      </button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function DatasetPage() {
  const isMobile = useIsMobile()

  const wrap    = { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }
  const eyebrow = { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 14 }
  const sec     = { padding: isMobile ? '72px 0' : '104px 0' }

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#FDFCF9 0%,#F1EFE9 100%)',
        padding: isMobile ? '100px 0 72px' : '120px 0 88px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', ...wrap }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <a href="/research" style={{ fontSize: 12, color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => { e.target.style.color = 'var(--dark)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--secondary)' }}
            >
              «Лови» Research
            </a>
            <Icon i={ChevronRight} size={12} color="var(--secondary)" stroke={1.5} />
            <span style={{ fontSize: 12, color: 'var(--dark)', fontWeight: 500 }}>Dataset</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(18,26,18,0.06)', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 24 }}>
            <Icon i={Database} size={11} color="var(--secondary)" stroke={1.5} />
            Research Dataset
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: isMobile ? 34 : 58, fontWeight: 500,
            lineHeight: 1.07, letterSpacing: '-0.02em',
            color: 'var(--dark)', margin: '0 0 20px', maxWidth: 680,
          }}>
            Почему данные «Лови» уникальны: не просто цифры,{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>а поведенческий полигон</em>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--secondary)', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 560 }}>
            Большинство открытых данных о потребительском поведении относятся к товарному e-commerce или
            являются искусственно смоделированными. Индустрия услуг устроена иначе.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: isMobile ? 24 : 48, flexWrap: 'wrap' }}>
            {[
              { value: '1 млн+', label: 'реальных бронирований' },
              { value: '2026',   label: 'открытый доступ для науки' },
              { value: 'DOI',    label: 'каждому исследованию' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 26 : 34, fontWeight: 500, color: 'var(--dark)', lineHeight: 1, marginBottom: 6 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ТАБЛИЦА СРАВНЕНИЯ ─────────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={eyebrow}>LOVI на фоне крупнейших открытых датасетов</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 64, alignItems: 'end', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 26 : 36, fontWeight: 500, color: 'var(--dark)', margin: 0, lineHeight: 1.2 }}>
              Сравнение с ведущими<br />источниками данных
            </h2>
            <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
              Наведите на чип <span style={{ background: 'rgba(74,222,128,0.1)', color: '#16A34A', padding: '1px 7px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>✓ Да</span> или{' '}
              <span style={{ background: 'rgba(18,26,18,0.06)', color: 'var(--secondary)', padding: '1px 7px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>✗ Нет</span>{' '}
              чтобы увидеть подробности.
            </p>
          </div>

          <ComparisonTable isMobile={isMobile} />

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px rgba(249,115,22,0.6)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--secondary)' }}>
              Строка LOVI Research выделена контурным акцентом — это наш датасет
            </span>
          </div>
        </div>
      </div>

      {/* ── ТРИ КИТА — шаги ───────────────────────────────────────────────── */}
      <div style={{ background: '#F1F0EC', ...sec }}>
        <div style={wrap}>
          <div style={eyebrow}>Три кита нашего преимущества</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: '0 0 56px', lineHeight: 1.2, maxWidth: 520 }}>
            Почему именно наши данные дают причинно-следственные связи
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 40 : 48 }}>
            {PILLARS.map((p, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 48, fontWeight: 500, color: 'rgba(18,26,18,0.05)', lineHeight: 1, marginBottom: 16, letterSpacing: '-0.02em' }}>
                  {p.n}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(18,26,18,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon i={p.icon} size={17} color="var(--dark)" stroke={1.5} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)', marginBottom: 10, lineHeight: 1.35 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.75 }}>{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ПЛАН НА ОТКРЫТОСТЬ ────────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
            <div>
              <div style={eyebrow}>Наш план на открытость</div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: '0 0 20px', lineHeight: 1.2 }}>
                Мы строим LOVI Research как гибрид бизнеса и исследовательского центра
              </h2>
              <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: '0 0 32px' }}>
                Мы сознательно не конкурируем с гигантами вроде T-ECD — мы закрываем уникальную нишу: рынок услуг и впечатлений, об экономике поведения которого известно прискорбно мало.
              </p>
              {OPENNESS.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon i={o.icon} size={13} color="var(--accent)" stroke={2} />
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.65 }}>{o.text}</span>
                </div>
              ))}
            </div>

            {/* Right — dark card с таймлайном доступа */}
            <div style={{ background: 'var(--dark)', borderRadius: 24, padding: isMobile ? '32px 24px' : '36px 32px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
                Дорожная карта открытости
              </div>
              {[
                { year: '2026 | Лето', status: 'done',    text: 'Запущены рандомизированные A/B-тесты на реальных пользователях' },
                { year: '2026 | Осень', status: 'active',  text: 'Публикация обезличенного датасета и первых DOI-отчётов' },
                { year: '2026 | Зима', status: 'active',  text: 'Открытый доступ для независимых исследователей' },
                { year: '2027', status: 'planned', text: 'Первая LOVI Research Conference' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < 3 ? 20 : 0, marginBottom: i < 3 ? 20 : 0, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', marginTop: 4,
                      background: item.status === 'done' ? '#4ADE80' : item.status === 'active' ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                      boxShadow: item.status === 'active' ? '0 0 8px rgba(249,115,22,0.5)' : 'none',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.status === 'done' ? '#4ADE80' : item.status === 'active' ? 'var(--accent)' : 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {item.year}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA — тёмный с формой ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '72px 0 88px' : '104px 0 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.05) 0%,transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', ...wrap }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'start' }}>

            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
                Ранний доступ
              </div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 30 : 44, fontWeight: 500, color: '#fff', margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Станьте частью первого в Европе открытого полигона
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, margin: '0 0 36px' }}>
                Если вы независимый исследователь, журналист, пишущий об экономике поведения,
                или представитель университета — свяжитесь с нами.
              </p>

              {/* Who we look for */}
              {[
                { icon: Database, label: 'Исследователи', sub: 'Поведенческая экономика, маркетинг, data science' },
                { icon: Users,    label: 'Университеты',  sub: 'Реальные кейсы и полевые данные' },
                { icon: BarChart2,label: 'Журналисты',    sub: 'Экономика поведения и рынок услуг' },
              ].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon i={w.icon} size={14} color="rgba(255,255,255,0.5)" stroke={1.5} />
                  </div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{w.label}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 8 }}>{w.sub}</span>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 28 }}>
                <Icon i={Mail} size={13} color="rgba(255,255,255,0.2)" stroke={1.5} />
                <a href="mailto:research@lovi.today" style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                  research@lovi.today
                </a>
              </div>
            </div>

            <div>
              <ContactForm />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
                <Icon i={Lock} size={11} color="rgba(255,255,255,0.2)" stroke={1.5} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                  Данные используются только для связи. Без спама.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}