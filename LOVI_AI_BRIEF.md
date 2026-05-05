# LOVI.TODAY — Знания сессии 05.05.2026

> Этот документ содержит всё что было сделано, решено и понято в сессии 05.05.2026.
> Положить в корень репозитория `lovi-web` как `LOVI_AI_BRIEF.md`

---

## 1. ЧТО ТАКОЕ LOVI

**Lovi.today** — Yield Management система для wellness-салонов Москвы.
Концепция: «Uber для горящих окошек». Пустые слоты салона выставляются со скидкой за 1-3 часа до начала. 100% предоплата. Клиент получает премиум-сервис дешевле, салон заполняет расписание.

**Домен:** lovi.today (куплен)
**Прод:** https://lovi-web.onrender.com
**Бэкенд API:** https://insalon.onrender.com (shared с Insalon)
**GitHub:** https://github.com/dvasincom-sketch/lovi-web
**Локальная разработка:** `~/lovi-web/` (фронт), `~/insalon/` (бэкенд)

---

## 2. БИЗНЕС-ЛОГИКА

### Pricing Engine (Step Discount Strategy)
```
> 1440 мин до слота  → скидка 10%
60–1440 мин          → скидка 15%  
< 60 мин             → скидка 40%
```

Класс `StepDiscountStrategy` в `app/routers/lovi.py`.
Переключение стратегии — одна строка в конфиге (`STRATEGY = StepDiscountStrategy()`).
Следующая стратегия: `ExponentialStrategy` (Uber-style, формула `1 - 0.65 * e^(-t/45)`).

### Weekday/Weekend логика
- **Будни (пн-пт):** только одиночные программы (один мастер в смене)
- **Выходные (сб-вс):** парные программы доступны (два мастера)
- Определяется через `_weekday = datetime.now().weekday()` в `/api/lovi/featured`

### Временной гэп
Слоты показываются только если до них **≥ 60 минут** — чтобы клиент успел доехать.
Фильтр: `slot_dt.timestamp() - datetime.now(tz=timezone.utc).timestamp() >= 3600`

### Активные услуги (только проверенные ID)

**Будни — одиночные:**
```python
{"id": 24560829, "name": "«Перерождение» (Premium Head SPA)", "category": "head"},
{"id": 24562251, "name": "«Гималайский дзен» (Relax Head SPA)", "category": "head"},
{"id": 24562305, "name": "«Гималайский экспресс» (Express Head SPA)", "category": "head"},
{"id": 19655588, "name": "SPA для мужчин «Самурай»", "category": "spa"},
{"id": 19658183, "name": "Массаж спины", "category": "back"},
{"id": 19658189, "name": "Массаж всего тела", "category": "body"},
{"id": 19658225, "name": "Массаж шейно-воротниковой зоны", "category": "neck"},
```

**Выходные — парные:**
```python
{"id": 19556779, "name": "«Перерождение» для двоих", "category": "spa"},
{"id": 19655561, "name": "SPA для двоих в будни", "category": "spa"},
{"id": 19556836, "name": "«Экспресс» для двоих", "category": "spa"},
{"id": 19655588, "name": "SPA для мужчин «Самурай»", "category": "spa"},
```

**ВАЖНО:** Услуги с ID 22296048, 22296054, 22296057 — **В АРХИВЕ**, не использовать!
Дополнительные услуги (массаж лица, пенный массаж, паровая баня) — только как add-on к основной программе, не показывать как самостоятельные.

### Физическая информация о салоне
- **Название:** Head Spa Beauty
- **Адрес:** ул. Миклухо-Маклая 37
- **Метро:** 5 мин пешком от м. Беляево
- Всегда писать строчными буквами, НЕ капслоком

---

## 3. TECH STACK LOVI-WEB

```
~/lovi-web/
├── src/
│   ├── App.jsx              — роутер (/ и /ui)
│   ├── index.css            — CSS переменные, chip класс, keyframes
│   ├── components/
│   │   ├── Nav.jsx          — sticky nav с mood фильтрами
│   │   ├── Hero.jsx         — hero с поиском и chips
│   │   ├── BentoGrid.jsx    — главная сетка с реальными данными
│   │   ├── AllSlots.jsx     — горизонтальный скролл всех слотов
│   │   └── Ticker.jsx       — бегущая строка
│   ├── pages/
│   │   └── UI.jsx           — дизайн-система (эталон всех компонентов)
│   └── hooks/
│       └── useIsMobile.js   — хук для мобильной адаптации
```

