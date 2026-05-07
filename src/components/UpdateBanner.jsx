import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateBanner() {
  const { needRefresh, updateServiceWorker } = useRegisterSW()
  const [refresh] = needRefresh

  if (!refresh) return null

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      background: '#121A12', color: '#fff', borderRadius: 10,
      padding: '12px 20px', display: 'flex', gap: 12, alignItems: 'center',
      zIndex: 9999, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap'
    }}>
      <span>Доступно обновление</span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{ background: '#F97316', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
      >
        Обновить
      </button>
    </div>
  )
}
