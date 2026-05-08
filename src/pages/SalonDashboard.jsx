import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

export default function SalonDashboard() {
  const [salon, setSalon] = useState(null)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("salon_token")
    if (!token) { navigate("/"); return }

    fetch(`${API}/api/lovi/salon/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSalon)
      .catch(() => setError(true))
  }, [])

  function logout() {
    localStorage.removeItem("salon_token")
    localStorage.removeItem("salon")
    navigate("/")
  }

  const s = {
    page:    { minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", padding:"40px 24px" },
    wrap:    { maxWidth:720, margin:"0 auto" },
    header:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 },
    title:   { fontFamily:"Playfair Display, serif", fontSize:28, color:"#121A12", margin:0 },
    logout:  { background:"none", border:"1px solid rgba(18,26,18,0.15)", borderRadius:8,
               padding:"8px 16px", fontSize:13, color:"#8F8475", cursor:"pointer" },
    card:    { background:"#fff", border:"1px solid rgba(18,26,18,0.08)", borderRadius:16,
               padding:24, marginBottom:16 },
    label:   { fontSize:11, color:"#8F8475", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 },
    value:   { fontSize:16, color:"#121A12", margin:0 },
    badge:   { display:"inline-block", background:"#dcfce7", color:"#16a34a", borderRadius:20,
               padding:"4px 12px", fontSize:12, fontWeight:500 },
    badgeOff:{ display:"inline-block", background:"#fee2e2", color:"#dc2626", borderRadius:20,
               padding:"4px 12px", fontSize:12, fontWeight:500 },
    grid:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
    row:     { marginBottom:16 },
  }

  if (error) return (
    <div style={{...s.page, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <p style={{color:"#F97316"}}>Сессия истекла. <a href="/" style={{color:"#121A12"}}>На главную</a></p>
    </div>
  )

  if (!salon) return (
    <div style={{...s.page, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <p style={{color:"#8F8475"}}>Загрузка...</p>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <div style={s.header}>
          <h1 style={s.title}>{salon.salon_name || salon.title}</h1>
          <button style={s.logout} onClick={logout}>Выйти</button>
        </div>

        {/* Статус */}
        <div style={s.card}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16}}>
            <div>
              <div style={s.label}>Подключение</div>
              <span style={salon.is_active ? s.badge : s.badgeOff}>
                {salon.is_active ? "Активно" : "Отключено"}
              </span>
            </div>
            <div>
              <div style={s.label}>Синхронизация</div>
              {salon.token_status === "ok" && <span style={s.badge}>Работает</span>}
              {salon.token_status === "error" && <span style={s.badgeOff}>Ошибка</span>}
              {(salon.token_status === "no_token" || salon.token_status === "unknown") && (
                <span style={{...s.badgeOff, background:"#fef9c3", color:"#854d0e"}}>Не настроено</span>
              )}
            </div>
            <div>
              <div style={s.label}>Подключён</div>
              <p style={{...s.value, fontSize:13}}>
                {new Date(salon.connected_at).toLocaleDateString("ru-RU", {day:"numeric",month:"long",year:"numeric"})}
              </p>
            </div>
          </div>
          {salon.last_sync_at && (
            <div style={{marginTop:16, paddingTop:16, borderTop:"1px solid rgba(18,26,18,0.06)"}}>
              <div style={s.label}>Последняя проверка</div>
              <p style={{...s.value, fontSize:13, color:"#8F8475"}}>
                {new Date(salon.last_sync_at).toLocaleString("ru-RU")}
              </p>
            </div>
          )}
          {salon.token_status === "no_token" && (
            <div style={{marginTop:16, padding:"12px 16px", background:"#fef9c3", borderRadius:10, fontSize:13, color:"#854d0e", lineHeight:1.5}}>
              Для синхронизации расписания необходимо переподключить салон через маркетплейс YCLIENTS.{" "}
              <a href="https://yclients.com/e/mp_41940_lovi_goryaschie_okoshki_zapisi/" style={{color:"#854d0e", fontWeight:600}}>Переподключить →</a>
            </div>
          )}
          {salon.token_status === "error" && (
            <div style={{marginTop:16, padding:"12px 16px", background:"#fee2e2", borderRadius:10, fontSize:13, color:"#dc2626", lineHeight:1.5}}>
              Не удаётся получить расписание. Возможно, токен YCLIENTS устарел.{" "}
              <a href="https://yclients.com/e/mp_41940_lovi_goryaschie_okoshki_zapisi/" style={{color:"#dc2626", fontWeight:600}}>Переподключить →</a>
            </div>
          )}
        </div>

        {/* Контакты */}
        <div style={s.card}>
          <div style={{...s.label, marginBottom:16}}>Владелец</div>
          <div style={s.grid}>
            <div>
              <div style={s.label}>Имя</div>
              <p style={s.value}>{salon.owner_name || "—"}</p>
            </div>
            <div>
              <div style={s.label}>Телефон</div>
              <p style={s.value}>{salon.owner_phone || "—"}</p>
            </div>
            <div>
              <div style={s.label}>Email</div>
              <p style={s.value}>{salon.owner_email || "—"}</p>
            </div>
            <div>
              <div style={s.label}>Город</div>
              <p style={s.value}>{salon.city || "—"}</p>
            </div>
          </div>
        </div>

        {/* Ссылка на витрину */}
        <div style={s.card}>
          <div style={s.label}>Витрина Lovi</div>
          <a href="https://lovi.today" target="_blank" rel="noreferrer"
             style={{color:"#F97316", fontSize:15, textDecoration:"none"}}>
            lovi.today →
          </a>
        </div>

      </div>
    </div>
  )
}