**Стек:** Vite + React + Tailwind v4 + shadcn/ui
**Деплой:** Render (Static Site), автодеплой из GitHub main
**Сборка:** `npm run build` → `dist/`

---

## 4. ДИЗАЙН-СИСТЕМА (Quiet Luxury)

### Цветовая палитра
```css
--bg: #FDFCF9      /* Cashmere White — основной фон */
--dark: #121A12    /* Deep Forest — типографика, тёмные карточки */
--accent: #F97316  /* Lovi Orange — кнопки, таймеры, акценты */
--border: rgba(18,26,18,0.06)
--secondary: #8F8475  /* Muted Taupe — вторичный текст */
```

### Правила применения
- `--accent` ТОЛЬКО на: кнопки CTA, таймер когда < 15 мин, live dot
- `--dark` на: типографика, тёмные карточки, nav активный элемент
- Фон всегда `--bg` (Cashmere White)

### Шрифты
- **Заголовки:** Playfair Display (serif) — эмоции, премиальность
- **Данные/интерфейс:** Inter — технологичность, данные
- Комбинация serif + sans-serif = "технологичный люкс"

### CSS классы (эталон)
```css
.chip {
  padding: 7px 16px; border-radius: 20px;
  border: 1px solid var(--border); font-size: 12px;
  color: var(--secondary); background: transparent; cursor: pointer;
  transition: all 0.2s;
}
.chip:hover { border-color: var(--dark); color: var(--dark); }
.chip.active { background: var(--dark); color: #fff; border-color: var(--dark); }
```

### Концепция "Time Stream"
Витрина — не магазин, а **биржа времени**. Ключевые принципы:
- Время слота (17:00) — самый крупный элемент
- Живые таймеры создают ощущение дефицита
- "Горящие окошки" = пустые слоты которые салон теряет

---

## 5. BENTO GRID — АРХИТЕКТУРА

### Структура featured карточки (большая тёмная)
```
[ЛУЧШЕЕ ПРЕДЛОЖЕНИЕ]          [2:19:42 до исчезновения окошка]

17:00                          ← огромный акцент

«Название программы»
📍 Head Spa Beauty · ул. Миклухо-Маклая 37 · 5 мин от м. Беляево

5 900 ₽  на сайте салона напрямую    [-15%] [Забрать за 5 015 ₽]
                                      100% предоплата  СБП  Apple Pay  T-Pay
```

**Ключевые решения:**
- Цена салона (5 900 ₽) показывается как **реальная точка отсчёта** — это не "старая" маркетинговая цена, это реальная стоимость если бронировать напрямую
- Цена Lovi только в кнопке "Забрать за X ₽"
- Скидка (-15%) слева от кнопки на одной строке
- Таймер вверху рядом с "Лучшее предложение"
- NO зачёркивания старой цены

### useTimer — правильная реализация
```javascript
function useTimer(sec) {
  const [s, setS] = useState(0)
  useEffect(()=>{
    if(!sec) return
    setS(sec)  // инициализируем после загрузки данных
    const t=setInterval(()=>setS(v=>v>0?v-1:0),1000)
    return()=>clearInterval(t)
  },[sec])
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60
  const str=h>0?h+':'+String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0'):
            String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0')
  return { str, pct: sec?Math.max(0,(s/sec)*100):0, urgent: s<=900 }
}
```
**ВАЖНО:** `sec` передаётся как `slot.minutes_to_slot * 60` из API. Часы отображаются явно (2:19:42 а не 139:42).

