import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import SlotDrawer from './SlotDrawer'

function useTimer(sec) {
  const [s, setS] = useState(0)
  useEffect(()=>{
    if(!sec) return
    setS(sec)
    const t=setInterval(()=>setS(v=>v>0?v-1:0),1000)
    return()=>clearInterval(t)
  },[sec])
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60
  const pct=sec?Math.max(0,(s/sec)*100):0
  const str=h>0?h+':'+String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0')
  return { str, pct, urgent: s<=900 }
}

function LiveDot({light}){
  return(
    <span style={{position:'relative',display:'inline-block',width:6,height:6,flexShrink:0}}>
      <span style={{position:'absolute',inset:0,borderRadius:'50%',background:light?'rgba(255,255,255,0.5)':'var(--accent)',animation:'pulse 2s infinite'}}/>
      <span style={{position:'absolute',inset:0,borderRadius:'50%',background:light?'rgba(255,255,255,0.5)':'var(--accent)'}}/>
    </span>
  )
}

function fmt(price){ return price.toLocaleString('ru-RU') + ' ₽' }

function SubCard({slot, tag, onBook}){
  const sec = slot ? slot.minutes_to_slot * 60 : 0
  const {str,urgent}=useTimer(sec)
  const [hov,setHov]=useState(false)
  const isMobile=useIsMobile()
  if(!slot) return null
  return(
    <div onClick={()=>{ if(navigator.vibrate) navigator.vibrate(10); if(onBook) onBook(slot) }}
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
      <div>
        <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',
          color:'rgba(18,26,18,0.35)',marginBottom:8}}>
          Запись на {slot.time}
        </div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:isMobile?18:21,
          marginBottom:3,lineHeight:1.2}}>{slot.service_name}</div>
        <div style={{fontSize:11,color:'var(--secondary)',textTransform:'uppercase',
          letterSpacing:'0.06em'}}>HeadSPA · Москва</div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:14}}>
        <div>
          <div style={{fontSize:11,color:'var(--secondary)',display:'flex',
            alignItems:'center',gap:5,marginBottom:4}}>
            <LiveDot/>
            <span style={{color:urgent?'var(--accent)':'var(--secondary)',fontWeight:urgent?600:400}}>
              1 слот · {str} до исчезновения
            </span>
          </div>
          <div style={{fontSize:isMobile?20:22,fontWeight:600,letterSpacing:'-0.02em'}}>{fmt(slot.lovi_price)}</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
          <div style={{background:'rgba(249,115,22,0.09)',color:'var(--accent)',
            padding:'3px 10px',borderRadius:8,fontSize:11,fontWeight:700}}>
            ⚡ -{slot.discount_pct}%
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

