# Input

- **Слой:** primitive
- **Файлы:** `input.tsx` / `input.style.ts` / `input.stories.tsx`

## Назначение

Контрол ввода одной строки. Визуал (фон, граница, hover/disabled,
фокус-кольцо) несёт контейнер-группа, внутри которого лежит нативный
`<input>` и опциональные `startContent`/`endContent` (адорнменты).
Все стандартные атрибуты инпута (`value`, `onChange`, `placeholder`,
`disabled`, `maxLength` и т.д.) пробрасываются напрямую.

## Когда использовать

- Любой ввод одной строки: в полях (`Field` + конкретные поля
  `ui/fields/`), в фильтрах, в поиске.
- Группы ввода с адорнментами: `endContent` — глаз пароля, кнопка очистки,
  степперы; `startContent` — иконка/префикс.

## Когда НЕ использовать

- Многострочный ввод — `TextAreaField` (использует общую оболочку
  `inputShellCss` из стилей примитива).
- Контрол с подписью/ошибкой/счётчиком — обвязка `Field` (pattern);
  Input — это только сам контрол.

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `size` | `sm \| md \| lg` | `'md'` | Размер контрола (32/36/40px) |
| `invalid` | `boolean` | `false` | Состояние ошибки: danger-граница + `aria-invalid` |
| `startContent` | `ReactNode` | — | Контент слева внутри группы |
| `endContent` | `ReactNode` | — | Контент справа внутри группы |
| `className` | `string` | — | Класс контейнера |

Плюс все атрибуты `<input>`.

## Примеры

```tsx
<Input placeholder="Имя" invalid={error !== undefined} />
<Input
  endContent={
    <InputAdornmentButton type="button" aria-label="Очистить">
      <CloseIcon />
    </InputAdornmentButton>
  }
/>
```

## Стилевые экспорты

`input.style.ts` дополнительно экспортирует:

- `inputShellCss` / `inputShellSize(theme, size)` — общая оболочка контрола
  для переиспользования (например `TextAreaRoot`);
- `InputAdornmentButton` — кнопка-адорнмент внутри группы.

## Зависимости

Использует `styled-components` и `base/theme` (тип `AppTheme`). Из других
слоёв не зависит. Глифы в примерах (`CloseIcon`, `EyeIcon` и т.д.) — из
пакета `@mai/icons`. Потребители — поля `ui/fields/` (легаси) через слоты.