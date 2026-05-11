import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  // Navigation & UI
  Menu, X, ChevronDown, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft,
  // Actions
  Search, Filter, SlidersHorizontal, Plus, Minus, Check, Copy, Share2,
  // Status & feedback
  Zap, Clock, Timer, AlertCircle, Info, Star, Heart,
  // Location & map
  MapPin, Navigation,
  // Commerce
  CreditCard, Wallet, Tag, Percent, ShoppingBag,
  // People
  User, Users,
  // Content
  Calendar, CalendarDays, Sparkles, Award,
  // Settings & system
  Settings, ToggleLeft, ToggleRight, Eye, EyeOff,
  // Communication
  Phone, Mail, MessageCircle,
  // Media
  Play, Pause,
  // Misc
  Leaf, Flame, Diamond, Gem,
} from 'lucide-react'

// ─── Icon helper ─────────────────────────────────────────────────────────────
// Используй везде в проекте вместо эмодзи
// <Icon i={Zap} size={16} color="var(--accent)" />
const Icon = ({ i: I, size = 16, color = 'currentColor', stroke = 1.5, style = {} }) => (
  <I size={size} color={color} strokeWidth={stroke} style={{ flexShrink: 0, ...style }} />
)

// ─── Хук мобильной адаптации ────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ─── Хук таймера ────────────────────────────────────────────────────────────
function useTimer(sec) {
  const [s, setS] = useState(0)
  useEffect(() => {
    if (!sec) return
    setS(sec)
    const t = setInterval(() => setS(v => v > 0 ? v - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [sec])
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const str = h > 0
    ? h + ':' + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0')
    : String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0')
  return { str, pct: sec ? Math.max(0, (s / sec) * 100) : 0, urgent: s <= 900, raw: s }
}

// ─── Обёртки ─────────────────────────────────────────────────────────────────
const Section = ({ id, title, children }) => (
  <div id={id} style={{ marginBottom: 72, scrollMarginTop: 80 }}>
    <div style={{
      fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--secondary)', marginBottom: 8, paddingBottom: 12,
      borderBottom: '1px solid var(--border)'
    }}>
      {title}
    </div>
    <div style={{ marginTop: 24 }}>{children}</div>
  </div>
)

const Row = ({ gap = 12, children, wrap = false }) => (
  <div style={{
    display: 'flex', gap, alignItems: 'flex-start',
    flexWrap: wrap ? 'wrap' : 'nowrap', marginBottom: 16
  }}>
    {children}
  </div>
)

const Label = ({ children }) => (
  <div style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 8 }}>{children}</div>
)

