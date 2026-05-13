# MASTER_INDEX

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Сводный индекс всех документов проекта Insalon / Lovi.

## 00-meta
- [DOCUMENT_SYSTEM.md](00-meta/DOCUMENT_SYSTEM.md) — описание структуры и правил документации

## 10-core
- [VISION.md](10-core/VISION.md) — миссия, видение, главная цель
- [PRODUCT_PRINCIPLES.md](10-core/PRODUCT_PRINCIPLES.md) — ключевые принципы разработки (ENMV)
- [GLOSSARY.md](10-core/GLOSSARY.md) — единый глоссарий терминов

## 20-product
- [INSALON_PRODUCT.md](20-product/INSALON_PRODUCT.md) — продукт Insalon, его контекст и ключевые решения
- [LOVI_PRODUCT.md](20-product/LOVI_PRODUCT.md) — продукт Lovi, его контекст и решения

## 30-domain
- [PAYROLL_RULES.md](30-domain/PAYROLL_RULES.md) — вся логика расчёта оплаты труда
- [SHIFT_LOGIC.md](30-domain/SHIFT_LOGIC.md) — смены, выходы под запись, двойные смены
- [FITMOST_ACCOUNTING.md](30-domain/FITMOST_ACCOUNTING.md) — учёт Fitmost-выручки и отложенные платежи
- [VISIT_RECORDS.md](30-domain/VISIT_RECORDS.md) — модель и правила выходов под запись
- [COUPLE_PROGRAMS.md](30-domain/COUPLE_PROGRAMS.md) — парные программы, идентификация
- [FINANCIAL_MODEL.md](30-domain/FINANCIAL_MODEL.md) — финансовые метрики, P&L, проекты
- [OBLIGATIONS_LOGIC.md](30-domain/OBLIGATIONS_LOGIC.md) — обязательства и периодические платежи

## 40-architecture
- [SYSTEM_ARCHITECTURE.md](40-architecture/SYSTEM_ARCHITECTURE.md) — общая архитектура, стек, связи
- [REPOSITORY_STRUCTURE.md](40-architecture/REPOSITORY_STRUCTURE.md) — структура репозиториев
- [SERVICES_MAP.md](40-architecture/SERVICES_MAP.md) — карта модулей и эндпоинтов

## 50-frontend
- [FRONTEND_ARCHITECTURE.md](50-frontend/FRONTEND_ARCHITECTURE.md) — архитектура фронтенда (Lovi + дашборды)
- [DESIGN_SYSTEM.md](50-frontend/DESIGN_SYSTEM.md) — дизайн-система «Quiet Luxury»
- [UI_LIBRARY.md](50-frontend/UI_LIBRARY.md) — библиотека компонентов (UI.jsx)
- [ROUTING.md](50-frontend/ROUTING.md) — маршрутизация страниц Lovi
- [DASHBOARD_VERSIONS.md](50-frontend/DASHBOARD_VERSIONS.md) — история версий дашбордов Insalon

## 60-backend
- [API_REFERENCE.md](60-backend/API_REFERENCE.md) — API Insalon + Lovi
- [ANALYTICS_ENGINE.md](60-backend/ANALYTICS_ENGINE.md) — аналитические расчёты Insalon
- [AUTH_FLOW.md](60-backend/AUTH_FLOW.md) — аутентификация и авторизация
- [SYNC_ENGINE.md](60-backend/SYNC_ENGINE.md) — синхронизация данных YCLIENTS → Supabase
- [WEBHOOKS.md](60-backend/WEBHOOKS.md) — вебхуки YCLIENTS

## 70-data
- [DATABASE_SCHEMA.md](70-data/DATABASE_SCHEMA.md) — полные схемы таблиц (Insalon + Lovi)
- [DATA_GOVERNANCE.md](70-data/DATA_GOVERNANCE.md) — управление данными, Solid-Finance
- [TABLE_REFERENCE.md](70-data/TABLE_REFERENCE.md) — краткий справочник таблиц
- [DATA_CLASSIFICATION.md](70-data/DATA_CLASSIFICATION.md) — классификация DR1/DR2/DR3

## 80-integrations
- [YCLIENTS.md](80-integrations/YCLIENTS.md)
- [FITMOST.md](80-integrations/FITMOST.md)
- [YOOKASSA.md](80-integrations/YOOKASSA.md)
- [SUPABASE.md](80-integrations/SUPABASE.md)
- [RENDER.md](80-integrations/RENDER.md)

## 90-operations
- [CURRENT_STATE.md](90-operations/CURRENT_STATE.md) — текущее состояние разработки
- [ACTIVE_SPRINT.md](90-operations/ACTIVE_SPRINT.md) — активные задачи
- [BLOCKERS.md](90-operations/BLOCKERS.md) — блокеры
- [KNOWN_ISSUES.md](90-operations/KNOWN_ISSUES.md) — известные проблемы
- [DEPLOY_STATUS.md](90-operations/DEPLOY_STATUS.md) — статус деплоя

## 95-ai
- [AI_RULES.md](95-ai/AI_RULES.md) — правила взаимодействия с AI
- [ENGINEERING_CONVENTIONS.md](95-ai/ENGINEERING_CONVENTIONS.md) — инженерные соглашения
- [ANTI_PATTERNS.md](95-ai/ANTI_PATTERNS.md) — антипаттерны
- [AI_CONTEXT_LOADING.md](95-ai/AI_CONTEXT_LOADING.md) — загрузка контекста для AI

## archive
- [giant-file-v1.md](archive/giant-file-v1.md) — исходный AI_PROJECT_BRIEF.md
- dashboard-v1/ — документация старого Bootstrap дашборда
- dashboard-v2/ — документация дашборда v2