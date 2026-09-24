# CheckboxGroup

- **Слой:** pattern
- **Файлы:** `checkboxGroup.tsx` / `checkboxGroup.style.ts` / `checkboxGroup.stories.tsx`

## Назначение

Группа флажков для выбора нескольких значений. Отображает список
`<Checkbox>` с подписями; переключение оперирует массивом `value`
(add/remove).

## Когда использовать

- Множественный выбор из фиксированного набора (фильтры, теги).

## Когда НЕ использовать

- Единичный выбор — `SegmentedControl` (primitive). Один флажок —
  `Checkbox` (primitive).

## API

| Пропс | Тип | Описание |
|---|---|---|
| `value` | `readonly string[]` (обязателен) | Выбранные значения |
| `onChange` | `(value: string[]) => void` (обязателен) | Изменение набора |
| `items` | `readonly {value,label}[]` (обязателен) | Варианты |
| `disabled` | `boolean` | Блокировка |
| `aria-label`, `className` | `string` | Групповая доступность / класс |

## Зависимости

Композиция `primitive/checkbox` (`Checkbox`) + `foundation/text` (`Text`);
собственный `checkboxGroup.style.ts`.