// ─── Кнопки (shared helpers) ─────────────────────────────────────────────────
const BtnPrimary = ({ children, style = {}, ...props }) => (
  <button
    style={{
      background: 'var(--accent)', color: '#fff', border: 'none',
      padding: '14px 28px', borderRadius: 18, fontWeight: 600,
      cursor: 'pointer', fontSize: 14,
      boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
      transition: 'all 0.2s', ...style
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}
    {...props}
  >
    {children}
  </button>
)

const BtnDark = ({ children, style = {}, ...props }) => (
  <button
    style={{
      background: 'var(--dark)', color: '#fff', border: 'none',
      padding: '14px 28px', borderRadius: 18, fontWeight: 600,
      cursor: 'pointer', fontSize: 14, transition: 'all 0.2s', ...style
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
    {...props}
  >
    {children}
  </button>
)

// ═══════════════════════════════════════════════════════════════════════════════
// НОВЫЕ КОМПОНЕНТЫ
// ═══════════════════════════════════════════════════════════════════════════════

// 1. ТАЙМЕР ───────────────────────────────────────────────────────────────────
function TimerDemo() {
  const normal = useTimer(5400)   // 1:30:00
  const urgent = useTimer(600)    // 10:00

  const TimerBlock = ({ timer, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Label>{label}</Label>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: timer.urgent ? 'rgba(249,115,22,0.08)' : 'rgba(18,26,18,0.04)',
        border: `1px solid ${timer.urgent ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
        borderRadius: 12, padding: '8px 14px', alignSelf: 'flex-start',
        transition: 'all 0.4s'
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: timer.urgent ? 'var(--accent)' : 'var(--secondary)',
          animation: timer.urgent ? 'pulse 1.2s ease-in-out infinite' : 'none',
          flexShrink: 0, transition: 'background 0.4s'
        }} />
        <span style={{
          fontFamily: 'monospace', fontSize: 18, fontWeight: 600, letterSpacing: '0.04em',
          color: timer.urgent ? 'var(--accent)' : 'var(--dark)',
          transition: 'color 0.4s'
        }}>
          {timer.str}
        </span>
        {timer.urgent && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--accent)'
          }}>
            горит
          </span>
        )}
      </div>
      {/* Progress bar */}
      <div style={{
        width: 200, height: 3, background: 'var(--border)', borderRadius: 2, marginTop: 6
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: timer.urgent ? 'var(--accent)' : 'var(--dark)',
          width: timer.pct + '%',
          transition: 'width 1s linear, background 0.4s'
        }} />
      </div>
    </div>
  )

  return (
    <Row gap={32} wrap>
      <TimerBlock timer={normal} label="Normal (> 15 мин)" />
      <TimerBlock timer={urgent} label="Urgent (< 15 мин)" />
    </Row>
  )
}

// 2. TOGGLE ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0
      }}
    >
      <div style={{
        width: 40, height: 22, borderRadius: 11,
        background: checked ? 'var(--dark)' : 'rgba(18,26,18,0.12)',
        position: 'relative', transition: 'background 0.25s', flexShrink: 0
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
        }} />
      </div>
      {label && (
        <span style={{ fontSize: 13, color: 'var(--dark)', fontWeight: 500 }}>{label}</span>
      )}
    </button>
  )
}

function ToggleDemo() {
  const [pub, setPub] = useState(true)
  const [prem, setPrem] = useState(false)
  const [feat, setFeat] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <div style={{
        border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 14
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>«Перерождение» Head SPA</div>
            <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>90 мин · 5 900 ₽</div>
          </div>
          <Toggle checked={pub} onChange={setPub} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>Массаж спины</div>
            <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>60 мин · 3 500 ₽</div>
          </div>
          <Toggle checked={prem} onChange={setPrem} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>Гималайский дзен</div>
            <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>75 мин · 4 200 ₽</div>
          </div>
          <Toggle checked={feat} onChange={setFeat} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Toggle checked={pub} onChange={setPub} label={pub ? 'Опубликовано' : 'Черновик'} />
      </div>
    </div>
  )
}

// 3. PILL / TAG ────────────────────────────────────────────────────────────────
function PillDemo() {
  const pills = [
    { label: 'Published', bg: 'rgba(18,26,18,0.07)', color: 'var(--dark)', dot: '#4ADE80' },
    { label: 'Draft', bg: 'rgba(143,132,117,0.1)', color: 'var(--secondary)', dot: 'var(--secondary)' },
    { label: 'Premium', bg: 'rgba(249,115,22,0.1)', color: 'var(--accent)', dot: 'var(--accent)' },
    { label: 'Popular', bg: 'rgba(249,115,22,0.18)', color: 'var(--accent)', dot: 'var(--accent)' },
    { label: 'Archived', bg: 'rgba(18,26,18,0.04)', color: 'rgba(18,26,18,0.3)', dot: 'rgba(18,26,18,0.2)' },
  ]

  const sizePills = [
    { label: 'xs pill', px: '3px 8px', r: 6, fs: 10, fw: 600 },
    { label: 'sm pill', px: '4px 10px', r: 8, fs: 11, fw: 600 },
    { label: 'md pill', px: '5px 12px', r: 10, fs: 12, fw: 600 },
    { label: 'lg pill', px: '6px 14px', r: 12, fs: 13, fw: 500 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Status pills */}
      <div>
        <Label>Статусные бейджи</Label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {pills.map(p => (
            <div key={p.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: p.bg, color: p.color,
              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot, flexShrink: 0 }} />
              {p.label}
            </div>
          ))}
        </div>
      </div>
      {/* Size scale */}
      <div>
        <Label>Размеры</Label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {sizePills.map(p => (
            <div key={p.label} style={{
              background: 'rgba(18,26,18,0.07)', color: 'var(--dark)',
              padding: p.px, borderRadius: p.r, fontSize: p.fs, fontWeight: p.fw
            }}>
              {p.label}
            </div>
          ))}
        </div>
      </div>
      {/* Discount tags */}
      <div>
        <Label>Теги скидок</Label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: 'rgba(249,115,22,0.09)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>⚡ -25%</div>
          <div style={{ background: 'rgba(249,115,22,0.18)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>-40%</div>
          <div style={{ background: 'var(--dark)', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Рекомендуем</div>
          <div style={{ background: '#FFF7ED', color: 'var(--accent)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Топ по отзывам</div>
          <div style={{ background: 'rgba(74,222,128,0.12)', color: '#16A34A', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Новинка</div>
        </div>
      </div>
    </div>
  )
}

// 4. COUNTER / КАЛЬКУЛЯТОР ────────────────────────────────────────────────────
function CounterDemo() {
  const [guests, setGuests] = useState(2)
  const [sessions, setSessions] = useState(1)
  const BASE = 5900
  const discount = sessions >= 5 ? 0.2 : sessions >= 3 ? 0.15 : sessions >= 2 ? 0.1 : 0
  const total = guests * sessions * BASE * (1 - discount)
  const saved = guests * sessions * BASE * discount

  const Counter = ({ value, onChange, min = 1, max = 10, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, color: 'var(--secondary)' }}>{label}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', alignSelf: 'flex-start' }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 40, height: 40, border: 'none', background: 'transparent',
            cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 400,
            color: value <= min ? 'rgba(18,26,18,0.2)' : 'var(--dark)',
            transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={e => { if (value > min) e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >−</button>
        <div style={{
          width: 44, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 600, color: 'var(--dark)',
          borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)'
        }}>
          {value}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 40, height: 40, border: 'none', background: 'transparent',
            cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 400,
            color: value >= max ? 'rgba(18,26,18,0.2)' : 'var(--dark)',
            transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={e => { if (value < max) e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >+</button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Counters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Counter value={guests} onChange={setGuests} min={1} max={6} label="Гостей" />
        <Counter value={sessions} onChange={setSessions} min={1} max={10} label="Сеансов" />
      </div>

      {/* Result block */}
      <div style={{
        background: 'var(--dark)', color: '#fff', borderRadius: 24,
        padding: '24px 28px', minWidth: 220, flex: 1, maxWidth: 320
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
          Итого
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span>{guests} × {sessions} сеанс{sessions > 1 ? 'а' : ''}</span>
            <span>{(guests * sessions * BASE).toLocaleString('ru')} ₽</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--accent)' }}>
              <span>Скидка {(discount * 100).toFixed(0)}%</span>
              <span>−{saved.toLocaleString('ru')} ₽</span>
            </div>
          )}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 500, lineHeight: 1 }}>
            {total.toLocaleString('ru')} ₽
          </div>
          {discount > 0 && (
            <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 6 }}>
              Экономия {saved.toLocaleString('ru')} ₽ 🎉
            </div>
          )}
        </div>
        {sessions >= 2 && (
          <div style={{ marginTop: 16, fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
            {sessions < 3 ? 'Добавьте 3 сеанса → скидка 15%' :
              sessions < 5 ? 'Добавьте 5 сеансов → скидка 20%' :
                'Максимальная скидка активирована'}
          </div>
        )}
      </div>
    </div>
  )
}

// 5. DRAWER ───────────────────────────────────────────────────────────────────
function DrawerDemo() {
  const [rightOpen, setRightOpen] = useState(false)
  const [bottomOpen, setBottomOpen] = useState(false)

  const Overlay = ({ onClose }) => (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(18,26,18,0.4)',
        zIndex: 999, backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.2s ease'
      }}
    />
  )

  return (
    <div>
      <Row gap={12} wrap>
        <div>
          <Label>slideRight — боковой drawer</Label>
          <BtnDark onClick={() => setRightOpen(true)} style={{ padding: '10px 20px', fontSize: 13, borderRadius: 14 }}>
            Открыть Right Drawer
          </BtnDark>
        </div>
        <div>
          <Label>slideUp — нижний drawer</Label>
          <button
            onClick={() => setBottomOpen(true)}
            style={{
              background: 'transparent', color: 'var(--dark)', border: '1px solid var(--border)',
              padding: '10px 20px', borderRadius: 14, fontWeight: 500, cursor: 'pointer', fontSize: 13,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dark)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Открыть Bottom Drawer
          </button>
        </div>
      </Row>

      {/* Right Drawer */}
      {rightOpen && (
        <>
          <Overlay onClose={() => setRightOpen(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
            background: 'var(--bg)', zIndex: 1000, padding: '32px 28px',
            overflowY: 'auto', boxShadow: '-24px 0 60px rgba(18,26,18,0.12)',
            animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 6 }}>Настройки услуги</div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500 }}>«Перерождение»</div>
              </div>
              <button
                onClick={() => setRightOpen(false)}
                style={{ background: 'rgba(18,26,18,0.06)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon i={X} size={14} color="var(--secondary)" stroke={2} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Базовая цена', value: '5 900 ₽' },
                { label: 'Скидка (будни)', value: '15%' },
                { label: 'Скидка (горит)', value: '40%' },
                { label: 'Длительность', value: '90 мин' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--secondary)' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{row.value}</span>
                </div>
              ))}
              <BtnPrimary style={{ width: '100%', marginTop: 8 }}>Сохранить изменения</BtnPrimary>
            </div>
          </div>
        </>
      )}

      {/* Bottom Drawer */}
      {bottomOpen && (
        <>
          <Overlay onClose={() => setBottomOpen(false)} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--bg)', zIndex: 1000,
            borderRadius: '24px 24px 0 0',
            padding: '20px 24px 40px',
            boxShadow: '0 -24px 60px rgba(18,26,18,0.12)',
            animation: 'slideInBottom 0.3s cubic-bezier(0.4,0,0.2,1)',
            maxWidth: 600, margin: '0 auto'
          }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: 'rgba(18,26,18,0.12)', borderRadius: 2, margin: '0 auto 24px', cursor: 'grab' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 500 }}>
                Выбрать время
              </div>
              <button
                onClick={() => setBottomOpen(false)}
                style={{ background: 'rgba(18,26,18,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon i={X} size={14} color="var(--secondary)" stroke={2} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              {['16:00', '17:30', '19:00', '20:15'].map((t, i) => (
                <button key={t} style={{
                  padding: '10px 18px', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  border: `1px solid ${i === 1 ? 'var(--dark)' : 'var(--border)'}`,
                  background: i === 1 ? 'var(--dark)' : 'transparent',
                  color: i === 1 ? '#fff' : 'var(--dark)',
                  transition: 'all 0.2s'
                }}>
                  {t}
                </button>
              ))}
            </div>
            <BtnPrimary style={{ width: '100%' }}>Забрать за 5 015 ₽</BtnPrimary>
          </div>
        </>
      )}
    </div>
  )
}

// 6. HERO-БЛОКИ ───────────────────────────────────────────────────────────────
function HeroDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Dark hero with photo overlay */}
      <div>
        <Label>Dark hero — fullscreen с фото-подложкой</Label>
        <div style={{
          position: 'relative', borderRadius: 24, overflow: 'hidden',
          minHeight: 420, background: '#1A1F1A',
          display: 'flex', alignItems: 'flex-end', padding: 40
        }}>
          {/* Simulated photo overlay as gradient mesh */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,rgba(18,26,18,0.95) 0%,rgba(18,26,18,0.6) 50%,rgba(18,26,18,0.85) 100%)'
          }} />
          {/* Decorative texture dots */}
          <div style={{
            position: 'absolute', top: 40, right: 40, width: 120, height: 120,
            backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.15) 1px, transparent 1px)',
            backgroundSize: '12px 12px', borderRadius: '50%'
          }} />
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.15)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.6s ease-in-out infinite' }} />
                342 окна прямо сейчас
              </div>
            </div>            <h1 style={{
              fontFamily: 'Playfair Display,serif', fontSize: 48, fontWeight: 500,
              lineHeight: 1.05, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em'
            }}>
              Горящие окошки.<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Сегодня.</em>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
              Лучшие велнес-пространства Москвы. Свободные слоты за час до сеанса — со скидкой до 40%.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <BtnPrimary>Найти окошко</BtnPrimary>
              <button style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                padding: '14px 28px', borderRadius: 18, fontWeight: 500, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}>
                Как это работает →
              </button>
            </div>
          </div>
          {/* Right accent */}
          <div style={{
            position: 'absolute', top: '50%', right: 40, transform: 'translateY(-50%)',
            textAlign: 'right'
          }}>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 80, fontWeight: 500, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>
              −40%
            </div>
          </div>
        </div>
      </div>

      {/* Light hero with gradient */}
      <div>
        <Label>Light hero — с градиентом</Label>
        <div style={{
          borderRadius: 24, overflow: 'hidden', minHeight: 320,
          background: 'linear-gradient(135deg,#FDFCF9 0%,#F1EFE9 100%)',
          display: 'flex', alignItems: 'center', padding: '40px 48px',
          position: 'relative', border: '1px solid var(--border)'
        }}>
          <div style={{
            position: 'absolute', bottom: -20, right: -20, width: 260, height: 260,
            borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)'
          }} />
          <div style={{ maxWidth: 520, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 16 }}>
              Для партнёров
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display,serif', fontSize: 36, fontWeight: 500,
              lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.01em'
            }}>
              Заполните пустые часы.<br />
              <span style={{ color: 'var(--accent)' }}>Без лишних усилий.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Подключите ваш салон к Lovi — горящие окна становятся доходом вместо потерь.
            </p>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <BtnDark>Подключить салон</BtnDark>
              <a href="#" style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 500 }}>
                Первые 3 мес. без комиссии →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 7. FEATURE-БЛОКИ ────────────────────────────────────────────────────────────
function FeatureDemo() {
  const features = [
    { icon: Zap, title: 'Мгновенное бронирование', text: '100% предоплата онлайн. Слот ваш в одно касание — без звонков и подтверждений.' },
    { icon: MapPin, title: 'Рядом с вами', text: 'Умный фильтр по расстоянию. Только салоны в 15 минутах езды от вас.' },
    { icon: Gem, title: 'Премиум без наценки', text: 'Те же мастера, то же качество — но по цене горящего слота, который иначе пропал бы.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Light variant */}
      <div>
        <Label>Light variant — 3 колонки</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          {features.map(f => (
            <div key={f.title} style={{
              border: '1px solid var(--border)', borderRadius: 20, padding: '24px 24px',
              background: '#fff', transition: 'all 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(18,26,18,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: 'rgba(18,26,18,0.04)' }}>
                <Icon i={f.icon} size={20} color="var(--dark)" stroke={1.5} />
              </div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.65 }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark variant */}
      <div>
        <Label>Dark variant</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 0, background: 'var(--dark)', borderRadius: 24, overflow: 'hidden' }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              padding: '28px 24px',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none'
            }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)' }}>
                <Icon i={f.icon} size={20} color="rgba(255,255,255,0.7)" stroke={1.5} />
              </div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, fontWeight: 500, color: '#fff', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 8. ШАГИ / НУМЕРАЦИЯ ─────────────────────────────────────────────────────────
function StepsDemo() {
  const steps = [
    { n: '01', title: 'Открываешь Lovi', text: 'Видишь реальные свободные окошки в салонах — прямо сейчас, рядом с тобой.' },
    { n: '02', title: 'Выбираешь слот', text: 'Программа, время, цена — всё честно. Скидка реальная, потому что иначе слот сгорит.' },
    { n: '03', title: 'Оплачиваешь онлайн', text: 'Бронирование мгновенное. СБП, Apple Pay, T-Pay — без звонков и подтверждений.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Horizontal */}
      <div>
        <Label>Горизонтально</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              padding: '24px 32px 24px 0',
              borderRight: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
              marginRight: i < steps.length - 1 ? 32 : 0
            }}>
              <div style={{
                fontFamily: 'Playfair Display,serif', fontSize: 52, fontWeight: 500,
                lineHeight: 1, color: 'rgba(18,26,18,0.06)', marginBottom: 12,
                letterSpacing: '-0.02em'
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.65 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical dark */}
      <div>
        <Label>Вертикально тёмный</Label>
        <div style={{ background: 'var(--dark)', borderRadius: 24, padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              display: 'flex', gap: 24, paddingBottom: i < steps.length - 1 ? 28 : 0,
              borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              marginBottom: i < steps.length - 1 ? 28 : 0
            }}>
              <div style={{
                fontFamily: 'Playfair Display,serif', fontSize: 36, fontWeight: 500,
                color: 'var(--accent)', lineHeight: 1, flexShrink: 0, width: 48
              }}>
                {s.n}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 9. ОТЗЫВЫ ───────────────────────────────────────────────────────────────────
function TestimonialsDemo() {
  const reviews = [
    {
      text: 'Записалась за 40 минут до сеанса — получила массаж за половину цены. Мастер тот же, пространство то же. Магия.',
      name: 'Анна К.',
      role: 'Клиент Lovi, Москва',
      discount: '-40%'
    },
    {
      text: 'Раньше пустые слоты просто сгорали. Теперь мы заполняем их через Lovi — без лишних объявлений и звонков.',
      name: 'Марина Власова',
      role: 'Владелец Head Spa Beauty',
      discount: '+30% доход'
    },
    {
      text: 'Концепция «биржи времени» зацепила сразу. Первый раз пришла скептически, теперь проверяю Lovi каждое утро.',
      name: 'Дарья М.',
      role: 'Постоянный клиент',
      discount: '8 визитов'
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Inline — без карточек */}
      <div>
        <Label>Текстовые (без карточек)</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 32 }}>
          {reviews.map(r => (
            <div key={r.name}>
              <div style={{
                fontFamily: 'Playfair Display,serif', fontSize: 16, lineHeight: 1.6,
                color: 'var(--dark)', marginBottom: 16, fontStyle: 'italic'
              }}>
                «{r.text}»
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>{r.role}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'rgba(249,115,22,0.08)', padding: '2px 8px', borderRadius: 6 }}>
                  {r.discount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured single */}
      <div>
        <Label>Большой отзыв</Label>
        <div style={{ maxWidth: 640, borderLeft: '2px solid var(--accent)', paddingLeft: 28 }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, lineHeight: 1.5, color: 'var(--dark)', marginBottom: 20, fontStyle: 'italic' }}>
            «Раньше пустые слоты просто сгорали. Теперь мы заполняем их через Lovi — без лишних объявлений и звонков.»
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>Марина Власова</div>
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4 }}>Владелец Head Spa Beauty · ул. Миклухо-Маклая 37</div>
        </div>
      </div>
    </div>
  )
}

// 10. ЛОГОТИП-СТРОКА ──────────────────────────────────────────────────────────
function LogoRowDemo() {
  const partners = ['Head Spa Beauty', 'LuxeSpa', 'Zen Studio', 'Body Works', 'Ritual', 'Oasis Club', 'Bloom']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Label>Партнёры / клиенты в ряд</Label>
      <div style={{
        display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 4,
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none'
      }}>
        {partners.map((p, i) => (
          <div key={p} style={{
            flexShrink: 0, padding: '16px 24px',
            borderRight: i < partners.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex', alignItems: 'center',
            cursor: 'pointer', transition: 'opacity 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.5' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            <span style={{
              fontFamily: 'Playfair Display,serif', fontSize: 14, fontWeight: 500,
              color: 'var(--dark)', whiteSpace: 'nowrap', opacity: 0.4
            }}>
              {p}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
        7 партнёрских салонов · Москва 2025
      </div>
    </div>
  )
}

// 11. СЕТКИ ───────────────────────────────────────────────────────────────────
function GridsDemo() {
  const Cell = ({ children, style = {} }) => (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 16,
      padding: '20px 20px', ...style
    }}>
      {children}
    </div>
  )
  const Placeholder = ({ label }) => (
    <div style={{ fontSize: 11, color: 'rgba(18,26,18,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Label>2 колонки — hero + content</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Cell style={{ minHeight: 120 }}><Placeholder label="Левая колонка" /></Cell>
          <Cell style={{ minHeight: 120 }}><Placeholder label="Правая колонка" /></Cell>
        </div>
      </div>

      <div>
        <Label>3 колонки — feature grid</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {['1 / 3', '2 / 3', '3 / 3'].map(l => (
            <Cell key={l} style={{ minHeight: 80 }}><Placeholder label={l} /></Cell>
          ))}
        </div>
      </div>

      <div>
        <Label>4 колонки — метрики / stats</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { value: '342', label: 'горящих окна' },
            { value: '52', label: 'салона' },
            { value: '−15%', label: 'средняя скидка' },
            { value: '1 ч', label: 'до сеанса' },
          ].map(s => (
            <Cell key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 500, color: 'var(--dark)', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--secondary)' }}>{s.label}</div>
            </Cell>
          ))}
        </div>
      </div>

      <div>
        <Label>Bento-асимметрия — 2/3 + 1/3</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <Cell style={{ minHeight: 140 }}>
            <Placeholder label="Большой блок 2/3" />
          </Cell>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
            <Cell><Placeholder label="1/3 верх" /></Cell>
            <Cell><Placeholder label="1/3 низ" /></Cell>
          </div>
        </div>
      </div>
    </div>
  )
}

// 12. CTA-СЕКЦИИ ──────────────────────────────────────────────────────────────
function CTADemo() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Dark CTA with form */}
      <div>
        <Label>Тёмный с формой</Label>
        <div style={{
          background: 'var(--dark)', borderRadius: 24, padding: '40px 40px',
          display: 'flex', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ maxWidth: 380 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
              Для партнёров
            </div>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, fontWeight: 500, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>
              Подключите салон к Lovi
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
              Первые 3 месяца без комиссии. Выход в любой момент.
            </div>
          </div>
          <div style={{ flexShrink: 0, minWidth: 280 }}>
            {submitted ? (
              <div style={{ color: '#16A34A', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon i={Check} size={16} color="#16A34A" stroke={2} /> Заявка принята — напишем в течение суток
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="email"
                  placeholder="Email салона"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14, padding: '13px 16px', fontSize: 14, color: '#fff',
                    outline: 'none', width: '100%', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.25)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
                <BtnPrimary style={{ width: '100%' }} onClick={() => email && setSubmitted(true)}>
                  Оставить заявку
                </BtnPrimary>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Light CTA with button */}
      <div>
        <Label>Светлый с кнопкой</Label>
        <div style={{
          background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)',
          borderRadius: 24, padding: '32px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 24, flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
              Найди горящее окошко прямо сейчас
            </div>
            <div style={{ fontSize: 13, color: 'var(--secondary)' }}>
              342 слота доступны сегодня · Скидки от 10% до 40%
            </div>
          </div>
          <BtnPrimary>Смотреть слоты →</BtnPrimary>
        </div>
      </div>
    </div>
  )
}

// 13. ФОРМА ЗАЯВКИ ────────────────────────────────────────────────────────────
function FormDemo() {
  const [collapsed, setCollapsed] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '', salon: '' })

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid var(--border)', borderRadius: 12,
    padding: '13px 16px', fontSize: 14, background: '#fff',
    outline: 'none', transition: 'border-color 0.2s', color: 'var(--dark)'
  }

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Expanded */}
      <div style={{ flex: 1, minWidth: 280, maxWidth: 380 }}>
        <Label>Expanded — раскрытая сразу</Label>
        <div style={{
          border: '1px solid var(--border)', borderRadius: 20, padding: '24px 24px',
          background: '#fff'
        }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
            Подключить салон
          </div>
          <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 20 }}>
            Ответим в течение суток
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'name', placeholder: 'Ваше имя', type: 'text' },
              { key: 'phone', placeholder: 'Телефон', type: 'tel' },
              { key: 'salon', placeholder: 'Название салона', type: 'text' },
            ].map(f => (
              <input
                key={f.key}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--dark)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
              />
            ))}
            <BtnPrimary style={{ width: '100%', marginTop: 4 }}>
              Оставить заявку
            </BtnPrimary>
          </div>
        </div>
      </div>

      {/* Collapsed */}
      <div style={{ flex: 1, minWidth: 280, maxWidth: 380 }}>
        <Label>Collapsed — раскрывается по кнопке</Label>
        <div style={{
          border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden',
          background: '#fff'
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', padding: '20px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer'
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>Стать партнёром</div>
              <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>Первые 3 мес. без комиссии</div>
            </div>
            <div style={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.25s', color: 'var(--secondary)', fontSize: 16
            }}>
              ↓
            </div>
          </button>
          {!collapsed && (
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { placeholder: 'Ваше имя', type: 'text' },
                { placeholder: 'Телефон', type: 'tel' },
                { placeholder: 'Email', type: 'email' },
              ].map(f => (
                <input
                  key={f.placeholder}
                  type={f.type}
                  placeholder={f.placeholder}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--dark)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
                />
              ))}
              <BtnPrimary style={{ width: '100%', marginTop: 4 }}>Отправить</BtnPrimary>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SHADCN КОМПОНЕНТЫ
// ═══════════════════════════════════════════════════════════════════════════════

// DIALOG ──────────────────────────────────────────────────────────────────────
function DialogDemo() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0) // 0=confirm, 1=success

  const handlePay = () => { setStep(1); setTimeout(() => { setOpen(false); setStep(0) }, 2000) }

  return (
    <>
      <BtnPrimary onClick={() => setOpen(true)}>Забрать за 5 015 ₽</BtnPrimary>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(18,26,18,0.45)',
            zIndex: 999, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease'
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: 'var(--bg)', borderRadius: 28, padding: '32px 32px',
            width: 420, maxWidth: 'calc(100vw - 40px)',
            zIndex: 1000, boxShadow: '0 40px 80px rgba(18,26,18,0.18)',
            animation: 'fadeIn 0.25s ease'
          }}>
            {step === 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 6 }}>Подтверждение</div>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500 }}>Оформление записи</div>
                  </div>
                  <button onClick={() => setOpen(false)} style={{ background: 'rgba(18,26,18,0.06)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon i={X} size={14} color="var(--secondary)" stroke={2} />
                  </button>
                </div>
                <div style={{ background: 'rgba(18,26,18,0.03)', borderRadius: 16, padding: '16px 18px', marginBottom: 20 }}>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 16, marginBottom: 8 }}>«Перерождение» Premium Head SPA</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', display: 'flex', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon i={MapPin} size={12} color="var(--secondary)" /> Head Spa Beauty</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon i={Clock} size={12} color="var(--secondary)" /> 17:00 · 90 мин</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--secondary)' }}>Цена в салоне</span>
                  <span style={{ fontSize: 13, color: 'var(--secondary)' }}>5 900 ₽</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--accent)' }}>Скидка Lovi −15%</span>
                  <span style={{ fontSize: 13, color: 'var(--accent)' }}>−885 ₽</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>Итого</span>
                  <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500 }}>5 015 ₽</span>
                </div>
                <BtnPrimary style={{ width: '100%' }} onClick={handlePay}>Оплатить 5 015 ₽</BtnPrimary>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                  {['СБП', 'Apple Pay', 'T-Pay'].map(p => (
                    <span key={p} style={{ fontSize: 10, color: 'var(--secondary)', background: 'rgba(18,26,18,0.06)', padding: '2px 8px', borderRadius: 4 }}>{p}</span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon i={Check} size={24} color="#16A34A" stroke={2} />
                </div>
              </div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, marginBottom: 8 }}>Запись подтверждена</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)' }}>Ждём вас в 17:00 · Head Spa Beauty</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

// DATE PICKER ─────────────────────────────────────────────────────────────────
function DatePickerDemo() {
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)

  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })
  const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

  const fmt = (d) => `${d.getDate()} ${months[d.getMonth()]}`

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid var(--border)', borderRadius: 14, padding: '11px 16px',
          background: '#fff', cursor: 'pointer', fontSize: 14, color: 'var(--dark)',
          transition: 'border-color 0.2s', minWidth: 200
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dark)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}><Icon i={CalendarDays} size={15} color="var(--secondary)" /></span>
        <span style={{ flex: 1, textAlign: 'left' }}>{selected ? fmt(selected) : 'Выбрать дату'}</span>
        <span style={{ color: 'var(--secondary)', fontSize: 11 }}>▾</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 6,
            background: '#fff', border: '1px solid var(--border)', borderRadius: 18,
            padding: '16px', zIndex: 100, boxShadow: '0 16px 40px rgba(18,26,18,0.1)',
            minWidth: 320
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {days.slice(0, 14).map((d, i) => {
                const isToday = i === 0
                const isSel = selected && d.toDateString() === selected.toDateString()
                const isWeekend = d.getDay() === 0 || d.getDay() === 6
                return (
                  <button
                    key={i}
                    onClick={() => { setSelected(d); setOpen(false) }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '8px 4px', borderRadius: 10, border: 'none',
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: isSel ? 'var(--dark)' : isToday ? 'rgba(249,115,22,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(18,26,18,0.05)' }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = isToday ? 'rgba(249,115,22,0.08)' : 'transparent' }}
                  >
                    <span style={{ fontSize: 9, color: isSel ? 'rgba(255,255,255,0.5)' : 'var(--secondary)', marginBottom: 2 }}>
                      {weekdays[d.getDay()]}
                    </span>
                    <span style={{
                      fontSize: 13, fontWeight: 500,
                      color: isSel ? '#fff' : isWeekend ? 'var(--accent)' : 'var(--dark)'
                    }}>
                      {d.getDate()}
                    </span>
                  </button>
                )
              })}
            </div>
            {selected && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--secondary)' }}>
                Выбрано: {fmt(selected)} · {weekdays[selected.getDay()]}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// SELECT ──────────────────────────────────────────────────────────────────────
function SelectDemo() {
  const [service, setService] = useState(null)
  const [openS, setOpenS] = useState(false)

  const services = [
    { id: 1, label: '«Перерождение» Premium Head SPA', sub: '90 мин · 5 900 ₽' },
    { id: 2, label: '«Гималайский дзен» Relax Head SPA', sub: '75 мин · 4 200 ₽' },
    { id: 3, label: '«Гималайский экспресс» Express Head SPA', sub: '45 мин · 2 800 ₽' },
    { id: 4, label: 'SPA для мужчин «Самурай»', sub: '60 мин · 4 500 ₽' },
    { id: 5, label: 'Массаж спины', sub: '60 мин · 3 500 ₽' },
    { id: 6, label: 'Массаж всего тела', sub: '90 мин · 5 200 ₽' },
  ]

  const SelectField = ({ value, options, onChange, placeholder, open, setOpen }) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: `1px solid ${open ? 'var(--dark)' : 'var(--border)'}`, borderRadius: 14,
          padding: '13px 16px', background: '#fff', cursor: 'pointer', fontSize: 14,
          color: value ? 'var(--dark)' : 'var(--secondary)', transition: 'border-color 0.2s', textAlign: 'left'
        }}
      >
        <span style={{ flex: 1 }}>{value ? value.label : placeholder}</span>
        <span style={{ color: 'var(--secondary)', fontSize: 11, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
            background: '#fff', border: '1px solid var(--border)', borderRadius: 16,
            zIndex: 100, boxShadow: '0 16px 40px rgba(18,26,18,0.1)',
            overflow: 'hidden', maxHeight: 280, overflowY: 'auto'
          }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => { onChange(opt); setOpen(false) }}
                style={{
                  width: '100%', padding: '12px 16px', border: 'none',
                  background: value?.id === opt.id ? 'rgba(18,26,18,0.04)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,26,18,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.background = value?.id === opt.id ? 'rgba(18,26,18,0.04)' : 'transparent' }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>{opt.label}</div>
                {opt.sub && <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>{opt.sub}</div>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SelectField
        value={service}
        options={services}
        onChange={setService}
        placeholder="Выберите услугу"
        open={openS}
        setOpen={setOpenS}
      />
      {service && (
        <div style={{ fontSize: 12, color: 'var(--secondary)', padding: '8px 12px', background: 'rgba(18,26,18,0.03)', borderRadius: 10 }}>
          Выбрано: {service.label} · {service.sub}
        </div>
      )}
    </div>
  )
}

// TOAST ───────────────────────────────────────────────────────────────────────
function ToastDemo() {
  const [toasts, setToasts] = useState([])

  const show = (type) => {
    const id = Date.now()
    const configs = {
      success: { icon: Check, title: 'Запись подтверждена', msg: 'Ждём вас в 17:00 · Head Spa Beauty', bg: '#fff', accent: '#16A34A' },
      error: { icon: AlertCircle, title: 'Ошибка оплаты', msg: 'Проверьте данные карты и попробуйте снова', bg: '#fff', accent: '#DC2626' },
      info: { icon: Zap, title: 'Новое окошко!', msg: '«Перерождение» — 17:00 · −40% горящая скидка', bg: 'var(--dark)', accent: 'var(--accent)', light: true },
    }
    const t = { id, ...configs[type] }
    setToasts(prev => [...prev, t])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000)
  }

  return (
    <div>
      <Row gap={10} wrap>
        <button onClick={() => show('success')} style={{ padding: '9px 18px', borderRadius: 12, border: '1px solid rgba(22,163,74,0.3)', background: 'rgba(22,163,74,0.06)', color: '#16A34A', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon i={Check} size={13} color="#16A34A" stroke={2} /> Success toast
        </button>
        <button onClick={() => show('error')} style={{ padding: '9px 18px', borderRadius: 12, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#DC2626', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon i={AlertCircle} size={13} color="#DC2626" stroke={2} /> Error toast
        </button>
        <button onClick={() => show('info')} style={{ padding: '9px 18px', borderRadius: 12, border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.06)', color: 'var(--accent)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon i={Zap} size={13} color="var(--accent)" stroke={2} /> Lovi toast
        </button>
      </Row>

      {/* Toast container */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.bg, borderRadius: 16, padding: '14px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            boxShadow: '0 12px 40px rgba(18,26,18,0.15)',
            border: t.light ? 'none' : '1px solid var(--border)',
            minWidth: 280, maxWidth: 340,
            animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'all'
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: `${t.accent}18`, color: t.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon i={t.icon} size={14} color={t.accent} stroke={2} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.light ? '#fff' : 'var(--dark)', marginBottom: 2 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: t.light ? 'rgba(255,255,255,0.5)' : 'var(--secondary)', lineHeight: 1.4 }}>{t.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// SKELETON ────────────────────────────────────────────────────────────────────
function SkeletonDemo() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!document.getElementById('lovi-shimmer')) {
      const s = document.createElement('style')
      s.id = 'lovi-shimmer'
      s.textContent = `
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .sk { background: linear-gradient(90deg,#f0ede8 25%,#e8e5e0 50%,#f0ede8 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
      `
      document.head.appendChild(s)
    }
  }, [])

  const Sk = ({ w, h, r = 8, style = {} }) => (
    <div className="sk" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
  )

  const SlotSkeleton = () => (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '20px 22px', width: 220, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Sk w={80} h={10} />
        <Sk w={44} h={20} r={8} />
      </div>
      <Sk w="90%" h={14} style={{ marginBottom: 8 }} />
      <Sk w="60%" h={10} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Sk w={50} h={10} style={{ marginBottom: 6 }} />
          <Sk w={70} h={20} />
        </div>
        <Sk w={44} h={32} r={10} />
      </div>
    </div>
  )

  const FeaturedSkeleton = () => (
    <div style={{ background: 'var(--dark)', borderRadius: 24, padding: '28px 28px', width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Sk w={120} h={10} style={{ background: 'rgba(255,255,255,0.08)' }} />
        <Sk w={90} h={10} style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
      <Sk w={100} h={56} r={4} style={{ background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
      <Sk w="70%" h={16} style={{ background: 'rgba(255,255,255,0.08)', marginBottom: 8 }} />
      <Sk w="50%" h={10} style={{ background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Sk w={80} h={10} style={{ background: 'rgba(255,255,255,0.06)' }} />
        <Sk w={44} h={18} r={8} style={{ background: 'rgba(249,115,22,0.15)' }} />
        <Sk w={140} h={44} r={14} style={{ background: 'rgba(249,115,22,0.2)', marginLeft: 'auto' }} />
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <button onClick={() => setLoading(!loading)} style={{ padding: '7px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--dark)' }}>
          {loading ? 'Показать контент' : 'Показать skeleton'}
        </button>
        <span style={{ fontSize: 11, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {loading
            ? <><Icon i={Timer} size={12} color="var(--secondary)" /> Загрузка...</>
            : <><Icon i={Check} size={12} color="#16A34A" stroke={2} /> Данные загружены</>
          }
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FeaturedSkeleton />
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {[1, 2, 3].map(i => <SlotSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--dark)', borderRadius: 24, padding: '28px', color: '#fff' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Лучшее предложение</div>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 52, fontWeight: 500, marginBottom: 8 }}>17:00</div>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, marginBottom: 20 }}>«Перерождение» Premium Head SPA</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>5 900 ₽ в салоне</span>
              <span style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 8, fontSize: 12 }}>−15%</span>
              <BtnPrimary style={{ marginLeft: 'auto', padding: '12px 22px', fontSize: 14 }}>Забрать за 5 015 ₽</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// SHEET (mobile drawer) ───────────────────────────────────────────────────────
function SheetDemo() {
  const [open, setOpen] = useState(false)
  const [mood, setMood] = useState('all')
  const [maxPrice, setMaxPrice] = useState(8000)
  const [duration, setDuration] = useState('any')

  const moods = [
    { id: 'all', label: 'Всё' },
    { id: 'relax', label: 'Глубокий отдых' },
    { id: 'reset', label: 'Перезагрузка' },
    { id: 'couple', label: 'Вдвоём' },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid var(--border)', borderRadius: 14, padding: '11px 18px',
          background: '#fff', cursor: 'pointer', fontSize: 13, color: 'var(--dark)',
          transition: 'border-color 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dark)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Icon i={SlidersHorizontal} size={14} color="var(--dark)" /> Фильтры
          <span style={{ background: 'var(--dark)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 600 }}>3</span>
        </button>
        <span style={{ fontSize: 12, color: 'var(--secondary)' }}>Открой на мобильном или нажми кнопку →</span>
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(18,26,18,0.4)', zIndex: 999, backdropFilter: 'blur(2px)', animation: 'fadeIn 0.2s ease' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--bg)', borderRadius: '24px 24px 0 0',
            padding: '20px 24px 48px', zIndex: 1000,
            boxShadow: '0 -24px 60px rgba(18,26,18,0.12)',
            animation: 'slideInBottom 0.3s cubic-bezier(0.4,0,0.2,1)',
            maxHeight: '85vh', overflowY: 'auto'
          }}>
            <div style={{ width: 40, height: 4, background: 'rgba(18,26,18,0.12)', borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 500 }}>Фильтры</div>
              <button onClick={() => setOpen(false)} style={{ background: 'rgba(18,26,18,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon i={X} size={14} color="var(--secondary)" stroke={2} />
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 12 }}>Настроение</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {moods.map(m => (
                  <button key={m.id} onClick={() => setMood(m.id)} style={{
                    padding: '8px 16px', borderRadius: 20, fontSize: 13, border: `1px solid ${mood === m.id ? 'var(--dark)' : 'var(--border)'}`,
                    background: mood === m.id ? 'var(--dark)' : 'transparent',
                    color: mood === m.id ? '#fff' : 'var(--dark)', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)' }}>Максимальная цена</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>до {maxPrice.toLocaleString('ru')} ₽</div>
              </div>
              <input type="range" min={1000} max={15000} step={500} value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--dark)' }} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 12 }}>Длительность</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'any', label: 'Любая' }, { id: 'short', label: '< 60 мин' }, { id: 'long', label: '> 60 мин' }].map(d => (
                  <button key={d.id} onClick={() => setDuration(d.id)} style={{
                    padding: '8px 14px', borderRadius: 12, fontSize: 12, border: `1px solid ${duration === d.id ? 'var(--dark)' : 'var(--border)'}`,
                    background: duration === d.id ? 'var(--dark)' : 'transparent',
                    color: duration === d.id ? '#fff' : 'var(--dark)', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <BtnPrimary style={{ width: '100%' }} onClick={() => setOpen(false)}>
              Показать результаты
            </BtnPrimary>
          </div>
        </>
      )}
    </>
  )
}

// TABS ────────────────────────────────────────────────────────────────────────
function TabsDemo() {
  const [active, setActive] = useState('head')

  const tabs = [
    { id: 'head', label: 'Head SPA', count: 3 },
    { id: 'body', label: 'Массаж', count: 4 },
    { id: 'couple', label: 'Для двоих', count: 2 },
    { id: 'express', label: 'Экспресс', count: 1 },
  ]

  const content = {
    head: [
      { name: '«Перерождение»', time: '17:00', price: '5 015 ₽', disc: '-15%' },
      { name: '«Гималайский дзен»', time: '18:30', price: '3 570 ₽', disc: '-15%' },
      { name: '«Гималайский экспресс»', time: '20:00', price: '1 680 ₽', disc: '-40%' },
    ],
    body: [
      { name: 'Массаж всего тела', time: '16:00', price: '3 120 ₽', disc: '-40%' },
      { name: 'Массаж спины', time: '17:30', price: '2 975 ₽', disc: '-15%' },
      { name: 'SPA «Самурай»', time: '19:00', price: '3 825 ₽', disc: '-15%' },
      { name: 'Шейно-воротниковая', time: '20:30', price: '1 500 ₽', disc: '-40%' },
    ],
    couple: [
      { name: '«Перерождение» для двоих', time: '16:00', price: '9 860 ₽', disc: '-15%' },
      { name: '«Экспресс» для двоих', time: '19:00', price: '6 120 ₽', disc: '-40%' },
    ],
    express: [
      { name: '«Гималайский экспресс»', time: '15:30', price: '1 680 ₽', disc: '-40%' },
    ],
  }

  return (
    <div style={{ maxWidth: 520 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 0
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: '10px 16px', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: 13, fontWeight: active === t.id ? 600 : 400,
              color: active === t.id ? 'var(--dark)' : 'var(--secondary)',
              borderBottom: `2px solid ${active === t.id ? 'var(--dark)' : 'transparent'}`,
              marginBottom: -1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            {t.label}
            <span style={{
              fontSize: 10, background: active === t.id ? 'var(--dark)' : 'rgba(18,26,18,0.08)',
              color: active === t.id ? '#fff' : 'var(--secondary)',
              borderRadius: 10, padding: '1px 6px', fontWeight: 600, transition: 'all 0.2s'
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 1 }}>
        {(content[active] || []).map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0', borderBottom: '1px solid var(--border)'
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>{item.name}</div>
              <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>{item.time}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(249,115,22,0.09)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{item.disc}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// AVATAR ──────────────────────────────────────────────────────────────────────
function AvatarDemo() {
  const masters = [
    { name: 'Алина М.', role: 'Head SPA', rating: 4.9, sessions: 284, initials: 'АМ', color: '#E8D5C8' },
    { name: 'Карина В.', role: 'Массаж', rating: 4.8, sessions: 156, initials: 'КВ', color: '#D4E0D4' },
    { name: 'Дарья Н.', role: 'SPA для двоих', rating: 5.0, sessions: 312, initials: 'ДН', color: '#D8D0E8' },
    { name: 'Михаил Р.', role: '«Самурай»', rating: 4.9, sessions: 98, initials: 'МР', color: '#D4D8E0' },
  ]

  const Avatar = ({ m, size = 44 }) => (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: m.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 600, color: 'rgba(18,26,18,0.6)',
      flexShrink: 0, border: '2px solid #fff'
    }}>
      {m.initials}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sizes */}
      <div>
        <Label>Размеры</Label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {[24, 36, 44, 56, 72].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Avatar m={masters[0]} size={s} />
              <span style={{ fontSize: 10, color: 'var(--secondary)' }}>{s}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar stack */}
      <div>
        <Label>Стопка аватаров</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {masters.map((m, i) => (
            <div key={m.name} style={{ marginLeft: i > 0 ? -10 : 0, zIndex: masters.length - i }}>
              <Avatar m={m} size={36} />
            </div>
          ))}
          <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--secondary)' }}>
            4 мастера доступны сегодня
          </span>
        </div>
      </div>

      {/* Master cards */}
      <div>
        <Label>Карточки мастеров</Label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {masters.map(m => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              border: '1px solid var(--border)', borderRadius: 16, padding: '12px 16px',
              background: '#fff', cursor: 'pointer', transition: 'all 0.2s', minWidth: 200
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(18,26,18,0.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(18,26,18,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <Avatar m={m} size={44} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>{m.role}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--dark)', fontWeight: 500 }}>★ {m.rating}</span>
                  <span style={{ fontSize: 11, color: 'var(--secondary)' }}>{m.sessions} сеансов</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UI() {
  const [pressed, setPressed] = useState(false)
  const isMobile = useIsMobile()

  // Inject keyframes
  useEffect(() => {
    if (document.getElementById('lovi-ui-keyframes')) return
    const style = document.createElement('style')
    style.id = 'lovi-ui-keyframes'
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.5)} }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
      @keyframes slideInBottom { from{transform:translateY(100%)} to{transform:translateY(0)} }
    `
    document.head.appendChild(style)
  }, [])

  const navItems = [
    { id: 'colors', label: 'Цвета' },
    { id: 'typography', label: 'Типографика' },
    { id: 'icons', label: 'Иконки' },
    { id: 'buttons', label: 'Кнопки' },
    { id: 'badges', label: 'Бейджи' },
    { id: 'inputs', label: 'Инпуты' },
    { id: 'cards', label: 'Карточки' },
    { id: 'nav-moods', label: 'Nav' },
    { id: 'live-status', label: 'Live' },
    { id: 'slot-card', label: 'Слот' },
    { id: 'timer', label: 'Таймер' },
    { id: 'toggle', label: 'Toggle' },
    { id: 'pills', label: 'Pills' },
    { id: 'counter', label: 'Счётчик' },
    { id: 'drawer', label: 'Drawer' },
    { id: 'hero', label: 'Hero' },
    { id: 'features', label: 'Features' },
    { id: 'steps', label: 'Шаги' },
    { id: 'testimonials', label: 'Отзывы' },
    { id: 'logo-row', label: 'Логотипы' },
    { id: 'grids', label: 'Сетки' },
    { id: 'cta', label: 'CTA' },
    { id: 'form', label: 'Форма' },
    { id: 'planned', label: 'shadcn' },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Sidebar nav (desktop) */}
      {!isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: 180,
          borderRight: '1px solid var(--border)', padding: '32px 0',
          background: 'var(--bg)', overflowY: 'auto', zIndex: 10
        }}>
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Lovi UI Kit
            </div>
          </div>
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: 'block', padding: '7px 20px', fontSize: 12,
                color: 'var(--secondary)', textDecoration: 'none',
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => { e.target.style.color = 'var(--dark)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--secondary)' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: isMobile ? '40px 20px 120px' : '60px 40px 120px',
        marginLeft: isMobile ? 'auto' : 200
      }}>
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 8 }}>
            Lovi Design System
          </div>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 42, fontWeight: 500, lineHeight: 1.1, marginBottom: 12 }}>
            UI Kit
          </div>
          <div style={{ fontSize: 14, color: 'var(--secondary)', maxWidth: 480, lineHeight: 1.7 }}>
            Все компоненты интерфейса в одном месте. Используй как справочник при разработке новых экранов.
          </div>
        </div>

        {/* ── СУЩЕСТВУЮЩИЕ СЕКЦИИ ─────────────────────────────────────────── */}

        <Section id="colors" title="Цвета / Colors">
          <Row gap={12} wrap>
            {[
              { name: '--bg', hex: '#FDFCF9', label: 'Background' },
              { name: '--dark', hex: '#121A12', label: 'Dark' },
              { name: '--accent', hex: '#F97316', label: 'Accent / Lovi Orange' },
              { name: '--secondary', hex: '#8F8475', label: 'Secondary / Muted' },
              { name: '--border', hex: 'rgba(18,26,18,0.06)', label: 'Border' },
            ].map(c => (
              <div key={c.name} style={{ width: 160 }}>
                <div style={{ height: 80, borderRadius: 16, background: c.hex, border: '1px solid var(--border)', marginBottom: 8 }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dark)', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--secondary)', fontFamily: 'monospace' }}>{c.hex}</div>
              </div>
            ))}
          </Row>
        </Section>

        <Section id="typography" title="Типографика / Typography">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 52, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16 }}>
            The Art of <em style={{ color: 'var(--accent)' }}>State.</em>
          </div>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 32, fontWeight: 500, marginBottom: 12 }}>
            Heading 2 — Гималайский дзен
          </div>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 500, marginBottom: 12 }}>
            Heading 3 — SPA для двоих
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--dark)', marginBottom: 8, maxWidth: 560 }}>
            Body — Система управления ликвидностью вашего времени. Интеллектуальный поиск окон в лучшие велнес-пространства города.
          </div>
          <div style={{ fontSize: 12, color: 'var(--secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            CAPTION / EYEBROW — БЛИЖАЙШИЕ СЛОТЫ
          </div>
        </Section>

        <Section id="icons" title="Иконки / Icons — lucide-react">
          {/* Usage note */}
          <div style={{ background: 'rgba(18,26,18,0.03)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 12, fontFamily: 'monospace', color: 'var(--secondary)' }}>
            {'import { Zap, MapPin, Clock } from \'lucide-react\''}<br />
            {'<Icon i={Zap} size={16} color="var(--accent)" stroke={1.5} />'}
          </div>

          {/* Icon groups */}
          {[
            {
              label: 'Навигация и действия',
              items: [
                { i: Search, name: 'Search' }, { i: Filter, name: 'Filter' }, { i: SlidersHorizontal, name: 'SlidersHorizontal' },
                { i: Menu, name: 'Menu' }, { i: X, name: 'X' }, { i: ChevronDown, name: 'ChevronDown' },
                { i: ChevronRight, name: 'ChevronRight' }, { i: ArrowRight, name: 'ArrowRight' }, { i: Plus, name: 'Plus' },
                { i: Minus, name: 'Minus' }, { i: Check, name: 'Check' }, { i: Copy, name: 'Copy' },
                { i: Share2, name: 'Share2' }, { i: Eye, name: 'Eye' }, { i: Settings, name: 'Settings' },
              ]
            },
            {
              label: 'Время и статус',
              items: [
                { i: Clock, name: 'Clock' }, { i: Timer, name: 'Timer' }, { i: Calendar, name: 'Calendar' },
                { i: CalendarDays, name: 'CalendarDays' }, { i: Zap, name: 'Zap' }, { i: Flame, name: 'Flame' },
                { i: AlertCircle, name: 'AlertCircle' }, { i: Info, name: 'Info' }, { i: Star, name: 'Star' },
                { i: Heart, name: 'Heart' }, { i: Sparkles, name: 'Sparkles' }, { i: Award, name: 'Award' },
              ]
            },
            {
              label: 'Геолокация и контакты',
              items: [
                { i: MapPin, name: 'MapPin' }, { i: Navigation, name: 'Navigation' },
                { i: Phone, name: 'Phone' }, { i: Mail, name: 'Mail' }, { i: MessageCircle, name: 'MessageCircle' },
                { i: User, name: 'User' }, { i: Users, name: 'Users' },
              ]
            },
            {
              label: 'Коммерция и ценности',
              items: [
                { i: CreditCard, name: 'CreditCard' }, { i: Wallet, name: 'Wallet' }, { i: Tag, name: 'Tag' },
                { i: Percent, name: 'Percent' }, { i: ShoppingBag, name: 'ShoppingBag' },
                { i: Gem, name: 'Gem' }, { i: Diamond, name: 'Diamond' }, { i: Leaf, name: 'Leaf' },
              ]
            },
          ].map(group => (
            <div key={group.label} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: 'var(--secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>{group.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {group.items.map(({ i: Ic, name }) => (
                  <div key={name} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 12px', border: '1px solid var(--border)', borderRadius: 14,
                    background: '#fff', cursor: 'default', minWidth: 72, transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dark)'; e.currentTarget.style.background = 'rgba(18,26,18,0.02)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff' }}
                  >
                    <Icon i={Ic} size={20} color="var(--dark)" stroke={1.5} />
                    <span style={{ fontSize: 9, color: 'var(--secondary)', fontFamily: 'monospace', letterSpacing: '0.02em', textAlign: 'center', lineHeight: 1.3 }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Stroke weights demo */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Толщина обводки / stroke</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {[
                { stroke: 1, label: 'thin · 1' },
                { stroke: 1.5, label: 'regular · 1.5' },
                { stroke: 2, label: 'medium · 2' },
                { stroke: 2.5, label: 'bold · 2.5' },
              ].map(({ stroke, label }) => (
                <div key={stroke} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Icon i={Zap} size={24} color="var(--dark)" stroke={stroke} />
                  <span style={{ fontSize: 10, color: 'var(--secondary)', fontFamily: 'monospace' }}>{label}</span>
                </div>
              ))}
              <div style={{ marginLeft: 16, display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Icon i={Zap} size={20} color="var(--accent)" stroke={1.5} />
                  <span style={{ fontSize: 10, color: 'var(--secondary)', fontFamily: 'monospace' }}>accent</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Icon i={Zap} size={20} color="var(--secondary)" stroke={1.5} />
                  <span style={{ fontSize: 10, color: 'var(--secondary)', fontFamily: 'monospace' }}>muted</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'var(--dark)', padding: '10px 10px 8px', borderRadius: 12 }}>
                  <Icon i={Zap} size={20} color="#fff" stroke={1.5} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>on dark</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="buttons" title="Кнопки / Buttons">
          <Row gap={12} wrap>
            <div>
              <Label>Primary</Label>
              <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 18, fontWeight: 600, cursor: 'pointer', fontSize: 14, boxShadow: '0 8px 20px rgba(249,115,22,0.3)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 28px rgba(249,115,22,0.4)' }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 20px rgba(249,115,22,0.3)' }}>
                Забрать за 3 300 ₽
              </button>
            </div>
            <div>
              <Label>Secondary</Label>
              <button style={{ background: 'var(--dark)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 18, fontWeight: 600, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                Найти окна
              </button>
            </div>
            <div>
              <Label>Ghost</Label>
              <button style={{ background: 'transparent', color: 'var(--dark)', border: '1px solid var(--border)', padding: '14px 28px', borderRadius: 18, fontWeight: 500, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--dark)' }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)' }}>
                Выбрать тариф
              </button>
            </div>
            <div>
              <Label>Small CTA</Label>
              <button style={{ background: 'var(--dark)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 12, fontWeight: 500, cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                Забрать →
              </button>
            </div>
            <div>
              <Label>Link</Label>
              <a href="#" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
                onMouseEnter={e => { e.target.style.opacity = '0.7' }}
                onMouseLeave={e => { e.target.style.opacity = '1' }}>
                Подключить →
              </a>
            </div>
          </Row>
          {/* Mobile sticky CTA */}
          <div style={{ marginTop: 24 }}>
            <Label>Mobile Sticky CTA</Label>
            <div style={{ background: 'rgba(253,252,249,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)', padding: '12px 16px 20px', borderRadius: 16, maxWidth: 390 }}>
              <button style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', padding: '16px', borderRadius: 18, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(249,115,22,0.3)', transition: 'all 0.2s' }}>
                Забрать за 3 300 ₽
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                {['СБП', 'Apple Pay', 'T-Pay'].map(p => (
                  <span key={p} style={{ fontSize: 10, color: 'var(--secondary)', background: 'rgba(18,26,18,0.06)', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="badges" title="Бейджи / Badges">
          <Row gap={10} wrap>
            <div style={{ background: 'rgba(249,115,22,0.09)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>⚡ -25%</div>
            <div style={{ background: '#FFF7ED', color: 'var(--accent)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Топ по отзывам</div>
            <div style={{ background: 'var(--dark)', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Рекомендуем</div>
            <div style={{ background: 'rgba(249,115,22,0.18)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>-40%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              <span style={{ position: 'relative', display: 'inline-block', width: 6, height: 6 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--accent)' }} />
              </span>
              В эфире: 342 окна
            </div>
          </Row>
        </Section>

        <Section id="inputs" title="Поля ввода / Inputs">
          <Row gap={16} wrap>
            <div>
              <Label>Search Bar (shadcn)</Label>
              <div style={{ background: '#fff', padding: 6, borderRadius: 28, display: 'flex', alignItems: 'center', gap: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid var(--border)', maxWidth: 500 }}>
                <Input placeholder="Район или метро" className="border-0 shadow-none rounded-none focus-visible:ring-0 text-sm h-12 px-5" style={{ borderRight: '1px solid var(--border)', flex: 1, background: 'transparent' }} />
                <Input placeholder="Услуга или тип" className="border-0 shadow-none rounded-none focus-visible:ring-0 text-sm h-12 px-5" style={{ flex: 1, background: 'transparent' }} />
                <Button className="h-12 px-6 rounded-2xl font-semibold text-sm" style={{ background: 'var(--dark)', color: '#fff', border: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Найти окна
                </Button>
              </div>
            </div>
          </Row>
          <Row gap={8} wrap>
            <Label>Chips / Tags</Label>
            {['Рядом со мной', 'Для двоих', 'Тайский', 'С душем', 'До 3 000 ₽'].map(c => (
              <button key={c} className="chip">{c}</button>
            ))}
          </Row>
        </Section>

        <Section id="cards" title="Карточки / Cards">
          <Row gap={16} wrap>
            {/* Sub card */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 32, padding: '24px 28px', width: 280, position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.2,1,0.2,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(18,26,18,0.08)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(18,26,18,0.35)', marginBottom: 10 }}>Available at 19:00</div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 21, marginBottom: 4 }}>SPA для двоих</div>
              <div style={{ fontSize: 11, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>LuxeSpa · Патриаршие</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 22, fontWeight: 600 }}>9 000 ₽</div>
                <div style={{ background: 'rgba(249,115,22,0.09)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>⚡ -25%</div>
              </div>
            </div>
            {/* Dark card */}
            <div style={{ background: 'var(--dark)', color: '#fff', borderRadius: 32, padding: '24px 28px', width: 240, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.2,1,0.2,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(18,26,18,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Для салонов</div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, marginBottom: 8 }}>Заполните пустые часы</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>Первые 3 месяца без комиссии</div>
              <a href="#" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Подключить →</a>
            </div>
            {/* Pass mini */}
            <div style={{ background: '#F1F0EC', borderRadius: 32, padding: '24px 28px', width: 240, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.2,1,0.2,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(18,26,18,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 10 }}>Единый абонемент</div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, marginBottom: 6 }}>The Unlimited Access</div>
              <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.5, marginBottom: 14 }}>50+ салонов · Любая услуга</div>
              <div style={{ fontSize: 22, fontWeight: 600 }}>15 000 ₽</div>
            </div>
          </Row>
        </Section>

        <Section id="nav-moods" title="Навигация / Nav Moods">
          <Row gap={8} wrap>
            {['Всё', 'Глубокий отдых', 'Перезагрузка', 'Вдвоём'].map((m, i) => (
              <button key={m} style={{ padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.25s', border: '1px solid var(--border)', background: i === 0 ? 'var(--dark)' : 'transparent', color: i === 0 ? '#fff' : 'var(--dark)' }}>
                {m}
              </button>
            ))}
          </Row>
        </Section>

        <Section id="live-status" title="Live Status / Статус в реальном времени">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--dark)', color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, alignSelf: 'flex-start' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.6s ease-in-out infinite', flexShrink: 0 }} />
              Прямо сейчас
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {[{ value: 342, label: 'горящих окна' }, { value: 52, label: 'салонов' }, { value: 7, label: 'районов' }].map(({ value, label }) => (
                <div key={label} style={{ background: 'var(--bg)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--dark)', lineHeight: 1 }}>{value}</span>
                  <span style={{ fontSize: 12, color: 'var(--secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="slot-card" title="Карточка горящего слота / Slot Card">
          <div style={{ position: 'relative', width: 360, height: 210 }}>
            <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', height: '100%', background: '#fff', border: '1px solid var(--border)', borderRadius: 20, zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 16px)', height: '100%', background: '#fff', border: '1px solid var(--border)', borderRadius: 20, zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '22px 24px', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--secondary)' }}>Патриаршие пруды</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', background: 'rgba(249,115,22,0.08)', padding: '3px 10px', borderRadius: 8 }}>38 мин</span>
              </div>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: 'var(--dark)', lineHeight: 1.3, marginBottom: 8 }}>«Массаж лица» Сияние</div>
              <div style={{ fontSize: 12, color: 'var(--secondary)', fontStyle: 'italic', marginBottom: 18 }}>Мастер освободился на 17:00</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>4 500 ₽ в салоне</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--dark)', lineHeight: 1.2 }}>2 025 ₽</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--accent)', padding: '5px 14px', borderRadius: 10 }}>-55%</div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── НОВЫЕ СЕКЦИИ ──────────────────────────────────────────────────── */}

        <Section id="timer" title="Таймер / Timer">
          <TimerDemo />
        </Section>

        <Section id="toggle" title="Toggle — переключатель">
          <ToggleDemo />
        </Section>

        <Section id="pills" title="Pill / Tag — статусные бейджи">
          <PillDemo />
        </Section>

        <Section id="counter" title="Калькулятор / Counter">
          <CounterDemo />
        </Section>

        <Section id="drawer" title="Drawer — боковой и нижний">
          <DrawerDemo />
        </Section>

        <Section id="hero" title="Hero-блоки">
          <HeroDemo />
        </Section>

        <Section id="features" title="Feature-блоки">
          <FeatureDemo />
        </Section>

        <Section id="steps" title="Шаги / Нумерация">
          <StepsDemo />
        </Section>

        <Section id="testimonials" title="Отзывы / Testimonials">
          <TestimonialsDemo />
        </Section>

        <Section id="logo-row" title="Логотип-строка / Partners">
          <LogoRowDemo />
        </Section>

        <Section id="grids" title="Сетки / Grids">
          <GridsDemo />
        </Section>

        <Section id="cta" title="CTA-секции">
          <CTADemo />
        </Section>

        <Section id="form" title="Форма заявки">
          <FormDemo />
        </Section>

        {/* Planned → Real shadcn implementations */}
        <Section id="planned" title="Компоненты shadcn / shadcn Components">

          {/* DIALOG */}
          <div style={{ marginBottom: 48 }}>
            <Label>Dialog — модальное окно оплаты</Label>
            <DialogDemo />
          </div>

          {/* DATE PICKER */}
          <div style={{ marginBottom: 48 }}>
            <Label>DatePicker — выбор даты бронирования</Label>
            <DatePickerDemo />
          </div>

          {/* SELECT */}
          <div style={{ marginBottom: 48 }}>
            <Label>Select — выбор услуги / мастера</Label>
            <SelectDemo />
          </div>

          {/* TOAST */}
          <div style={{ marginBottom: 48 }}>
            <Label>Toast — подтверждение бронирования</Label>
            <ToastDemo />
          </div>

          {/* SKELETON */}
          <div style={{ marginBottom: 48 }}>
            <Label>Skeleton — загрузка слотов</Label>
            <SkeletonDemo />
          </div>

          {/* SHEET */}
          <div style={{ marginBottom: 48 }}>
            <Label>Sheet — мобильный drawer фильтров</Label>
            <SheetDemo />
          </div>

          {/* TABS */}
          <div style={{ marginBottom: 48 }}>
            <Label>Tabs — переключение категорий</Label>
            <TabsDemo />
          </div>

          {/* AVATAR */}
          <div style={{ marginBottom: 0 }}>
            <Label>Avatar — фото мастера в карточке</Label>
            <AvatarDemo />
          </div>

        </Section>

      </div>
    </div>
  )
}