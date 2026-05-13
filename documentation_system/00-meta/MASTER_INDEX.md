# MASTER_INDEX

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Сводный индекс всех документов проекта Insalon / Lovi.

## 00-meta
- [DOCUMENT_SYSTEM.md](/documentation_system/00-meta/DOCUMENT_SYSTEM.md) — описание структуры и правил документации
- [SESSION_PROTOCOL.md](/documentation_system/00-meta/SESSION_PROTOCOL.md) — стандарт открытия и закрытия сессии разработки

## 10-core
- [VISION.md](/documentation_system/10-core/VISION.md) — миссия, видение, главная цель
- [PRODUCT_PRINCIPLES.md](/documentation_system/10-core/PRODUCT_PRINCIPLES.md) — ключевые принципы разработки (ENMV)
- [GLOSSARY.md](/documentation_system/10-core/GLOSSARY.md) — единый глоссарий терминов

## 20-product
- [INSALON_PRODUCT.md](/documentation_system/20-product/INSALON_PRODUCT.md) — продукт Insalon, его контекст и ключевые решения
- [LOVI_PRODUCT.md](/documentation_system/20-product/LOVI_PRODUCT.md) — продукт Lovi, его контекст и решения

## 30-domain
- [PAYROLL_RULES.md](/documentation_system/30-domain/PAYROLL_RULES.md) — вся логика расчёта оплаты труда
- [SHIFT_LOGIC.md](/documentation_system/30-domain/SHIFT_LOGIC.md) — смены, выходы под запись, двойные смены
- [FITMOST_ACCOUNTING.md](/documentation_system/30-domain/FITMOST_ACCOUNTING.md) — учёт Fitmost-выручки и отложенные платежи
- [VISIT_RECORDS.md](/documentation_system/30-domain/VISIT_RECORDS.md) — модель и правила выходов под запись
- [COUPLE_PROGRAMS.md](/documentation_system/30-domain/COUPLE_PROGRAMS.md) — парные программы, идентификация
- [FINANCIAL_MODEL.md](/documentation_system/30-domain/FINANCIAL_MODEL.md) — финансовые метрики, P&L, проекты
- [OBLIGATIONS_LOGIC.md](/documentation_system/30-domain/OBLIGATIONS_LOGIC.md) — обязательства и периодические платежи

## 40-architecture
- [SYSTEM_ARCHITECTURE.md](/documentation_system/40-architecture/SYSTEM_ARCHITECTURE.md) — общая архитектура, стек, связи
- [REPOSITORY_STRUCTURE.md](/documentation_system/40-architecture/REPOSITORY_STRUCTURE.md) — структура репозиториев
- [SERVICES_MAP.md](/documentation_system/40-architecture/SERVICES_MAP.md) — карта модулей и эндпоинтов

## 50-frontend
- [FRONTEND_ARCHITECTURE.md](/documentation_system/50-frontend/FRONTEND_ARCHITECTURE.md) — архитектура фронтенда (Lovi + дашборды)
- [DESIGN_SYSTEM.md](/documentation_system/50-frontend/DESIGN_SYSTEM.md) — дизайн-система «Quiet Luxury»
- [UI_LIBRARY.md](/documentation_system/50-frontend/UI_LIBRARY.md) — библиотека компонентов (UI.jsx)
- [ROUTING.md](/documentation_system/50-frontend/ROUTING.md) — маршрутизация страниц Lovi
- [DASHBOARD_VERSIONS.md](/documentation_system/50-frontend/DASHBOARD_VERSIONS.md) — история версий дашбордов Insalon

## 60-backend
- [API_REFERENCE.md](/documentation_system/60-backend/API_REFERENCE.md) — API Insalon + Lovi
- [ANALYTICS_ENGINE.md](/documentation_system/60-backend/ANALYTICS_ENGINE.md) — аналитические расчёты Insalon
- [AUTH_FLOW.md](/documentation_system/60-backend/AUTH_FLOW.md) — аутентификация и авторизация
- [SYNC_ENGINE.md](/documentation_system/60-backend/SYNC_ENGINE.md) — синхронизация данных YCLIENTS → Supabase
- [WEBHOOKS.md](/documentation_system/60-backend/WEBHOOKS.md) — вебхуки YCLIENTS

## 70-data
- [DATABASE_SCHEMA.md](/documentation_system/70-data/DATABASE_SCHEMA.md) — полные схемы таблиц (Insalon + Lovi)
- [DATA_GOVERNANCE.md](/documentation_system/70-data/DATA_GOVERNANCE.md) — управление данными, Solid-Finance
- [TABLE_REFERENCE.md](/documentation_system/70-data/TABLE_REFERENCE.md) — краткий справочник таблиц
- [DATA_CLASSIFICATION.md](/documentation_system/70-data/DATA_CLASSIFICATION.md) — классификация DR1/DR2/DR3

## 80-integrations
- [YCLIENTS.md](/documentation_system/80-integrations/YCLIENTS.md)
- [FITMOST.md](/documentation_system/80-integrations/FITMOST.md)
- [YOOKASSA.md](/documentation_system/80-integrations/YOOKASSA.md)
- [SUPABASE.md](/documentation_system/80-integrations/SUPABASE.md)
- [RENDER.md](/documentation_system/80-integrations/RENDER.md)

## 90-operations
- [CURRENT_STATE.md](/documentation_system/90-operations/CURRENT_STATE.md) — текущее состояние разработки
- [ACTIVE_SPRINT.md](/documentation_system/90-operations/ACTIVE_SPRINT.md) — активные задачи
- [BLOCKERS.md](/documentation_system/90-operations/BLOCKERS.md) — блокеры
- [KNOWN_ISSUES.md](/documentation_system/90-operations/KNOWN_ISSUES.md) — известные проблемы
- [DEPLOY_STATUS.md](/documentation_system/90-operations/DEPLOY_STATUS.md) — статус деплоя

## 95-ai
- [AI_RULES.md](/documentation_system/95-ai/AI_RULES.md) — правила взаимодействия с AI
- [ENGINEERING_CONVENTIONS.md](/documentation_system/95-ai/ENGINEERING_CONVENTIONS.md) — инженерные соглашения
- [ANTI_PATTERNS.md](/documentation_system/95-ai/ANTI_PATTERNS.md) — антипаттерны
- [AI_CONTEXT_LOADING.md](/documentation_system/95-ai/AI_CONTEXT_LOADING.md) — загрузка контекста для AI

## archive
- [giant-file-v1.md](/documentation_system/archive/giant-file-v1.md) — исходный AI_PROJECT_BRIEF.md
- dashboard-v1/ — документация старого Bootstrap дашборда (папка)
- dashboard-v2/ — документация дашборда v2 (папка)