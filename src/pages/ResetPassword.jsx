import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://insalon.onrender.com'

export default function ResetPassword() {
  const navigate = useNavigate()
  const token = new URLSearchParams(window.location.search).get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) navigate('/')
  }, [token])

  async function submit() {
    if (!password || password.length < 6) { setError('Минимум 6 символов'); return }
    if (password !== confirm) { setError('Пароли не совпадают'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Ошибка'); return }
      setDone(true)
    } catch { setError('Ошибка соединения') } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', border: '1px solid rgba(18,26,18,0.12)', borderRadius: 12,
    padding: '12px 14px', fontSize: 14, outline: 'none',
    background: '#FDFCF9', boxSizing: 'border-box',
    fontFamily: 'Inter,sans-serif', color: '#121A12', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight:'100vh',background:'#FDFCF9',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
      <div style={{ background:'#fff',borderRadius:24,padding:'40px 32px',width:'100%',maxWidth:400,boxShadow:'0 32px 80px rgba(18,26,18,0.1)' }}>
        <div style={{ marginBottom:28,textAlign:'center' }}>
          <img src="/logo.svg" alt="LOVI" style={{ height:28,marginBottom:20 }} />
          {done ? (
            <>
              <div style={{ fontSize:32,marginBottom:12 }}>✅</div>
              <div style={{ fontSize:18,fontWeight:700,color:'#121A12',marginBottom:8,fontFamily:'Playfair Display,serif' }}>Пароль изменён</div>
              <div style={{ fontSize:13,color:'#8F8475',lineHeight:1.6 }}>Теперь вы можете войти с новым паролем.</div>
            </>
          ) : (
            <>
              <div style={{ fontSize:18,fontWeight:700,color:'#121A12',marginBottom:8,fontFamily:'Playfair Display,serif' }}>Новый пароль</div>
              <div style={{ fontSize:13,color:'#8F8475' }}>Придумайте надёжный пароль</div>
            </>
          )}
        </div>

        {done ? (
          <button onClick={() => navigate('/')} style={{ width:'100%',background:'#121A12',color:'#fff',border:'none',padding:'14px',borderRadius:14,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif' }}>
            На главную
          </button>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            <input style={inputStyle} type="password" placeholder="Новый пароль" value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor='#121A12'}
              onBlur={e => e.target.style.borderColor='rgba(18,26,18,0.12)'}
            />
            <input style={inputStyle} type="password" placeholder="Повторите пароль" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key==='Enter' && submit()}
              onFocus={e => e.target.style.borderColor='#121A12'}
              onBlur={e => e.target.style.borderColor='rgba(18,26,18,0.12)'}
            />
            {error && (
              <div style={{ background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#DC2626' }}>{error}</div>
            )}
            <button onClick={submit} disabled={loading} style={{ width:'100%',background:loading?'rgba(18,26,18,0.4)':'#121A12',color:'#fff',border:'none',padding:'14px',borderRadius:14,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',transition:'background 0.2s' }}>
              {loading ? 'Сохраняем...' : 'Сохранить пароль'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
