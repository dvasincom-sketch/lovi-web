# API_REFERENCE

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

## Insalon Endpoints (основные)

| Эндпоинт | Описание |
|----------|---------|
| GET /analytics/summary | KPI за 30 дней |
| GET /analytics/revenue?weeks=12 | Выручка по неделям |
| GET /analytics/revenue/detail?date_from=&date_to= | Детализация транзакций |
| GET /analytics/clients?weeks=12 | Новые vs повторные |
| GET /analytics/churn?days=45 | Риск оттока |
| GET /analytics/services | Топ услуги |
| GET /analytics/pl | P&L по месяцам |
| GET /analytics/cmph | CM/LH North Star |
| GET /analytics/staff/daily?days=30 | Эффективность мастеров |
| GET /analytics/obligations/{year}/{month} | Обязательства на месяц |
| GET /analytics/payroll?months=6 | Ведомость оплаты труда |
| GET /analytics/payroll/verify/{year}/{month} | Сверка выплат |
| GET /analytics/shifts/{year}/{month} | Расписание смен |
| GET /analytics/couple-programs/{year}/{month} | Парные программы |
| GET /analytics/visit-records/{year}/{month} | Выходы под запись |
| GET /analytics/payroll-schedule/{year}/{month} | Парсинг notes payroll |
| GET /checks/ | Проверки качества данных |
| POST /sync/records | Синхронизация записей |
| POST /sync/all | Полная синхронизация |

## Lovi Endpoints (/api/lovi)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /featured | BentoGrid — топ слоты |
| GET | /slots-stream | Ближайшие слоты |
| GET | /slots | Слоты по услуге и дате |
| GET | /strategies | Стратегии салона |
| PUT | /strategies/{service_id} | Обновить стратегию |
| POST | /sync-services | Синхронизация услуг из YCLIENTS |
| POST | /book | Бронирование + YooKassa платёж |
| POST | /city-waitlist | Подписка на открытие города |
| POST | /city-partner | Заявка владельца салона |
| POST | /connect | Подключение через маркетплейс |
| GET | /salon/me | Данные салона |
| POST | /salon/magic-link | Запрос magic link |
| GET | /salon/auth | Верификация magic link |
| POST | /bookings/{id}/cancel | Отмена брони |
| GET | /lugi/zones/search | Прокси к 2GIS Catalog API (для zone-map) |