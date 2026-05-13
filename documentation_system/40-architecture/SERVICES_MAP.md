# SERVICES_MAP

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

## Модули Insalon
| Модуль | Назначение | Статус |
|--------|-----------|--------|
| app/main.py | FastAPI app, роутеры, StaticFiles | done |
| app/database.py | Supabase клиент | done |
| app/yclients.py | YCLIENTS API клиент | done |
| app/analytics.py | Расчёты инсайтов | done |
| app/routers/sync.py | /sync/* | done |
| app/routers/analytics.py | /analytics/* | done |
| app/routers/checks.py | /checks/* | done |
| app/routers/oauth.py | /connect, /oauth/callback | done |
| app/routers/webhooks.py | /webhook/* | done |
| scripts/import_bank.py | Импорт выписки ИП | done |
| scripts/import_personal.py | Импорт выписки физ.карты | done |
| cron (planned) | Ежедневная автосинхронизация | planned |

## Модули Lovi
- React-приложение (lovi/), обслуживается статикой через FastAPI или отдельный хостинг.
- Ключевые эндпоинты `/api/lovi/*` реализованы в insalon backend (добавлены роуты).