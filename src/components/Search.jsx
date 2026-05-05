export default function Search() {
  return (
    <div style={{maxWidth:1400,margin:'0 auto',padding:'0 40px 0'}}>
      <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid var(--dark)',padding:'20px 0',gap:16}}>
        <input placeholder="Район или метро" style={{
          background:'transparent',border:'none',
          fontSize:24,fontFamily:'Playfair Display,serif',
          width:'35%',outline:'none',color:'var(--dark)',
          borderRight:'1px solid var(--border)',paddingRight:24
        }}/>
        <input placeholder="Услуга или опыт" style={{
          background:'transparent',border:'none',
          fontSize:24,fontFamily:'Playfair Display,serif',
          flex:1,outline:'none',color:'var(--dark)'
        }}/>
        <button style={{
          background:'var(--dark)',color:'#fff',border:'none',
          padding:'16px 40px',fontSize:12,textTransform:'uppercase',
          letterSpacing:'0.2em',cursor:'pointer',flexShrink:0,
          transition:'background 0.2s'
        }}>Discover</button>
      </div>
      <div style={{display:'flex',gap:8,padding:'16px 0',flexWrap:'wrap'}}>
        {['Рядом со мной','Для двоих','Тайский','С душем','До 3 000 ₽'].map(c=>(
          <button key={c} style={{
            padding:'6px 14px',borderRadius:2,
            border:'1px solid var(--border)',
            fontSize:11,color:'rgba(18,26,18,0.5)',
            background:'transparent',cursor:'pointer',
            textTransform:'uppercase',letterSpacing:'0.06em'
          }}>{c}</button>
        ))}
      </div>
    </div>
  )
}
