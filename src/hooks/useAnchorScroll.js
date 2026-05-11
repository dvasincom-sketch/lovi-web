import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Вызови один раз в App.jsx:
 *   import { useAnchorScroll } from './hooks/useAnchorScroll'
 *   function App() { useAnchorScroll(); return <Routes>... }
 *
 * Как работает:
 * Footer/Nav сохраняет якорь в sessionStorage и вызывает navigate('/').
 * Этот хук на главной странице ждёт появления нужного DOM-элемента
 * через MutationObserver (не таймер!) — срабатывает ровно тогда когда
 * BentoGrid/AllSlots реально отрендерились, даже если данные грузятся асинхронно.
 */
export function useAnchorScroll() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    const id = sessionStorage.getItem('scrollTo')
    if (!id) return
    sessionStorage.removeItem('scrollTo')

    // Элемент уже есть — скроллим сразу
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    // Элемента нет — ждём через MutationObserver (асинхронный рендер)
    const observer = new MutationObserver(() => {
      const target = document.getElementById(id)
      if (target) {
        observer.disconnect()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Страховка: если за 5 секунд элемент не появился — отключаем
    const timeout = setTimeout(() => observer.disconnect(), 5000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [location.pathname])
}
