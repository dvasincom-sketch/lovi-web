import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import SlotDrawer from './SlotDrawer'

function useTimer(sec) {
  const [s, setS] = useState(sec || 0)
  useEffect(()=>{
    if(!sec)return
    const t=setInterval(()=>setS(v=>v>0?v-1:0),1000)
    return()=>clearInterval(t)
  },[sec])
  const m=Math.floor((s%3600)/60),ss=s%60
  return { str: String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0'), urgent: s<=900 }
}

function fmt(price){ return price.toLocaleString('ru-RU') + ' ₽' }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0]
  if (dateStr === today) return 'Сегодня'
  if (dateStr === tomorrow) return 'Завтра'
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'head', label: 'Голова' },
  { id: 'spa', label: 'SPA' },
  { id: 'back', label: 'Спина' },
  { id: 'neck', label: 'Шея' },
  { id: 'body', label: 'Всё тело' },
]

function SlotPill({ slot, isNextDay, onBook }) {
  const {str, urgent} = useTimer(slot.minutes_to_slot * 60)
  const [hov, setHov] = useState(false)
  return (
    <div onClick={()=>onBook&&onBook(slot)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        flexShrink: 0, width: 200,
        background: isNextDay ? '#F1F0EC' : '#fff',
        border: '1px solid var(--border)',
        borderRadius: 24, padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.2,1,0.2,1)',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 16px 40px rgba(18,26,18,0.08)' : 'none',
        borderColor: hov ? 'rgba(249,115,22,0.25)' : 'var(--border)'
      }}>
      {isNextDay && (
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'0.08em',
          textTransform:'uppercase',color:'var(--secondary)',marginBottom:-4}}>
          {formatDate(slot.slot_date)}
        </div>
      )}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:22,fontWeight:600,letterSpacing:'-0.02em',color:'var(--dark)'}}>
          {slot.time}
        </div>
        <div style={{background:'rgba(249,115,22,0.09)',color:'var(--accent)',
          padding:'3px 8px',borderRadius:6,fontSize:11,fontWeight:700}}>
          -{slot.discount_pct}%
        </div>
      </div>
      <div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:14,
          marginBottom:2,lineHeight:1.3,color:'var(--dark)'}}>{slot.service_name}</div>
        <div style={{fontSize:10,color:'var(--secondary)',textTransform:'uppercase',
          letterSpacing:'0.06em'}}>{slot.duration_min} мин</div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <div style={{fontSize:11,color:'rgba(18,26,18,0.3)',
            textDecoration:'line-through',marginBottom:1}}>{fmt(slot.base_price)}</div>
          <div style={{fontSize:18,fontWeight:600,color:'var(--dark)'}}>{fmt(slot.lovi_price)}</div>
        </div>
        <div style={{fontSize:10,color:urgent?'var(--accent)':'var(--secondary)',
          fontWeight:urgent?600:400}}>
          {str}
        </div>
      </div>
    </div>
  )
}

export default function AllSlots() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [drawerSlot, setDrawerSlot] = useState(null)
  const isMobile = useIsMobile()
  const today = new Date().toISOString().split('T')[0]

  useEffect(()=>{
    fetch(`https://insalon.onrender.com/api/lovi/featured?date=${today}`)
      .then(r=>r.json())
      .then(data=>setSlots((data.slots||[]).sort((a,b)=>a.minutes_to_slot-b.minutes_to_slot)))
      .catch(()=>{})
      .finally(()=>setLoading(false))
  },[])

  if (loading || slots.length === 0) return null

  const filtered = activeCategory === 'all'
    ? slots
    : slots.filter(s => s.category === activeCategory)

  // Есть ли слоты не сегодняшнего дня
  const hasNextDay = filtered.some(s => s.slot_date && s.slot_date !== today)

  return (
    <>
    <div style={{padding:isMobile?'32px 0 40px':'48px 0 60px', background:'#F1F0EC'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        marginBottom:16,flexWrap:'wrap',gap:10,padding:isMobile?'0 16px':'0 40px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--secondary)'}}>
            Ближайшие окошки
          </div>
          {hasNextDay && (
            <div style={{fontSize:11,color:'var(--accent)',fontWeight:500}}>
              · включая следующие дни
            </div>
          )}
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {CATEGORIES.map(cat=>(
            <button key={cat.id} className="chip"
              onClick={()=>setActiveCategory(cat.id)}
              style={{
                background: activeCategory===cat.id ? 'var(--dark)' : 'transparent',
                color: activeCategory===cat.id ? '#fff' : 'var(--secondary)',
                borderColor: activeCategory===cat.id ? 'var(--dark)' : 'var(--border)',
                padding:'5px 12px', fontSize:11
              }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{padding:'24px',color:'var(--secondary)',fontSize:13,textAlign:'center'}}>
          В этой категории пока нет свободных окошек
        </div>
      ) : (
        <div style={{display:'flex',gap:12,overflowX:'auto',
          scrollbarWidth:'none',padding:isMobile?'0 16px 12px':'0 40px 12px'}}>
          {filtered.map((slot,i)=>(
            <SlotPill key={i} slot={slot} isNextDay={slot.slot_date && slot.slot_date !== today} onBook={s=>setDrawerSlot(s)}/>
          ))}
        </div>
      )}
    </div>
    {drawerSlot && <SlotDrawer slot={drawerSlot} onClose={()=>setDrawerSlot(null)}/>}
    </>
  )
}
