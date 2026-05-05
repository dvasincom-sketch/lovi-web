const items = [
  'Live Status: 342 Open Slots',
  '● Ксения взяла SPA для двоих в LuxeSpa со скидкой 25%',
  '● Анна забронировала HeadSPA на Арбате',
  '● Михаил сэкономил 2 500 ₽ в Relax Чистые Пруды',
  'Last Booking: 2 min ago · HeadSPA',
  '● Дарья выбрала Массаж спины на 20:00',
  'Moscow · May 2026',
  'Live Status: 342 Open Slots',
  '● Ксения взяла SPA для двоих в LuxeSpa со скидкой 25%',
  '● Анна забронировала HeadSPA на Арбате',
  '● Михаил сэкономил 2 500 ₽ в Relax Чистые Пруды',
  'Last Booking: 2 min ago · HeadSPA',
]

export default function Ticker() {
  return (
    <div style={{
      position:'sticky',bottom:0,left:0,right:0,zIndex:50,
      borderTop:'1px solid var(--border)',
      background:'rgba(245,244,240,0.92)',
      backdropFilter:'blur(12px)',
      padding:'14px 40px',overflow:'hidden',whiteSpace:'nowrap'
    }}>
      <div style={{display:'inline-flex',gap:60,animation:'drift 50s linear infinite'}}>
        {items.map((item,i)=>(
          <span key={i} style={{fontSize:11,color:'rgba(18,26,18,0.4)',textTransform:'uppercase',letterSpacing:'0.1em'}}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
