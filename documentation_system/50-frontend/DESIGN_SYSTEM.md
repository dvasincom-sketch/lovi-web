# DESIGN_SYSTEM

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

## Цвета «Quiet Luxury»
```css
--bg:        #FDFCF9   /* Cashmere White */
--dark:      #121A12   /* Deep Forest */
--accent:    #F97316   /* Lovi Orange */
--border:    rgba(18,26,18,0.06)
--secondary: #8F8475   /* Muted Taupe */

Типографика

Заголовки: Playfair Display
Интерфейс: Inter
Все компоненты должны использовать эти переменные, без жёстко заданных цветов.

# /docs/50-frontend/UI_LIBRARY.md

```md
# UI_LIBRARY

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes

Эталонная дизайн-система реализована в `src/pages/UI.jsx`. Это единственный источник правды для компонентов. Новые компоненты после одобрения добавляются в UI.jsx.

## Состав UI.jsx (актуально на 2026-05-11)
| Секция | id |
|---|---|
| Colors | colors |
| Typography | typography |
| Icons (40+) | icons |
| Tooltip / Tip | tooltip |
| Buttons | buttons |
| Badges | badges |
| Inputs + Chips | inputs |
| Cards (Sub/Dark/Pass) | cards |
| Nav Moods | nav-moods |
| Live Status | live-status |
| Slot Card (стопка) | slot-card |
| Timer | timer |
| Toggle | toggle |
| Pills / Tags | pills |
| Counter + Калькулятор | counter |
| Drawer (right + bottom) | drawer |
| Accordion | accordion |
| Hero (dark + light) | hero |
| Feature-блоки | features |
| Steps | steps |
| Timeline / Roadmap | timeline |
| Testimonials | testimonials |
| Logo Row | logo-row |
| Grids (2/3/4-col + bento) | grids |
| Comparison Table | comparison-table |
| Article Card | article-card |
| CTA | cta |
| Form | form |
| shadcn-подобные (Dialog, DatePicker...) | planned |