import { useState, useEffect } from 'react'

function useTimer(sec) {
  const [s, setS] = useState(sec)
  useEffect(()=>{
    if(!sec)return
    const t=setInterval(()=>setS(v=>v>0?v-1:0),1000)
    return()=>clearInterval(t)
  },[])
  const m=Math.floor((s%3600)/60),ss=s%60
  return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0')
}

function LiveDot({light}){
  return(
    <span style={{position:'relative',display:'inline-block',width:6,height:6,flexShrink:0}}>
      <span style={{position:'absolute',inset:0,borderRadius:'50%',background:light?'rgba(255,255,255,0.5)':'var(--accent)',animation:'pulse 2s infinite'}}/>
      <span style={{position:'absolute',inset:0,borderRadius:'50%',background:light?'rgba(255,255,255,0.5)':'var(--accent)'}}/>
    </span>
  )
}

function Card({children,style={},cols=4,rows=1,hover=true}){
  const [hov,setHov]=useState(false)
  return(
    <div
      onMouseEnter={()=>hover&&setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        gridColumn:`span ${cols}`,gridRow:`span ${rows}`,
        background:'#fff',border:'1px solid var(--border)',
        borderRadius:4,padding:40,
        display:'flex',flexDirection:'column',
        position:'relative',overflow:'hidden',
        transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)',
        transform:hov?'translateY(-5px)':'none',
        boxShadow:hov?'0 30px 60px rgba(18,26,18,0.07)':'none',
        borderColor:hov?'var(--bronze)':'var(--border)',
        cursor:'pointer',
        ...style
      }}>
      {children}
    </div>
  )
}

