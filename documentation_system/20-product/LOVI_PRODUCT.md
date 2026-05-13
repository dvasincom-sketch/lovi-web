Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Related Documents:
- VISION.md
- FRONTEND_ARCHITECTURE.md
- DESIGN_SYSTEM.md

## Идентичность
- Название: Lovi
- Тип: Клиентская витрина для бронирования слотов в beauty/SPA салонах
- Цель: Дать клиентам возможность находить и бронировать свободные окошки со скидкой

## Ключевые принятые решения
1. Дизайн-система «Quiet Luxury» (см. DESIGN_SYSTEM.md).
2. Стратегии скидок на основе времени до слота (premium, popular, step).
3. Интеграция с YCLIENTS для получения услуг и слотов.
4. Оплата через ЮKassa при бронировании.
5. Кэшбэк на баланс Lovi при отмене (YooKassa refund не реализован).