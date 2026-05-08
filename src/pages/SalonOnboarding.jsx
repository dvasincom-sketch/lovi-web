import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

const DISCOUNT_MAP = {
  "20-30": { coeff_hot: 0.75, coeff_near: 0.85, coeff_far: 0.95, label: "до 30%" },
  "30-40": { coeff_hot: 0.65, coeff_near: 0.80, coeff_far: 0.92, label: "до 35%" },
  "40-50": { coeff_hot: 0.55, coeff_near: 0.72, coeff_far: 0.90, label: "до 45%" },
  "50+":   { coeff_hot: 0.45, coeff_near: 0.65, coeff_far: 0.88, label: "более 50%" },
}

const HORIZON_MAP = {
  "yes-big":  { threshold_far: 72, threshold_near: 1, label: "за 3 дня" },
  "yes-small":{ threshold_far: 72, threshold_near: 1, label: "за 3 дня, небольшая скидка" },
  "no":       { threshold_far: 1,  threshold_near: 1, label: "только день в день" },
}

const PRIORITY_MAP = {
  "expensive": "Дорогие услуги показываются первыми",
  "cheap":     "Доступные услуги показываются первыми",
  "all":       "Все услуги показываются одинаково",
}

const QUESTIONS = [
  {
    id: "priority",
    title: "Какие услуги продвигать в первую очередь?",
    hint: "Влияет на порядок показа в витрине Lovi — какие окошки клиент увидит первыми",
    options: [
      { value: "expensive", label: "Самые дорогие", sub: "увеличение среднего чека" },
      { value: "cheap",     label: "Самые доступные", sub: "рост загрузки и числа клиентов" },
      { value: "all",       label: "Все одинаково", sub: "равномерное заполнение" },
    ]
  },
  {
    id: "discount",
    title: "На сколько готовы снизить цену если запись за час до начала?",
    hint: "Это максимальная скидка которую увидит клиент на витрине. Чем больше скидка — тем выше вероятность что горящий слот забронируют",
    options: [
      { value: "20-30", label: "До 30%", sub: "мягко, сохраняем ценность услуги" },
      { value: "30-40", label: "До 35%", sub: "баланс между загрузкой и выручкой" },
      { value: "40-50", label: "До 45%", sub: "агрессивно, максимум броней" },
      { value: "50+",   label: "Более 50%", sub: "лучше не терять слот совсем" },
    ]
  },
  {
    id: "horizon",
    title: "Давать скидки на слоты через 2–3 дня?",
    hint: "Главная сила Lovi — горящие окошки в ближайшие часы. Скидки заранее — дополнительный инструмент для заполнения расписания",
    options: [
      { value: "yes-big",   label: "Да", sub: "небольшая скидка начинается за 3 дня" },
      { value: "no",        label: "Нет, только день в день", sub: "скидки только на горящие окошки" },
    ]
  },
]

