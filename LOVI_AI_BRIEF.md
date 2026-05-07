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

### Важно про деплой
- `dist/` должен быть в git (убран из `.gitignore`)
- После любых изменений: `npm run build` → `git add -A` → `git commit` → `git push`
- Render деплоит статику из `dist/`, автосборки нет

---

## 16. ИТОГИ СЕССИИ 05.05.2026

### Новые компоненты
- `src/components/HeroNew.jsx` — новый первый экран с Live Shuffle анимацией карточек и дашбордом статуса
- Старый `Hero.jsx` перенесён вниз страницы (перед `Ticker`) как философский блок

### Структура App.jsx
Nav → HeroNew → BentoGrid → AllSlots → Hero → Ticker

### HeroNew — архитектура
- Левая колонка: заголовок + subtitle + плашка «Прямо сейчас» + три метрики дашборда
- Правая колонка: Live Shuffle карточки (5 хардкодных примеров, меняются каждые 3.2с) + объяснение механики
- Три live-числа: `useLiveNumber(target, duration)` — easeOut рост → колебания ±1
- Числа не уходят в минус: `Math.max(1, v + delta)`
- На мобильном: правая колонка под левой

### Дашборд статуса (левая колонка HeroNew)
- Тёмная плашка «● ПРЯМО СЕЙЧАС» с мерцающей точкой
- Три метрики в grid: горящих окна / салонов / районов
- Разделители через `gap:1, background: var(--border)` на враппере

### BentoGrid — скрытые элементы
- `PassCard` («Единый абонемент») — скрыта через `display:'none'` на строке 373
- «Для салонов» — скрыта через `display:'none'`
- Оба блока перенесены в `/ui` как задокументированные компоненты

### AllSlots — обновления
- Переименован в «Ближайшие окошки»
- Фон секции: `#F1F0EC`
- Карточки следующего дня: фон `#F1F0EC`, лейбл с датой сверху («Завтра» / «7 мая»)
- Fallback логика перенесена на бэкенд, фронт всегда запрашивает `today`

### BentoGrid — мелкие правки
- «Available at» → «Запись на»
- Убран эмодзи 👁 из SubCard
- Подпись «на сайте салона напрямую» на новой строке через `<br/>`

### Ценообразование — три стратегии (lovi.py)
```python
PremiumDiscountStrategy:   ≤24ч → 40%, ≤48ч → 35%, ≤72ч → 20%
PopularDiscountStrategy:   ≤24ч → 35%, ≤48ч → 20%
StepDiscountStrategy:      >1440мин → 10%, >60мин → 15%, <60мин → 40%
```

### Привязка стратегий к услугам
**Будни:**
- Premium: `24560829` («Перерождение» Premium Head SPA), `26949774` («Весна: 9 трав»)
- Popular: `19658225` (Массаж ШВЗ), `19658183` (Массаж спины)
- Step: всё остальное

**Выходные:**
- Premium: `28219353` («Весна» для двоих), `19556779` («Перерождение» для двоих), `19655561` (SPA для двоих), `19556836` («Экспресс» для двоих)
- Step: остальные парные

### Теги слотов (проставляются в /api/lovi/featured)
- `"Лучшее предложение"` → первый слот со стратегией premium
- `"Популярное"` → первый слот со стратегией popular
- `null` → все остальные
- `"Топ по отзывам"` → беклог (нужен перенос отзывов из YCLIENTS в Supabase)

### Fallback логика в /api/lovi/featured
1. Ищем слоты на запрошенную дату
2. Если нет premium — ищем вперёд до 7 дней, добавляем премиум в начало
3. Если слотов < 3 — берём следующий день целиком
4. Каждый слот содержит поле `slot_date` (YYYY-MM-DD)

### Дубликат эндпоинта — исправлен
В `lovi.py` был дублирующий `@router.get("/featured")` — удалён, остался один правильный.

### Услуги — важные ID
| ID | Название | Цена | Статус |
|----|---------|------|--------|
| 24560829 | «Перерождение» Premium Head SPA | 10 900 | активна |
| 26949774 | «Весна: 9 трав» | 12 900 | активна |
| 26522085 | «Весна: 9 трав» (старая) | 12 900 | неактуальна |
| 28219353 | «Весна» для двоих | 25 800 | выходные |
| 19556779 | «Перерождение» для двоих | 21 800 | выходные |
| 19658225 | Массаж ШВЗ | — | популярное |
| 19658183 | Массаж спины | — | популярное |
| 22296048, 22296054, 22296057 | — | — | В АРХИВЕ |