### API данные для BentoGrid
```javascript
fetch(`https://insalon.onrender.com/api/lovi/featured?date=${today}`)
// Возвращает: { date, slots: [{time, datetime, service_id, service_name, 
//               category, duration_min, base_price, lovi_price, 
//               discount_pct, minutes_to_slot}] }
```

---

## 6. API ENDPOINTS (lovi роутер)

Файл: `~/insalon/app/routers/lovi.py`

| Эндпоинт | Описание |
|----------|---------|
| `GET /api/lovi/featured?date=YYYY-MM-DD` | Топ слоты дня с weekday/weekend логикой |
| `GET /api/lovi/slots?date=&service_id=` | Слоты конкретной услуги |
| `GET /api/lovi/price?base_price=&slot_time=` | Рассчитать цену слота |

**Подключение роутера** в `app/main.py`:
```python
from app.routers import ..., lovi
app.include_router(lovi.router)
```

---

## 7. СТРАНИЦА /UI — ДИЗАЙН-СИСТЕМА

URL: `https://lovi-web.onrender.com/ui`

**Принцип:** Страница `/ui` — единственный эталон. Если элемент ломается на одной странице — ломается везде. Если появляется новый элемент — сначала добавляется в `/ui`.

**Секции:**
1. Цвета / Colors
2. Типографика / Typography  
3. Кнопки / Buttons (Primary, Secondary, Ghost, Small, Mobile Sticky CTA)
4. Бейджи / Badges
5. Поля ввода / Inputs (Search Bar shadcn + Chips)
6. Карточки / Cards (SubCard, Dark card, Pass card)
7. Навигация / Nav Moods
8. Запланировано из shadcn / Planned (Dialog, DatePicker, Select, Toast, Skeleton, Sheet, Tabs, Avatar)

---

## 8. MOBILE АДАПТАЦИЯ

**Хук:** `src/hooks/useIsMobile.js` — `window.innerWidth < 768`

**Мобильный sticky CTA:**
```jsx
{isMobile && slot1 && (
  <div style={{position:'fixed',bottom:0,...}}>
    <button>Забрать за {fmt(slot1.lovi_price)}</button>
    <div>СБП · Apple Pay · T-Pay</div>
  </div>
)}
```

**Haptic feedback при бронировании:**
```javascript
if(navigator.vibrate) navigator.vibrate([10,50,10])
```

**Grid адаптация:** `gridTemplateColumns: isMobile ? '1fr' : 'repeat(12,1fr)'`

---

## 9. КАТЕГОРИИ УСЛУГ

Используются в AllSlots для фильтрации:

| category | Описание |
|----------|---------|
| `spa` | SPA программы (парные в выходные) |
| `head` | Программы для головы (HeadSPA) |
| `back` | Массаж спины |
| `neck` | Массаж шейно-воротниковой зоны |
| `body` | Массаж всего тела |
| `face` | Массаж лица (дополнительная услуга, не показывать как основную) |

---

## 10. ANTI-PATTERNS

- **НЕ показывать** услуги из архива YCLIENTS (нет активного флага в БД — только вручную проверенные ID)
- **НЕ показывать** дополнительные услуги (массаж лица, пенный массаж, паровая баня) как самостоятельные
- **НЕ показывать** парные программы в будни (один мастер = нет второго для пары)
- **НЕ фильтровать** по `base_price >= 3000` — убрано, показываем все категории
- **НЕ писать** адрес КАПСЛОКОМ — только строчные
- **НЕ дублировать** таймер — только в одном месте (eyebrow)
- **НЕ зачёркивать** старую цену — это реальная цена салона, не маркетинговый приём
- **НЕ использовать** `dataPointSelection` в ApexCharts (из Insalon anti-patterns)
- **НЕ хранить** dist/ в .gitignore для lovi-web — JS бандл должен быть в git

---

## 11. СЛЕДУЮЩИЕ ШАГИ

### P0 — Критично
1. **Подключить кнопку "Забрать"** к реальному booking flow через YCLIENTS API
2. **Интеграция YooKassa** — создание платежа при нажатии "Забрать"
3. **Страница подтверждения** — после успешной оплаты
4. **Приложение YCLIENTS разблокировать** — сейчас на модерации, нужно для подключения других салонов

### P1 — Важно
5. **Перенос бэкенда** на отдельный сервер для Lovi (сейчас shared с Insalon)
6. **Домен lovi.today** — настроить DNS на Render
7. **Реальные фото** салона вместо градиентных заглушек в карточках
8. **Счётчик просмотров** слота — для `g(d)` в pricing формуле

