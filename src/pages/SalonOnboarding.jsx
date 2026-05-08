import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://insalon.onrender.com"

// ── Маппинг ответов → коэффициенты ────────────────────────────────────────

const DISCOUNT_MAP = {
  "20-30": { coeff_hot: 0.75, coeff_near: 0.85, label: "до 30%" },
  "30-40": { coeff_hot: 0.65, coeff_near: 0.80, label: "до 40%" },
  "40-50": { coeff_hot: 0.55, coeff_near: 0.72, label: "до 50%" },
  "50+":   { coeff_hot: 0.45, coeff_near: 0.65, label: "более 50%" },
}

const HORIZON_MAP = {
  "yes-big":  { threshold_far: 72, coeff_far: 0.88, label: "за 3 дня" },
  "yes-small":{ threshold_far: 72, coeff_far: 0.95, label: "за 3 дня, скидка до 20%" },
  "no":       { threshold_far: 1,  coeff_far: 0.98, label: "только день в день" },
}

const PRIORITY_MAP = {
  "expensive": "Дорогие услуги в приоритете",
  "cheap":     "Доступные услуги в приоритете",
  "all":       "Все услуги одинаково",
}

const QUESTIONS = [
  {
    id: "priority",
    title: "Какие услуги хотите продвигать в первую очередь?",
    hint: "Это поможет нам выставить приоритет в витрине",
    options: [
      { value: "expensive", label: "Самые дорогие", sub: "увеличение среднего чека" },
      { value: "cheap",     label: "Самые доступные", sub: "рост загрузки и числа клиентов" },
      { value: "all",       label: "Все одинаково", sub: "равномерное заполнение" },
    ]
  },
  {
    id: "discount",
    title: "Максимальная скидка если запись за час до начала?",
    hint: "Клиент видит эту цену на витрине — это ваш главный инструмент привлечения",
    options: [
      { value: "20-30", label: "20–30%", sub: "мягко, сохраняем ценность" },
      { value: "30-40", label: "30–40%", sub: "баланс между загрузкой и выручкой" },
      { value: "40-50", label: "40–50%", sub: "агрессивно, максимум броней" },
      { value: "50+",   label: "Более 50%", sub: "лучше пустой слот не терять совсем" },
    ]
  },
  {
    id: "horizon",
    title: "Давать скидки на слоты через 2–3 дня?",
    hint: "Наша сила — горящие окошки в ближайшие часы. Скидки заранее — дополнительный инструмент",
    options: [
      { value: "yes-big",   label: "Да, до 50% заранее", sub: "максимальное заполнение на неделю" },
      { value: "yes-small", label: "Да, но до 20%", sub: "небольшой стимул записаться заранее" },
      { value: "no",        label: "Нет, только день в день", sub: "скидки только на горящие окошки" },
    ]
  },
]

function StrategyBadge({ name }) {
  const colors = {
    premium: { bg:"#fef9c3", color:"#854d0e" },
    popular: { bg:"#dcfce7", color:"#16a34a" },
    step:    { bg:"#e0f2fe", color:"#0369a1" },
    custom:  { bg:"#f3e8ff", color:"#7e22ce" },
  }
  const c = colors[name] || colors.custom
  return (
    <span style={{...c, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600}}>
      {name}
    </span>
  )
}

