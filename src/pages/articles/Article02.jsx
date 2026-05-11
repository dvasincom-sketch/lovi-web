// Заглушка — заменить реальным текстом

function Divider() {
  return <div style={{ height: 1, background: 'rgba(18,26,18,0.07)', margin: '24px 0' }} />
}

function Callout({ children }) {
  return (
    <div style={{
      background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)',
      borderRadius: 12, padding: '14px 18px', margin: '0 0 16px',
      fontSize: 14, color: 'var(--dark)', lineHeight: 1.65, fontStyle: 'italic',
    }}>
      {children}
    </div>
  )
}

function Sources({ items }) {
  return (
    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(18,26,18,0.07)' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 10 }}>
        Источники
      </div>
      {items.map((s, i) => (
        <div key={i} style={{ fontSize: 11, color: '#888', lineHeight: 1.6, marginBottom: 6 }}>
          {i + 1}. {s}
        </div>
      ))}
    </div>
  )
}

const p = { fontSize: 14, lineHeight: 1.8, color: '#3a3a3a', margin: '0 0 16px', fontFamily: 'Inter, sans-serif' }
const h3 = { fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 500, color: 'var(--dark)', margin: '24px 0 12px', lineHeight: 1.3 }

export default function Article02() {
  return (
    <div>
      <p style={p}>Текст статьи появится здесь. Замени этот компонент реальным содержимым.</p>
      <Divider />
      <p style={{ ...p, color: '#999', fontStyle: 'italic' }}>Материал готовится к публикации.</p>
    </div>
  )
}
