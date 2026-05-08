import { useEffect, useState } from "react"
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

const DISCOUNT_PRESETS = [
  { id: "soft",       label: "Мягкая",       sub: "до 20% за час",   coeff_hot: 0.82, coeff_near: 0.90, coeff_far: 0.96 },
  { id: "balanced",   label: "Сбалансированная", sub: "до 35% за час", coeff_hot: 0.65, coeff_near: 0.80, coeff_far: 0.92 },
  { id: "aggressive", label: "Агрессивная",   sub: "до 45% за час",   coeff_hot: 0.55, coeff_near: 0.72, coeff_far: 0.90 },
]

const HORIZON_PRESETS = [
  { id: "today",    label: "Только день в день", threshold_far: 1,  threshold_near: 1 },
  { id: "3days",    label: "До 3 дней",          threshold_far: 72, threshold_near: 1 },
]

// ── Strategy Drawer ────────────────────────────────────────────────────────

function StrategyDrawer({ open, onClose, services, token, onSaved }) {
  const [discount, setDiscount]   = useState("balanced")
  const [horizon, setHorizon]     = useState("today")
  const [checked, setChecked]     = useState({})
  const [saving, setSaving]       = useState(false)
  const isMobile                  = window.innerWidth < 768

  useEffect(() => {
    if (!open) return
    const init = {}
    services.forEach(s => { init[s.service_id] = s.status === "published" })
    setChecked(init)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open, services])

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!open) return null

  const discPreset  = DISCOUNT_PRESETS.find(p => p.id === discount)  || DISCOUNT_PRESETS[1]
  const horizPreset = HORIZON_PRESETS.find(p => p.id === horizon)    || HORIZON_PRESETS[0]
  const maxDisc     = Math.round((1 - discPreset.coeff_hot) * 100)

  async function apply() {
    setSaving(true)
    await Promise.all(services.map(svc =>
      fetch(`${API}/api/lovi/strategies/${svc.service_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          company_id:     svc.company_id,
          threshold_far:  horizPreset.threshold_far,
          threshold_near: horizPreset.threshold_near,
          coeff_far:      discPreset.coeff_far,
          coeff_near:     discPreset.coeff_near,
          coeff_hot:      discPreset.coeff_hot,
          status:         checked[svc.service_id] ? "published" : "draft",
        })
      })
    ))
    setSaving(false)
    onSaved()
    onClose()
  }

  const drawerStyle = isMobile ? {
    position:"fixed", bottom:0, left:0, right:0, zIndex:1000,
    background:"#fff", borderRadius:"20px 20px 0 0",
    padding:"24px 20px 40px", maxHeight:"90vh", overflowY:"auto",
    animation:"slideUp 0.3s cubic-bezier(0.2,1,0.2,1)",
  } : {
    position:"fixed", top:0, right:0, bottom:0, zIndex:1000,
    background:"#fff", width:480,
    padding:"32px 32px 40px", overflowY:"auto",
    animation:"slideRight 0.3s cubic-bezier(0.2,1,0.2,1)",
    boxShadow:"-8px 0 40px rgba(18,26,18,0.08)",
  }

  const publishedCount = Object.values(checked).filter(Boolean).length

  return (
    <>
      <div onMouseDown={onClose}
        style={{position:"fixed",inset:0,background:"rgba(18,26,18,0.4)",zIndex:999,
          animation:"fadeIn 0.2s"}} />
      <div style={drawerStyle}>
        {/* Handle мобайл */}
        {isMobile && (
          <div style={{width:36,height:4,borderRadius:2,background:"rgba(18,26,18,0.12)",
            margin:"0 auto 24px"}} />
        )}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div>
            <div style={{fontSize:11,color:"#8F8475",textTransform:"uppercase",
              letterSpacing:"0.08em",marginBottom:4}}>Настройка</div>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:22,color:"#121A12"}}>
              Стратегия скидок
            </div>
          </div>
          <button onMouseDown={onClose}
            style={{background:"none",border:"none",fontSize:20,color:"#8F8475",cursor:"pointer",
              padding:"4px 8px",lineHeight:1}}>✕</button>
        </div>

        {/* Размер скидки */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:600,color:"#121A12",marginBottom:12}}>
            Максимальная скидка за час до слота
          </div>
          {DISCOUNT_PRESETS.map(p => (
            <div key={p.id} onMouseDown={() => setDiscount(p.id)}
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"12px 14px",marginBottom:6,borderRadius:12,cursor:"pointer",
                border:`1px solid ${discount === p.id ? "#121A12" : "rgba(18,26,18,0.08)"}`,
                background: discount === p.id ? "#121A12" : "#FDFCF9"}}>
              <div>
                <div style={{fontSize:13,fontWeight:500,
                  color: discount === p.id ? "#fff" : "#121A12"}}>{p.label}</div>
                <div style={{fontSize:11,color: discount === p.id ? "rgba(255,255,255,0.5)" : "#8F8475",
                  marginTop:2}}>{p.sub}</div>
              </div>
              {discount === p.id && (
                <div style={{fontSize:20,fontWeight:700,color:"#F97316"}}>до {maxDisc}%</div>
              )}
            </div>
          ))}
        </div>

        {/* Горизонт */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:600,color:"#121A12",marginBottom:12}}>
            Когда начинается скидка
          </div>
          <div style={{display:"flex",gap:8}}>
            {HORIZON_PRESETS.map(p => (
              <div key={p.id} onMouseDown={() => setHorizon(p.id)}
                style={{flex:1,padding:"10px 12px",borderRadius:10,cursor:"pointer",textAlign:"center",
                  border:`1px solid ${horizon === p.id ? "#121A12" : "rgba(18,26,18,0.08)"}`,
                  background: horizon === p.id ? "#121A12" : "#FDFCF9"}}>
                <div style={{fontSize:12,fontWeight:500,
                  color: horizon === p.id ? "#fff" : "#121A12"}}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Услуги */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:600,color:"#121A12"}}>
              Публиковать на витрине
            </div>
            <button onMouseDown={() => {
              const allOn = Object.values(checked).every(Boolean)
              const next = {}
              services.forEach(s => { next[s.service_id] = !allOn })
              setChecked(next)
            }} style={{background:"none",border:"none",fontSize:11,color:"#F97316",cursor:"pointer",padding:0}}>
              {Object.values(checked).every(Boolean) ? "Снять все" : "Выбрать все"}
            </button>
          </div>

          {services.map(svc => (
            <div key={svc.service_id}
              onMouseDown={() => setChecked(prev => ({...prev, [svc.service_id]: !prev[svc.service_id]}))}
              style={{display:"flex",alignItems:"center",gap:10,
                padding:"10px 12px",marginBottom:4,borderRadius:10,cursor:"pointer",
                background: checked[svc.service_id] ? "rgba(22,163,74,0.04)" : "#FDFCF9",
                border:`1px solid ${checked[svc.service_id] ? "rgba(22,163,74,0.2)" : "rgba(18,26,18,0.06)"}`,
                opacity: checked[svc.service_id] ? 1 : 0.5}}>
              <div style={{width:16,height:16,borderRadius:4,flexShrink:0,
                background: checked[svc.service_id] ? "#121A12" : "transparent",
                border:`1.5px solid ${checked[svc.service_id] ? "#121A12" : "rgba(18,26,18,0.2)"}`,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {checked[svc.service_id] && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5l2.5 2.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,color:"#121A12",fontWeight:500,
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                  {svc.service_name || `Услуга ${svc.service_id}`}
                </div>
                <div style={{fontSize:10,color:"#8F8475",marginTop:1}}>
                  {STRATEGY_DESC[svc.strategy_name] || svc.strategy_name} · {CAT_LABELS[svc.category] || svc.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button disabled={saving} onMouseDown={apply}
          style={{width:"100%",background:"#F97316",color:"#fff",border:"none",
            borderRadius:12,padding:"16px",fontSize:15,fontWeight:600,cursor:"pointer"}}>
          {saving ? "Сохраняем..." : `Применить · ${publishedCount} услуг на витрине`}
        </button>
      </div>

      <style>{`
        @keyframes slideUp    { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes fadeIn     { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function SalonDashboard() {
  const [salon, setSalon]           = useState(null)
  const [services, setServices]     = useState([])
  const [syncing, setSyncing]       = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [error, setError]           = useState(false)
  const [dragging, setDragging]     = useState(null)
  const [dragOver, setDragOver]     = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
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
    const updated = list.map((s, i) => ({...s, display_order: i}))
    setServices(updated)
    setDragging(null)
    setDragOver(null)
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
    page:       { minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif", padding:"40px 24px" },
    wrap:       { maxWidth:800, margin:"0 auto" },
    card:       { background:"#fff", border:"1px solid rgba(18,26,18,0.08)", borderRadius:16, padding:24, marginBottom:16 },
    label:      { fontSize:11, color:"#8F8475", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 },
    value:      { fontSize:16, color:"#121A12", margin:0 },
    badge:      { display:"inline-block", background:"#dcfce7", color:"#16a34a", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:500 },
    badgeOff:   { display:"inline-block", background:"#fee2e2", color:"#dc2626", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:500 },
    grid:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
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

  const byCategory = {}
  for (const svc of services) {
    const cat = svc.category || "other"
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(svc)
  }
  const allCats     = Object.keys(CAT_LABELS)
  const otherCats   = Object.keys(byCategory).filter(c => !allCats.includes(c))
  const orderedCats = [...allCats.filter(c => byCategory[c]), ...otherCats]
  const publishedCount = services.filter(s => s.status === "published").length

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32}}>
          <h1 style={{fontFamily:"Playfair Display,serif", fontSize:28, color:"#121A12", margin:0}}>
            {salon.salon_name || salon.title}
          </h1>
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
            <div style={{marginTop:16, paddingTop:16, borderTop:"1px solid rgba(18,26,18,0.06)"}}>
              <div style={s.label}>Последняя проверка</div>
              <p style={{...s.value, fontSize:13, color:"#8F8475"}}>
                {new Date(salon.last_sync_at).toLocaleString("ru-RU")}
              </p>
            </div>
          )}
          {salon.token_status === "no_token" && (
            <div style={{marginTop:16, padding:"12px 16px", background:"#fef9c3", borderRadius:10, fontSize:13, color:"#854d0e", lineHeight:1.5}}>
              Переподключите салон через маркетплейс YCLIENTS.{" "}
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
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4}}>
            <div>
              <div style={{fontSize:15, fontWeight:600, color:"#121A12"}}>Услуги на витрине</div>
              <div style={{fontSize:12, color:"#8F8475", marginTop:2}}>
                Перетащите для изменения порядка · меняйте категорию через меню
              </div>
            </div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}>
              {syncResult && <span style={{fontSize:12, color:"#16a34a"}}>+{syncResult.added} новых</span>}
              <button style={s.btnPrimary} disabled={syncing} onClick={syncServices}>
                {syncing ? "Синхронизация..." : "Обновить из YCLIENTS"}
              </button>
            </div>
          </div>

          {/* Кнопка стратегии */}
          <div style={{display:"flex", justifyContent:"flex-end", marginBottom:16, marginTop:8}}>
            <button style={s.btnGhost} onClick={() => setDrawerOpen(true)}>
              Изменить стратегию
            </button>
          </div>

          {orderedCats.map(cat => (
            <div key={cat} style={{marginBottom:24}}>
              <div style={{fontSize:12, fontWeight:600, color:"#121A12", letterSpacing:"0.06em",
                textTransform:"uppercase", marginBottom:10, paddingBottom:8,
                borderBottom:"1px solid rgba(18,26,18,0.06)"}}>
                {CAT_LABELS[cat] || cat}
                <span style={{fontWeight:400, color:"#8F8475", marginLeft:8,
                  textTransform:"none", letterSpacing:0, fontSize:11}}>
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
                    border:`1px solid ${dragOver === svc.service_id ? "rgba(249,115,22,0.3)" : "rgba(18,26,18,0.06)"}`,
                    cursor:"grab", transition:"all 0.15s",
                    opacity: dragging === svc.service_id ? 0.5 : 1,
                  }}>

                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0, opacity:0.3}}>
                    <circle cx="4" cy="3" r="1.2" fill="#121A12"/>
                    <circle cx="4" cy="7" r="1.2" fill="#121A12"/>
                    <circle cx="4" cy="11" r="1.2" fill="#121A12"/>
                    <circle cx="10" cy="3" r="1.2" fill="#121A12"/>
                    <circle cx="10" cy="7" r="1.2" fill="#121A12"/>
                    <circle cx="10" cy="11" r="1.2" fill="#121A12"/>
                  </svg>

                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13, color:"#121A12", fontWeight:500,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                      {svc.service_name || `Услуга ${svc.service_id}`}
                    </div>
                    <div style={{fontSize:11, color:"#8F8475", marginTop:2}}>
                      {STRATEGY_DESC[svc.strategy_name] || svc.strategy_name}
                    </div>
                  </div>

                  <select value={svc.category || ""} onChange={e => moveToCategory(svc.service_id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    style={{fontSize:11, color:"#8F8475", border:"1px solid rgba(18,26,18,0.1)",
                      borderRadius:6, padding:"4px 6px", background:"#fff", cursor:"pointer"}}>
                    {Object.entries(CAT_LABELS).map(([k,v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>

                  <div onClick={() => toggleStatus(svc)}
                    style={{width:36, height:20, borderRadius:10, cursor:"pointer",
                      background: svc.status === "published" ? "#16a34a" : "rgba(18,26,18,0.12)",
                      position:"relative", transition:"background 0.2s", flexShrink:0}}>
                    <div style={{position:"absolute", top:3, borderRadius:"50%",
                      width:14, height:14, background:"#fff",
                      left: svc.status === "published" ? 19 : 3,
                      transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>

      <StrategyDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        services={services}
        token={token}
        onSaved={loadServices}
      />
    </div>
  )
}