export default function SalonOnboarding() {
  const [step, setStep]         = useState(0)   // 0,1,2 = вопросы; 3 = результат; 4 = применено
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
        // По умолчанию все выбраны
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
      setStep(QUESTIONS.length) // переход к результату
    }
  }

  // Рассчитываем параметры стратегии из ответов
  function calcParams(serviceRow) {
    const disc = DISCOUNT_MAP[answers.discount] || DISCOUNT_MAP["30-40"]
    const horiz = HORIZON_MAP[answers.horizon] || HORIZON_MAP["no"]

    // Приоритет: дорогие услуги получают более агрессивную скидку
    let hotMult = 1
    if (answers.priority === "expensive" && serviceRow.strategy_name === "premium") hotMult = 0.97
    if (answers.priority === "cheap"     && serviceRow.strategy_name === "step")    hotMult = 0.97

    return {
      threshold_far:  horiz.threshold_far,
      threshold_near: 1,
      coeff_far:      horiz.coeff_far,
      coeff_near:     disc.coeff_near,
      coeff_hot:      Math.max(0.40, disc.coeff_hot * hotMult),
      strategy_name:  serviceRow.strategy_name,
      status:         "published",
    }
  }

  async function applyStrategies() {
    setSaving(true)
    const selected = services.filter(s => checked[s.service_id])
    const draft    = services.filter(s => !checked[s.service_id])

    await Promise.all([
      ...selected.map(s => fetch(`${API}/api/lovi/strategies/${s.service_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company_id: s.company_id, ...calcParams(s), status: "published" })
      })),
      ...draft.map(s => fetch(`${API}/api/lovi/strategies/${s.service_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company_id: s.company_id, ...calcParams(s), status: "draft" })
      })),
    ])

    setSaving(false)
    setStep(4)
  }

  const s = {
    page:   { minHeight:"100vh", background:"#FDFCF9", fontFamily:"Inter, sans-serif",
              display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"60px 24px" },
    wrap:   { width:"100%", maxWidth:560 },
    back:   { background:"none", border:"none", color:"#8F8475", fontSize:13, cursor:"pointer",
              padding:0, marginBottom:32, display:"flex", alignItems:"center", gap:6 },
    eyebrow:{ fontSize:11, color:"#8F8475", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 },
    title:  { fontFamily:"Playfair Display, serif", fontSize:26, color:"#121A12", margin:"0 0 8px" },
    hint:   { fontSize:13, color:"#8F8475", margin:"0 0 32px", lineHeight:1.6 },
    option: { width:"100%", textAlign:"left", background:"#fff", border:"1px solid rgba(18,26,18,0.1)",
              borderRadius:14, padding:"16px 20px", marginBottom:10, cursor:"pointer",
              transition:"all 0.15s", display:"flex", justifyContent:"space-between", alignItems:"center" },
    optLabel:{ fontSize:15, color:"#121A12", fontWeight:500 },
    optSub:  { fontSize:12, color:"#8F8475", marginTop:2 },
    progress:{ display:"flex", gap:6, marginBottom:40 },
    dot:     { height:3, borderRadius:2, flex:1, background:"rgba(18,26,18,0.1)" },
    dotActive:{ height:3, borderRadius:2, flex:1, background:"#121A12" },
    card:   { background:"#fff", border:"1px solid rgba(18,26,18,0.08)", borderRadius:16, padding:20, marginBottom:10 },
    btnPrimary:{ width:"100%", background:"#F97316", color:"#fff", border:"none", borderRadius:12,
                 padding:"16px", fontSize:15, fontWeight:600, cursor:"pointer", marginTop:8 },
    btnSecondary:{ width:"100%", background:"none", border:"1px solid rgba(18,26,18,0.15)",
                   color:"#8F8475", borderRadius:12, padding:"14px", fontSize:14,
                   cursor:"pointer", marginTop:8 },
    check:  { width:18, height:18, accentColor:"#121A12", cursor:"pointer", flexShrink:0 },
  }

  // ── Вопросы ───────────────────────────────────────────────────────────────
  if (step < QUESTIONS.length) {
    const q = QUESTIONS[step]
    return (
      <div style={s.page}>
        <div style={s.wrap}>
          {step > 0 && (
            <button style={s.back} onClick={() => setStep(step - 1)}>
              ← Назад
            </button>
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
                <div style={s.optLabel}>{opt.label}</div>
                <div style={s.optSub}>{opt.sub}</div>
              </div>
              <div style={{color:"rgba(18,26,18,0.2)", fontSize:18}}>→</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Результат + чекбоксы ──────────────────────────────────────────────────
  if (step === QUESTIONS.length) {
    const disc  = DISCOUNT_MAP[answers.discount]  || DISCOUNT_MAP["30-40"]
    const horiz = HORIZON_MAP[answers.horizon]    || HORIZON_MAP["no"]

    return (
      <div style={s.page}>
        <div style={s.wrap}>
          <button style={s.back} onClick={() => setStep(QUESTIONS.length - 1)}>← Назад</button>

          <div style={s.eyebrow}>Ваша стратегия</div>
          <h1 style={s.title}>Вот что получилось</h1>

          {/* Итог */}
          <div style={{background:"#121A12", borderRadius:16, padding:24, marginBottom:24, color:"#fff"}}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
              <div>
                <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:4}}>Скидка за час</div>
                <div style={{fontSize:24, fontWeight:700, color:"#F97316"}}>
                  {Math.round((1 - (DISCOUNT_MAP[answers.discount]?.coeff_hot || 0.65)) * 100)}%
                </div>
              </div>
              <div>
                <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:4}}>Горизонт скидок</div>
                <div style={{fontSize:16, fontWeight:600}}>{horiz.label}</div>
              </div>
            </div>
            <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
              letterSpacing:"0.08em", marginBottom:4}}>Приоритет</div>
            <div style={{fontSize:14}}>{PRIORITY_MAP[answers.priority]}</div>
          </div>

          {/* Услуги с чекбоксами */}
          <div style={{fontSize:13, color:"#8F8475", marginBottom:16, lineHeight:1.6}}>
            Выберите услуги для публикации. Остальные сохранятся как черновик — вы сможете опубликовать их позже.
          </div>

          <div style={{marginBottom:8, display:"flex", justifyContent:"space-between"}}>
            <span style={{fontSize:12, color:"#8F8475"}}>
              Выбрано: {Object.values(checked).filter(Boolean).length} из {services.length}
            </span>
            <button style={{background:"none", border:"none", fontSize:12, color:"#F97316",
              cursor:"pointer", padding:0}}
              onClick={() => {
                const allChecked = Object.values(checked).every(Boolean)
                const next = {}
                services.forEach(s => { next[s.service_id] = !allChecked })
                setChecked(next)
              }}>
              {Object.values(checked).every(Boolean) ? "Снять все" : "Выбрать все"}
            </button>
          </div>

          {services.map(svc => {
            const params = calcParams(svc)
            const discPct = Math.round((1 - params.coeff_hot) * 100)
            return (
              <div key={svc.service_id} style={{...s.card,
                opacity: checked[svc.service_id] ? 1 : 0.5,
                borderColor: checked[svc.service_id] ? "rgba(18,26,18,0.12)" : "rgba(18,26,18,0.06)"}}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                  <input type="checkbox" style={s.check}
                    checked={!!checked[svc.service_id]}
                    onChange={e => setChecked(prev => ({...prev, [svc.service_id]: e.target.checked}))} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:14, color:"#121A12", fontWeight:500, marginBottom:4}}>
                      {svc.service_name || `Услуга ${svc.service_id}`}
                    </div>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <StrategyBadge name={svc.strategy_name} />
                      <span style={{fontSize:12, color:"#8F8475"}}>скидка до {discPct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <button style={s.btnPrimary} disabled={saving}
            onClick={applyStrategies}>
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
          <div style={{fontSize:48, marginBottom:24}}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#dcfce7"/>
              <path d="M20 32l9 9 15-16" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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