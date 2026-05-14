# ENGINEERING_CONVENTIONS

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-14

## Правила правок кода
- Правка < 300 символов → команда в терминал (python3 /tmp/fix.py)
- Правка > 300 символов → генерировать новый файл целиком
- НИКОГДА не регенерировать весь файл ради точечного изменения
- Максимум 4 правки подряд через update → потом rewrite

## Терминал
- Скрипты писать в /tmp/: `cat > /tmp/fix.py` → `python3 /tmp/fix.py`
- zsh ломает heredoc со спецсимволами → всегда использовать /tmp/
- Деплой только после локальной проверки на localhost:8000
- Коммит после каждого изменения: `git add . && git commit -m "..." && git push`

## Данные
- Проверять только через SQL в Supabase SQL Editor
- Никогда не угадывать схему таблицы — сначала проверить

## Деплой
- Backend: ~/insalon → git push → Render autodeploy
- Frontend: ~/lovi-web → npm run build → git push → Render autodeploy
