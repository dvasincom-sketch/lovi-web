# SYNC_ENGINE

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Синхронизация данных из YCLIENTS в Supabase.
- POST /sync/records — выборочная синхронизация записей.
- POST /sync/all — полная синхронизация всех сущностей (записи, клиенты, транзакции, сотрудники, услуги).
- Автосинхронизация по cron планируется.
- Fitmost-записи: при синхронизации сохраняется флаг is_fitmost.
- Пагинация Supabase использует fetch_all для таблиц >1000 строк.
- Whitelist категорий для Lovi сервисов (см. YCLIENTS интеграцию).