### Беклог (не сделано, важно)
- «Топ по отзывам» — перенос рейтингов мастеров из YCLIENTS в Supabase
- «Популярное» — управление через Supabase (флаг `is_popular` на услуге)
- Кнопка «Забрать» → booking flow через YCLIENTS API (P0)
- YooKassa интеграция (P0)
- Страница подтверждения после оплаты (P0)

### Деплой (обязательный порядок)
```bash
# Бэкенд
cd ~/insalon && git add -A && git commit -m "..." && git push

# Фронт — ВСЕГДА build перед push
cd ~/lovi-web && npm run build && git add -A && git commit -m "..." && git push
```
`dist/` убран из `.gitignore` — Render деплоит статику из него напрямую.


---

## 17. ИТОГИ СЕССИИ 05.05.2026 (часть 2)

### SlotDrawer.jsx — новый компонент
- Файл: `src/components/SlotDrawer.jsx`
- Открывается по клику «Забрать» в BentoGrid и AllSlots
- Десктоп: модал справа (slideRight), мобайл: drawer снизу (slideUp)
- Закрывается по Escape, клику на оверлей, кнопке ✕
- Блокирует скролл страницы пока открыт

### SlotDrawer — содержимое
- Название услуги, дата/время, длительность
- Таймер исчезновения (urgent < 15 мин → оранжевый)
- Мастер — загружается отдельным запросом `GET /api/booking/staff`
- Цена салона (зачёркнута) → Lovi цена + бейдж скидки
- Форма: имя + телефон (временно — пока нет авторизации)
- Кнопка «Оплатить X ₽» → `POST /api/lovi/book` → redirect YooKassa

### SlotDrawer — expired state
Если таймер истёк пока drawer открыт:
> «Такое бывает, но окошко уже недоступно, сейчас поищем похожие!»
Кнопка «Смотреть другие окошки» → закрывает drawer

### /api/lovi/book — новый эндпоинт
- Создаёт бронь в Supabase (`source: "lovi"`)
- Создаёт/находит клиента в YCLIENTS
- Создаёт запись в YCLIENTS (fire-and-forget)
- Создаёт платёж YooKassa с `return_url: lovi-web.onrender.com/confirm?booking_id=...`

### Confirm.jsx — страница подтверждения
- Файл: `src/pages/Confirm.jsx`
- Роут: `/confirm?booking_id=...`
- Polling каждые 2.5с пока статус не `paid` (макс 12 попыток)
- Показывает детали брони при статусе `paid` и `waiting_payment`
- Мастер загружается отдельным запросом
- Кнопки: маршрут в Яндекс Картах, перенос/отмена через WhatsApp
- Обработка ошибок: `data.error`, `data.detail`, сетевые ошибки → экран «Бронь не найдена»

### Беклог — разобрать в следующей сессии
- Ошибка «Ошибка создания платежа» в SlotDrawer — `BOOKING_BASE_URL` указывает на localhost, нужно поменять на `https://lovi-web.onrender.com` в env на Render
- Форма имя/телефон в drawer — убрать после реализации авторизации
- Авторизация — данные клиента брать из профиля автоматически
- SlotDrawer — проверить передачу `datetime` в правильном формате для `/api/booking/staff`

### Env переменные на Render (insalon)
Нужно проверить и обновить:
- `BOOKING_BASE_URL` → `https://lovi-web.onrender.com`
- `YOOKASSA_SHOP_ID` → боевой ID (сейчас test_)
- `YOOKASSA_SECRET_KEY` → боевой ключ (сейчас test_)


---

## 18. ИТОГИ СЕССИИ 06.05.2026

### HeroNew — карточки Live Shuffle
- 356 400 уникальных комбинаций из справочника (5×9×6×10×120×4)
- Рандомный seed при каждой загрузке страницы
- 5 цветовых палитр в земляных тонах: #8F8475, #6B6358, #E8E4DC, #3D3830, #C8BFB0
- Tinder-style swipe: верхняя карточка улетает вправо с поворотом, нижние поднимаются
- Радиальный блик через CSS gradient внутри карточки
- Структура карточки: локация+таймер → услуга+описание → контекст(заголовок+причина)
- Интервал смены: 6 сек

