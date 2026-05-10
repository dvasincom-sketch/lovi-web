export const CATEGORIES = [
  { id: 'head', label: 'Голова' },
  { id: 'spa',  label: 'SPA' },
  { id: 'back', label: 'Спина' },
  { id: 'neck', label: 'Шея' },
  { id: 'body', label: 'Всё тело' },
  { id: 'face', label: 'Лицо' },
]

export const CAT_LABELS = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]))