function Skeleton({isMobile}){
  const [step, setStep] = useState(0)
  const steps = [
    {text:'Подключаемся к расписанию', detail:'Проверяем свободные окна на сегодня...'},
    {text:'Анализируем спрос', detail:'Смотрим сколько людей уже смотрят эти слоты...'},
    {text:'Считаем скидку', detail:'Определяем лучшую цену для этого момента...'},
    {text:'Готовим лучшее предложение', detail:'Отбираем самый выгодный вариант для вас...'},
  ]
  useEffect(()=>{
    const t = setInterval(()=>setStep(v=>(v+1)%steps.length), 1200)
    return()=>clearInterval(t)
  },[])
  return(
    <div style={{
      gridColumn: isMobile?'span 1':'span 8',gridRow: isMobile?'span 1':'span 2',
      background:'#121A12',borderRadius:isMobile?28:40,padding:isMobile?'28px 24px':48,
      display:'flex',flexDirection:'column',justifyContent:'center',minHeight:isMobile?200:300,
      position:'relative',overflow:'hidden'
    }}>
      <div style={{position:'absolute',top:-60,right:-60,width:240,height:240,borderRadius:'50%',
        background:'radial-gradient(circle,rgba(249,115,22,0.1),transparent 70%)'}}/>
      <div style={{position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)',
            animation:'pulse 1s ease-in-out infinite'}}/>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',
            letterSpacing:'0.1em'}}>Yield Management · В процессе</div>
        </div>
        <div style={{marginBottom:32}}>
          <div style={{fontSize:isMobile?18:24,fontWeight:500,color:'#fff',
            fontFamily:'Playfair Display,serif',marginBottom:8,
            transition:'all 0.4s ease'}}>
            {steps[step].text}
          </div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.35)',
            transition:'all 0.4s ease'}}>
            {steps[step].detail}
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {steps.map((_,i)=>(
            <div key={i} style={{
              height:2,flex:1,borderRadius:1,
              background: i===step ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
              transition:'background 0.4s ease'
            }}/>
          ))}
        </div>
        <div style={{marginTop:20,display:'flex',gap:16,flexWrap:'wrap'}}>
          {['Анализ расписания','Цены в реальном времени','Персональная скидка'].map((tag,i)=>(
            <div key={i} style={{
              fontSize:10,color:'rgba(255,255,255,0.3)',
              background:'rgba(255,255,255,0.05)',
              padding:'4px 10px',borderRadius:20,
              letterSpacing:'0.05em'
            }}>{tag}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BentoGrid(){
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [hov1,setHov1]=useState(false)
  const [booked,setBooked]=useState(false)
  const [drawerSlot, setDrawerSlot]=useState(null)
  const isMobile=useIsMobile()

  useEffect(()=>{
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0]
    fetch(`https://insalon.onrender.com/api/lovi/featured?date=${today}`)
      .then(r=>r.json())
      .then(data=>{
        if(data.slots && data.slots.length >= 2){
          setSlots(data.slots)
        } else {
          return fetch(`https://insalon.onrender.com/api/lovi/featured?date=${tomorrow}`)
            .then(r=>r.json())
            .then(d=>setSlots(d.slots||[]))
        }
      })
      .catch(()=>setSlots([]))
      .finally(()=>setLoading(false))
  },[])

  const slot1 = slots[0]
  const slot2 = slots[1]
  const slot3 = slots[2]
  const t1 = useTimer(slot1 ? slot1.minutes_to_slot * 60 : 0)

  const handleBook = () => {
    if(navigator.vibrate) navigator.vibrate([10,50,10])
    if(slot1) setDrawerSlot(slot1)
  }

  const pad = isMobile ? '32px 16px 80px' : '48px 40px 60px'

  return(
    <div style={{maxWidth:1200,margin:'0 auto',padding:pad}}>
      <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',
        color:'var(--secondary)',marginBottom:isMobile?16:24}}>
        Ближайшие слоты
      </div>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(12,1fr)',
        gap:isMobile?14:20,
        gridAutoRows: isMobile ? 'auto' : 'minmax(160px,auto)'
      }}>

        {/* FEATURED */}
        {loading ? <Skeleton isMobile={isMobile}/> : slot1 ? (
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
            {/* Eyebrow */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:10,fontWeight:600,
                letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.38)'}}>
                <LiveDot light/> Лучшее предложение
              </div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',gap:6}}>
                <LiveDot light/>
                <span style={{color:t1.urgent?'var(--accent)':'rgba(255,255,255,0.4)'}}>
                  {t1.str} до исчезновения окошка
                </span>
              </div>
            </div>
            {/* Время — главный акцент */}
            <div style={{fontSize:isMobile?64:96,fontWeight:600,letterSpacing:'-0.04em',
              color:'var(--accent)',lineHeight:0.9,marginBottom:16}}>
              {slot1.time}
            </div>
            {/* Название */}
            <div style={{fontFamily:'Playfair Display,serif',
              fontSize:isMobile?20:28,marginBottom:10,fontWeight:500,lineHeight:1.2}}>
              {slot1.service_name}
            </div>
            {/* Адрес */}
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',letterSpacing:'0.02em'}}>
              📍 Head Spa Beauty · ул. Миклухо-Маклая 37 · 5 мин от м. Беляево
            </div>
          </div>

          <div style={{display:'flex',alignItems:'flex-end',
            justifyContent:'space-between',gap:16,position:'relative',
            marginTop:isMobile?24:0}}>
            <div>
              {/* Цена салона — реальная точка отсчёта */}
              <div style={{marginBottom:4}}>
                <span style={{fontSize:isMobile?28:36,fontWeight:600,letterSpacing:'-0.02em',
                  color:'rgba(255,255,255,0.9)'}}>
                  {fmt(slot1.base_price)}
                </span>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginLeft:10}}>
                  <br/>на сайте салона напрямую
                </span>
              </div>

            </div>
            {!isMobile && (
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{background:'rgba(249,115,22,0.15)',color:'var(--accent)',
                    padding:'12px 16px',borderRadius:14,fontSize:14,fontWeight:700,whiteSpace:'nowrap',border:'1px solid rgba(249,115,22,0.3)'}}>
                    -{slot1.discount_pct}%
                  </div>
                  <button onClick={handleBook} style={{
                  background: booked?'rgba(255,255,255,0.15)':'var(--accent)',
                  color:'#fff',border:'none',padding:'14px 28px',borderRadius:18,
                  fontWeight:600,cursor:'pointer',fontSize:14,
                  boxShadow:'0 8px 20px rgba(249,115,22,0.3)',
                  transition:'all 0.3s',
                  transform:hov1?'scale(1.04)':'scale(1)'
                }}>
                  {booked ? '⏳ Проверяем...' : `Забрать за ${fmt(slot1.lovi_price)}`}
                </button>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:9,color:'rgba(255,255,255,0.35)',letterSpacing:'0.04em'}}>100% предоплата</span>
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
        ) : <Skeleton isMobile={isMobile}/>}

        {/* RIGHT COLUMN */}
        <div style={{
          gridColumn: isMobile?'span 1':'span 4',
          gridRow: isMobile?'span 1':'span 2',
          display:'flex',flexDirection:'column',gap:isMobile?14:20
        }}>
          <SubCard slot={slot2} tag="Топ по отзывам" onBook={s=>setDrawerSlot(s)}/>
          <SubCard slot={slot3} onBook={s=>setDrawerSlot(s)}/>
        </div>



        <div style={{
          gridColumn: isMobile?'span 1':'span 4',
          background:'var(--dark)',color:'#fff',
          borderRadius:isMobile?24:40,padding:isMobile?'24px 22px':32,
          display:'none',flexDirection:'column',cursor:'pointer',
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

      {drawerSlot && <SlotDrawer slot={drawerSlot} onClose={()=>setDrawerSlot(null)}/>}

      {isMobile && slot1 && (
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
            {booked ? '⏳ Проверяем...' : `Забрать за ${fmt(slot1.lovi_price)}`}
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