### HeroNew — фон первого экрана
- Горизонтальный градиент: #FDFCF9 → #E8E4DC
- Радиальный блик в центре-левее для подсветки заголовка
- SVG grain поверх (opacity: 0.025) через feTurbulence + feColorMatrix

### BentoGrid — правки
- SubCard redesign: крупное время (44px Playfair), цена зачёркнута + скидка, итог в кнопке
- «Окошки улетают за 10 мин» — если minutes_to_slot > 240
- Кнопка «Забрать» на мобильном — внутри карточки, не фиксированная
- Выравнивание по левому краю на мобильном

### AllSlots — правки
- Сортировка по minutes_to_slot на фронте (ближайшие слева)

### SlotInfoDrawer.jsx — новый компонент
- Файл: `src/components/SlotInfoDrawer.jsx`
- «Паспорт слота» — полная информация перед бронированием
- Фото салона (заглушка Unsplash), название услуги поверх
- Время и дата крупно, длительность
- Описание услуги (хардкод по service_id, 8 услуг)
- Мастер (загружается через /api/booking/staff)
- Цена: зачёркнутая → Lovi цена + скидка на тёмном фоне
- Адрес + кнопка Яндекс Карты
- Контакты: телефон + WhatsApp
- Условия визита: 4 пункта
- CTA «Забрать за X ₽» → открывает SlotDrawer с формой оплаты

### Booking flow — финальная схема
Клик карточки → SlotInfoDrawer (информация)
→ «Забрать за X ₽» → SlotDrawer (форма: имя+телефон с маской +7)
→ POST /api/lovi/book → YooKassa redirect
→ /confirm?booking_id=N → polling → детали брони

### Баги исправлены
- Дублирующий роут `/api/booking/booking/{id}` → `/api/booking/{id}`
- `source` колонка добавлена в Supabase bookings
- `LOVI_BASE_URL` отдельная env переменная на Render
- Маска телефона +7 в SlotDrawer
- SPA routing через render.yaml + _redirects

### Беклог
- Описания услуг перенести из хардкода в Supabase (колонка `description`)
- Фото салона — реальные фото вместо Unsplash заглушки
- Авторизация — убрать форму из SlotDrawer когда будет профиль
- Поиск и фильтры в HeroNew — пока не функциональны
- Топ по отзывам — рейтинги из YCLIENTS в Supabase

---

## 20. ИТОГИ СЕССИИ 06.05.2026 — Frontend рефакторинг + города + ValueCard

### Что сделано

#### CityPicker → Modal
- Дропдаун заменён на полноценное модальное окно (паттерн SlotDrawer)
- Мобайл: drawer снизу + хэндл + `slideUp` анимация
- Десктоп: центрированный modal + `fadeIn` анимация
- Поиск фильтрует оба раздела одновременно, Escape закрывает, скролл блокируется
- Новый prop `onCityChange` в Nav → прокидывается из App

#### Мультигород
- `city` state в `App.jsx → Home`, прокидывается в `Nav` и `HeroNew`
- `isMoscow = city === 'Москва'` — при других городах скрываются BentoGrid, AllSlots, Hero, Ticker
- В HeroNew: заголовок и подзаголовок меняются динамически
- `ComingSoonBlock` для не-Москвы: плашка «На стадии подключения» + форма email + форма для бизнеса

#### Новые таблицы Supabase (файл: `migrations_city_tables.sql`)
| Таблица | Назначение |
|---------|-----------|
| `city_waitlist` | Email-подписки «Узнать первым» об открытии города |
| `city_partner_requests` | Заявки владельцев салонов на подключение |

#### Новые API эндпоинты (lovi.py)
- `POST /api/lovi/city-waitlist` — подписка на город
- `POST /api/lovi/city-partner` — заявка салона

#### Hero.jsx — поиск с аналитикой
- Кнопка переименована в «Проверить доступность»
- Loading state: 4 сменяющиеся фразы каждые 500мс (1.8с)
- После — smooth scroll к `#value-card-section`
- `onSearch({ location, service })` → App → ValueCard
- Чипы заполняют нужное поле (район или услуга)
- `POST /api/lovi/search-intent` — fire-and-forget аналитика запросов (эндпоинт нужно добавить, таблица `search_intents`)

