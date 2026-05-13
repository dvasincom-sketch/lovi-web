# INSALON_PRODUCT

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- VISION.md
- SYSTEM_ARCHITECTURE.md
- PAYROLL_RULES.md
- FITMOST_ACCOUNTING.md
- FINANCIAL_MODEL.md

## Идентичность
- Название: Insalon
- Тип: SaaS управленческая аналитика для beauty/SPA салонов
- Цель: предоставить владельцам и управляющим P&L, эффективность мастеров, обязательства, денежный поток
- Фаза: development
- Домен: check.moscow (Tilda заглушка)
- API: insalon.onrender.com
- GitHub: github.com/dvasincom-sketch/insalon

## Ключевые принятые решения
1. **Выручка из transactions, не из records.service_cost** — transactions точнее отражает авансы и доплаты.
2. **Абонементы** для мастера: прайс × 0.7 (скидка 30%). Продажа абонемента — в день оплаты, начисление мастеру — в день использования.
3. **Скользящие 30 дней** для KPI вместо календарного месяца.
4. **Fitmost** выручка учитывается по period (месяц визита), не по дате платежа.
5. **Аренда салона** (Гилтон) учитывается по period: платёж 25-го за следующий месяц.
6. **Проектная разметка** транзакций позволяет строить чистый P&L только по салону.
7. **Пагинация Supabase** (fetch_all) для таблиц >1000 строк.
8. **Овердрафт ИП** = операционный инструмент, тело = financing, проценты = overdraft_interest.