# ANTI_PATTERNS

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13

## Insalon
- Не использовать `records.service_cost` для выручки.
- Не считать `service_cost = 0` отсутствием выручки (абонемент/сертификат).
- Не смешивать личные расходы с бизнесом (разметка project).
- Не считать выплаты 1-го числа текущим месяцем.
- Не использовать дату платежа для аренды/Fitmost — нужен period.
- Не забывать пагинацию Supabase (fetch_all).
- Не считать наличные авансом мастеру.
- Не использовать `dataPointSelection` в ApexCharts, только `markerClick`.
- Не строить расписание только из records.
- В Tabler UI не использовать `bootstrap.Modal`.

## Lovi
- Не хардкодить цвета, только CSS-переменные.
- Иконки только lucide-react через <Icon>.
- Не трогать существующий контент без явного запроса.
- Именование: PascalCase компоненты, camelCase утилиты.