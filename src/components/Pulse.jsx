import SlotRow from './SlotRow'

const slots = [
  { id:1, type:'best', hour:'18', min:'30', name:'Гималайский дзен · 90 мин', salon:'HeadSPA · Арбат', dist:'4 мин на такси', discount:40, progress:82, views:4, price:'3 300 ₽', seconds:522, avatarBg:'linear-gradient(135deg,#cdc9b8,#ada898)' },
  { id:2, type:'good', hour:'19', min:'00', name:'SPA для двоих · 120 мин', salon:'LuxeSpa · Патриаршие', dist:'12 мин на такси', discount:25, progress:52, views:2, price:'9 000 ₽', seconds:2322, avatarBg:'linear-gradient(135deg,#b8c2b8,#98a898)' },
  { id:3, type:'other', hour:'20', min:'00', name:'Массаж спины · 60 мин', salon:'Relax · Чистые пруды', dist:'20 мин на такси', discount:15, progress:24, views:1, price:'2 975 ₽', seconds:5922, avatarBg:'linear-gradient(135deg,#c2baa8,#a29888)' },
  { id:4, type:'other', hour:'21', min:'30', name:'Перерождение Premium', salon:'HeadSPA · Арбат', dist:'', discount:0, progress:0, views:0, price:'', seconds:0, faded:true, avatarBg:'linear-gradient(135deg,#cdc9b8,#ada898)' },
]

const groups = [
  { label:'Лучший выбор прямо сейчас', ids:[1] },
  { label:'Интересное предложение', ids:[2] },
  { label:'Другие окошки', ids:[3,4] },
]

export default function Pulse() {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10" style={{borderTop:'0.5px solid #e2ddd0'}}>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{color:'#8F8475'}}>Горит сейчас</div>
      <div className="text-xl font-normal mb-6" style={{color:'#1C2D1C',fontFamily:'Georgia,serif'}}>Поток доступности · сегодня</div>
      {groups.map(g=>(
        <div key={g.label} className="mb-1">
          <div className="text-[10px] uppercase tracking-widest mb-2 mt-5" style={{color:'#B5B5B5'}}>{g.label}</div>
          {slots.filter(s=>g.ids.includes(s.id)).map(s=><SlotRow key={s.id} slot={s}/>)}
        </div>
      ))}
    </div>
  )
}
