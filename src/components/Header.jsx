export default function Header() {
  return (
    <div style={{maxWidth:1400,margin:'0 auto',padding:'60px 40px 40px',display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'end',gap:40,animation:'fadeUp 0.8s ease both'}}>
      <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(48px,5vw,80px)',fontWeight:500,lineHeight:0.95,margin:0,letterSpacing:'-0.04em'}}>
        The Art of<br/><i style={{fontStyle:'italic'}}>State.</i>
      </h1>
      <div style={{maxWidth:360,fontSize:14,lineHeight:1.7,color:'rgba(18,26,18,0.55)',paddingBottom:8}}>
        Система управления ликвидностью вашего времени. Интеллектуальный поиск окон в лучшие велнес-пространства города.
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:20,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--accent)'}}>
          <div style={{position:'relative',width:6,height:6}}>
            <div style={{width:6,height:6,background:'var(--accent)',borderRadius:'50%'}}/>
            <div style={{position:'absolute',inset:0,background:'var(--accent)',borderRadius:'50%',animation:'pulse 2s infinite'}}/>
          </div>
          В эфире: 342 окна
        </div>
      </div>
    </div>
  )
}
