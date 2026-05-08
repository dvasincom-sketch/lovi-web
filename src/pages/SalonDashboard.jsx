import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

const CAT_LABELS = {
  head: "Голова",
  spa:  "SPA",
  back: "Массаж",
  neck: "Шея",
  body: "Всё тело",
}

const STRATEGY_DESC = {
  premium: "Премиальная",
  popular: "Популярная",
  step:    "Стандартная",
  custom:  "Кастом",
}

export default function SalonDashboard() {
  const [salon, setSalon]         = useState(null)
  const [services, setServices]   = useState([])
  const [syncing, setSyncing]     = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [error, setError]         = useState(false)
  const [dragging, setDragging]   = useState(null)   // service_id
  const [dragOver, setDragOver]   = useState(null)   // service_id
  const navigate = useNavigate()
  const token = localStorage.getItem("salon_token")

  useEffect(() => {
    if (!token) { navigate("/"); return }
    fetch(`${API}/api/lovi/salon/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSalon)
      .catch(() => setError(true))

    loadServices()
  }, [])

  function loadServices() {
    fetch(`${API}/api/lovi/strategies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        const list = (d.strategies || []).sort((a, b) => a.display_order - b.display_order)
        setServices(list)
      })
  }

  async function syncServices() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const r = await fetch(`${API}/api/lovi/sync-services`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      const d = await r.json()
      setSyncResult(d)
      loadServices()
    } finally {
      setSyncing(false)
    }
  }

  async function toggleStatus(svc) {
    const newStatus = svc.status === "published" ? "draft" : "published"
    setServices(prev => prev.map(s => s.service_id === svc.service_id ? {...s, status: newStatus} : s))
    await fetch(`${API}/api/lovi/strategies/${svc.service_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ company_id: svc.company_id, status: newStatus })
    })
  }

  async function moveToCategory(service_id, newCategory) {
    setServices(prev => prev.map(s => s.service_id === service_id ? {...s, category: newCategory} : s))
    const svc = services.find(s => s.service_id === service_id)
    await fetch(`${API}/api/lovi/strategies/${service_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ company_id: svc.company_id, category: newCategory })
    })
  }

  // Drag-and-drop handlers
  function onDragStart(e, service_id) {
    setDragging(service_id)
    e.dataTransfer.effectAllowed = "move"
  }

  function onDragOver(e, service_id) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(service_id)
  }

  async function onDrop(e, targetId) {
    e.preventDefault()
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }

    const list = [...services]
    const fromIdx = list.findIndex(s => s.service_id === dragging)
    const toIdx   = list.findIndex(s => s.service_id === targetId)
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)

    // Обновляем display_order
    const updated = list.map((s, i) => ({...s, display_order: i}))
    setServices(updated)
    setDragging(null)
    setDragOver(null)

    // Сохраняем порядок
    await Promise.all(updated.map(s =>
      fetch(`${API}/api/lovi/strategies/${s.service_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company_id: s.company_id, display_order: s.display_order })
      })
    ))
  }

  function logout() {
    localStorage.removeItem("salon_token")
    localStorage.removeItem("salon")
    navigate("/")
  }

  const s = {
    page:    { minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", padding:"40px 24px" },
    wrap:    { maxWidth:800, margin:"0 auto" },
    header:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 },
    title:   { fontFamily:"Playfair Display, serif", fontSize:28, color:"#121A12", margin:0 },
    card:    { background:"#fff", border:"1px solid rgba(18,26,18,0.08)", borderRadius:16, padding:24, marginBottom:16 },
    label:   { fontSize:11, color:"#8F8475", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 },
    value:   { fontSize:16, color:"#121A12", margin:0 },
    badge:   { display:"inline-block", background:"#dcfce7", color:"#16a34a", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:500 },
    badgeOff:{ display:"inline-block", background:"#fee2e2", color:"#dc2626", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:500 },
    grid:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
    btnPrimary: { background:"#F97316", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer" },
    btnGhost:   { background:"none", border:"1px solid rgba(18,26,18,0.15)", borderRadius:8, padding:"8px 16px", fontSize:13, color:"#8F8475", cursor:"pointer" },
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

  // Группируем по категории
  const byCategory = {}
  for (const svc of services) {
    const cat = svc.category || "other"
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(svc)
  }
  const allCats = Object.keys(CAT_LABELS)
  const otherCats = Object.keys(byCategory).filter(c => !allCats.includes(c))
  const orderedCats = [...allCats.filter(c => byCategory[c]), ...otherCats]

  const publishedCount = services.filter(s => s.status === "published").length

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <div style={s.header}>
          <h1 style={s.title}>{salon.salon_name || salon.title}</h1>
          <button style={s.btnGhost} onClick={logout}>Выйти</button>
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
              {salon.token_status === "ok"        && <span style={s.badge}>Работает</span>}
              {salon.token_status === "error"     && <span style={s.badgeOff}>Ошибка</span>}
              {salon.token_status === "no_access" && <span style={s.badgeOff}>Нет прав</span>}
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
            <div style={{marginTop:16, paddingTop:16, borderTop:"1px solid rgba(18,26,18,0.06)",
              display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={s.label}>Последняя проверка</div>
                <p style={{...s.value, fontSize:13, color:"#8F8475"}}>
                  {new Date(salon.last_sync_at).toLocaleString("ru-RU")}
                </p>
              </div>
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
              Не удаётся получить расписание.{" "}
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
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div style={s.label}>Витрина Lovi</div>
              <a href="https://lovi.today" target="_blank" rel="noreferrer"
                style={{color:"#F97316", fontSize:15, textDecoration:"none"}}>
                lovi.today →
              </a>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={s.label}>Опубликовано</div>
              <div style={{fontSize:22, fontWeight:700, color:"#121A12"}}>{publishedCount}</div>
              <div style={{fontSize:11, color:"#8F8475"}}>из {services.length} услуг</div>
            </div>
          </div>
        </div>

        {/* Услуги */}
        <div style={s.card}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
            <div>
              <div style={{fontSize:15, fontWeight:600, color:"#121A12"}}>Услуги на витрине</div>
              <div style={{fontSize:12, color:"#8F8475", marginTop:2}}>
                Перетащите для изменения порядка. Переключите категорию через меню.
              </div>
            </div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}>
              {syncResult && (
                <span style={{fontSize:12, color:"#16a34a"}}>
                  +{syncResult.added} новых
                </span>
              )}
              <button style={s.btnPrimary} disabled={syncing} onClick={syncServices}>
                {syncing ? "Синхронизация..." : "Обновить из YCLIENTS"}
              </button>
            </div>
          </div>

          <div style={{marginBottom:8, display:"flex", gap:8, justifyContent:"flex-end"}}>
            <button style={{...s.btnGhost, fontSize:12, padding:"6px 14px"}}
              onClick={() => navigate("/salon/onboarding")}>
              Изменить стратегию
            </button>
          </div>

          {orderedCats.map(cat => (
            <div key={cat} style={{marginBottom:24}}>
              <div style={{fontSize:12, fontWeight:600, color:"#121A12", letterSpacing:"0.06em",
                textTransform:"uppercase", marginBottom:10, paddingBottom:8,
                borderBottom:"1px solid rgba(18,26,18,0.06)"}}>
                {CAT_LABELS[cat] || cat}
                <span style={{fontWeight:400, color:"#8F8475", marginLeft:8, textTransform:"none", letterSpacing:0}}>
                  {byCategory[cat]?.filter(s => s.status === "published").length} опубл.
                </span>
              </div>

              {(byCategory[cat] || []).map(svc => (
                <div key={svc.service_id}
                  draggable
                  onDragStart={e => onDragStart(e, svc.service_id)}
                  onDragOver={e => onDragOver(e, svc.service_id)}
                  onDrop={e => onDrop(e, svc.service_id)}
                  onDragEnd={() => { setDragging(null); setDragOver(null) }}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 14px", marginBottom:6, borderRadius:12,
                    background: dragging === svc.service_id ? "rgba(249,115,22,0.04)"
                              : dragOver === svc.service_id ? "rgba(249,115,22,0.08)" : "#FDFCF9",
                    border: `1px solid ${dragOver === svc.service_id ? "rgba(249,115,22,0.3)" : "rgba(18,26,18,0.06)"}`,
                    cursor:"grab", transition:"all 0.15s",
                    opacity: dragging === svc.service_id ? 0.5 : 1,
                  }}>

                  {/* Drag handle */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0, opacity:0.3}}>
                    <circle cx="4" cy="3" r="1.2" fill="#121A12"/>
                    <circle cx="4" cy="7" r="1.2" fill="#121A12"/>
                    <circle cx="4" cy="11" r="1.2" fill="#121A12"/>
                    <circle cx="10" cy="3" r="1.2" fill="#121A12"/>
                    <circle cx="10" cy="7" r="1.2" fill="#121A12"/>
                    <circle cx="10" cy="11" r="1.2" fill="#121A12"/>
                  </svg>

                  {/* Название */}
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13, color:"#121A12", fontWeight:500,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                      {svc.service_name || `Услуга ${svc.service_id}`}
                    </div>
                    <div style={{fontSize:11, color:"#8F8475", marginTop:2}}>
                      {STRATEGY_DESC[svc.strategy_name] || svc.strategy_name}
                    </div>
                  </div>

                  {/* Смена категории */}
                  <select
                    value={svc.category || ""}
                    onChange={e => moveToCategory(svc.service_id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    style={{fontSize:11, color:"#8F8475", border:"1px solid rgba(18,26,18,0.1)",
                      borderRadius:6, padding:"4px 6px", background:"#fff", cursor:"pointer"}}>
                    {Object.entries(CAT_LABELS).map(([k,v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>

                  {/* Переключатель published/draft */}
                  <div onClick={() => toggleStatus(svc)}
                    style={{
                      width:36, height:20, borderRadius:10, cursor:"pointer",
                      background: svc.status === "published" ? "#16a34a" : "rgba(18,26,18,0.12)",
                      position:"relative", transition:"background 0.2s", flexShrink:0,
                    }}>
                    <div style={{
                      position:"absolute", top:3, borderRadius:"50%",
                      width:14, height:14, background:"#fff",
                      left: svc.status === "published" ? 19 : 3,
                      transition:"left 0.2s",
                      boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}