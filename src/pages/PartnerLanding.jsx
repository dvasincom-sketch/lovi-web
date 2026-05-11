import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import PartnerForm from '../components/PartnerForm'

// ── Калькулятор ────────────────────────────────────────────────────────────

function Counter({ value, min, max, step = 1, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
      <button onClick={() => onChange(Math.max(min, value - step))} style={{
        width:32, height:32, borderRadius:'50%',
        border:'1px solid rgba(18,26,18,0.15)', background:'transparent',
        fontSize:20, lineHeight:1, cursor:'pointer', color:'var(--dark)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>−</button>
      <div style={{ fontSize:24, fontWeight:700, color:'var(--dark)',
        minWidth:64, textAlign:'center', letterSpacing:'-0.02em' }}>
        {value.toLocaleString('ru-RU')}
      </div>
      <button onClick={() => onChange(Math.min(max, value + step))} style={{
        width:32, height:32, borderRadius:'50%',
        border:'1px solid rgba(18,26,18,0.15)', background:'transparent',
        fontSize:20, lineHeight:1, cursor:'pointer', color:'var(--dark)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>+</button>
    </div>
  )
}

function Calculator({ isMobile }) {
  const [slots, setSlots] = useState(2)
  const [check, setCheck] = useState(1500)
  const [days,  setDays]  = useState(30)
  const lost      = slots * check * days
  const potential = Math.round(lost * 0.65)

  const rows = [
    { label:'Пустых окна в день',     value:slots, min:1,   max:20,    step:1,   set:setSlots },
    { label:'Средний чек (₽)',         value:check, min:500, max:10000, step:500, set:setCheck },
    { label:'Рабочих дней в месяц',    value:days,  min:1,   max:31,    step:1,   set:setDays  },
  ]

  return (
    <div style={{ background:'#fff', borderRadius:24,
      padding: isMobile ? '28px 20px' : '36px 40px',
      boxShadow:'0 4px 40px rgba(18,26,18,0.07)' }}>
      {rows.map((r,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', padding:'18px 0',
          borderBottom: i < rows.length-1 ? '1px solid rgba(18,26,18,0.07)' : 'none' }}>
          <div style={{ fontSize:15, color:'var(--dark)' }}>{r.label}</div>
          <Counter value={r.value} min={r.min} max={r.max} step={r.step} onChange={r.set} />
        </div>
      ))}
      <div style={{ marginTop:24, padding:'24px', background:'#FDFCF9', borderRadius:16 }}>
        <div style={{ fontSize:12, color:'var(--secondary)', textTransform:'uppercase',
          letterSpacing:'0.08em', marginBottom:8 }}>Вы теряете в месяц</div>
        <div style={{ fontSize: isMobile ? 44 : 56, fontWeight:700, color:'var(--accent)',
          letterSpacing:'-0.03em', lineHeight:1 }}>
          {lost.toLocaleString('ru-RU')} ₽
        </div>
        <div style={{ fontSize:13, color:'var(--secondary)', marginTop:10, lineHeight:1.6 }}>
          Потенциальная выручка с Lovi при полной загрузке пустых окон —{' '}
          <strong style={{ color:'var(--dark)' }}>{potential.toLocaleString('ru-RU')} ₽</strong>
        </div>
      </div>
      <div style={{ marginTop:14, fontSize:13, color:'var(--secondary)', lineHeight:1.6 }}>
        Даже 2 пустые окна в день — это десятки тысяч рублей, которые уходят к вашим конкурентам.
      </div>
    </div>
  )
}

// ── Данные ─────────────────────────────────────────────────────────────────

const LOGOS   = ['SODA', '4hands', 'WAX&GQ', 'BRITVA', 'BEAUTICK']
const SPOTS   = 12

const HOW = [
  { n:'01', title:'Авторизация YCLIENTS', sub:'1 минута. Безопасный OAuth.\nМы не видим ваши пароли.' },
  { n:'02', title:'Выбор услуг',          sub:'2 минуты. Отметьте галочками,\nкакие услуги участвуют в акции.' },
  { n:'03', title:'Выход в ленту Lovi',   sub:'2 минуты. Ваши окна уже видны\nтысячам пользователей.' },
]

const FEATURES = [
  { title:'Без компромиссов в качестве', text:'Премиальные салоны, которые вы любите' },
  { title:'Особые условия',              text:'Для тех, кто выбирает удобное время' },
  { title:'Гибкость без усилий',         text:'Включайте и выключайте услуги когда нужно' },
  { title:'Полный контроль',             text:'Вы управляете ценами, услугами и расписанием' },
]

const REVIEWS = [
  { text:'За первую неделю получили 14 новых клиентов и заполнили вечерние окна на 80%.', name:'Анна', role:'владелец Studio 12, маникюрный салон, м. Белорусская' },
  { text:'Интеграция заняла реально 5 минут. Никаких сложностей, всё интуитивно понятно.', name:'Игорь', role:'сеть BRITVA, барбершопы' },
  { text:'Клиенты приходят с промокодами, оплачивают на месте. Выручка полностью у нас.', name:'Мария', role:'Wax&Go, сеть студий депиляции' },
]

// ── Main ───────────────────────────────────────────────────────────────────

export default function PartnerLanding() {
  const isMobile = useIsMobile()

  const wrap = { maxWidth:1100, margin:'0 auto', padding: isMobile ? '0 20px' : '0 40px' }
  const eyebrow = { fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--secondary)', marginBottom:14 }

  return (
    <div style={{ background:'var(--bg)', fontFamily:'Inter, sans-serif' }}>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div style={{ position:'relative', minHeight: isMobile ? '100svh' : '95vh',
        display:'flex', alignItems:'center', background:'#080a08', overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1600334089648-b8d9d8b39a42?w=1800&q=85"
          alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', opacity:0.28, pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background:'linear-gradient(120deg,rgba(0,0,0,0.75) 40%,rgba(0,0,0,0.2) 100%)' }} />

        <div style={{ position:'relative', ...wrap,
          display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 420px',
          gap: isMobile ? 40 : 64, alignItems:'center',
          padding: isMobile ? '100px 20px 60px' : '0 40px' }}>

          {/* Левая */}
          <div>
            <div style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.35)', marginBottom:24 }}>
              Для первых {SPOTS} салонов Москвы
            </div>
            <h1 style={{ fontFamily:'Playfair Display, serif',
              fontSize: isMobile ? 44 : 68, fontWeight:600, lineHeight:1.05,
              color:'#fff', margin:'0 0 28px', letterSpacing:'-0.025em' }}>
              Премиальный сервис<br />
              <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.55)' }}>по особым условиям</em>
            </h1>
            <p style={{ fontSize: isMobile ? 15 : 17, color:'rgba(255,255,255,0.5)',
              lineHeight:1.7, margin:'0 0 40px', maxWidth:480 }}>
              Получайте новых клиентов в свободные окна —<br />
              без скидок, без комиссий, без лишних усилий.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 32px', marginBottom:44 }}>
              {[['Оплата на месте','100% выручка у вас'],
                ['Интеграция','за 5 минут'],
                ['Отключение','одной кнопкой'],
                ['Без договоров','и вложений']].map(([t,s],i)=>(
                <div key={i}>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>{t}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:11, letterSpacing:'0.1em', color:'rgba(255,255,255,0.25)',
                textTransform:'uppercase', fontWeight:600 }}>YCLIENTS</span>
              <span style={{ width:1, height:14, background:'rgba(255,255,255,0.12)' }} />
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>Интеграция в 1 клик</span>
            </div>
          </div>

          {/* Форма-карточка */}
          <div style={{ background:'#fff', borderRadius:20,
            padding: isMobile ? '28px 20px' : '32px 28px',
            boxShadow:'0 40px 100px rgba(0,0,0,0.4)' }}>
            <div style={{ display:'flex', justifyContent:'space-between',
              alignItems:'flex-start', marginBottom:6 }}>
              <div style={{ fontFamily:'Playfair Display, serif', fontSize:18,
                color:'var(--dark)', lineHeight:1.3 }}>
                Получите доступ<br />на специальных условиях
              </div>
              <div style={{ background:'rgba(249,115,22,0.1)', color:'var(--accent)',
                fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:20,
                flexShrink:0, marginLeft:12, whiteSpace:'nowrap' }}>
                {SPOTS} мест осталось
              </div>
            </div>
            <p style={{ fontSize:13, color:'var(--secondary)', margin:'0 0 20px' }}>
              Мы свяжемся с вами в течение 15 минут
            </p>
            <PartnerForm city="Москва" dark={false} />
          </div>
        </div>
      </div>

      {/* ── ЛОГОТИПЫ ── */}
      <div style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)',
        padding: isMobile ? '20px 20px' : '24px 40px' }}>
        <div style={{ ...wrap, display:'flex', alignItems:'center',
          gap: isMobile ? 20 : 48, flexWrap:'wrap' }}>
          <div style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase',
            color:'rgba(18,26,18,0.3)', flexShrink:0 }}>Уже с нами</div>
          {LOGOS.map(l=>(
            <div key={l} style={{ fontSize: isMobile ? 15 : 18, fontWeight:800,
              letterSpacing:'0.04em', color:'rgba(18,26,18,0.2)' }}>{l}</div>
          ))}
          <div style={{ fontSize:13, color:'rgba(18,26,18,0.2)' }}>и другие</div>
        </div>
      </div>

      {/* ── КАК ЭТО РАБОТАЕТ ── */}
      <div style={{ padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={eyebrow}>Как это работает</div>
          <h2 style={{ fontFamily:'Playfair Display, serif',
            fontSize: isMobile ? 30 : 44, fontWeight:600, color:'var(--dark)',
            margin:'0 0 64px', lineHeight:1.15, maxWidth:520 }}>
            От подключения до новых клиентов — 5 минут
          </h2>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap: isMobile ? 40 : 56 }}>
            {HOW.map(h=>(
              <div key={h.n}>
                <div style={{ fontFamily:'Playfair Display, serif', fontSize:56, fontWeight:600,
                  color:'rgba(18,26,18,0.06)', lineHeight:1, marginBottom:20 }}>{h.n}</div>
                <div style={{ fontSize:16, fontWeight:600, color:'var(--dark)', marginBottom:10 }}>{h.title}</div>
                <div style={{ fontSize:14, color:'var(--secondary)', lineHeight:1.7,
                  whiteSpace:'pre-line' }}>{h.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── УМНОЕ ПОТРЕБЛЕНИЕ ── */}
      <div style={{ background:'#F1F0EC', padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 6fr',
            gap: isMobile ? 40 : 80, alignItems:'center' }}>
            <div style={{ position:'relative', borderRadius:20, overflow:'hidden',
              aspectRatio:'4/5' }}>
              <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85"
                alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              <div style={{ position:'absolute', inset:0,
                background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              <div style={{ position:'absolute', bottom:28, left:28, right:28 }}>
                <div style={{ fontFamily:'Playfair Display, serif',
                  fontSize: isMobile ? 20 : 24, fontWeight:600, color:'#fff', lineHeight:1.3 }}>
                  Умное потребление<br />премиального сервиса
                </div>
              </div>
            </div>
            <div>
              <div style={eyebrow}>Для клиентов</div>
              <p style={{ fontFamily:'Playfair Display, serif',
                fontSize: isMobile ? 22 : 28, color:'var(--dark)',
                lineHeight:1.5, margin:'0 0 24px', fontWeight:400 }}>
                Вы получаете тот же уровень сервиса и мастеров, которые вам нравятся,
                по особым условиям — если готовы выбрать удобное для салона время.
              </p>
              <p style={{ fontSize:15, color:'var(--secondary)', lineHeight:1.7, margin:0 }}>
                Это не скидка. Это новый подход к красоте в большом городе.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── КАЛЬКУЛЯТОР ── */}
      <div style={{ padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 48 : 80, alignItems:'start' }}>
            <div>
              <div style={eyebrow}>Считаем вместе</div>
              <h2 style={{ fontFamily:'Playfair Display, serif',
                fontSize: isMobile ? 30 : 42, fontWeight:600, color:'var(--dark)',
                margin:'0 0 20px', lineHeight:1.2 }}>
                Сколько вы теряете<br />на пустых окнах?
              </h2>
              <p style={{ fontSize:15, color:'var(--secondary)', lineHeight:1.7, margin:0 }}>
                Настройте параметры под свой салон и увидите реальную сумму упущенной выручки.
              </p>
            </div>
            <Calculator isMobile={isMobile} />
          </div>
        </div>
      </div>

      {/* ── ФИЧИ ── */}
      <div style={{ background:'#121A12', padding: isMobile ? '64px 0' : '88px 0' }}>
        <div style={wrap}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
            gap: isMobile ? 28 : 48 }}>
            {FEATURES.map((f,i)=>(
              <div key={i}>
                <div style={{ fontFamily:'Playfair Display, serif', fontSize: isMobile ? 15 : 17,
                  fontWeight:500, color:'#fff', marginBottom:10, lineHeight:1.35 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', lineHeight:1.6 }}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ОТЗЫВЫ ── */}
      <div style={{ padding: isMobile ? '72px 0' : '104px 0' }}>
        <div style={wrap}>
          <div style={eyebrow}>Что говорят первые партнёры</div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap: isMobile ? 40 : 56, marginTop:48 }}>
            {REVIEWS.map((r,i)=>(
              <div key={i}>
                <div style={{ fontFamily:'Georgia, serif', fontSize:40,
                  color:'rgba(249,115,22,0.18)', lineHeight:1, marginBottom:16 }}>«</div>
                <p style={{ fontSize:15, color:'var(--dark)', lineHeight:1.75,
                  margin:'0 0 24px', fontStyle:'italic' }}>{r.text}</p>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--dark)' }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'var(--secondary)', marginTop:3 }}>{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ФИНАЛЬНАЯ ФОРМА ── */}
      <div style={{ position:'relative', overflow:'hidden',
        padding: isMobile ? '72px 0 88px' : '104px 0 120px' }}>
        <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(8,10,8,0.82)',
          pointerEvents:'none' }} />

        <div style={{ position:'relative', ...wrap }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 48 : 80, alignItems:'start' }}>
            <div>
              <h2 style={{ fontFamily:'Playfair Display, serif',
                fontSize: isMobile ? 34 : 50, fontWeight:600, color:'#fff',
                margin:'0 0 24px', lineHeight:1.1, letterSpacing:'-0.02em' }}>
                Успейте в число<br />первых {SPOTS} салонов
              </h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)',
                lineHeight:1.7, margin:'0 0 36px' }}>
                Получите доступ на специальных условиях и начните принимать новых клиентов уже сегодня.
              </p>
              {[['0% комиссии','первые 3 месяца'],
                ['Интеграция','за 5 минут'],
                [`${SPOTS} мест`,'осталось']].map(([t,s],i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center',
                  gap:10, marginBottom:14 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%',
                    background:'var(--accent)', flexShrink:0 }} />
                  <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>{t}</span>
                  <span style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>{s}</span>
                </div>
              ))}
            </div>

            <div>
              <PartnerForm city="Москва" dark={true} />
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.2)',
                textAlign:'center', marginTop:16 }}>
                🔒 Мы не передаём ваши данные третьим лицам
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}