# ROUTING

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

## Lovi страницы
| Путь | Компонент | Описание |
|------|-----------|----------|
| / | Home | Главная |
| /my-bookings | MyBookings | Брони клиента |
| /confirm | Confirm | Подтверждение оплаты |
| /reset-password | ResetPassword | Сброс пароля |
| /connect | Connect | YCLIENTS marketplace connect |
| /salon/dashboard | SalonDashboard | Кабинет партнёра |
| /salon/onboarding | SalonOnboarding | Онбординг |
| /salon/login | SalonLogin | Вход в кабинет |
| /salon/auth | SalonAuth | Magic link авторизация |
| /about | ComingSoon | О сервисе |
| /pass | ComingSoon | Lovi Pass |
| /partners | Partners | Партнёрам |
| /PartnerLanding | PartnerLanding | Лендинг для салонов |
| /privacy | ComingSoon | Политика |
| /offer | ComingSoon | Оферта |
| /unsubscribe | Unsubscribe | Отписка |
| /library | Library | Библиотека статей |
| /research | Research | Исследования |
| /research/dataset | Dataset | Датасет |
| /investor | Investorlanding | Инвесторам |
| /zone-map | ZoneMap | Аналитика зон (standalone) |

## Якоря главной страницы (Home)
- `#featured` — BentoGrid
- `#slots` — AllSlots
- `#about` — Hero

## Межстраничный скролл
Используется `sessionStorage.setItem('scrollTo', id)` → `navigate('/')` → `ScrollToTop.jsx` читает ключ и скроллит через `MutationObserver`.