export default function BentoGrid(){
  const t1=useTimer(522),t2=useTimer(2322),t3=useTimer(5922),t4=useTimer(7200)
  const [hov1,setHov1]=useState(false)

  return(
    <div style={{maxWidth:1400,margin:'60px auto',padding:'0 40px'}}>
      <div style={{fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(18,26,18,0.4)',marginBottom:30}}>
        Ближайшие слоты
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:24,gridAutoRows:'minmax(160px,auto)'}}>

        {/* FEATURED */}
        <div
          onMouseEnter={()=>setHov1(true)}
          onMouseLeave={()=>setHov1(false)}
          style={{
            gridColumn:'span 8',gridRow:'span 2',
            background:'var(--dark)',color:'#fff',
            borderRadius:4,padding:48,
            display:'flex',justifyContent:'space-between',alignItems:'flex-start',
            backgroundImage:'radial-gradient(circle at top right,rgba(166,124,82,0.18),transparent 60%)',
            position:'relative',overflow:'hidden',cursor:'pointer',
            transition:'all 0.5s cubic-bezier(0.2,1,0.2,1)',
            transform:hov1?'translateY(-5px)':'none',
            boxShadow:hov1?'0 40px 80px rgba(18,26,18,0.15)':'none'
          }}>
          <div>
            <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
              <LiveDot light/> Next Available Slot
            </div>
            <div style={{fontSize:'clamp(64px,7vw,110px)',fontWeight:300,letterSpacing:'-0.06em',color:'var(--bronze)',lineHeight:1,marginBottom:24}}>
              18:30
            </div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(28px,3vw,42px)',marginBottom:10,fontWeight:500,lineHeight:1.1}}>
              Гималайский дзен
            </div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:48}}>
              HeadSPA · Арбат · 4 мин на такси
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11,color:'rgba(255,255,255,0.3)'}}>
              <LiveDot light/> 4 смотрят · {t1}
            </div>
          </div>
          <div style={{textAlign:'right',display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'space-between',height:'100%'}}>
            <div>
              <div style={{fontSize:13,color:'var(--bronze)',fontWeight:600,letterSpacing:'0.05em',marginBottom:8}}>SAVING 40%</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.3)',textDecoration:'line-through',marginBottom:4}}>5 500 ₽</div>
              <div style={{fontSize:36,fontWeight:600,letterSpacing:'-0.02em'}}>3 300 ₽</div>
            </div>
            <button style={{
              background:'var(--bronze)',color:'#fff',border:'none',
              padding:'16px 40px',fontSize:12,textTransform:'uppercase',
              letterSpacing:'0.15em',cursor:'pointer',borderRadius:2,
              transition:'opacity 0.2s',opacity:hov1?1:0.85
            }}>Secure Spot</button>
          </div>
        </div>

        {/* 19:00 */}
        <Card cols={4}>
          <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(18,26,18,0.35)',marginBottom:16}}>Available at 19:00</div>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:24,marginBottom:6}}>SPA для двоих</div>
          <div style={{fontSize:12,color:'rgba(18,26,18,0.4)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'auto'}}>LuxeSpa · Патриаршие</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:24}}>
            <div>
              <div style={{fontSize:11,color:'rgba(18,26,18,0.3)',display:'flex',alignItems:'center',gap:6,marginBottom:4}}><LiveDot/>{t2}</div>
              <div style={{fontSize:22,fontWeight:600}}>9 000 ₽</div>
            </div>
            <div style={{color:'var(--bronze)',fontSize:13,fontWeight:600}}>−25%</div>
          </div>
        </Card>

        {/* 20:00 */}
        <Card cols={4}>
          <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(18,26,18,0.35)',marginBottom:16}}>Available at 20:00</div>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:24,marginBottom:6}}>Массаж спины</div>
          <div style={{fontSize:12,color:'rgba(18,26,18,0.4)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'auto'}}>Relax · Чистые пруды</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:24}}>
            <div>
              <div style={{fontSize:11,color:'rgba(18,26,18,0.3)',display:'flex',alignItems:'center',gap:6,marginBottom:4}}><LiveDot/>{t3}</div>
              <div style={{fontSize:22,fontWeight:600}}>2 975 ₽</div>
            </div>
            <div style={{color:'var(--bronze)',fontSize:13,fontWeight:600}}>−15%</div>
          </div>
        </Card>

        {/* PASS */}
        <Card cols={8} style={{background:'var(--bronze)',borderColor:'transparent',color:'#fff'}} hover={false}>
          <div style={{display:'flex',gap:40,alignItems:'center',height:'100%'}}>
            <div style={{
              width:160,height:100,flexShrink:0,
              background:'rgba(0,0,0,0.2)',backdropFilter:'blur(10px)',
              borderRadius:4,padding:20,
              display:'flex',flexDirection:'column',justifyContent:'space-between'
            }}>
              <div style={{fontSize:8,letterSpacing:3,opacity:.7}}>LOVI PASS</div>
              <div style={{fontSize:18,fontWeight:600}}>5 СЕАНСОВ</div>
            </div>
            <div>
              <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:12}}>Единый абонемент</div>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:24,marginBottom:8}}>The Unlimited Access</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:1.6,marginBottom:20}}>Любой салон, любая услуга, фиксированная цена.</div>
              <div style={{display:'flex',alignItems:'center',gap:24}}>
                <div style={{fontSize:26,fontWeight:600}}>15 000 ₽</div>
                <button style={{background:'rgba(0,0,0,0.2)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',padding:'10px 24px',fontSize:12,textTransform:'uppercase',letterSpacing:'0.1em',cursor:'pointer',borderRadius:2}}>
                  Выбрать тариф
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* B2B */}
        <Card cols={4} style={{background:'var(--dark)',color:'#fff',borderColor:'transparent'}}>
          <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:16}}>Для салонов</div>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:22,marginBottom:8}}>Заполните пустые часы</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',lineHeight:1.6,marginBottom:'auto'}}>Первые 3 месяца без комиссии</div>
          <a href="#" style={{color:'var(--bronze)',fontSize:12,fontWeight:600,textDecoration:'none',display:'flex',alignItems:'center',gap:6,marginTop:24,textTransform:'uppercase',letterSpacing:'0.1em'}}>
            Подключить →
          </a>
        </Card>

      </div>
    </div>
  )
}