### P2 — Планируется
9. **Continuous Dynamic Pricing** (Exponential strategy) — после накопления данных
10. **Первые партнёры** — другие салоны через OAuth YCLIENTS
11. **Лендинг для B2B** — страница "Подключить салон"
12. **Единый абонемент** — реальная логика продажи и использования
13. **Geolocation** — определять расстояние до салона вместо статичных "5 мин от м. Беляево"
14. **Telegram бот** — алерты "Горящее окошко рядом с тобой"

---

## 12. КАК ЗАПУСТИТЬ ЛОКАЛЬНО

```bash
# Терминал 1 — бэкенд
cd ~/insalon && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Терминал 2 — фронт
cd ~/lovi-web && npm run dev
# http://localhost:5173
```

**Проверка API:**
```bash
curl -s "http://localhost:8000/api/lovi/featured" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(f'Slots: {len(d[\"slots\"])}')
for s in d['slots']:
    print(s['time'], s.get('category'), s['lovi_price'], s['service_name'])
"
```

**Деплой:**
```bash
# Бэкенд (insalon)
cd ~/insalon && git add -A && git commit -m "feat: ..." && git push

# Фронт (lovi-web)
cd ~/lovi-web && git add -A && git commit -m "feat: ..." && git push
# Render автодеплоится из main
```

---

## 13. СТРАТЕГИЯ РОСТА

### Growth Loop #1 — PLG Viral
Лейбл "Powered by Lovi" внизу виджета записи → владельцы других салонов видят UX → становятся лидами.

### Growth Loop #2 — Data Network
Чем больше салонов → тем точнее бенчмарки по районам Москвы → тем ценнее аналитика для B2B.

### Метрики успеха
- **IFR** (Inventory Fill Rate) — % заполненных горящих слотов
- **Booking Conversion Lift** — рост конверсии vs стандартный виджет YCLIENTS
- **Take Rate** — средняя комиссия с транзакции (целевая: 15-20%)

### Защитный ров
Data Density — агрегация реального наличия мест в реальном времени. YCLIENTS имеет данные но не отдаёт аналитику "сосед vs сосед". Lovi строит этот слой поверх.

---

## 14. ВАЖНЫЕ РЕШЕНИЯ ЭТОЙ СЕССИИ

| Решение | Причина |
|---------|---------|
| Bento Grid вместо списка строк | Визуальная иерархия, "биржевой" вид |
| Цена салона как точка отсчёта (не зачёркнутая) | Это реальная цена, не маркетинговый трюк |
| Таймер в eyebrow, не в теле карточки | Контекстуально связан с "Лучшее предложение" |
| Weekday/weekend логика услуг | Парные программы требуют 2 мастеров |
| Гэп 60 минут до слота | Клиент должен успеть доехать |
| Step Discount (не Exponential) на старте | Проще объяснить, меньше рисков |
| Shared бэкенд с Insalon | Быстрый старт, потом разделить |
| Render для деплоя | Уже настроен для Insalon |
| shadcn/ui для форм и модалов | Только там где реально ускоряет |
| /ui страница как эталон | Единый источник правды для компонентов |

---

*Документ создан: 05.05.2026*
*Следующая сессия: продолжить с подключения booking flow к кнопке "Забрать"*

---

## 15. КАК МЫ РАБОТАЕМ С AI

### Путь к файлам фронтенда
/Users/dmitryvasin/lovi-web/src/components/

### Как запустить локально
```bash
# Фронт
cd ~/lovi-web && npm run dev
# http://localhost:5173

# Бэкенд
cd ~/insalon && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
```

### Правила работы с Claude
- **Мелкие правки** (типографика, цвета, отступы, одна строка) — сразу через `str_replace` напрямую в файл по абсолютному пути, без обмена файлами
- **Крупные изменения** (новый компонент, рефактор, новая логика) — создаём файл через артефакт, скачиваем
- Контекст проекта держим в `LOVI_AI_BRIEF.md` в корне репозитория
- Перед новой сессией — закидываем `LOVI_AI_BRIEF.md` в чат чтобы Claude знал весь контекст