#### ValueCard.jsx — новый компонент
Место в дереве: `HeroNew → BentoGrid → AllSlots → Hero → ValueCard → Ticker`
- Появляется только после поиска (`searchQuery !== null`), анимация `fadeUp`
- Тёмный фон `#121A12` с оранжевым glow — в стиле featured-карточки
- Двухколоночный layout на десктопе:
  - Левая: три аргумента (Снайпер локаций, Свобода выбора, Закрытый доступ) с SVG-иконками
  - Правая: депозитный блок (`rgba(255,255,255,0.04)`) + CTA оранжевая кнопка
- Депозитный блок: шапка «Депозит, не расход» + бейдж `+10% на остаток` + 3 строки

#### SVG-иконки
Все эмодзи в компонентах заменены на inline SVG (stroke-based, 16×16):
- Pin, Grid, Lock — для аргументов ValueCard
- Vault, Infinity, Trend — для депозитного блока

### Автотесты (запланировано, не реализовано)
- Инструмент: `pytest + httpx`
- Структура: `tests/test_city_forms.py`, `tests/test_booking_flow.py`, `conftest.py`
- Три уровня: терминал → GitHub Actions (03:00 ночью) → Telegram алерт
- Принцип: тест всегда чистит за собой
- Email для тестов: `autotest@lovi.today`
- Добавить в следующей сессии вместе с `/api/lovi/search-intent`

### Структура файлов (актуально на 06.05.2026)
```
src/components/
  Nav.jsx          — навигация + CityModal + AuthModal
  HeroNew.jsx      — первый экран + ComingSoonBlock для не-Москвы
  BentoGrid.jsx    — сетка слотов (без overlay логики)
  AllSlots.jsx     — полный список слотов
  Hero.jsx         — поиск с loading state + аналитика
  ValueCard.jsx    — карточка Lovi Pass (появляется после поиска)
  Ticker.jsx       — бегущая строка
  SlotDrawer.jsx   — боковой drawer бронирования
  SlotInfoDrawer.jsx
```

### Беклог (обновлён)
- `POST /api/lovi/search-intent` + таблица `search_intents` — аналитика поисковых запросов
- Автотесты city-forms (pytest + httpx)
- Подключить кнопку «Активировать Lovi Pass» к реальному flow
- Описания услуг перенести из хардкода в Supabase
- Реальные фото салона
- Топ по отзывам — рейтинги из YCLIENTS
---

## DEV PRINCIPLES (Lean)

1. **Читай перед правкой** — всегда `cat file` перед изменением
2. **Один шаг → проверка** — не пачка изменений за раз
3. **Файлы через терминал** — `cat > file << 'EOF'`, не артефакты Claude
4. **Проверочная команда после каждого шага** — curl / npm run build / grep
5. **Не генерить если файл уже есть** — спросить сначала

---

## ИТОГИ СЕССИИ 07.05.2026

### Авторизация
- Таблица `users` в Supabase: id, name, email, password_hash, created_at
- Бэкенд: `app/routers/auth.py` — POST /api/auth/register, /api/auth/login, /api/auth/my-bookings, /api/auth/rate
- JWT токен (python-jose), bcrypt без passlib, pydantic[email]
- Nav.jsx: залогинен → аватар с инициалами + дропдаун (Мои брони, Выйти)
- Состояние user хранится в App.jsx, прокидывается через props

### MyBookings.jsx
- Роут /my-bookings в App.jsx
- Bento: одна строка — Следующий визит (кликабельный) → Экономия → Lovi Pass (градиент)
- Lovi Pass: градиент #1a1a2e→#0f3460, кнопка "Активировать — 15 000 ₽" по ширине текста
- BookingCard: 3-колоночный layout, код чекина крупно, финансы отдельно
- История: retention блок "Хотите снова?" с тем же градиентом
- Safety FAQ: SVG иконки, фон #F1F0EC, Центр безопасности и гарантий
- Тестовые данные: user_id=3, 9 броней всех статусов

### Новые поля bookings
ALTER TABLE bookings ADD: user_id, base_price, discount_pct, rating_place, rating_master, rating_service, review_text

### Новые таблицы
- users: id, name, email, password_hash, created_at

### Ticker.jsx
- Генератор 37 800+ уникальных событий (30 имён × действия × 12 услуг × 7 выгод)
- 3 типа: service / benefit / subscription
- Чередование: 3-4 события → статусная строка
- Обновление каждые 30 сек
- Скорость: drift 90s linear infinite
