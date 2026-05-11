import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const anchorId = sessionStorage.getItem('scrollTo')

    if (anchorId && pathname === '/') {
      // Переход на главную с якорем — ждём появления элемента в DOM
      sessionStorage.removeItem('scrollTo')

      const tryScroll = () => {
        const el = document.getElementById(anchorId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return true
        }
        return false
      }

      // Пробуем сразу
      if (tryScroll()) return

      // Элемент ещё не в DOM — MutationObserver ждёт его появления
      const observer = new MutationObserver(() => {
        if (tryScroll()) {
          observer.disconnect()
          clearTimeout(fallback)
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })

      // Страховка на 6 секунд (BentoGrid грузит данные с API)
      const fallback = setTimeout(() => observer.disconnect(), 6000)

      return () => {
        observer.disconnect()
        clearTimeout(fallback)
      }
    } else {
      // Обычная навигация — скролл в начало
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}