import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
const moods = ['Всё','Глубокий отдых','Перезагрузка','Вдвоём']
const moodsShort = ['Всё','Отдых','Перезагрузка']

export default function Nav() {
  const [active, setActive] = useState('Всё')
  const isMobile = useIsMobile()
  return (
    <nav style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding: isMobile ? '14px 16px' : '20px 40px', position:'sticky', top:0, zIndex:100,
      background:'rgba(253,252,249,0.92)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--border)'
    }}>
      <div style={{fontWeight:600,fontSize:20,letterSpacing:'-1px'}}>LOVI.today</div>
      <div style={{display:'flex',gap:8}}>
        {(isMobile ? moodsShort : moods).map(m=>(
          <button key={m} onClick={()=>setActive(m)} style={{
            padding: isMobile ? '6px 12px' : '8px 18px', borderRadius:20, fontSize: isMobile ? 11 : 13, fontWeight:500,
            cursor:'pointer', transition:'all 0.25s', border:'1px solid var(--border)',
            background: active===m ? 'var(--dark)' : 'transparent',
            color: active===m ? '#fff' : 'var(--dark)'
          }}>{m}</button>
        ))}
      </div>
      {!isMobile && <div style={{fontSize:13,fontWeight:500,cursor:'pointer'}}>Москва →</div>}
    </nav>
  )
}
