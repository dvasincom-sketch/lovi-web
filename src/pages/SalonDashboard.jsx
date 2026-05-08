import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

const STRATEGY_LABELS = {
  premium: "Premium",
  popular: "Популярное",
  step:    "Step",
  custom:  "Кастом",
}

const STRATEGY_COLORS = {
  premium: { bg:"#fef9c3", color:"#854d0e" },
  popular: { bg:"#dcfce7", color:"#16a34a" },
  step:    { bg:"#e0f2fe", color:"#0369a1" },
  custom:  { bg:"#f3e8ff", color:"#7e22ce" },
}

function fmt(v) { return (v * 100).toFixed(0) + "%" }

export default function SalonDashboard() {
  const [salon, setSalon]           = useState(null)
  const [strategies, setStrategies] = useState([])
  const [editing, setEditing]       = useState(null)   // service_id редактируемой строки
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("salon_token")
    if (!token) { navigate("/"); return }

    fetch(`${API}/api/lovi/salon/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSalon)
      .catch(() => setError(true))

    fetch(`${API}/api/lovi/strategies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setStrategies(d.strategies || []))
      .catch(() => {})
  }, [])

  function logout() {
    localStorage.removeItem("salon_token")
    localStorage.removeItem("salon")
    navigate("/")
  }

  function startEdit(svc_id) {
    setEditing(svc_id)
  }

  async function saveStrategy(row) {
    setSaving(true)
    const token = localStorage.getItem("salon_token")
    try {
      const res = await fetch(`${API}/api/lovi/strategies/${row.service_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          company_id:     row.company_id,
          threshold_far:  Number(row.threshold_far),
          threshold_near: Number(row.threshold_near),
          coeff_far:      Number(row.coeff_far),
          coeff_near:     Number(row.coeff_near),
          coeff_hot:      Number(row.coeff_hot),
          strategy_name:  row.strategy_name,
        })
      })
      const data = await res.json()
      if (data.ok) {
        setStrategies(prev => prev.map(s => s.service_id === row.service_id ? data.strategy : s))
        setEditing(null)
      }
    } finally {
      setSaving(false)
    }
  }

  function updateLocal(service_id, field, value) {
    setStrategies(prev => prev.map(s =>
      s.service_id === service_id ? { ...s, [field]: value } : s
    ))
  }

  const s = {
    page:    { minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", padding:"40px 24px" },
    wrap:    { maxWidth:800, margin:"0 auto" },
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
    input:   { border:"1px solid rgba(18,26,18,0.15)", borderRadius:8, padding:"6px 10px",
               fontSize:13, width:"72px", color:"#121A12", background:"#FDFCF9" },
    btnSave: { background:"#121A12", color:"#fff", border:"none", borderRadius:8,
               padding:"7px 16px", fontSize:13, cursor:"pointer" },
    btnEdit: { background:"none", border:"1px solid rgba(18,26,18,0.15)", borderRadius:8,
               padding:"6px 14px", fontSize:12, color:"#8F8475", cursor:"pointer" },
    btnCancel:{ background:"none", border:"none", fontSize:12, color:"#8F8475", cursor:"pointer", marginLeft:8 },
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

  // Группируем стратегии по category
  const byCategory = strategies.reduce((acc, row) => {
    const cat = row.category || "other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(row)
    return acc
  }, {})

  const CAT_LABELS = { head:"Голова", spa:"SPA", back:"Спина", neck:"Шея", body:"Всё тело", other:"Прочее" }

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
              {salon.token_status === "ok"       && <span style={s.badge}>Работает</span>}
              {salon.token_status === "error"    && <span style={s.badgeOff}>Ошибка</span>}
              {salon.token_status === "no_access"&& <span style={s.badgeOff}>Нет прав</span>}
              {(salon.token_status === "no_token"||salon.token_status === "unknown") && (
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
            <div style={{marginTop:16, paddingTop:16, borderTop:"1px solid rgba(18,26,18,0.06)",
              display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={s.label}>Последняя проверка</div>
                <p style={{...s.value, fontSize:13, color:"#8F8475"}}>
                  {new Date(salon.last_sync_at).toLocaleString("ru-RU")}
                </p>
              </div>
              <button onClick={()=>navigate("/salon/onboarding")}
                style={{background:"#F97316", color:"#fff", border:"none",
                borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer"}}>
                Настроить
              </button>
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
          {salon.token_status === "no_access" && (
            <div style={{marginTop:16, padding:"12px 16px", background:"#fee2e2", borderRadius:10, fontSize:13, color:"#dc2626", lineHeight:1.5}}>
              <strong>Нет прав на управление филиалом.</strong>{" "}
              <a href="https://yclients.com/e/mp_41940_lovi_goryaschie_okoshki_zapisi/" style={{color:"#dc2626", fontWeight:600}}>Активировать →</a>
            </div>
          )}
        </div>

        {/* Контакты */}
        <div style={s.card}>
          <div style={{...s.label, marginBottom:16}}>Владелец</div>
          <div style={s.grid}>
            <div><div style={s.label}>Имя</div><p style={s.value}>{salon.owner_name || "—"}</p></div>
            <div><div style={s.label}>Телефон</div><p style={s.value}>{salon.owner_phone || "—"}</p></div>
            <div><div style={s.label}>Email</div><p style={s.value}>{salon.owner_email || "—"}</p></div>
            <div><div style={s.label}>Город</div><p style={s.value}>{salon.city || "—"}</p></div>
          </div>
        </div>

        {/* Витрина */}
        <div style={s.card}>
          <div style={s.label}>Витрина Lovi</div>
          <a href="https://lovi.today" target="_blank" rel="noreferrer"
             style={{color:"#F97316", fontSize:15, textDecoration:"none"}}>
            lovi.today →
          </a>
        </div>

        {/* Стратегии скидок */}
        {strategies.length > 0 && (
          <div style={s.card}>
            <div style={{...s.label, marginBottom:4}}>Стратегии скидок</div>
            <p style={{fontSize:12, color:"#8F8475", marginBottom:20, marginTop:0}}>
              Цена автоматически снижается по мере приближения к слоту. Настройте пороги и коэффициенты для каждой услуги.
            </p>

            {Object.entries(byCategory).map(([cat, rows]) => (
              <div key={cat} style={{marginBottom:24}}>
                <div style={{fontSize:12, fontWeight:600, color:"#121A12", letterSpacing:"0.06em",
                  textTransform:"uppercase", marginBottom:12, paddingBottom:8,
                  borderBottom:"1px solid rgba(18,26,18,0.06)"}}>
                  {CAT_LABELS[cat] || cat}
                </div>

                {rows.map(row => {
                  const isEditing = editing === row.service_id
                  const sc = STRATEGY_COLORS[row.strategy_name] || STRATEGY_COLORS.custom
                  return (
                    <div key={row.service_id} style={{marginBottom:12, padding:"14px 16px",
                      background:"#FDFCF9", borderRadius:12, border:"1px solid rgba(18,26,18,0.06)"}}>

                      <div style={{display:"flex", justifyContent:"space-between",
                        alignItems:"flex-start", flexWrap:"wrap", gap:8}}>
                        <div>
                          <div style={{fontSize:14, color:"#121A12", fontWeight:500, marginBottom:4}}>
                            ID {row.service_id}
                          </div>
                          <span style={{...sc, borderRadius:20, padding:"3px 10px",
                            fontSize:11, fontWeight:600, display:"inline-block"}}>
                            {STRATEGY_LABELS[row.strategy_name] || row.strategy_name}
                          </span>
                        </div>

                        {!isEditing ? (
                          <div style={{display:"flex", alignItems:"center", gap:24, flexWrap:"wrap"}}>
                            <div style={{textAlign:"center"}}>
                              <div style={s.label}>Далеко (&gt;{row.threshold_far}ч)</div>
                              <div style={{fontSize:15, fontWeight:600, color:"#121A12"}}>{fmt(row.coeff_far)}</div>
                            </div>
                            <div style={{textAlign:"center"}}>
                              <div style={s.label}>Скоро (&gt;{row.threshold_near}ч)</div>
                              <div style={{fontSize:15, fontWeight:600, color:"#121A12"}}>{fmt(row.coeff_near)}</div>
                            </div>
                            <div style={{textAlign:"center"}}>
                              <div style={s.label}>Горящий</div>
                              <div style={{fontSize:15, fontWeight:600, color:"#F97316"}}>{fmt(row.coeff_hot)}</div>
                            </div>
                            <button style={s.btnEdit} onClick={() => startEdit(row.service_id)}>
                              Изменить
                            </button>
                          </div>
                        ) : (
                          <div style={{display:"flex", alignItems:"flex-end", gap:12, flexWrap:"wrap"}}>
                            <div>
                              <div style={s.label}>Порог далеко (ч)</div>
                              <input style={s.input} type="number" value={row.threshold_far}
                                onChange={e => updateLocal(row.service_id, "threshold_far", e.target.value)} />
                            </div>
                            <div>
                              <div style={s.label}>Порог скоро (ч)</div>
                              <input style={s.input} type="number" value={row.threshold_near}
                                onChange={e => updateLocal(row.service_id, "threshold_near", e.target.value)} />
                            </div>
                            <div>
                              <div style={s.label}>Коэфф. далеко</div>
                              <input style={s.input} type="number" step="0.01" value={row.coeff_far}
                                onChange={e => updateLocal(row.service_id, "coeff_far", e.target.value)} />
                            </div>
                            <div>
                              <div style={s.label}>Коэфф. скоро</div>
                              <input style={s.input} type="number" step="0.01" value={row.coeff_near}
                                onChange={e => updateLocal(row.service_id, "coeff_near", e.target.value)} />
                            </div>
                            <div>
                              <div style={s.label}>Коэфф. горящий</div>
                              <input style={s.input} type="number" step="0.01" value={row.coeff_hot}
                                onChange={e => updateLocal(row.service_id, "coeff_hot", e.target.value)} />
                            </div>
                            <div style={{display:"flex", alignItems:"center"}}>
                              <button style={s.btnSave} disabled={saving}
                                onClick={() => saveStrategy(row)}>
                                {saving ? "..." : "Сохранить"}
                              </button>
                              <button style={s.btnCancel} onClick={() => setEditing(null)}>
                                Отмена
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}