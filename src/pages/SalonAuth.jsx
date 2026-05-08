import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

export default function SalonAuth() {
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) { setError("Токен не найден"); return }

    fetch(`${API}/api/lovi/salon/auth?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.token) {
          localStorage.setItem("salon_token", d.token)
          localStorage.setItem("salon", JSON.stringify(d.salon))
          navigate("/salon/dashboard")
        } else {
          setError(d.detail || "Ссылка недействительна")
        }
      })
      .catch(() => setError("Ошибка сети"))
  }, [])

  const s = {
    page: { display:"flex", alignItems:"center", justifyContent:"center",
            minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif" },
    sub:  { color:"#8F8475", fontSize:15 },
    err:  { color:"#F97316", fontSize:15, textAlign:"center", padding:24 },
  }

  if (error) return (
    <div style={s.page}>
      <div style={s.err}>
        <p>{error}</p>
        <a href="/salon/login" style={{color:"#121A12", fontSize:13}}>Запросить новую ссылку</a>
      </div>
    </div>
  )

  return (
    <div style={s.page}><p style={s.sub}>Входим в кабинет...</p></div>
  )
}
