# DEPLOY_STATUS

Status: runtime
Owner: Dmitry Vasin
Last Updated: 2026-05-14

## Frontend — lovi-web
- Платформа: Render (static site)
- Репозиторий: github.com/dvasincom-sketch/lovi-web
- Ветка: main → autodeploy
- URL: https://lovi.today
- Статус: ✅ живой
- Последний деплой: 2026-05-14

## Backend — insalon
- Платформа: Render (web service)
- Репозиторий: github.com/dvasincom-sketch/insalon
- Ветка: main → autodeploy
- URL: https://insalon.onrender.com
- Статус: ✅ живой
- Последний деплой: 2026-05-14

## Supabase
- Project: insalon
- Статус: ✅ живой
- Ключевые таблицы: salons, service_strategies, bookings, users, dev_sessions

## Деплой команды
### Frontend
```bash
cd ~/lovi-web && npm run build && git add -A && git commit -m "..." && git push
```
### Backend
```bash
cd ~/insalon && git add -A && git commit -m "..." && git push
```
