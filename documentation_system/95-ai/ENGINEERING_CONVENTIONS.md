# ENGINEERING_CONVENTIONS

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13

- Данные проверять только через SQL в Supabase SQL Editor.
- Скрипты писать в `/tmp/`: `cat > /tmp/fix.py` → `python3 /tmp/fix.py`.
- zsh ломает heredoc со спецсимволами → всегда использовать /tmp/.
- Деплой только после локальной проверки на localhost:8000.
- Коммит после каждого файла: `git add . && git commit -m "..." && git push`.