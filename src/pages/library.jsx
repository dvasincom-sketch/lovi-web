import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { ArrowRight, X, BookOpen, Clock, ChevronRight } from 'lucide-react'

import Article01 from './articles/Article01'
import Article02 from './articles/Article02'
import Article03 from './articles/Article03'
import Article04 from './articles/Article04'
import Article05 from './articles/Article05'
import Article06 from './articles/Article06'
import Article07 from './articles/Article07'
import Article08 from './articles/Article08'
import Article09 from './articles/Article09'
import Article10 from './articles/Article10'
import Article11 from './articles/Article11'
import Article12 from './articles/Article12'

const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5 }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0 }} />
)

// ── Данные ───────────────────────────────────────────────────────────────────

const ARTICLES = [
  {
    id: 1, component: Article01,
    title: 'Скидка в рублях или процентах: что выбрать для чека 3 000 ₽ и чека 15 000 ₽',
    ref: 'Chen et al., 1998 · González et al., 2016',
    ready: true,
    tag: 'Ценообразование',
  },
  {
    id: 2, component: Article02,
    title: 'Когнитивная нагрузка в карточке товара: как убрать трение и поднять конверсию на 12–18%',
    ref: 'Готовится',
    ready: false,
    tag: 'UX & конверсия',
  },
  {
    id: 3, component: Article03,
    title: 'Якорь, который продаёт: как правильно ставить «старую цену», чтобы не убить доверие',
    ref: 'Urbany, 1988',
    ready: false,
    tag: 'Ценообразование',
  },
  {
    id: 4, component: Article04,
    title: 'Акция, которая ворует будущую маржу: когда рост конверсии оборачивается падением LTV',
    ref: 'Готовится',
    ready: false,
    tag: 'Маржинальность',
  },
  {
    id: 5, component: Article05,
    title: 'Скидка как сигнал: почему премиум-бренды теряют 30% perceived quality после частых распродаж',
    ref: 'Готовится',
    ready: false,
    tag: 'Бренд',
  },
  {
    id: 6, component: Article06,
    title: 'Дедлайн, который реально работает: таймер, которого боятся, и таймер, которому верят',
    ref: 'Готовится',
    ready: false,
    tag: 'Urgency',
  },
  {
    id: 7, component: Article07,
    title: '«До 70%» vs «–40% на всё»: какой заголовок акции даёт больше кликов и меньше возвратов',
    ref: 'Готовится',
    ready: false,
    tag: 'Копирайтинг',
  },
  {
    id: 8, component: Article08,
    title: 'Почему 999 ₽ всё ещё продаёт лучше 1000 ₽ — left-digit bias и как его использовать прямо сейчас',
    ref: 'Готовится',
    ready: false,
    tag: 'Ценообразование',
  },
  {
    id: 9, component: Article09,
    title: 'Купон на 500 ₽ vs скидка 500 ₽: что сильнее удерживает клиента и повышает повторные покупки',
    ref: 'Готовится',
    ready: false,
    tag: 'Лояльность',
  },
  {
    id: 10, component: Article10,
    title: 'Рынок на скидочной игле: как не попасть в ловушку promotion addiction и сохранить маржинальность',
    ref: 'Готовится',
    ready: false,
    tag: 'Маржинальность',
  },
  {
    id: 11, component: Article11,
    title: '100% предоплата: барьер или фильтр? Как обязательный платёж меняет конверсию и no-show',
    ref: 'Готовится',
    ready: false,
    tag: 'Бронирование',
  },
  {
    id: 12, component: Article12,
    title: 'Гео-фактор в акциях: почему в дождь и в 500 метрах от метро скидка работает иначе',
    ref: 'Готовится',
    ready: false,
    tag: 'География',
  },
]

const TAG_COLORS = {
  'Ценообразование': { bg: 'rgba(249,115,22,0.08)', color: 'var(--accent)' },
  'UX & конверсия':  { bg: 'rgba(99,179,237,0.1)',  color: '#2B8CC4' },
  'Маржинальность':  { bg: 'rgba(154,205,50,0.1)',  color: '#5A8A00' },
  'Бренд':           { bg: 'rgba(143,132,117,0.12)', color: 'var(--secondary)' },
  'Urgency':         { bg: 'rgba(239,68,68,0.08)',   color: '#DC2626' },
  'Копирайтинг':     { bg: 'rgba(18,26,18,0.07)',    color: 'var(--dark)' },
  'Лояльность':      { bg: 'rgba(74,222,128,0.1)',   color: '#16A34A' },
  'Бронирование':    { bg: 'rgba(99,179,237,0.1)',   color: '#2B8CC4' },
  'География':       { bg: 'rgba(143,132,117,0.12)', color: 'var(--secondary)' },
}

// ── Article Drawer ────────────────────────────────────────────────────────────

