# Checkbox

- **Слой:** primitive
- **Файлы:** `checkbox.tsx` / `checkbox.style.ts` / `checkbox.stories.tsx`

## Назначение

Флажок выбора boolean-значения. Управляемый: `role="checkbox"` +
`aria-checked`; переключение — через `onChange(!checked)`.

## Когда использовать

- Единичный выбор да/нет.
- В составе группы — `CheckboxGroup` (pattern).

## Когда НЕ использовать

- Включение/выключение без формы — `Switch` (primitive). Выбор одного из
  многих — `SegmentedControl` (primitive).

## API

| Пропс | Тип | Описание |
|---|---|---|
| `checked` | `boolean` (обязателен) | Текущее состояние |
| `onChange` | `(checked: boolean) => void` (обязателен) | Изменение |
| `disabled` | `boolean` | Блокировка |
| `id`, `aria-label` | `string` | Связь/доступность |

## Зависимости

Использует `@mai/icons` (`CheckIcon`), `checkbox.style.ts`.
Потребляется `CheckboxGroup` (pattern).