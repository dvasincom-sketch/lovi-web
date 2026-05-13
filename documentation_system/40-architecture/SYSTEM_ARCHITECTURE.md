# SYSTEM_ARCHITECTURE

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- SERVICES_MAP.md
- REPOSITORY_STRUCTURE.md

## Стек
- **Frontend (Insalon):** Vanilla JS, Tabler UI (Bootstrap 5), ApexCharts. Статические файлы в `/static/v3/`, модульная структура.
- **Frontend (Lovi):** React (Vite), компоненты в стиле «Quiet Luxury», lucide-react, React Router.
- **Backend:** FastAPI (Python 3.11), Uvicorn, Supabase Python SDK, httpx.
- **База данных:** Supabase PostgreSQL, RLS отключён.
- **Инфраструктура:** Render (хостинг API), Tilda (лендинг check.moscow), локальная разработка на MacOS.
- **Интеграции:** YCLIENTS API, Fitmost, ЮKassa (Аванпост), Т-банк (расчётный счёт), Яндекс Аренда (личное).

## Принципы развертывания
- Деплой на Render через git push.
- Статические файлы дашбордов монтируются через FastAPI StaticFiles.
- Конфигурация через .env (python-dotenv).

## Репозитории
- insalon — основной монорепозиторий: backend + статические дашборды.
- Lovi frontend размещён в том же монорепозитории (папка `lovi/` или аналогично) с React-приложением.