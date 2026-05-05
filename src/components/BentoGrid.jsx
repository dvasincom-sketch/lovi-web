import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

function useTimer(sec) {
  const [s, setS] = useState(sec)
  useEffect(()=>{
    if(!sec)return
    const t=setInterval(()=>setS(v=>v>0?v-1:0),1000)
    return()=>clearInterval(t)
  },[])
  const m=Math.floor((s%3600)/60),ss=s%60
  const pct=Math.max(0,(s/sec)*100)
  return { str: String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0'), pct, urgent: s<=900 }
}

function LiveDot({light}){
  return(
    <span style={{position:'relative',display:'inline-block',width:6,height:6,flexShrink:0}}>
      <span style={{position:'absolute',inset:0,borderRadius:'50%',background:light?'rgba(255,255,255,0.5)':'var(--accent)',animation:'pulse 2s infinite'}}/>
      <span style={{position:'absolute',inset:0,borderRadius:'50%',background:light?'rgba(255,255,255,0.5)':'var(--accent)'}}/>
    </span>
  )
}

function SubCard({time,name,salon,price,discount,seconds,tag}){
  const {str,pct,urgent}=useTimer(seconds)
  const [hov,setHov]=useState(false)
  const isMobile=useIsMobile()
  return(
    <div onClick={()=>{ if(navigator.vibrate) navigator.vibrate(10) }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:'#fff',border:'1px solid var(--border)',
        borderRadius:isMobile?24:32,padding:isMobile?'20px 22px':'24px 28px',
        display:'flex',flexDirection:'column',justifyContent:'space-between',
        flex:1,position:'relative',overflow:'hidden',cursor:'pointer',
        transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)',
        transform:hov&&!isMobile?'translateY(-4px)':'none',
        boxShadow:hov&&!isMobile?'0 24px 48px rgba(18,26,18,0.08)':'none',
        borderColor:hov?'rgba(249,115,22,0.3)':'var(--border)',
        minHeight:isMobile?'auto':160
      }}>
      {tag&&(
        <div style={{position:'absolute',top:16,right:16,background:'#FFF7ED',color:'var(--accent)',
          fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:8}}>
          {tag}
        </div>
      )}
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'rgba(18,26,18,0.04)'}}>
        <div style={{height:'100%',background:urgent?'var(--accent)':'rgba(18,26,18,0.1)',
          width:`${pct}%`,transition:'width 1s linear'}}/>
      </div>
      <div>
        <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',
          color:'rgba(18,26,18,0.35)',marginBottom:8}}>
          Available at {time}
        </div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:isMobile?18:21,
          marginBottom:3,lineHeight:1.2}}>{name}</div>
        <div style={{fontSize:11,color:'var(--secondary)',textTransform:'uppercase',
          letterSpacing:'0.06em'}}>{salon}</div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:14}}>
        <div>
          <div style={{fontSize:11,color:'var(--secondary)',display:'flex',
            alignItems:'center',gap:5,marginBottom:4}}>
            <span style={{fontSize:10}}>👁</span><LiveDot/>
            <span style={{color:urgent?'var(--accent)':'var(--secondary)',fontWeight:urgent?600:400}}>
              {str} до роста цены
            </span>
          </div>
          <div style={{fontSize:isMobile?20:22,fontWeight:600,letterSpacing:'-0.02em'}}>{price}</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
          <div style={{background:'rgba(249,115,22,0.09)',color:'var(--accent)',
            padding:'3px 10px',borderRadius:8,fontSize:11,fontWeight:700}}>
            ⚡ -{discount}%
          </div>
          <div style={{
            background:hov?'var(--accent)':'var(--dark)',color:'#fff',
            fontSize:11,fontWeight:500,padding:'7px 14px',borderRadius:10,
            transition:'background 0.25s'
          }}>
            Забрать →
          </div>
        </div>
      </div>
    </div>
  )
}

