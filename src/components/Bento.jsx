export default function Bento() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:24,marginTop:60}}>
      <div style={{background:'var(--dark)',color:'#fff',padding:32,borderRadius:28,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'radial-gradient(circle,rgba(249,115,22,.15),transparent 70%)'}}/>
        <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:16}}>Единый абонемент</div>
        <h2 style={{fontFamily:'Playfair Display, serif',fontSize:28,marginBottom:12,fontWeight:500}}>
          5 сеансов.<br/>Любой салон.
        </h2>
        <p style={{opacity:.6,fontSize:14,marginBottom:28,lineHeight:1.6}}>
          Используй в любом топовом салоне Москвы по фиксированной цене.
        </p>
        <button style={{
          background:'var(--accent)',color:'#fff',border:'none',
          padding:'12px 28px',borderRadius:14,fontWeight:500,
          cursor:'pointer',fontSize:14
        }}>
          Купить за 15 000 ₽
        </button>
      </div>
      <div style={{background:'#fff',color:'var(--dark)',padding:32,borderRadius:28,border:'1px solid var(--border)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#8F8475',marginBottom:16}}>Для салонов</div>
          <h3 style={{fontFamily:'Playfair Display, serif',fontSize:22,marginBottom:10,fontWeight:500}}>
            Заполните пустые часы
          </h3>
          <p style={{fontSize:13,color:'#8F8475',lineHeight:1.6}}>
            Подключитесь за 5 минут. Первые 3 месяца без комиссии.
          </p>
        </div>
        <a href="#" style={{color:'var(--accent)',fontSize:14,fontWeight:600,textDecoration:'none',display:'flex',alignItems:'center',gap:6,marginTop:24}}>
          Подключить салон →
        </a>
      </div>
    </div>
  )
}