export default function SalonOnboarding() {
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState({})
  const [services, setServices] = useState([])
  const [checked, setChecked]   = useState({})
  const [saving, setSaving]     = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem("salon_token")

  useEffect(() => {
    if (!token) { navigate("/"); return }
    fetch(`${API}/api/lovi/strategies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        const list = d.strategies || []
        setServices(list)
        const init = {}
        list.forEach(s => { init[s.service_id] = true })
        setChecked(init)
      })
  }, [])

  function answer(qid, value) {
    const next = { ...answers, [qid]: value }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setStep(QUESTIONS.length)
    }
  }

  function calcParams(serviceRow) {
    const disc  = DISCOUNT_MAP[answers.discount]  || DISCOUNT_MAP["30-40"]
    const horiz = HORIZON_MAP[answers.horizon]    || HORIZON_MAP["no"]
    return {
      threshold_far:  horiz.threshold_far,
      threshold_near: horiz.threshold_near,
      coeff_far:      disc.coeff_far,
      coeff_near:     disc.coeff_near,
      coeff_hot:      disc.coeff_hot,
      strategy_name:  serviceRow.strategy_name,
    }
  }

  function discountLabel(coeff_hot) {
    return Math.round((1 - coeff_hot) * 100) + "%"
  }

  // Человекочитаемое описание типа стратегии
  function strategyDesc(name) {
    if (name === "premium") return "Премиальная программа"
    if (name === "popular") return "Популярная услуга"
    return "Стандартная услуга"
  }

  async function applyStrategies() {
    setSaving(true)
    const all = services.map(s => {
      const params = calcParams(s)
      return fetch(`${API}/api/lovi/strategies/${s.service_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          company_id: s.company_id,
          ...params,
          status: checked[s.service_id] ? "published" : "draft",
        })
      })
    })
    await Promise.all(all)
    setSaving(false)
    setStep(4)
  }

  const s = {
    page:    { minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif",
               display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"60px 24px" },
    wrap:    { width:"100%", maxWidth:560 },
    back:    { background:"none", border:"none", color:"#8F8475", fontSize:13, cursor:"pointer",
               padding:0, marginBottom:32, display:"flex", alignItems:"center", gap:6 },
    eyebrow: { fontSize:11, color:"#8F8475", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 },
    title:   { fontFamily:"Playfair Display, serif", fontSize:26, color:"#121A12", margin:"0 0 8px" },
    hint:    { fontSize:13, color:"#8F8475", margin:"0 0 32px", lineHeight:1.6 },
    option:  { width:"100%", textAlign:"left", background:"#fff", border:"1px solid rgba(18,26,18,0.1)",
               borderRadius:14, padding:"16px 20px", marginBottom:10, cursor:"pointer",
               transition:"all 0.15s", display:"flex", justifyContent:"space-between", alignItems:"center" },
    progress:{ display:"flex", gap:6, marginBottom:40 },
    dot:     { height:3, borderRadius:2, flex:1, background:"rgba(18,26,18,0.1)" },
    dotActive:{ height:3, borderRadius:2, flex:1, background:"#121A12" },
    card:    { background:"#fff", border:"1px solid rgba(18,26,18,0.08)", borderRadius:16,
               padding:"16px 20px", marginBottom:8 },
    btnPrimary:  { width:"100%", background:"#F97316", color:"#fff", border:"none", borderRadius:12,
                   padding:"16px", fontSize:15, fontWeight:600, cursor:"pointer", marginTop:8 },
    btnSecondary:{ width:"100%", background:"none", border:"1px solid rgba(18,26,18,0.15)",
                   color:"#8F8475", borderRadius:12, padding:"14px", fontSize:14,
                   cursor:"pointer", marginTop:8 },
    check:   { width:18, height:18, accentColor:"#121A12", cursor:"pointer", flexShrink:0 },
  }

  // ── Вопросы ───────────────────────────────────────────────────────────────
  if (step < QUESTIONS.length) {
    const q = QUESTIONS[step]
    return (
      <div style={s.page}>
        <div style={s.wrap}>
          {step > 0 && (
            <button style={s.back} onClick={() => setStep(step - 1)}>← Назад</button>
          )}
          <div style={s.progress}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={i <= step ? s.dotActive : s.dot} />
            ))}
          </div>
          <div style={s.eyebrow}>Настройка стратегии · {step + 1} из {QUESTIONS.length}</div>
          <h1 style={s.title}>{q.title}</h1>
          <p style={s.hint}>{q.hint}</p>
          {q.options.map(opt => (
            <button key={opt.value} style={s.option}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#F97316"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(18,26,18,0.1)"}
              onClick={() => answer(q.id, opt.value)}>
              <div>
                <div style={{fontSize:15, color:"#121A12", fontWeight:500}}>{opt.label}</div>
                <div style={{fontSize:12, color:"#8F8475", marginTop:2}}>{opt.sub}</div>
              </div>
              <div style={{color:"rgba(18,26,18,0.2)", fontSize:18}}>→</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Результат ─────────────────────────────────────────────────────────────
  if (step === QUESTIONS.length) {
    const disc  = DISCOUNT_MAP[answers.discount]  || DISCOUNT_MAP["30-40"]
    const horiz = HORIZON_MAP[answers.horizon]    || HORIZON_MAP["no"]
    const maxDisc = Math.round((1 - disc.coeff_hot) * 100)

    return (
      <div style={s.page}>
        <div style={s.wrap}>
          <button style={s.back} onClick={() => setStep(QUESTIONS.length - 1)}>← Назад</button>

          <div style={s.eyebrow}>Ваша стратегия</div>
          <h1 style={s.title}>Вот что получилось</h1>

          {/* Итог */}
          <div style={{background:"#121A12", borderRadius:16, padding:24, marginBottom:8, color:"#fff"}}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
              <div>
                <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:4}}>Скидка за час до слота</div>
                <div style={{fontSize:28, fontWeight:700, color:"#F97316"}}>до {maxDisc}%</div>
              </div>
              <div>
                <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:4}}>Когда начинается скидка</div>
                <div style={{fontSize:16, fontWeight:600}}>{horiz.label}</div>
              </div>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:16}}>
              <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
                letterSpacing:"0.08em", marginBottom:4}}>Порядок показа на витрине</div>
              <div style={{fontSize:14}}>{PRIORITY_MAP[answers.priority]}</div>
            </div>
          </div>

          {/* Пояснение */}
          <div style={{fontSize:12, color:"#8F8475", lineHeight:1.6, marginBottom:24,
            padding:"12px 16px", background:"rgba(18,26,18,0.03)", borderRadius:10}}>
            Цена снижается автоматически по мере приближения к слоту. За {horiz.label} клиент
            увидит небольшую скидку, а в последний час — максимальную {maxDisc}%.
          </div>

          {/* Услуги */}
          <div style={{fontSize:14, color:"#121A12", fontWeight:600, marginBottom:4}}>
            Выберите услуги для публикации
          </div>
          <div style={{fontSize:12, color:"#8F8475", marginBottom:16, lineHeight:1.5}}>
            Снятые с галочки сохранятся как черновик — опубликуете позже из кабинета.
          </div>

          <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
            <span style={{fontSize:12, color:"#8F8475"}}>
              Выбрано: {Object.values(checked).filter(Boolean).length} из {services.length}
            </span>
            <button style={{background:"none", border:"none", fontSize:12, color:"#F97316",
              cursor:"pointer", padding:0}}
              onClick={() => {
                const allChecked = Object.values(checked).every(Boolean)
                const next = {}
                services.forEach(sv => { next[sv.service_id] = !allChecked })
                setChecked(next)
              }}>
              {Object.values(checked).every(Boolean) ? "Снять все" : "Выбрать все"}
            </button>
          </div>

          {services.map(svc => {
            const params = calcParams(svc)
            const isOn = !!checked[svc.service_id]
            return (
              <div key={svc.service_id}
                style={{...s.card, opacity: isOn ? 1 : 0.45,
                  borderColor: isOn ? "rgba(18,26,18,0.12)" : "rgba(18,26,18,0.05)"}}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                  <input type="checkbox" style={s.check} checked={isOn}
                    onChange={e => setChecked(prev => ({...prev, [svc.service_id]: e.target.checked}))} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:14, color:"#121A12", fontWeight:500, marginBottom:4}}>
                      {svc.service_name || `Услуга ${svc.service_id}`}
                    </div>
                    <div style={{fontSize:12, color:"#8F8475"}}>
                      {strategyDesc(svc.strategy_name)} · скидка до {discountLabel(params.coeff_hot)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <button style={s.btnPrimary} disabled={saving} onClick={applyStrategies}>
            {saving ? "Применяем..." : `Опубликовать ${Object.values(checked).filter(Boolean).length} услуг`}
          </button>
          <button style={s.btnSecondary} onClick={() => navigate("/salon/dashboard")}>
            Сохранить черновик и выйти
          </button>
        </div>
      </div>
    )
  }

  // ── Успех ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={{textAlign:"center", padding:"40px 0"}}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{marginBottom:24}}>
            <circle cx="32" cy="32" r="32" fill="#dcfce7"/>
            <path d="M20 32l9 9 15-16" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{...s.title, textAlign:"center"}}>Стратегия применена</h1>
          <p style={{...s.hint, textAlign:"center"}}>
            Ваши услуги появятся на витрине Lovi в ближайшие минуты.
            По мере накопления данных Lovi будет предлагать скорректировать стратегию.
          </p>
          <button style={s.btnPrimary} onClick={() => navigate("/salon/dashboard")}>
            Перейти в кабинет
          </button>
        </div>
      </div>
    </div>
  )
}