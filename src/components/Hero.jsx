import { useState, useEffect } from 'react'

export default function Hero() {
  const [count, setCount] = useState(342)
  useEffect(()=>{
    const t = setInterval(()=>{
      setCount(v => v + (Math.random() > 0.5 ? -1 : 1))
    }, 3000)
    return () => clearInterval(t)
  },[])
  const isMobile = window.innerWidth < 768

  return (
    <section style={{
      maxWidth:1200, margin:'0 auto',
      padding: isMobile ? '40px 16px 40px' : '80px 40px 60px',
      textAlign:'center', animation:'fadeUp 0.8s ease both'
    }}>
      <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:24,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--accent)'}}>
        <div style={{position:'relative',width:6,height:6,flexShrink:0}}>
          <div style={{width:6,height:6,background:'var(--accent)',borderRadius:'50%'}}/>
          <div style={{position:'absolute',inset:0,background:'var(--accent)',borderRadius:'50%',animation:'pulse 2s infinite'}}/>
        </div>
        В эфире: {count} окна
      </div>
      <h1 style={{
        fontFamily:'Playfair Display, serif', fontSize:'clamp(36px,4.5vw,58px)',
        fontWeight:500, lineHeight:1.08, marginBottom:40, letterSpacing:'-0.02em'
      }}>
        Время — это <i style={{color:'var(--accent)',fontStyle:'italic'}}>единственная</i> валюта,<br/>которую нельзя вернуть.
      </h1>
      <div style={{
        maxWidth:760, margin:'0 auto',
        background:'#fff', padding:10, borderRadius:isMobile?16:28,
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto',
        gap: isMobile ? 8 : 0,
        boxShadow:'0 40px 100px rgba(15,23,15,0.05)',
        border:'1px solid var(--border)'
      }}>
        <input placeholder="Район или метро" style={{border:'none',padding:'16px 24px',fontSize:16,outline:'none',background:'transparent',borderRight: isMobile ? 'none' : '1px solid var(--border)', borderBottom: isMobile ? '1px solid var(--border)' : 'none'}}/>
        <input placeholder="Услуга или тип" style={{border:'none',padding:'16px 24px',fontSize:16,outline:'none',background:'transparent'}}/>
        <button style={{
          background:'var(--dark)',color:'#fff',border:'none',
          padding:'0 36px',borderRadius:20,fontWeight:600,
          cursor:'pointer',fontSize:14,whiteSpace:'nowrap'
        }}>Найти окна</button>
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:20,flexWrap:'wrap'}}>
        {['Рядом со мной','Для двоих','Тайский','С душем','До 3 000 ₽'].map(c=>(
          <button key={c} style={{
            padding:'6px 14px',borderRadius:20,
            border:'1px solid var(--border)',
            fontSize:12,color:'var(--secondary)',background:'transparent',cursor:'pointer'
          }}>{c}</button>
        ))}
      </div>
    </section>
  )
}
