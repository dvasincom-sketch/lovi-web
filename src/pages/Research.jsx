import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  ChevronDown, Database, BarChart2, MapPin, Clock,
  CreditCard, Check, Mail, Users, Zap, Award, ArrowRight,
} from 'lucide-react'

const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5 }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0 }} />
)

// ── Данные ───────────────────────────────────────────────────────────────────

const RESEARCH = [
  {
    n: '①',
    icon: BarChart2,
    title: 'Глубина скидки и доверие',
    question: 'Где грань между «выгодно» и «подозрительно»?',
    text: 'Тестируем, как 20%, 40% и 60% скидки влияют на конверсию и на желание клиента вернуться. Результаты показывают нелинейную зависимость — скидка выше порога разрушает доверие к бренду салона.',
    status: 'Активный A/B-тест',
  },
  {
    n: '②',
    icon: Clock,
    title: 'Таймер обратного отсчёта',
    question: 'Помогает urgency продажам — или только увеличивает процент отмен?',
    text: 'Сравниваем три группы: без таймера, с мягким напоминанием и агрессивным countdown. Измеряем не только конверсию, но и качество брони — возвращаемость клиента после каждого варианта.',
    status: 'Активный A/B-тест',
  },
  {
    n: '③',
    icon: Zap,
    title: 'Фрейминг выгоды',
    question: '«−50%» против «Экономия 3 500 ₽» — что работает лучше?',
    text: 'Проверяем классический framing effect из поведенческой экономики на реальных бронированиях. Процентная скидка vs абсолютная сумма — ответ зависит от ценового сегмента услуги.',
    status: 'Сбор данных',
  },
  {
    n: '④',
    icon: MapPin,
    title: 'География импульсивности',
    question: 'Как расстояние до салона и погода влияют на ценовую чувствительность?',
    text: 'Исследуем, как близость салона и внешние условия (погода, время суток, день недели) меняют вероятность импульсного бронирования. Строим тепловые карты импульсивности по районам Москвы.',
    status: 'Планируется',
  },
  {
    n: '⑤',
    icon: CreditCard,
    title: 'Предоплата и commitment',
    question: 'Действительно ли 100% предоплата снижает no-show?',
    text: 'Анализируем, как обязательная предоплата меняет поведение клиента до и после визита. Измеряем влияние на lifetime value и вероятность повторного бронирования в том же салоне.',
    status: 'Активный A/B-тест',
  },
]

const STANDARDS = [
  { icon: Check,    title: 'Пререгистрация гипотез',    text: 'Фиксируем, что именно проверяем, до запуска теста — без корректировки постфактум.' },
  { icon: Database, title: 'Одна переменная за раз',    text: 'Меняем только формат скидки или только таймер — никогда оба сразу.' },
  { icon: Users,    title: 'Случайное распределение',   text: 'Без привязки к устройству, источнику трафика или географии пользователя.' },
  { icon: BarChart2,title: 'Анализ мощности',            text: 'Не останавливаем тест, пока не набираем статистически значимый результат.' },
  { icon: Award,    title: 'Проверено на международном уровне',        text: 'Каждому отчёту присваивается DOI — наши работы входят в глобальную систему цитирования.' },
  { icon: Zap,      title: 'Этичность сигналов',       text: 'У нас нет нарисованных дедлайнов и липовых остатков. Если написано, что товар заканчивается или акция скоро сгорит — так и есть.' },
]

const COLLAB = [
  { icon: Database, title: 'Независимые исследователи', text: 'Поведенческая экономика, маркетинг, data science — работайте с нашими данными.' },
  { icon: Award,    title: 'Владельцы салонов',         text: 'Участвуйте в экспериментах и первыми получайте инсайты до публикации.' },
  { icon: Users,    title: 'Университеты и бизнес-школы', text: 'Реальные кейсы и полевые данные для учебных программ и диссертаций.' },
]

const STATUS_COLOR = {
  'Активный A/B-тест': { bg: 'rgba(74,222,128,0.1)', color: '#16A34A', dot: '#4ADE80' },
  'Сбор данных':       { bg: 'rgba(249,115,22,0.08)', color: 'var(--accent)', dot: 'var(--accent)' },
  'Планируется':       { bg: 'rgba(143,132,117,0.1)', color: 'var(--secondary)', dot: 'var(--secondary)' },
}

// ── Accordion ────────────────────────────────────────────────────────────────

