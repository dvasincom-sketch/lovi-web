import { useState, useEffect } from 'react'

export default function InstallBanner() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('lovi_install_dismissed')) return

    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
    const isAndroid = /Android/.test(ua)

    // iOS — Safari не поддерживает beforeinstallprompt, показываем сразу
    if (isIOS) {
      // Только в Safari (не в Chrome/Firefox на iOS)
      const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua)
      if (isSafari) { setPlatform('ios'); setShow(true) }
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!isIOS) { setPlatform('android'); setShow(true) }
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => { setInstalled(true); setShow(false) })
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('lovi_install_dismissed', '1')
    setShow(false)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setShow(false)
  }

  if (!show || installed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 16, right: 16,
      background: '#121A12', borderRadius: 16, padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      zIndex: 9998, boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
    }}>
      {/* Иконка */}
      <div style={{ width:40,height:40,borderRadius:10,background:'rgba(249,115,22,0.15)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v13M7 9l5 6 5-6"/><path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
        </svg>
      </div>

      {/* Текст */}
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13,fontWeight:600,color:'#fff',marginBottom:2 }}>Добавить Lovi на экран</div>
        {platform === 'ios' ? (
          <div style={{ fontSize:11,color:'rgba(255,255,255,0.5)',lineHeight:1.5 }}>
            Нажмите{' '}
            <svg style={{ display:'inline',verticalAlign:'middle' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {' '}→ «На экран "Домой"»
          </div>
        ) : (
          <div style={{ fontSize:11,color:'rgba(255,255,255,0.5)' }}>Быстрый доступ без браузера</div>
        )}
      </div>

      {/* Кнопка Android */}
      {platform === 'android' && deferredPrompt && (
        <button onClick={install} style={{ flexShrink:0,background:'#F97316',border:'none',borderRadius:8,padding:'8px 14px',fontSize:12,fontWeight:600,color:'#fff',cursor:'pointer',fontFamily:'Inter,sans-serif' }}>
          Установить
        </button>
      )}

      {/* Закрыть */}
      <button onClick={dismiss} style={{ flexShrink:0,background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:20,lineHeight:1,padding:4 }}>×</button>
    </div>
  )
}
