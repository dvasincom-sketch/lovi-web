 REPOSITORY_STRUCTURE

Status: canonical
Owner: Dmitry Vasin
Last Updated: 2026-05-13
Source of Truth: yes
insalon/
├── app/ # FastAPI приложение
│ ├── main.py
│ ├── database.py
│ ├── yclients.py
│ ├── analytics.py
│ └── routers/ # sync, analytics, checks, oauth, webhooks
├── static/ # Дашборды Insalon
│ ├── v3/ # актуальный
│ │ └── js/ # 14 модулей (config → ... → main.js)
│ ├── v2/ # устаревший
│ └── index.html # v1 (MVP)
├── scripts/ # import_bank.py, import_personal.py
├── lovi/ # Lovi frontend (React)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── constants.js
│ └── ...
└── requirements.txt