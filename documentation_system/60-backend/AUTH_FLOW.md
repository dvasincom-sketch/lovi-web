# AUTH_FLOW

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

## Insalon
- OAuth2 подключение к YCLIENTS: /connect → YCLIENTS → /oauth/callback → сохранение токена в Supabase (salons).
- Webhook disconnect для отслеживания отзыва доступа.

## Lovi
- Аутентификация пользователей через magic link: /salon/magic-link (отправка) → /salon/auth (верификация и выдача JWT).
- Endpoints салона защищены JWT.