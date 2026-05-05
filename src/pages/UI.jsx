import { useState } from 'react'

const Section = ({title, children}) => (
  <div style={{marginBottom:60}}>
    <div style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',
      color:'var(--secondary)',marginBottom:8,paddingBottom:12,
      borderBottom:'1px solid var(--border)'}}>
      {title}
    </div>
    <div style={{marginTop:24}}>{children}</div>
  </div>
)

const Row = ({gap=12,children,wrap=false}) => (
  <div style={{display:'flex',gap,alignItems:'flex-start',flexWrap:wrap?'wrap':'nowrap',marginBottom:16}}>
    {children}
  </div>
)

export default function UI() {
  const [pressed, setPressed] = useState(false)

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 40px 120px',background:'var(--bg)',minHeight:'100vh'}}>
      <div style={{marginBottom:60}}>
        <div style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--secondary)',marginBottom:8}}>
          Lovi Design System
        </div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:42,fontWeight:500,lineHeight:1.1,marginBottom:12}}>
          UI Kit
        </div>
        <div style={{fontSize:14,color:'var(--secondary)',maxWidth:480,lineHeight:1.7}}>
          Все компоненты интерфейса в одном месте. Используй как справочник при разработке новых экранов.
        </div>
      </div>

      {/* COLORS */}
      <Section title="Цвета / Colors">
        <Row gap={12} wrap>
          {[
            {name:'--bg',hex:'#FDFCF9',label:'Background'},
            {name:'--dark',hex:'#121A12',label:'Dark'},
            {name:'--accent',hex:'#F97316',label:'Accent / Lovi Orange'},
            {name:'--secondary',hex:'#8F8475',label:'Secondary / Muted'},
            {name:'--border',hex:'rgba(18,26,18,0.06)',label:'Border'},
          ].map(c=>(
            <div key={c.name} style={{width:160}}>
              <div style={{
                height:80,borderRadius:16,background:c.hex,
                border:'1px solid var(--border)',marginBottom:8
              }}/>
              <div style={{fontSize:12,fontWeight:500,color:'var(--dark)',marginBottom:2}}>{c.label}</div>
              <div style={{fontSize:11,color:'var(--secondary)',fontFamily:'monospace'}}>{c.hex}</div>
            </div>
          ))}
        </Row>
      </Section>

      {/* TYPOGRAPHY */}
      <Section title="Типографика / Typography">
        <div style={{fontFamily:'Playfair Display,serif',fontSize:52,fontWeight:500,
          lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:16}}>
          The Art of <em style={{color:'var(--accent)'}}>State.</em>
        </div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:32,fontWeight:500,marginBottom:12}}>
          Heading 2 — Гималайский дзен
        </div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:22,fontWeight:500,marginBottom:12}}>
          Heading 3 — SPA для двоих
        </div>
        <div style={{fontSize:15,lineHeight:1.7,color:'var(--dark)',marginBottom:8,maxWidth:560}}>
          Body — Система управления ликвидностью вашего времени. Интеллектуальный поиск окон в лучшие велнес-пространства города.
        </div>
        <div style={{fontSize:12,color:'var(--secondary)',letterSpacing:'0.1em',textTransform:'uppercase'}}>
          CAPTION / EYEBROW — БЛИЖАЙШИЕ СЛОТЫ
        </div>
      </Section>

      {/* BUTTONS */}
      <Section title="Кнопки / Buttons">
        <Row gap={12} wrap>
          {/* Primary */}
          <div>
            <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Primary</div>
            <button style={{
              background:'var(--accent)',color:'#fff',border:'none',
              padding:'14px 28px',borderRadius:18,fontWeight:600,
              cursor:'pointer',fontSize:14,
              boxShadow:'0 8px 20px rgba(249,115,22,0.3)',
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 12px 28px rgba(249,115,22,0.4)'}}
            onMouseLeave={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 8px 20px rgba(249,115,22,0.3)'}}>
              Забрать за 3 300 ₽
            </button>
          </div>
          {/* Secondary */}
          <div>
            <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Secondary</div>
            <button style={{
              background:'var(--dark)',color:'#fff',border:'none',
              padding:'14px 28px',borderRadius:18,fontWeight:600,
              cursor:'pointer',fontSize:14,transition:'all 0.2s'
            }}
            onMouseEnter={e=>{e.target.style.opacity='0.85'}}
            onMouseLeave={e=>{e.target.style.opacity='1'}}>
              Найти окна
            </button>
          </div>
          {/* Ghost */}
          <div>
            <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Ghost</div>
            <button style={{
              background:'transparent',color:'var(--dark)',
              border:'1px solid var(--border)',
              padding:'14px 28px',borderRadius:18,fontWeight:500,
              cursor:'pointer',fontSize:14,transition:'all 0.2s'
            }}
            onMouseEnter={e=>{e.target.style.borderColor='var(--dark)'}}
            onMouseLeave={e=>{e.target.style.borderColor='var(--border)'}}>
              Выбрать тариф
            </button>
          </div>
          {/* Small */}
          <div>
            <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Small CTA</div>
            <button style={{
              background:'var(--dark)',color:'#fff',border:'none',
              padding:'8px 16px',borderRadius:12,fontWeight:500,
              cursor:'pointer',fontSize:12,transition:'all 0.2s'
            }}
            onMouseEnter={e=>{e.target.style.opacity='0.85'}}
            onMouseLeave={e=>{e.target.style.opacity='1'}}>
              Забрать →
            </button>
          </div>
          {/* Link */}
          <div>
            <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Link</div>
            <a href="#" style={{
              color:'var(--accent)',fontSize:13,fontWeight:600,
              textDecoration:'none',letterSpacing:'0.06em',
              textTransform:'uppercase',transition:'opacity 0.2s'
            }}
            onMouseEnter={e=>{e.target.style.opacity='0.7'}}
            onMouseLeave={e=>{e.target.style.opacity='1'}}>
              Подключить →
            </a>
          </div>
        </Row>

        {/* Mobile sticky CTA */}
        <div style={{marginTop:24}}>
          <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Mobile Sticky CTA</div>
          <div style={{
            background:'rgba(253,252,249,0.95)',backdropFilter:'blur(12px)',
            borderTop:'1px solid var(--border)',padding:'12px 16px 20px',
            borderRadius:16,maxWidth:390
          }}>
            <button style={{
              width:'100%',background:'var(--accent)',color:'#fff',border:'none',
              padding:'16px',borderRadius:18,fontWeight:600,fontSize:16,
              cursor:'pointer',boxShadow:'0 8px 24px rgba(249,115,22,0.3)',
              transition:'all 0.2s'
            }}>
              Забрать за 3 300 ₽
            </button>
            <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:8}}>
              {['СБП','Apple Pay','T-Pay'].map(p=>(
                <span key={p} style={{fontSize:10,color:'var(--secondary)',
                  background:'rgba(18,26,18,0.06)',padding:'2px 8px',
                  borderRadius:4,fontWeight:500}}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* BADGES */}
      <Section title="Бейджи / Badges">
        <Row gap={10} wrap>
          <div style={{background:'rgba(249,115,22,0.09)',color:'var(--accent)',padding:'4px 12px',borderRadius:8,fontSize:12,fontWeight:700}}>⚡ -25%</div>
          <div style={{background:'#FFF7ED',color:'var(--accent)',padding:'4px 12px',borderRadius:8,fontSize:12,fontWeight:600}}>Топ по отзывам</div>
          <div style={{background:'var(--dark)',color:'#fff',padding:'3px 10px',borderRadius:20,fontSize:10,fontWeight:500,letterSpacing:'0.06em',textTransform:'uppercase'}}>Рекомендуем</div>
          <div style={{background:'rgba(249,115,22,0.18)',color:'var(--accent)',padding:'4px 12px',borderRadius:10,fontSize:12,fontWeight:600}}>-40%</div>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--accent)'}}>
            <span style={{position:'relative',display:'inline-block',width:6,height:6}}>
              <span style={{position:'absolute',inset:0,borderRadius:'50%',background:'var(--accent)',animation:'pulse 2s infinite'}}/>
              <span style={{position:'absolute',inset:0,borderRadius:'50%',background:'var(--accent)'}}/>
            </span>
            В эфире: 342 окна
          </div>
        </Row>
      </Section>

      {/* INPUTS */}
      <Section title="Поля ввода / Inputs">
        <Row gap={16} wrap>
          <div>
            <div style={{fontSize:11,color:'var(--secondary)',marginBottom:8}}>Search Bar</div>
            <div style={{
              background:'#fff',padding:10,borderRadius:28,
              display:'flex',alignItems:'center',gap:0,
              boxShadow:'0 10px 30px rgba(0,0,0,0.04)',
              border:'1px solid var(--border)',maxWidth:500
            }}>
              <input placeholder="Район или метро" style={{
                border:'none',padding:'14px 18px',fontSize:15,flex:1,
                outline:'none',background:'transparent',
                borderRight:'1px solid var(--border)'
              }}/>
              <input placeholder="Услуга или тип" style={{
                border:'none',padding:'14px 18px',fontSize:15,flex:1,
                outline:'none',background:'transparent'
              }}/>
              <button style={{
                background:'var(--dark)',color:'#fff',border:'none',
                padding:'12px 24px',borderRadius:20,fontWeight:600,
                cursor:'pointer',fontSize:13,whiteSpace:'nowrap'
              }}>Найти окна</button>
            </div>
          </div>
        </Row>
        <Row gap={8} wrap>
          <div style={{fontSize:11,color:'var(--secondary)',marginBottom:0,width:'100%'}}>Chips / Tags</div>
          {['Рядом со мной','Для двоих','Тайский','С душем','До 3 000 ₽'].map(c=>(
            <button key={c} style={{
              padding:'7px 16px',borderRadius:20,
              border:'1px solid var(--border)',fontSize:12,
              color:'var(--secondary)',background:'transparent',cursor:'pointer',
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--dark)';e.currentTarget.style.color='var(--dark)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--secondary)'}}>
              {c}
            </button>
          ))}
        </Row>
      </Section>

      {/* CARDS */}
      <Section title="Карточки / Cards">
        <Row gap={16} wrap>
          {/* Sub card */}
          <div style={{
            background:'#fff',border:'1px solid var(--border)',
            borderRadius:32,padding:'24px 28px',width:280,
            position:'relative',overflow:'hidden',cursor:'pointer',
            transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)'
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 24px 48px rgba(18,26,18,0.08)';e.currentTarget.style.borderColor='rgba(249,115,22,0.3)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='var(--border)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'rgba(18,26,18,0.04)'}}>
              <div style={{height:'100%',background:'var(--accent)',width:'62%',transition:'width 1s linear'}}/>
            </div>
            <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(18,26,18,0.35)',marginBottom:10}}>Available at 19:00</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:21,marginBottom:4}}>SPA для двоих</div>
            <div style={{fontSize:11,color:'var(--secondary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:16}}>LuxeSpa · Патриаршие</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
              <div style={{fontSize:22,fontWeight:600}}>9 000 ₽</div>
              <div style={{background:'rgba(249,115,22,0.09)',color:'var(--accent)',padding:'3px 10px',borderRadius:8,fontSize:11,fontWeight:700}}>⚡ -25%</div>
            </div>
          </div>

          {/* Dark card */}
          <div style={{
            background:'var(--dark)',color:'#fff',
            borderRadius:32,padding:'24px 28px',width:240,cursor:'pointer',
            transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)'
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 24px 48px rgba(18,26,18,0.15)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
            <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:12}}>Для салонов</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:20,marginBottom:8}}>Заполните пустые часы</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',lineHeight:1.6,marginBottom:16}}>Первые 3 месяца без комиссии</div>
            <a href="#" style={{color:'var(--accent)',fontSize:12,fontWeight:600,textDecoration:'none',textTransform:'uppercase',letterSpacing:'0.08em'}}>
              Подключить →
            </a>
          </div>

          {/* Pass mini */}
          <div style={{
            background:'#F1F0EC',borderRadius:32,padding:'24px 28px',
            width:240,cursor:'pointer',
            transition:'all 0.4s cubic-bezier(0.2,1,0.2,1)'
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 24px 48px rgba(18,26,18,0.06)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
            <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--secondary)',marginBottom:10}}>Единый абонемент</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:18,marginBottom:6}}>The Unlimited Access</div>
            <div style={{fontSize:12,color:'var(--secondary)',lineHeight:1.5,marginBottom:14}}>50+ салонов · Любая услуга</div>
            <div style={{fontSize:22,fontWeight:600}}>15 000 ₽</div>
          </div>
        </Row>
      </Section>

      {/* NAV MOODS */}
      <Section title="Навигация / Nav Moods">
        <Row gap={8} wrap>
          {['Всё','Глубокий отдых','Перезагрузка','Вдвоём'].map((m,i)=>(
            <button key={m} style={{
              padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:500,
              cursor:'pointer',transition:'all 0.25s',
              border:'1px solid var(--border)',
              background: i===0 ? 'var(--dark)' : 'transparent',
              color: i===0 ? '#fff' : 'var(--dark)'
            }}>
              {m}
            </button>
          ))}
        </Row>
      </Section>

      {/* SHADCN PLANNED */}
      <Section title="Запланировано из shadcn / Planned shadcn components">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          {[
            {name:'Dialog', desc:'Модальное окно оплаты'},
            {name:'DatePicker', desc:'Выбор даты бронирования'},
            {name:'Select', desc:'Выбор услуги/мастера'},
            {name:'Toast', desc:'Подтверждение бронирования'},
            {name:'Skeleton', desc:'Загрузка слотов'},
            {name:'Sheet', desc:'Мобильный drawer фильтров'},
            {name:'Tabs', desc:'Переключение категорий'},
            {name:'Avatar', desc:'Фото мастера в карточке'},
          ].map(c=>(
            <div key={c.name} style={{
              border:'1px dashed var(--border)',borderRadius:16,
              padding:'16px 20px',background:'rgba(18,26,18,0.02)'
            }}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4,color:'var(--dark)'}}>{c.name}</div>
              <div style={{fontSize:12,color:'var(--secondary)'}}>{c.desc}</div>
              <div style={{fontSize:10,color:'var(--accent)',marginTop:8,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>Planned</div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  )
}
