# Switch

- **Слой:** primitive
- **Файлы:** `switch.tsx` / `switch.style.ts` / `switch.stories.tsx`

## Назначение

Переключатель on/off. Управляемый: `role="switch"` + `aria-checked`.

## Когда использовать

- Мгновенное включение/выключение опции (без формы/подтверждения).

## Когда НЕ использовать

- Флажок в форме/группе выбора — `Checkbox` / `CheckboxGroup`.

## API

| Пропс | Тип | Описание |
|---|---|---|
| `checked` | `boolean` (обязателен) | Текущее состояние |
| `onChange` | `(checked: boolean) => void` (обязателен) | Изменение |
| `disabled` | `boolean` | Блокировка |
| `id`, `aria-label` | `string` | Связь/доступность |

## Зависимости

Импортирует `switch.style.ts`. Из других слоёв ничего не использует.