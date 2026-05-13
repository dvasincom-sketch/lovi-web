# OBLIGATIONS_LOGIC

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- FINANCIAL_MODEL.md
- DATABASE_SCHEMA.md

Таблица `obligations` содержит периодические и единовременные платежи (аренда, кредиты, подписки, зарплаты). Поля: type, amount, day_of_month, start_date, end_date.

Используется для прогноза денежного потока и контроля предстоящих выплат. API: GET /analytics/obligations/{year}/{month}