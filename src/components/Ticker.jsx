import { useEffect, useRef, useState } from 'react'

// ─── СПРАВОЧНИКИ ────────────────────────────────────────────────────────────

const SUBJECTS = [
  'Анна', 'Ксения', 'Мария', 'Дарья', 'Полина', 'Екатерина', 'Алина',
  'Виктория', 'Наталья', 'Юлия', 'Ирина', 'Татьяна', 'Ольга', 'Елена',
  'Анастасия', 'Валерия', 'Кристина', 'Марина', 'Светлана', 'Людмила',
  'Надежда', 'Галина', 'Вера', 'Тамара', 'Зоя', 'Лариса', 'Оксана',
  'Яна', 'Диана', 'Регина',
]

const ACTIONS = {
  service: [
    'забронировала',
    'выбрала',
    'записалась на',
    'взяла окошко:',
    'оформила запись:',
  ],
  benefit: [
    'сэкономила {benefit} на',
    'зафиксировала цену на',
    'взяла со скидкой {benefit}:',
    'урвала со скидкой {benefit}:',
    'успела поймать скидку {benefit} на',
  ],
  subscription: [
    'открыла доступ к',
    'активировала абонемент:',
    'подключила абонемент на',
  ],
}

const OBJECTS = [
  'Массаж спины',
  'Массаж шеи и плеч',
  'Массаж всего тела',
  'SPA для двоих',
  'Head SPA «Перерождение»',
  'Head SPA «Гималайский дзен»',
  'Head SPA «Экспресс»',
  'SPA для мужчин «Самурай»',
  '«Перерождение» для двоих',
  '«Экспресс» для двоих',
  'Аромамассаж',
  'Антистресс-программа',
]

const BENEFITS = [
  '2 500 ₽',
  '1 800 ₽',
  '3 200 ₽',
  '40%',
  '35%',
  '25%',
  '15%',
]

// Время "назад" — используется в статусных строках
const TIME_AGO = [
  '1 мин назад',
  '2 мин назад',
  '4 мин назад',
  '7 мин назад',
  '11 мин назад',
]

// Статусные разделители — не именные события
const STATUS_ITEMS = [
  () => {
    const n = 280 + Math.floor(Math.random() * 120)
    return `Live: ${n} открытых окошек`
  },
  () => {
    const ago = TIME_AGO[Math.floor(Math.random() * TIME_AGO.length)]
    return `Последняя бронь ${ago}`
  },
  () => 'Москва · Горящие окошки',
  () => {
    const pct = [10, 15, 25, 40][Math.floor(Math.random() * 4)]
    return `Скидки до ${pct}% · Только онлайн`
  },
]

// ─── ГЕНЕРАТОР ───────────────────────────────────────────────────────────────

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Генерирует одно событие одного из трёх типов:
 *   'service'      — Анна забронировала Head SPA
 *   'benefit'      — Ксения сэкономила 2 500 ₽ на массаже
 *   'subscription' — Мария открыла доступ к Head SPA «Экспресс»
 */
function generateEvent() {
  const type = rnd(['service', 'service', 'benefit', 'benefit', 'subscription'])
  const subject = rnd(SUBJECTS)
  const object = rnd(OBJECTS)

  if (type === 'service') {
    const action = rnd(ACTIONS.service)
    return `● ${subject} ${action} ${object}`
  }

  if (type === 'benefit') {
    const benefit = rnd(BENEFITS)
    const actionTemplate = rnd(ACTIONS.benefit)
    const action = actionTemplate.replace('{benefit}', benefit)
    return `● ${subject} ${action} ${object}`
  }

  // subscription
  const action = rnd(ACTIONS.subscription)
  return `● ${subject} ${action} ${object}`
}

/**
 * Генерирует массив из N уникальных строк тикера.
 * Чередует: 3–4 именных события → 1 статусная строка.
 */
function generateItems(count = 40) {
  const items = []
  let sinceStatus = 0

  for (let i = 0; i < count; i++) {
    const nextStatusIn = 3 + Math.floor(Math.random() * 2) // 3 или 4

    if (sinceStatus >= nextStatusIn) {
      items.push(rnd(STATUS_ITEMS)())
      sinceStatus = 0
    } else {
      items.push(generateEvent())
      sinceStatus++
    }
  }

  return items
}

// ─── КОМПОНЕНТ ───────────────────────────────────────────────────────────────

export default function Ticker() {
  const [items, setItems] = useState(() => generateItems(40))
  const trackRef = useRef(null)

  // Раз в ~30 секунд перегенерируем items чтобы поток не повторялся
  useEffect(() => {
    const id = setInterval(() => {
      setItems(generateItems(40))
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderTop: '1px solid var(--border)',
        background: 'rgba(245,244,240,0.92)',
        backdropFilter: 'blur(12px)',
        padding: '14px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          gap: 56,
          animation: 'drift 160s linear infinite',
        }}
      >
        {/* Дублируем массив чтобы бесшовный loop */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              color: item.startsWith('●')
                ? 'rgba(18,26,18,0.55)'     // именные события чуть ярче
                : 'rgba(18,26,18,0.35)',     // статусные строки тише
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: item.startsWith('●') ? 400 : 500,
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes drift {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}