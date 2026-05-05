import { useState, useEffect } from 'react'

function useTimer(sec) {
  const [s, setS] = useState(sec)
  useEffect(() => {
    if (!sec) return
    const t = setInterval(() => setS(v => v > 0 ? v-1 : 0), 1000)
    return () => clearInterval(t)
  }, [])
  const m = Math.floor((s%3600)/60), ss = s%60
  return String(m).padStart(2,'0') + ':' + String(ss).padStart(2,'0')
}

const slots = [
  { id:1, time:'18:30', name:'Гималайский дзен', sub:'HeadSPA · Арбат', dist:'4 мин на такси', discount:40, old:'5 500 ₽', price:'3 300 ₽', views:4, seconds:522, hot:false, best:true },
  { id:2, time:'19:00', name:'SPA для двоих', sub:'LuxeSpa · Патрики', dist:'12 мин', discount:25, old:'12 000 ₽', price:'9 000 ₽', views:2, seconds:2322, hot:true, best:false },
  { id:3, time:'20:00', name:'Массаж спины', sub:'Relax · Чистые пруды', dist:'20 мин', discount:15, old:'3 500 ₽', price:'2 975 ₽', views:1, seconds:5922, hot:false, best:false },
]

function SlotCard({ slot }) {
  const timer = useTimer(slot.seconds)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'#fff',
        border: hovered ? '1px solid var(--accent)' : slot.hot ? '1px solid var(--accent)' : '1px solid var(--border)',
        borderRadius:24,padding:24,position:'relative',overflow:'hidden',
        transition:'all 0.4s cubic-bezier(0.165,0.84,0.44,1)',
        transform: hovered ? 'translateY(-8px)' : 'none',
        boxShadow: hovered ? '0 30px 60px rgba(28,45,28,0.08)' : 'none',
        cursor:'pointer'
      }}>
      {slot.hot && (
        <div style={{position:'absolute',top:0,right:0,background:'var(--accent)',color:'#fff',fontSize:10,padding:'4px 14px',borderRadius:'0 0 0 12px',fontWeight:600,letterSpacing:'0.05em'}}>
          ГОРЯЩЕЕ
        </div>
      )}
      {slot.best && (
        <div style={{position:'absolute',top:0,left:0,background:'var(--dark)',color:'#fff',fontSize:10,padding:'4px 14px',borderRadius:'0 0 12px 0',fontWeight:500,letterSpacing:'0.05em'}}>
          Рекомендуем
        </div>
      )}
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,marginTop: slot.hot||slot.best ? 16 : 0}}>
        <div style={{fontSize:28,fontWeight:600,letterSpacing:'-0.03em'}}>{slot.time}</div>
        <div style={{background:'rgba(249,115,22,0.1)',color:'var(--accent)',padding:'4px 10px',borderRadius:10,fontSize:12,fontWeight:600}}>
          −{slot.discount}%
        </div>
      </div>
      {/* Info */}
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:'Playfair Display, serif',fontSize:19,marginBottom:6}}>{slot.name}</div>
        <div style={{fontSize:13,color:'#8F8475',display:'flex',alignItems:'center',gap:8}}>
          <span>{slot.sub}</span>
          <span style={{background:'#F1F1EB',padding:'2px 8px',borderRadius:6,fontSize:11}}>{slot.dist}</span>
        </div>
      </div>
      {/* Footer */}
      <div style={{paddingTop:20,borderTop:'1px dashed rgba(28,45,28,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11,color:'#8F8475'}}>
          <div style={{position:'relative',width:6,height:6}}>
            <div style={{width:6,height:6,background:'var(--accent)',borderRadius:'50%'}}/>
            <div style={{position:'absolute',inset:0,background:'var(--accent)',borderRadius:'50%',animation:'pulse-ring 2s infinite'}}/>
          </div>
          {slot.views} смотрят · {timer}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12,textDecoration:'line-through',color:'#B5B5B5'}}>{slot.old}</div>
          <div style={{fontSize:20,fontWeight:600,color:'var(--dark)'}}>{slot.price}</div>
        </div>
      </div>
      {/* CTA */}
      <button style={{
        width:'100%',marginTop:16,padding:'12px',borderRadius:14,border:'none',
        background: hovered ? 'var(--accent)' : 'var(--dark)',
        color:'#fff',fontWeight:500,fontSize:14,cursor:'pointer',
        transition:'background 0.3s'
      }}>
        Зафиксировать цену
      </button>
    </div>
  )
}

export default function Slots() {
  return (
    <div>
      <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#8F8475',marginBottom:24}}>
        Ближайшие слоты
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
        {slots.map(s => <SlotCard key={s.id} slot={s}/>)}
      </div>
    </div>
  )
}
