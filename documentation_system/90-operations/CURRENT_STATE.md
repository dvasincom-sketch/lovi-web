# CURRENT_STATE

Status: runtime
Owner: Dmitry Vasin
Last Updated: 2026-05-14

## Lovi.today — текущее состояние

### Витрина (lovi.today)
- BentoGrid читает published услуги из Supabase (не хардкод)
- AllSlots читает slots-stream, skeleton loader, якорь #slots
- duration_min берётся из service_strategies, не из seance_length
- Timezone фикс: сервер UTC, слоты +03:00 — работает корректно

### Salon Dashboard (/salon/dashboard)
- Drag-and-drop порядка услуг (display_order)
- Toggle published/draft на каждой услуге
- StrategyDrawer — глобальная стратегия (4 шага)
- ServiceDrawer — точечные настройки одной услуги
- Sync из YCLIENTS через POST /api/lovi/sync-services

### Стратегии скидок
- DynamicDiscountStrategy читает параметры из Supabase
- Таблица service_strategies: threshold_far/near, coeff_far/near/hot, duration_min
- Пресеты: premium (48/24ч), popular (48/24ч), step (24/1ч)

### Страницы
- / — главная: HeroNew → BentoGrid → AllSlots → Hero → ValueCard → Ticker → Footer
- /partners — полная страница для партнёров с PartnerForm
- /PartnerLanding — лендинг для первых 50 салонов
- /salon/dashboard — кабинет партнёра
- /about, /pass, /privacy, /offer — ComingSoon заглушки

### Инфраструктура
- Frontend: Vite + React, Render (lovi-web)
- Backend: FastAPI + Supabase, Render (insalon)
- COMPANY_ID: 1166484 (Head SPA Beauty, Беляево) — хардкод, требует рефакторинга при масштабировании

## Известные проблемы
- Дубли услуг в service_strategies (27937128/27937491, 26522085/26949774)
- Бандл 613 КБ — нужен lazy loading
- YooKassa refund при отмене не реализован
- Баланс Lovi в /my-bookings не отображается
