# AI_CONTEXT_LOADING

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-14

## Как работает система

1. Владелец открывает новый чат
2. Скидывает MASTER_INDEX.md + описание задачи
3. AI читает MASTER_INDEX, определяет какие файлы нужны для задачи
4. AI запрашивает их через web_fetch по GitHub raw URLs
5. Работа начинается с полным контекстом

## Базовый URL для web_fetch
https://raw.githubusercontent.com/dvasincom-sketch/lovi-web/main/documentation_system/

## Карта задач → файлы

### Фикс бага / новая фича в витрине Lovi
- LOVI_AI_BRIEF.md (корень репо)
- 90-operations/CURRENT_STATE.md
- 60-backend/API_REFERENCE.md

### Новый компонент UI / страница
- 50-frontend/DESIGN_SYSTEM.md
- 50-frontend/UI_LIBRARY.md
- 50-frontend/ROUTING.md
- 90-operations/CURRENT_STATE.md

### Изменение бизнес-логики / стратегий скидок
- 20-product/LOVI_PRODUCT.md
- 70-data/DATABASE_SCHEMA.md
- 60-backend/API_REFERENCE.md

### Дебаг YCLIENTS интеграции
- 80-integrations/YCLIENTS.md
- 60-backend/SYNC_ENGINE.md
- 90-operations/KNOWN_ISSUES.md

### Любая сессия (всегда загружать)
- LOVI_AI_BRIEF.md
- 00-meta/SESSION_PROTOCOL.md
- 95-ai/AI_RULES.md
- 95-ai/ENGINEERING_CONVENTIONS.md
- 90-operations/CURRENT_STATE.md

## Правило минимума
Не грузить весь MASTER_INDEX — только файлы нужные для задачи.
Лишний контекст замедляет работу и тратит токены впустую.