function Accordion({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
      {items.map((item, i) => {
        const isOpen = open === i
        const st = STATUS_COLOR[item.status]
        return (
          <div
            key={i}
            style={{
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
              background: isOpen ? '#fff' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            {/* Header */}
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 16, padding: '20px 24px', background: 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              {/* Number */}
              <div style={{
                fontFamily: 'Playfair Display,serif', fontSize: 22,
                fontWeight: 500, color: isOpen ? 'var(--accent)' : 'rgba(18,26,18,0.15)',
                flexShrink: 0, width: 28, transition: 'color 0.2s',
              }}>
                {item.n}
              </div>

              {/* Icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isOpen ? 'rgba(249,115,22,0.08)' : 'rgba(18,26,18,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <Icon i={item.icon} size={16} color={isOpen ? 'var(--accent)' : 'var(--secondary)'} stroke={1.5} />
              </div>

              {/* Title + question */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.5 }}>
                  {item.question}
                </div>
              </div>

              {/* Status pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: st.bg, color: st.color,
                padding: '3px 10px', borderRadius: 20,
                fontSize: 10, fontWeight: 600, flexShrink: 0,
                whiteSpace: 'nowrap',
              }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: st.dot }} />
                {item.status}
              </div>

              {/* Chevron */}
              <div style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s', color: 'var(--secondary)', flexShrink: 0,
              }}>
                <Icon i={ChevronDown} size={16} color="var(--secondary)" stroke={1.5} />
              </div>
            </button>

            {/* Body */}
            {isOpen && (
              <div style={{ padding: '0 24px 24px 124px' }}>
                <div style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.75, maxWidth: 560 }}>
                  {item.text}
                </div>
                <a href="#subscribe" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginTop: 16, fontSize: 12, fontWeight: 600,
                  color: 'var(--accent)', textDecoration: 'none',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  Получить результаты первым
                  <Icon i={ArrowRight} size={12} color="var(--accent)" stroke={2} />
                </a>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Subscribe form ────────────────────────────────────────────────────────────

function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon i={Check} size={15} color="#4ADE80" stroke={2} />
      </div>
      <div style={{ fontSize: 14, color: 'var(--dark)' }}>
        Подписка оформлена — первые инсайты уже в пути
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="Ваш email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          flex: 1, minWidth: 220, border: '1px solid var(--border)',
          borderRadius: 14, padding: '13px 16px', fontSize: 14,
          background: '#fff', color: 'var(--dark)', outline: 'none',
          transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--dark)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
      />
      <button
        onClick={() => email && setSent(true)}
        style={{
          background: 'var(--dark)', color: '#fff', border: 'none',
          padding: '13px 22px', borderRadius: 14, fontWeight: 600,
          fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(18,26,18,0.15)',
          transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        Подписаться на инсайты
      </button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function ResearchLanding() {
  const isMobile = useIsMobile()

  const wrap    = { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }
  const eyebrow = { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 14 }
  const sec     = { padding: isMobile ? '72px 0' : '104px 0' }

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO — светлый с градиентом ───────────────────────────────────── */}
      <div style={{
        borderRadius: 0, overflow: 'hidden',
        background: 'linear-gradient(135deg,#FDFCF9 0%,#F1EFE9 100%)',
        padding: isMobile ? '100px 0 72px' : '120px 0 88px',
        position: 'relative',
      }}>
        {/* Subtle glow */}
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', ...wrap }}>
          {/* Eyebrow badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.08)', color: 'var(--accent)', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.6s ease-in-out infinite' }} />
            Открытая лаборатория
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: isMobile ? 36 : 60, fontWeight: 500,
            lineHeight: 1.07, letterSpacing: '-0.02em',
            color: 'var(--dark)', margin: '0 0 20px', maxWidth: 720,
          }}>
            Исследования поведения потребителей{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>на реальных данных</em>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--secondary)', lineHeight: 1.75, margin: '0 0 40px', maxWidth: 540 }}>
            Мы превращаем «Лови» в открытую лабораторию — проверяем гипотезы,
            публикуем результаты и строим стандарты ценообразования.
          </p>

          {/* Subscribe inline */}
          <div id="subscribe">
            <SubscribeForm />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: isMobile ? 24 : 48, marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { value: '5',        label: 'активных исследований' },
              { value: '10',       label: 'тем в матрице исследований' },
              { value: 'DOI',      label: 'каждому отчёту' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 36, fontWeight: 500, color: 'var(--dark)', lineHeight: 1, marginBottom: 6 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ПОЧЕМУ МЫ ИССЛЕДУЕМ ───────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
            <div>
              <div style={eyebrow}>Почему мы начали исследовать скидки</div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: '0 0 20px', lineHeight: 1.2 }}>
                Скидка — мощный,<br />но опасный инструмент
              </h2>
              <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: '0 0 24px' }}>
                Большинство сервисов применяют её вслепую: «все делают 30% — и мы сделаем».
                «Лови» контролирует время, дефицит, фрейминг, предоплату и географию.
                Это позволяет запускать контролируемые эксперименты на тысячах реальных пользователей.
              </p>
              <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: 0 }}>
                Цель «Лови» — создать самый большой в  Европе
                поведенческий датасет по спросу на услуги и сделать его
                полезным для бизнеса и науки.
              </p>
            </div>

            {/* Right — три преимущества */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', borderRadius: 20, overflow: 'hidden' }}>
              {[
                { icon: BarChart2, title: 'Видим полную картину', text: 'Не только «купили / не купили», но и как меняется доверие, готовность платить и возвращаемость.' },
                { icon: Database,  title: 'Изолируем один фактор', text: 'Точно измеряем причинный эффект таймера или формулировки — без смешивания переменных.' },
                { icon: Check,     title: 'Говорим честно', text: 'Публикуем что работает, а что разрушает бренд — без прикрас.' },
              ].map((f, i) => (
                <div key={i} style={{ background: 'var(--bg)', padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(18,26,18,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon i={f.icon} size={16} color="var(--dark)" stroke={1.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.65 }}>{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RESEARCH MATRIX — аккордеон ───────────────────────────────────── */}
      <div style={{ background: '#F1F0EC', ...sec }}>
        <div style={wrap}>
          <div style={eyebrow}>Что мы исследуем</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 64, alignItems: 'start', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: 0, lineHeight: 1.2 }}>
              Матрица исследований —<br />десять ключевых тем
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: 0, paddingTop: isMobile ? 0 : 8 }}>
              По каждой теме готовятся отдельные статьи-отчёты с методологией,
              цифрами и выводами. Первые результаты публикуются здесь же,
              в открытом доступе.
            </p>
          </div>
          <Accordion items={RESEARCH} />
        </div>
      </div>

      {/* ── ЧТО ДАЛЬШЕ — шаги ─────────────────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={eyebrow}>Что мы будем делать дальше</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: '0 0 56px', lineHeight: 1.2, maxWidth: 480 }}>
            На пути к стандарту индустрии
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 40 : 48 }}>
            {[
              { n: '01', title: 'Инсайты',           text: 'Регулярные аналитические записки с результатами завершённых экспериментов.' },
              { n: '02', title: 'Индекс импульсивности',   text: 'Еженедельный срез по районам и категориям услуг — публичный рейтинг.' },
              { n: '03', title: 'Открытые датасеты',       text: 'Обезличенные данные для независимых исследователей и студентов.' },
              { n: '04', title: 'DOI для каждого отчёта',  text: 'Через Crossref — наши работы становятся частью глобальной системы цитирования.' },
              { n: '05', title: 'Онлайн конференция', text: 'Первая открытая конференция для владельцев салонов и маркетологов.' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 48, fontWeight: 500, color: 'rgba(18,26,18,0.05)', lineHeight: 1, marginBottom: 14, letterSpacing: '-0.02em' }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.7 }}>{s.text}</div>
              </div>
            ))}
          </div>

          {/* Цитата-цель */}
          <div style={{ marginTop: 64, borderLeft: '2px solid var(--accent)', paddingLeft: 28 }}>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 18 : 22, fontWeight: 500, color: 'var(--dark)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 12 }}>
              Не «где-то читал», а по данным «Лови»»
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)' }}>
              Ближайшая цель — стать точкой отсчёта, на которую ссылаются, когда говорят о скидках в индустрии красоты и здоровья
            </div>
          </div>
        </div>
      </div>

      {/* ── ЗАЧЕМ РЫНКУ — мифы ────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '64px 0' : '88px 0' }}>
        <div style={wrap}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>
            Зачем это нужно рынку
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'start' }}>
            {/* Myths */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 26 : 34, fontWeight: 500, color: '#fff', margin: '0 0 28px', lineHeight: 1.2 }}>
                Индустрия работает<br />на мифах
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  '«Скидка 50% всегда привлекает больше клиентов»',
                  '«Таймер увеличивает продажи»',
                  '«Лучше давать процент, а не рубли»',
                ].map((myth, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)', fontFamily: 'Playfair Display,serif', flexShrink: 0, lineHeight: 1.5 }}>✗</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontStyle: 'italic' }}>{myth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who benefits */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 26 : 34, fontWeight: 500, color: '#fff', margin: '0 0 28px', lineHeight: 1.2 }}>
                Мы заменяем интуицию<br />на доказательства
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { who: 'Владельцы салонов', what: 'Увидят, как не разрушить ценность бренда ежедневными акциями.' },
                  { who: 'Маркетологи',       what: 'Получат воспроизводимые механики, подкреплённые данными.' },
                  { who: 'Потребители',       what: 'Научатся отличать честную выгоду от манипуляции.' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', alignItems: 'flex-start' }}>
                    <Icon i={Check} size={14} color="var(--accent)" stroke={2.5} style={{ marginTop: 3 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{row.who}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{row.what}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── СТАНДАРТЫ ЧИСТОТЫ ─────────────────────────────────────────────── */}
      <div style={{ ...sec, background: '#F1F0EC' }}>
        <div style={wrap}>
          <div style={eyebrow}>Как мы гарантируем чистоту экспериментов</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: '0 0 48px', lineHeight: 1.2, maxWidth: 520 }}>
            Академические стандарты<br />на реальных данных
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 0, background: 'var(--dark)', borderRadius: 24, overflow: 'hidden' }}>
            {STANDARDS.map((s, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderLeft: i > 0 && !isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
                borderTop: isMobile && i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon i={s.icon} size={16} color="rgba(255,255,255,0.6)" stroke={1.5} />
                </div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 8, lineHeight: 1.35 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{s.text}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, fontSize: 13, color: 'var(--secondary)', textAlign: 'center', lineHeight: 1.6 }}>
            Каждому отчёту «Лови» можно доверять как рецензированной статье
          </div>
        </div>
      </div>

      {/* ── СОТРУДНИЧЕСТВО — 3 карточки ───────────────────────────────────── */}
      <div style={sec}>
        <div style={wrap}>
          <div style={eyebrow}>Приглашение к сотрудничеству</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 64, alignItems: 'start', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 38, fontWeight: 500, color: 'var(--dark)', margin: 0, lineHeight: 1.2 }}>
              Мы ищем партнёров<br />по трём направлениям
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.75, margin: 0, paddingTop: isMobile ? 0 : 8 }}>
              Напишите на{' '}
              <a href="mailto:research@lovi.today" style={{ color: 'var(--dark)', fontWeight: 500, textDecoration: 'none' }}>
                research@lovi.today
              </a>
              {' '}— обсудим совместные проекты.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 12 }}>
            {COLLAB.map((c, i) => (
              <div key={i} style={{
                border: '1px solid var(--border)', borderRadius: 20,
                padding: '28px 24px', background: '#fff',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(18,26,18,0.07)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(18,26,18,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon i={c.icon} size={18} color="var(--dark)" stroke={1.5} />
                </div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 500, color: 'var(--dark)', marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.65 }}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA — подписка ────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: isMobile ? '64px 0 80px' : '88px 0 104px' }}>
        <div style={{ ...wrap, textAlign: 'center', maxWidth: 600, margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>
            Инсайты
          </div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: isMobile ? 28 : 40, fontWeight: 500, color: '#fff', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Хотите первыми получать<br />результаты исследований?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: '0 0 32px' }}>
            Только цифры и выводы — без спама.
          </p>

          {/* Subscribe form on dark */}
          <SubscribeFormDark />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <Icon i={Mail} size={11} color="rgba(255,255,255,0.2)" stroke={1.5} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              research@lovi.today
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

// Отдельная тёмная версия формы подписки
function SubscribeFormDark() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon i={Check} size={15} color="#4ADE80" stroke={2} />
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
        Подписка оформлена — спасибо!
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      <input
        type="email"
        placeholder="Ваш email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          flex: 1, minWidth: 220, maxWidth: 300,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '13px 16px', fontSize: 14,
          background: 'rgba(255,255,255,0.06)', color: '#fff',
          outline: 'none', transition: 'border-color 0.2s',
          fontFamily: 'Inter, sans-serif',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.28)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
      />
      <button
        onClick={() => email && setSent(true)}
        style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          padding: '13px 22px', borderRadius: 14, fontWeight: 600,
          fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
          boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
          transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}
      >
        Подписаться на инсайты
      </button>
    </div>
  )
}