function PassCard({isMobile}){
  const [hov,setHov]=useState(false)
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      gridColumn: isMobile?'span 1':'span 8',
      background:'#F1F0EC',borderRadius:isMobile?24:40,
      padding:isMobile?'24px 22px':'32px 36px',
      display:'flex',flexDirection:isMobile?'column':'row',
      alignItems:isMobile?'flex-start':'center',gap:isMobile?20:32,
      cursor:'pointer',
      transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)',
      transform:hov&&!isMobile?'translateY(-4px)':'none',
      boxShadow:hov&&!isMobile?'0 24px 48px rgba(18,26,18,0.06)':'none'
    }}>
      <div style={{
        width:isMobile?120:150,height:isMobile?76:94,flexShrink:0,
        background:'linear-gradient(135deg,#121A12,#2A3D2A)',
        borderRadius:14,padding:16,color:'#fff',
        display:'flex',flexDirection:'column',justifyContent:'space-between',
        position:'relative',overflow:'hidden',
        boxShadow:hov?'0 12px 32px rgba(18,26,18,0.25)':'0 4px 16px rgba(18,26,18,0.15)',
        transition:'box-shadow 0.4s'
      }}>
        {hov&&<div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.07) 50%,transparent 65%)'}}/>}
        <div style={{fontSize:7,letterSpacing:3,opacity:.55,textTransform:'uppercase'}}>Lovi Pass</div>
        <div style={{fontSize:14,fontWeight:600}}>5 СЕАНСОВ</div>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',
          color:'var(--secondary)',marginBottom:6}}>Единый абонемент</div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:isMobile?18:22,
          marginBottom:6,lineHeight:1.2}}>The Unlimited Access</div>
        <div style={{fontSize:12,color:'var(--secondary)',lineHeight:1.6,marginBottom:14}}>
          Доступ в 50+ топ-салонов Москвы · Любая услуга · Фиксированная цена.
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:isMobile?20:24,fontWeight:600,letterSpacing:'-0.02em'}}>15 000 ₽</div>
            <div style={{fontSize:11,color:'var(--secondary)',marginTop:2}}>3 000 ₽ за сеанс · выгода vs 3 300 ₽</div>
          </div>
          <button style={{background:'var(--dark)',color:'#fff',border:'none',
            padding:'10px 20px',borderRadius:12,fontWeight:500,cursor:'pointer',
            fontSize:13,opacity:hov?1:0.85,transition:'opacity 0.2s'}}>
            Выбрать тариф
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BentoGrid(){
  const t1=useTimer(522)
  const [hov1,setHov1]=useState(false)
  const [booked,setBooked]=useState(false)
  const isMobile=useIsMobile()

  const handleBook = () => {
    if(navigator.vibrate) navigator.vibrate([10,50,10])
    setBooked(true)
    setTimeout(()=>setBooked(false), 3000)
  }

  const pad = isMobile ? '0 16px 80px' : '0 40px 60px'

  return(
    <div style={{maxWidth:1200,margin:'0 auto',padding:pad}}>
      <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',
        color:'var(--secondary)',marginBottom:isMobile?16:24}}>
        Ближайшие слоты
      </div>

      <div style={{
        display:'grid', background:'var(--bg)',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(12,1fr)',
        gap:isMobile?14:20,
        gridAutoRows: isMobile ? 'auto' : 'minmax(160px,auto)'
      }}>

        {/* FEATURED */}
        <div onMouseEnter={()=>setHov1(true)} onMouseLeave={()=>setHov1(false)}
          style={{
            gridColumn: isMobile?'span 1':'span 8',
            gridRow: isMobile?'span 1':'span 2',
            background:'#121A12',color:'#fff',
            borderRadius:isMobile?28:40,
            padding:isMobile?'28px 24px':48,
            display:'flex',flexDirection:'column',justifyContent:'space-between',
            position:'relative',overflow:'hidden',cursor:'pointer',
            minHeight:isMobile?380:'auto',
            transition:'all 0.5s cubic-bezier(0.2,1,0.2,1)',
            transform:hov1&&!isMobile?'translateY(-6px)':'none',
            boxShadow:hov1&&!isMobile?'0 48px 96px rgba(18,26,18,0.18)':'none'
          }}>
          <div style={{position:'absolute',top:-60,right:-60,width:240,height:240,borderRadius:'50%',
            background:'radial-gradient(circle,rgba(249,115,22,0.14),transparent 70%)',
            opacity:hov1?1:0.6,transition:'opacity 0.5s'}}/>

          <div style={{position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:10,fontWeight:600,
              letterSpacing:'0.1em',textTransform:'uppercase',
              color:'rgba(255,255,255,0.38)',marginBottom:12}}>
              <LiveDot light/> Next Available Slot
            </div>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:12}}>
              <div style={{fontSize:isMobile?56:80,fontWeight:600,letterSpacing:'-0.04em',
                color:'var(--accent)',lineHeight:1}}>
                18:30
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <svg width="32" height="32" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="12" fill="none" stroke="var(--accent)" strokeWidth="2"
                    strokeDasharray={`${2*Math.PI*12}`}
                    strokeDashoffset={`${2*Math.PI*12*(1-t1.pct/100)}`}
                    strokeLinecap="round"
                    style={{transition:'stroke-dashoffset 1s linear'}}/>
                </svg>
                <div style={{fontSize:8,color:'rgba(255,255,255,0.28)',textTransform:'uppercase',
                  letterSpacing:'0.06em',textAlign:'center',lineHeight:1.3}}>
                  до роста<br/>цены
                </div>
              </div>
            </div>
            <div style={{fontFamily:'Playfair Display,serif',
              fontSize:isMobile?22:32,marginBottom:8,fontWeight:500,lineHeight:1.1}}>
              Гималайский дзен
            </div>
            <a href="https://yandex.ru/maps/?text=HeadSPA+Арбат" target="_blank"
              style={{fontSize:11,color:'rgba(255,255,255,0.45)',textTransform:'uppercase',
              letterSpacing:'0.06em',textDecoration:'none',
              borderBottom:'1px solid rgba(255,255,255,0.15)',paddingBottom:1,display:'inline-block'}}>
              📍 HeadSPA · Арбат · 350 м · 4 мин пешком
            </a>
          </div>

          <div style={{display:'flex',alignItems:'flex-end',
            justifyContent:'space-between',gap:16,position:'relative',
            marginTop:isMobile?24:0}}>
            <div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',
                textDecoration:'line-through',marginBottom:4}}>5 500 ₽</div>
              <div style={{fontSize:isMobile?28:34,fontWeight:600,
                letterSpacing:'-0.02em',lineHeight:1}}>3 300 ₽</div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:10,
                color:'rgba(255,255,255,0.4)',marginTop:8}}>
                <span>👁</span><LiveDot light/>
                <span style={{color:t1.urgent?'var(--accent)':'rgba(255,255,255,0.4)'}}>
                  {t1.str} · 4 смотрят
                </span>
              </div>
            </div>
            {!isMobile && (
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                <div style={{background:'rgba(249,115,22,0.18)',color:'var(--accent)',
                  padding:'4px 12px',borderRadius:10,fontSize:12,fontWeight:600}}>-40%</div>
                <button onClick={handleBook} style={{
                  background: booked?'rgba(255,255,255,0.15)':'var(--accent)',
                  color:'#fff',border:'none',padding:'14px 28px',borderRadius:18,
                  fontWeight:600,cursor:'pointer',fontSize:14,
                  boxShadow:'0 8px 20px rgba(249,115,22,0.3)',
                  transition:'all 0.3s',
                  transform:hov1?'scale(1.04)':'scale(1)'
                }}>
                  {booked ? '⏳ Проверяем...' : 'Забрать за 3 300 ₽'}
                </button>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Оплата:</span>
                  {['СБП','Apple Pay','T-Pay'].map(p=>(
                    <span key={p} style={{fontSize:9,fontWeight:600,
                      color:'rgba(255,255,255,0.4)',background:'rgba(255,255,255,0.07)',
                      padding:'2px 6px',borderRadius:4}}>{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{
          gridColumn: isMobile?'span 1':'span 4',
          gridRow: isMobile?'span 1':'span 2',
          display:'flex',flexDirection:'column',gap:isMobile?14:20
        }}>
          <SubCard time="19:00" name="SPA для двоих" salon="LuxeSpa · Патриаршие"
            price="9 000 ₽" discount={25} seconds={2322} tag="Топ по отзывам"/>
          <SubCard time="20:00" name="Массаж спины" salon="Relax · Чистые пруды"
            price="2 975 ₽" discount={15} seconds={5922}/>
        </div>

        {/* PASS */}
        <PassCard isMobile={isMobile}/>

        {/* B2B */}
        <div style={{
          gridColumn: isMobile?'span 1':'span 4',
          background:'var(--dark)',color:'#fff',
          borderRadius:isMobile?24:40,padding:isMobile?'24px 22px':32,
          display:'flex',flexDirection:'column',cursor:'pointer',
          transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)'
        }}
        onMouseEnter={e=>{if(!isMobile){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 24px 48px rgba(18,26,18,0.15)'}}}
        onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
          <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',
            color:'rgba(255,255,255,0.32)',marginBottom:12}}>Для салонов</div>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:isMobile?18:22,
            marginBottom:8,lineHeight:1.2}}>Заполните пустые часы</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.38)',lineHeight:1.6,marginBottom:'auto'}}>
            Первые 3 месяца без комиссии
          </div>
          <a href="#" style={{color:'var(--accent)',fontSize:13,fontWeight:600,
            textDecoration:'none',display:'flex',alignItems:'center',gap:4,marginTop:18,
            textTransform:'uppercase',letterSpacing:'0.08em'}}>
            Подключить →
          </a>
        </div>

      </div>

      {/* MOBILE STICKY CTA */}
      {isMobile && (
        <div style={{
          position:'fixed',bottom:0,left:0,right:0,zIndex:100,
          padding:'12px 16px 24px',
          background:'rgba(249,248,246,0.95)',
          backdropFilter:'blur(12px)',
          borderTop:'1px solid var(--border)'
        }}>
          <button onClick={handleBook} style={{
            width:'100%',background:booked?'rgba(18,26,18,0.5)':'var(--accent)',
            color:'#fff',border:'none',padding:'16px',borderRadius:18,
            fontWeight:600,fontSize:16,cursor:'pointer',
            boxShadow:'0 8px 24px rgba(249,115,22,0.3)',
            transition:'all 0.3s'
          }}>
            {booked ? '⏳ Проверяем доступность...' : 'Забрать за 3 300 ₽'}
          </button>
          <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:8}}>
            {['СБП','Apple Pay','T-Pay'].map(p=>(
              <span key={p} style={{fontSize:10,color:'var(--secondary)',
                background:'rgba(18,26,18,0.06)',padding:'2px 8px',borderRadius:4,fontWeight:500}}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
