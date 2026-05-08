import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

export default function Connect() {
  const [status, setStatus] = useState("loading")
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const user_token = params.get("user_token")
    const company_id = params.get("company_id")

    if (!user_token || !company_id) {
      setStatus("error")
      return
    }

    fetch(`${API}/api/lovi/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_token, company_id }),
    })
      .then(r => r.json())
      .then(d => setStatus(d.ok ? "success" : "error"))
      .catch(() => setStatus("error"))
  }, [])

  const s = {
    page: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            height:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", gap:16 },
    title: { fontFamily:"Playfair Display, serif", fontSize:28, color:"#121A12", margin:0 },
    sub:   { color:"#8F8475", fontSize:15, margin:0 },
    btn:   { background:"#F97316", color:"#fff", border:"none", borderRadius:8,
             padding:"12px 28px", fontSize:15, cursor:"pointer", marginTop:8 },
  }

  if (status === "loading") return (
    <div style={s.page}><p style={s.sub}>Подключаем салон...</p></div>
  )

  if (status === "success") return (
    <div style={s.page}>
      <h2 style={s.title}>Салон подключён</h2>
      <p style={s.sub}>Горящие окошки теперь видны в Lovi</p>
      <button style={s.btn} onClick={() => navigate("/")}>На главную</button>
    </div>
  )

  return (
    <div style={s.page}>
      <h2 style={{...s.title, color:"#F97316"}}>Ошибка подключения</h2>
      <p style={s.sub}>Попробуйте снова через маркетплейс YCLIENTS</p>
    </div>
  )
}
