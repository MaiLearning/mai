# Button

- **Слой:** primitive
- **Файлы:** `button.tsx` / `button.style.ts` / `button.stories.tsx`

## Назначение

Базовое пользовательское действие. Варианты из модели intent + solid:
`primary`/`secondary`/`danger` (насыщенные), `ghost`/`outline` (поверхность +
бордер). `loading` замещает контент спиннером, `selected` подсвечивает
переключаемую кнопку.

## Когда использовать

- Действие пользователя: отправка, запуск, переход.
- Кнопки с иконками (`onlyIcon`, `startIcon`, `endIcon`).

## Когда НЕ использовать

- Навигация-ссылка — `Link` (primitive). Бинарный выбор — `Checkbox`/
  `Switch`/`SegmentedControl` (primitive).

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `size` | `xs..xl` | `'md'` | Размер кнопки |
| `variant` | `primary \| secondary \| danger \| ghost \| outline` | `'primary'` | Вариант |
| `loading` | `boolean` | `false` | Замещает контент спиннером, блокирует |
| `selected` | `boolean` | — | `aria-pressed` + подсветка (переключаемая кнопка) |
| `onlyIcon` | `ReactNode` | — | Кнопка-иконка без текста |
| `startIcon` / `endIcon` | `ReactNode` | — | Иконка до/после текста |

Плюс все атрибуты `button` (`disabled`, `type` и др.).

## Зависимости

Использует `@mai/icons` (`Icon`), `foundation/spinner` (`Spinner`),
`button.style.ts`. Внутри слоя не зависит ни от чего. Совместим с
`tooltip`-обёртками из сценариев `course`/`sidebar`.