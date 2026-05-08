import { useState } from "react"

const API = "https://insalon.onrender.com"

export default function SalonLogin() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !email.includes("@")) return
    setLoading(true)
    await fetch(`${API}/api/lovi/salon/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  const s = {
    page:  { display:"flex", alignItems:"center", justifyContent:"center",
             minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", padding:24 },
    card:  { width:"100%", maxWidth:400, background:"#fff",
             border:"1px solid rgba(18,26,18,0.08)", borderRadius:20, padding:40 },
    logo:  { fontSize:20, fontWeight:700, color:"#121A12", marginBottom:32,
             fontFamily:"Playfair Display, serif" },
    title: { fontSize:22, fontWeight:700, color:"#121A12", marginBottom:8,
             fontFamily:"Playfair Display, serif" },
    sub:   { fontSize:14, color:"#8F8475", marginBottom:28, lineHeight:1.6 },
    label: { fontSize:12, color:"#8F8475", marginBottom:6, display:"block" },
    input: { width:"100%", padding:"12px 16px", border:"1px solid rgba(18,26,18,0.15)",
             borderRadius:10, fontSize:15, fontFamily:"Inter", outline:"none",
             boxSizing:"border-box", marginBottom:16 },
    btn:   { width:"100%", background:"#121A12", color:"#fff", border:"none",
             borderRadius:10, padding:"13px 0", fontSize:15, fontWeight:600,
             cursor:"pointer", opacity: loading ? 0.6 : 1 },
    ok:    { textAlign:"center" },
    okIcon:{ fontSize:40, marginBottom:16 },
    okTitle:{ fontSize:20, fontWeight:700, color:"#121A12", marginBottom:8,
              fontFamily:"Playfair Display, serif" },
    okSub: { fontSize:14, color:"#8F8475", lineHeight:1.6 },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>«Лови»</div>

        {!sent ? <>
          <h1 style={s.title}>Кабинет партнёра</h1>
          <p style={s.sub}>Введите email, который вы указали при подключении. Мы пришлём ссылку для входа.</p>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="salon@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button style={s.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Отправляем..." : "Получить ссылку"}
          </button>
        </> : (
          <div style={s.ok}>
            <div style={s.okIcon}>📬</div>
            <div style={s.okTitle}>Письмо отправлено</div>
            <p style={s.okSub}>Проверьте {email}. Ссылка для входа действует 7 дней.</p>
          </div>
        )}
      </div>
    </div>
  )
}
