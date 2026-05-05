import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function useTimer(initialSec) {
  const [s, setS] = useState(initialSec)
  useEffect(() => {
    if (!initialSec) return
    const t = setInterval(() => setS(v => v > 0 ? v-1 : 0), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), ss = s%60
  return {
    str: h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`,
    urgent: s <= 900
  }
}

export default function SlotRow({ slot }) {
  const { str, urgent } = useTimer(slot.seconds)
  const markerColor = slot.type==='best' ? '#F97316' : slot.type==='good' ? 'rgba(28,45,28,.2)' : 'rgba(181,181,181,.2)'

  return (
    <div className={`relative flex flex-row items-center gap-4 px-4 py-4 rounded-xl transition-colors
      ${slot.faded ? 'opacity-30 pointer-events-none' : 'cursor-pointer hover:bg-black/[0.02]'}
      ${slot.type==='best' ? 'bg-orange-500/[0.03]' : ''}`}
      style={{borderBottom:'0.5px solid #e8e4d8'}}>

      {slot.type==='best' && (
        <Badge className="absolute -top-2.5 left-4 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{background:'#1C2D1C',color:'#F9F7EF',border:'none'}}>
          Рекомендуем
        </Badge>
      )}

      {/* Color marker */}
      <div className="flex-shrink-0 self-stretch w-0.5 rounded-full my-1" style={{background:markerColor}}/>

      {/* Time */}
      <div className="flex-shrink-0 w-14 text-left">
        <div style={{fontSize:22,fontWeight:500,color:slot.faded?'#B5B5B5':'#1C2D1C',letterSpacing:'-0.02em',lineHeight:1}}>
          {slot.hour}<span style={{fontSize:16,color:'#8F8475'}}>:{slot.min}</span>
        </div>
        <div className="text-[10px] mt-0.5" style={{color:'#B5B5B5'}}>{slot.faded?'занято':'сегодня'}</div>
      </div>

      {/* Live dot */}
      {!slot.faded && (
        <div className="flex-shrink-0 relative w-2 h-2">
          <div className="w-2 h-2 rounded-full" style={{background:'#F97316'}}/>
          <div className="absolute -inset-1 rounded-full border border-orange-400/40" style={{animation:'ring 2s ease-out infinite'}}/>
        </div>
      )}

      {/* Avatar */}
      <Avatar className="flex-shrink-0 w-9 h-9" style={{opacity:slot.faded?0.3:1}}>
        <AvatarFallback style={{background:slot.avatarBg,fontSize:0}}/>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" style={{color:slot.faded?'#B5B5B5':'#1C2D1C',fontFamily:'Georgia,serif'}}>{slot.name}</div>
        <div className="text-xs mt-0.5" style={{color:'#8F8475'}}>{slot.salon}{slot.dist && ` · ${slot.dist}`}</div>
      </div>

      {/* Discount + progress */}
      {!slot.faded && (
        <div className="flex-shrink-0 w-16 text-right">
          <div className="text-xs mb-1.5" style={{color:'#8F8475'}}>−{slot.discount}%</div>
          <div className="w-full h-px rounded-full overflow-hidden" style={{background:'#e8e4d8'}}>
            <div className="h-full rounded-full relative overflow-hidden" style={{
              width:`${slot.progress}%`,
              background: slot.type==='best'
                ? 'linear-gradient(90deg,rgba(249,115,22,.5),rgba(249,115,22,.85))'
                : 'rgba(28,45,28,.18)'
            }}/>
          </div>
        </div>
      )}

      {/* Countdown */}
      {!slot.faded && (
        <div className="flex-shrink-0 w-14 text-right">
          <div className="text-xs font-medium tabular-nums" style={{color:urgent?'#F97316':'#8F8475'}}>{str}</div>
          <div className="text-[10px] italic mt-0.5" style={{color:'#B5B5B5'}}>смотрят {slot.views}</div>
        </div>
      )}

      {/* Action */}
      <div className="flex-shrink-0 w-28 text-center">
        {slot.faded ? (
          <Button variant="outline" disabled size="sm" className="w-full text-xs h-8 border-0" style={{background:'rgba(28,45,28,.06)',color:'#8F8475'}}>
            Занято
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Button className="w-full h-auto py-2 text-white rounded-lg" style={{background:'#F97316'}}>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold leading-tight">{slot.price}</span>
                <span className="text-[10px] opacity-80 leading-tight">Зафиксировать</span>
              </div>
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{color:'#8F8475',background:'rgba(28,45,28,.05)'}}>СБП</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{color:'#8F8475',background:'rgba(28,45,28,.05)'}}>Pay</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="8" height="9" viewBox="0 0 8 9" fill="none"><rect x="1" y="4" width="6" height="5" rx="1" fill="#B5B5B5"/><path d="M2.5 4V2.5a1.5 1.5 0 013 0V4" stroke="#B5B5B5" strokeWidth="1"/></svg>
              <span className="text-[9px]" style={{color:'#B5B5B5'}}>гарантия</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
