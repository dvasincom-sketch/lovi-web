# COUPLE_PROGRAMS

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- SHIFT_LOGIC.md
- VISIT_RECORDS.md

## Определение
Услуги категории «для двоих» (фильтр SQL: `ILIKE '%для двоих%'`). Перечень:
- «Перерождение» для двоих
- «Экспресс» для двоих
- SPA для двоих в будни
- SPA для двоих (запись через администратора)
- «Ретрит» для двоих
- «Весна» для двоих

## Логика фильтрации в отчётах
Если `service_cost < price_min * 0.5` — запись исключается из парных (предполагается, что второй клиент не пришёл). Пример: 18.03.2026 «Экспресс» для двоих, service_cost=5310, price_min=11800 → 5310 < 5900 → исключена.

## API
- GET /analytics/couple-programs/{year}/{month}
- Ответ: `{"couple_days": { "4": [{"service_title":..., "staff_name":..., "visit_pay":...}] } }`