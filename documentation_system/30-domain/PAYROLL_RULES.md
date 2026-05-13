# PAYROLL_RULES

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- SHIFT_LOGIC.md
- VISIT_RECORDS.md
- FITMOST_ACCOUNTING.md
- OBLIGATIONS_LOGIC.md
- DATABASE_SCHEMA.md

## Периоды расчёта
Период 1: с 1 по 14 число  
Период 2: с 15 по последний день месяца  
Выплата остатка за период 1 — 15-го числа  
Выплата за период 2 — 1-го следующего месяца  

## Состав начислений
| Компонент | Описание |
|-----------|----------|
| shift_pay | Оплата за смены (кол-во смен × 5000) |
| visit_pay | Оплата выходов под запись (из visit_records) |
| bonus_loyalty | Бонус за продажи/лояльность |
| bonus | Прочие бонусы (премия, переработка) |
| expenses_reimbursement | Компенсация расходов (может быть отрицательной = долг) |
| total_accrued | shift_pay + visit_pay + bonus_loyalty + bonus + expenses_reimbursement |
| advance_cash | Аванс наличными |
| advance_transfer | Аванс/выплата переводом |
| total_paid | advance_cash + advance_transfer |
| balance | total_accrued - total_paid (автотриггером) |

## Важные правила
- `bonus_loyalty` выделено из исторического `bonus`: bonus_loyalty = bonus - visit_pay (после добавления visit_pay).
- Выплаты 1-го числа относятся к предыдущему месяцу (период 2), не к текущему.
- Мария: особый случай (см. SHIFT_LOGIC.md).
- Все изменения payroll логируются в `payroll_audit`.
- Поле `status` в payroll: 'draft' | 'paid'
- `offset_amount` — зачёт авансов/переплат из предыдущих периодов.