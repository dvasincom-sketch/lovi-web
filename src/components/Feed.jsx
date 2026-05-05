import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const items = [
  { id:1, init:'АК', name:'Анна', action:'забронировала антистресс-массаж в HeadSPA', highlight:'40%', ago:'2 мин' },
  { id:2, init:'МП', name:'Мария', action:'взяла SPA для двоих в LuxeSpa · сэкономила', highlight:'3 000 ₽', ago:'7 мин' },
  { id:3, init:'ДС', name:'Дарья', action:'записалась на Гималайский дзен со скидкой', highlight:'25%', ago:'14 мин' },
]

export default function Feed() {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10" style={{borderTop:'0.5px solid #e2ddd0'}}>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{color:'#8F8475'}}>Только что</div>
      <div className="text-xl font-normal mb-5" style={{color:'#1C2D1C',fontFamily:'Georgia,serif'}}>Только что забронировали</div>
      <div className="flex flex-col gap-2">
        {items.map(i=>(
          <Card key={i.id} className="flex items-center gap-3 px-4 py-3 border-0 shadow-none rounded-xl" style={{background:'rgba(28,45,28,.03)'}}>
            <Avatar className="w-7 h-7 flex-shrink-0">
              <AvatarFallback className="text-[10px] font-medium" style={{background:'rgba(28,45,28,.08)',color:'#1C2D1C'}}>{i.init}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-xs" style={{color:'#8F8475',lineHeight:1.5}}>
              <span className="font-medium" style={{color:'#1C2D1C'}}>{i.name}</span> {i.action} <span className="font-medium" style={{color:'#1C2D1C'}}>{i.highlight}</span>
            </div>
            <div className="flex-shrink-0 text-[10px]" style={{color:'#B5B5B5'}}>{i.ago}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
