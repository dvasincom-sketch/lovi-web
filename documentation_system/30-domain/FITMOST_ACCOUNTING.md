# FITMOST_ACCOUNTING

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- INSALON_PRODUCT.md
- FINANCIAL_MODEL.md

Fitmost — партнёр-агрегатор, даёт клиентам скидку 35% и выплачивает выручку салонам в следующем месяце.

## Ключевые правила
1. **Выручка Fitmost учитывается по period (месяц визита), а не по дате поступления платежа.**
2. В таблице `records` записи от Fitmost помечаются `is_fitmost = true` (администратор создаёт дубль записи).
3. Платежи Fitmost приходят на расчётный счёт ИП в месяце, следующем за месяцем визита.
4. Для сверки: в P&L выручка распределяется на месяц визита, а в bank_transactions платеж размечен соответствующим period.