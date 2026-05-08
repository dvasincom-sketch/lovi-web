import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

export default function Connect() {
  const [status, setStatus] = useState("loading")
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const salon_id = params.get("salon_id")
    const user_data = params.get("user_data")

    let user_info = {}
    try {
      const bin = atob(user_data.replace(/-/g,'+').replace(/_/g,'/'))
      const bytes = new Uint8Array([...bin].map(c => c.charCodeAt(0)))
      user_info = JSON.parse(new TextDecoder("utf-8").decode(bytes))
    } catch(e) {}

    if (!salon_id) { setStatus("error"); return }

    fetch(`${API}/api/lovi/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salon_id, user_info }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.token) {
          localStorage.setItem("salon_token", d.token)
          localStorage.setItem("salon", JSON.stringify(d.salon))
          navigate("/salon/dashboard")
        } else {
          setStatus("error")
        }
      })
      .catch(() => setStatus("error"))
  }, [])

  const s = {
    page: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            height:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", gap:16 },
    sub: { color:"#8F8475", fontSize:15, margin:0 },
  }

  if (status === "loading") return (
    <div style={s.page}><p style={s.sub}>Подключаем салон...</p></div>
  )

  return (
    <div style={s.page}>
      <p style={{...s.sub, color:"#F97316"}}>Ошибка подключения. Попробуйте снова.</p>
    </div>
  )
}
