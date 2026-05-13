# FRONTEND_ARCHITECTURE

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- DESIGN_SYSTEM.md
- UI_LIBRARY.md
- ROUTING.md
- DASHBOARD_VERSIONS.md

## Insalon Dashboard
- **Актуальная версия:** v3 (Tabler UI, модульный JS)
- **Структура v3:** `config.js → utils.js → api.js → router.js → pulse.js → pl.js → staff.js → schedule.js → payroll.js → checks.js → obligations.js → modal.js → fot.js → main.js`
- Графика: ApexCharts
- Взаимодействие с API через fetch, без фреймворков.

## Lovi Web App
- Стек: React 18, React Router v6, Vite
- Архитектура: страницы в `src/pages/`, компоненты в `src/components/`, хуки в `src/hooks/`
- Именование: PascalCase для компонентов/страниц, camelCase для хуков/утилит.
- CSS: кастомные свойства из дизайн-системы, никаких хардкодов.
- Адаптив: через хук useIsMobile().
- Иконки: lucide-react через компонент <Icon>.