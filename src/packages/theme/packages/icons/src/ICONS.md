# @mai/icons

Пакет системных иконок Mai: контейнер `Icon` с выбором глифа по имени и
каталог иконок на базе `lucide-react`.

- **Файлы:** `icon.tsx` / `icon.style.ts` / `registry.tsx` / `icon.stories.tsx`

## Назначение

Единая точка доступа к иконкам: один компонент-контейнер с фиксированным
размером и выравниванием + каталог глифов, выбираемых по `name`. Вытеснил
`Icon` и `glyphs/` из пакета `@mai/theme` (foundation) — тема теперь
потребляет `@mai/icons`.

## Слоёность

Пакет **ниже** темы и не зависит от неё: цвет иконки — `currentColor`
(наследование), размер — собственная шкала. `@mai/theme` импортирует
`@mai/icons` для своих внутренних иконок (Button, Alert, Checkbox, поля,
context-menu). Сторонние потребители тоже могут импортировать пакет
напрямую.

## API

### `<Icon />`

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `name` | `IconName` | — | Имя иконки из каталога (см. ниже) |
| `children` | `ReactNode` | — | Собственный SVG вместо каталога; приоритет ниже, чем у `name` |
| `size` | `xs \| sm \| md \| lg \| xl \| number` | `'md'` | Токен шкалы (`12/16/20/24/32px`) или число px |
| `strokeWidth` | `number` | дефолт иконки | Толщина штриха |

Плюс атрибуты `span` (`aria-label` и др.); глифы несут `aria-hidden="true"`.

```tsx
<Icon name="check" size="sm" />
<Icon name="close" size={15} aria-label="Закрыть" />
<Icon size="md">{customSvg}</Icon>
```

### Именованные экспорты

Для встраивания без контейнера (сырой SVG в своём слоте):

`CheckIcon` (толщина 3 — калибровка), `CloseIcon`, `ErrorIcon`,
`EyeIcon`, `EyeOffIcon`, `InfoIcon`, `SuccessIcon`, `WarningIcon`,
`ChevronRightIcon`, `TrashIcon`.

## Каталог и `IconName`

`registry.tsx` держит карту `name → { Component, defaultStrokeWidth? }`:
`IconName` — union ключей реестра, экспортируется для типизации и списков
выбора. Каталог покрывает семантический набор (`check`, `close`, `error`,
`info`, `success`, `warning`, `eye`, `eyeOff`) и рабочие иконки приложения
(`chevronRight`, `folder`, `search`, `plus` и др.). Источник глифов —
`lucide-react` (единственная версия в воркспейсе).

## Как добавить иконку

1. Глиф должен существовать в `lucide-react`; импортнули символ в
   `registry.tsx` (imports — по алфавиту).
2. Добавили запись `kebabOrCamelName: { Component: Symbol }` в `iconRegistry`.
   Если иконке нужна калиброванная толщина — `defaultStrokeWidth`.
3. `IconName` подхватится автоматически; стори `Catalog` покажет глиф.
4. Если нужен и именованный экспорт — добавили export в `registry.tsx` и
   пробросили в `index.ts`.

## Примечание о шкале размеров (сознательное исключение)

`icon.style.ts` хранит локальную шкалу `12/16/20/24/32px`, как было в
`@mai/theme/icon`. Универсального токена под иконки в теме нет
(типографика и spacing дают другие значения) — шкала зафиксирована локально
и документирована здесь же.

## Зависимости

- `lucide-react` (dependency, единственная версия 1.47);
- `react`, `react-dom`, `styled-components` — только `peerDependencies`.

Потребляется `@mai/theme` (включая внутренние под-пакеты `fields`,
`context-menu`).