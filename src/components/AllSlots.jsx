import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

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

function SlotPill({slot}){
  const {str, urgent} = useTimer(slot.minutes_to_slot * 60)
  const [hov, setHov] = useState(false)
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        flexShrink:0, width:200,
        background:'#fff', border:'1px solid var(--border)',
        borderRadius:24, padding:'20px 22px',
        display:'flex', flexDirection:'column', gap:10,
        cursor:'pointer', transition:'all 0.3s cubic-bezier(0.2,1,0.2,1)',
        transform:hov?'translateY(-4px)':'none',
        boxShadow:hov?'0 16px 40px rgba(18,26,18,0.08)':'none',
        borderColor:hov?'rgba(249,115,22,0.25)':'var(--border)'
      }}>
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
          fontWeight:urgent?600:400,textAlign:'right'}}>
          {str}
        </div>
      </div>
    </div>
  )
}

export default function AllSlots(){
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(()=>{
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0]
    fetch(`https://insalon.onrender.com/api/lovi/featured?date=${today}`)
      .then(r=>r.json())
      .then(data=>{
        if(data.slots && data.slots.length >= 1){
          setSlots(data.slots)
        } else {
          return fetch(`https://insalon.onrender.com/api/lovi/featured?date=${tomorrow}`)
            .then(r=>r.json())
            .then(d=>setSlots(d.slots||[]))
        }
      })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  },[])

  if(loading) return null
if(slots.length === 0) return null

  return(
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'0 16px 40px':'0 40px 60px'}}>
      <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',
        color:'var(--secondary)',marginBottom:16}}>
        Все окошки сегодня
      </div>
      <div style={{
        display:'flex', gap:12, overflowX:'auto', paddingBottom:12,
        scrollbarWidth:'none', msOverflowStyle:'none'
      }}>
        <style>{`.allslots-scroll::-webkit-scrollbar{display:none}`}</style>
        {slots.map((slot,i)=>(
          <SlotPill key={i} slot={slot}/>
        ))}
        {/* CTA карточка в конце */}
        <div style={{
          flexShrink:0, width:180,
          background:'var(--dark)', color:'#fff',
          borderRadius:24, padding:'20px 22px',
          display:'flex', flexDirection:'column',
          justifyContent:'space-between', cursor:'pointer'
        }}>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',
            textTransform:'uppercase',letterSpacing:'0.08em'}}>Хочешь больше?</div>
          <div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:16,
              marginBottom:12,lineHeight:1.3}}>Подключи свой салон</div>
            <div style={{color:'var(--accent)',fontSize:12,fontWeight:600,
              textTransform:'uppercase',letterSpacing:'0.06em'}}>
              Подключить →
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
