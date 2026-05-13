# FINANCIAL_MODEL

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- PAYROLL_RULES.md
- OBLIGATIONS_LOGIC.md
- INSALON_PRODUCT.md

## Источники данных
- Выручка: таблица `transactions` (YCLIENTS)
- Расходы бизнеса: `bank_transactions` + `personal_transactions` (размеченные проектом 'salon')
- Обязательства: таблица `obligations`

## Проектная структура
Все транзакции размечаются полем `project`. Проекты: salon, podcast, book, startup, consulting, enzyme, personal, internal. Это позволяет строить P&L только по салону (salon) без примеси личных или других бизнес-расходов.

## Ключевые метрики
- CM/LH (North Star) = Contribution Margin / оплаченные часы мастеров
- Когортный анализ новых клиентов (повторные визиты)
- Кассовый разрыв: овердрафт ИП (тело = financing, проценты = overdraft_interest)

## Правило аренды (Гилтон)
Аренда 93 000 ₽, платёж 25-го числа каждого месяца за следующий месяц. Учитывается по period, а не по дате платежа.

## Прочие расходы
Закупка расходников (Wildberries) через физ.карту, размечается expense_category='production', project='salon'.