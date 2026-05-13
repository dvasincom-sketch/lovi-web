# DATA_GOVERNANCE

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Основано на принципе Solid-Finance.

## Классификация DR1/DR2/DR3
- **DR1 (Sacred)** — неизменяемые первоисточники: bank_transactions, personal_transactions, transactions, records.
  - Разрешён только INSERT через синхронизацию. Запрещены UPDATE/DELETE.
- **DR2 (Calculated)** — производные: shifts, visit_records, payroll.
- **DR3 (Manual)** — ручной контекст: notes, staff_payment_aliases, obligations.

## Триггеры
- `payroll_balance_trigger` — BEFORE INSERT/UPDATE пересчитывает balance.
- `payroll_audit_trigger` — AFTER UPDATE пишет в payroll_audit.

## Принцип контроля
Все проверки качества данных автоматизированы через /checks/ эндпоинт и UI-индикаторы.