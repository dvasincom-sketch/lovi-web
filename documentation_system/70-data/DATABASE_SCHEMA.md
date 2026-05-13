# DATABASE_SCHEMA

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Все таблицы находятся в Supabase PostgreSQL (RLS отключён).

## Таблицы Insalon
### payroll
| Колонка | Тип | Описание |
|---------|-----|----------|
| company_id | int | 1166484 |
| staff_name | text | |
| period_start | date | 1 или 15 число |
| period_end | date | 14 или последний день |
| payment_date | date | null если не выплачено |
| shifts | int | количество смен |
| shift_pay | int | смен × 5000 |
| visit_pay | int | выходы под запись |
| bonus_loyalty | int | |
| bonus | int | прочие бонусы |
| advance_cash | int | аванс наличными |
| advance_transfer | int | перевод |
| expenses_reimbursement | int | компенсация |
| total_accrued | int | shift_pay+visit_pay+bonus_loyalty+bonus+expenses_reimbursement |
| total_paid | int | advance_cash+advance_transfer |
| balance | int | = total_accrued - total_paid (триггер) |
| notes | text | детализация |
| status | text | 'draft','paid' |
| offset_amount | int | зачёт переплат |

### shifts
| Колонка | Тип | Описание |
|---------|-----|----------|
| company_id | int | |
| date | date | |
| staff_name | text | |
| shift_pay | int | 5000, 0 если visit_only |
| is_double_shift | bool | |
| is_visit_only | bool | true для выходов под запись |
| notes | text | |

### visit_records
| Колонка | Тип | Описание |
|---------|-----|----------|
| date | date | |
| staff_name | text | |
| service_title | text | |
| visit_pay | int | |
| notes | text | |

### personal_transactions
| Колонка | Тип | Описание |
|---------|-----|----------|
| date | date | |
| amount | numeric | кредит=отрицательно |
| description | text | контрагент (нет отдельного counterparty) |
| expense_category | text | salary, materials, marketing… |
| project | text | salon, personal… |
| period | date | месяц начисления |

### staff_payment_aliases
| Колонка | Тип | Описание |
|---------|-----|----------|
| staff_name | text | |
| alias | text | описание в выписке |
| company_id | int | |

### payroll_audit
Лог всех изменений payroll.

### obligations, bank_transactions, records, transactions и др.
Описаны в TABLE_REFERENCE.md.

## Таблицы Lovi
### service_strategies
id, company_id, service_id, service_name, category, strategy_name, status (published/draft), threshold_far, threshold_near, coeff_far, coeff_near, coeff_hot, duration_min, display_order, updated_at

### salons (общая)
Расширена колонками token_status и др. под Lovi.

### bookings
status: pending, waiting_payment, confirmed, cancelled_by_client

### users, balance_transactions, city_waitlist, city_partner_requests, salon_magic_links
Используются в Lovi.