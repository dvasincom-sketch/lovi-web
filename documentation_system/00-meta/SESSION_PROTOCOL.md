# SESSION_PROTOCOL

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Стандарт проведения сессии разработки (соло, с командой, с AI-оператором).

---

## 1. ОТКРЫТИЕ СЕССИИ

### 1.1. Идентификатор сессии

Формат: `Итерация-ПорядковыйНомер Название инкремента`

Пример: `3-14 Обновление геоданных для слоя карты`

Где:
- **Итерация** — номер продуктовой итерации (1, 2, 3…)
- **Порядковый номер** — сквозной номер инкремента внутри итерации
- **Название** — краткое описание задачи

### 1.2. Дата

Фиксируется дата начала сессии: `13 мая 2026`

### 1.3. Аналитика перед разработкой

Любая работа начинается с аналитики. Никакой код не пишется до ответа на вопросы:

- Что именно делаем?
- Какие данные/файлы/таблицы затрагиваются?
- Какие пограничные случаи и ограничения известны?
- Где в UI пользователь увидит результат?

### 1.4. Если работа идёт с AI-оператором

Перед первым запросом в сессии обязательно:

- Прочитать [AI_RULES.md](/documentation_system/95-ai/AI_RULES.md)
- Прочитать [ANTI_PATTERNS.md](/documentation_system/95-ai/ANTI_PATTERNS.md)
- Прочитать [ENGINEERING_CONVENTIONS.md](/documentation_system/95-ai/ENGINEERING_CONVENTIONS.md)

AI-оператор должен понимать:
- Стиль общения (прямой, без лишних объяснений)
- Формат кода (готовые терминальные команды)
- Антипаттерны, которые нельзя повторять
- Инженерные соглашения (SQL Editor, /tmp/, деплой после localhost)

---

## 2. ЗАКРЫТИЕ СЕССИИ

### 2.1. Обновление документации

После каждой сессии разработки:

**Runtime-файлы (обязательно):**
- [CURRENT_STATE.md](/documentation_system/90-operations/CURRENT_STATE.md)
- [ACTIVE_SPRINT.md](/documentation_system/90-operations/ACTIVE_SPRINT.md)
- [BLOCKERS.md](/documentation_system/90-operations/BLOCKERS.md) (если появились/сняты)
- [KNOWN_ISSUES.md](/documentation_system/90-operations/KNOWN_ISSUES.md) (если обнаружены/исправлены)
- [DEPLOY_STATUS.md](/documentation_system/90-operations/DEPLOY_STATUS.md)

**Canonic-файлы (при изменениях в логике):**
- Если менялась бизнес-логика — обновить соответствующий доменный файл в [30-domain](/documentation_system/30-domain/)
- Если добавились/изменились эндпоинты — обновить [API_REFERENCE.md](/documentation_system/60-backend/API_REFERENCE.md)
- Если изменилась схема данных — обновить [DATABASE_SCHEMA.md](/documentation_system/70-data/DATABASE_SCHEMA.md)

### 2.2. Логирование в Dev Log

Проект Insalon имеет таблицу `dev_sessions` в Supabase и API на Render. В конце сессии выполнить:

```bash
curl -X POST https://insalon.onrender.com/dev-sessions \
  -H "Content-Type: application/json" \
  -d '{"date":"YYYY-MM-DD","feature":"Название задачи","category":"dev","duration_min":90,"tokens_approx":50000,"notes":"..."}'

Параметры:

Поле	Описание
date	Дата сессии (YYYY-MM-DD)
feature	Название задачи (совпадает с идентификатором сессии)
category	dev / design / analytics
duration_min	Продолжительность в минутах
tokens_approx	Примерный расход токенов (если с AI)
notes	Что сделано, ключевые решения, незакрытые вопросы
Пример:
curl -X POST https://insalon.onrender.com/dev-sessions \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-05-13","feature":"3-14 Обновление геоданных для слоя карты","category":"dev","duration_min":120,"tokens_approx":80000,"notes":"Кэширование bbox, дедупликация объектов, 176 объектов в кэше"}'

