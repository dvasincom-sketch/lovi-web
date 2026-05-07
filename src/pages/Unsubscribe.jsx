export default function Unsubscribe() {
  return (
    <div style={{ minHeight:'100vh',background:'#FDFCF9',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
      <div style={{ maxWidth:400,textAlign:'center' }}>
        <img src="/logo.svg" alt="«Лови»" style={{ height:28,marginBottom:32 }} />
        <div style={{ fontSize:20,fontWeight:700,color:'#121A12',marginBottom:12,fontFamily:'Playfair Display,serif' }}>Отписка от рассылки</div>
        <div style={{ fontSize:14,color:'#8F8475',lineHeight:1.7,marginBottom:24 }}>
          Для отписки напишите нам на{' '}
          <a href="mailto:support@lovi.today" style={{ color:'#121A12' }}>support@lovi.today</a>
          {' '}— мы удалим ваш email в течение 24 часов.
        </div>
        <a href="/" style={{ fontSize:13,color:'#8F8475' }}>← На главную</a>
      </div>
    </div>
  )
}