function ArticleDrawer({ article, onClose }) {
  const ArticleComponent = article.component

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(18,26,18,0.35)',
          zIndex: 1100, backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer — справа */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(640px, 100vw)',
        background: '#fff',
        zIndex: 1101,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-24px 0 60px rgba(18,26,18,0.12)',
        animation: 'slideInRight 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px', flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--secondary)' }}>Библиотека</span>
              <Icon i={ChevronRight} size={10} color="var(--secondary)" stroke={1.5} />
              <span style={{ fontSize: 11, color: 'var(--secondary)' }}>
                Статья {String(article.id).padStart(2, '0')}
              </span>
              {/* Tag */}
              {(() => {
                const tc = TAG_COLORS[article.tag] || TAG_COLORS['Ценообразование']
                return (
                  <span style={{ marginLeft: 4, background: tc.bg, color: tc.color, padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
                    {article.tag}
                  </span>
                )
              })()}
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 500,
              color: 'var(--dark)', margin: 0, lineHeight: 1.4,
            }}>
              {article.title}
            </h2>
            {article.ready && (
              <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon i={BookOpen} size={11} color="var(--secondary)" stroke={1.5} />
                {article.ref}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(18,26,18,0.06)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,26,18,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(18,26,18,0.06)' }}
          >
            <Icon i={X} size={14} color="var(--secondary)" stroke={2} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '28px 28px 60px',
        }}>
          <ArticleComponent />
        </div>
      </div>
    </>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function Library() {
  const isMobile = useIsMobile()
  const [active, setActive] = useState(null)

  const ready = ARTICLES.filter(a => a.ready)
  const coming = ARTICLES.filter(a => !a.ready)

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#FDFCF9 0%,#F1EFE9 100%)',
        padding: isMobile ? '80px 20px 60px' : '96px 40px 72px',
        position: 'relative', overflow: 'hidden',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ position: 'absolute', bottom: -40, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 680 }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.08)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            <Icon i={BookOpen} size={11} color="var(--accent)" stroke={2} />
            Lovi Research · Библиотека
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: isMobile ? 34 : 52, fontWeight: 500,
            color: 'var(--dark)', margin: '0 0 16px',
            lineHeight: 1.07, letterSpacing: '-0.02em',
          }}>
            Гид по поведенческой<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>экономике скидок</em>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 16, color: 'var(--secondary)', lineHeight: 1.75, margin: 0, maxWidth: 520 }}>
            12 статей на основе академических исследований — о том, как скидки влияют
            на восприятие, конверсию и лояльность клиентов.
          </p>
        </div>
      </div>

      {/* ── КОНТЕНТ ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '48px 20px 80px' : '64px 40px 100px' }}>

        {/* Опубликованные */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Опубликованы
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(74,222,128,0.1)', color: '#16A34A', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ADE80' }} />
              {ready.length}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            {ready.map((a, i) => {
              const tc = TAG_COLORS[a.tag] || { bg: 'rgba(18,26,18,0.06)', color: 'var(--secondary)' }
              return (
                <button
                  key={a.id}
                  onClick={() => setActive(a)}
                  style={{
                    width: '100%', textAlign: 'left', background: '#fff',
                    border: 'none', borderBottom: i < ready.length - 1 ? '1px solid var(--border)' : 'none',
                    padding: isMobile ? '20px 20px' : '22px 28px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.02)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                >
                  {/* Number */}
                  <div style={{
                    fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500,
                    color: 'var(--accent)', flexShrink: 0, width: 32, lineHeight: 1,
                  }}>
                    {String(a.id).padStart(2, '0')}
                  </div>

                  {/* Title + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 500, color: 'var(--dark)', lineHeight: 1.45, marginBottom: 6 }}>
                      {a.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ background: tc.bg, color: tc.color, padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
                        {a.tag}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon i={BookOpen} size={10} color="var(--secondary)" stroke={1.5} />
                        {a.ref}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon i={ArrowRight} size={14} color="var(--accent)" stroke={2} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Готовятся */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Готовятся
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(143,132,117,0.1)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
              {coming.length}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 10 }}>
            {coming.map((a) => {
              const tc = TAG_COLORS[a.tag] || { bg: 'rgba(18,26,18,0.06)', color: 'var(--secondary)' }
              return (
                <div
                  key={a.id}
                  style={{
                    background: '#fff', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '18px 20px',
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    opacity: 0.65,
                  }}
                >
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 16, fontWeight: 500, color: 'rgba(18,26,18,0.2)', flexShrink: 0, width: 26, lineHeight: 1, paddingTop: 2 }}>
                    {String(a.id).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--dark)', lineHeight: 1.5, marginBottom: 8 }}>
                      {a.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: tc.bg, color: tc.color, padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
                        {a.tag}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--secondary)' }}>
                        <Icon i={Clock} size={10} color="var(--secondary)" stroke={1.5} />
                        Скоро
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      {active && (
        <ArticleDrawer article={active} onClose={() => setActive(null)} />
      )}
    </div>
  )
}