# NavList

- **Слой:** pattern
- **Файлы:** `navList.tsx` / `navList.style.ts` / `navList.stories.tsx`

## Назначение

Вертикальный список навигации: группы с заголовками, пункты с иконкой и
подписью, вложенные подпункты. Пункт — кнопка с состояниями hover/active/disabled.
Компонент не владеет состоянием выбора — активный `id` и обработчик приходят извне.

## Когда использовать

- Боковое меню: настройки, разделы раздела, список плагинов/курсов.
- Нужен список навигации с заголовками групп и вложенными пунктами.

## Когда НЕ использовать

- Путь/хлебные крошки — `Breadcrumbs`.
- Дерево с раскрытием/сворачиванием и drag-and-drop — специализированный
  компонент (например `@mai/sidebar`).
- Простой список действий — `DropdownMenu`/`ContextMenu`.

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `groups` | `readonly NavListGroup[]` | — | Секции навигации (обязательны) |
| `activeId` | `string` | — | Идентификатор активного пункта |
| `onSelect` | `(id: string) => void` | — | Выбор пункта (обязателен) |
| `ariaLabel` | `string` | — | Доступное имя навигации |
| `className` | `string` | — | Класс корня |

`NavListGroup`: `{ id?: string; title?: string; items: readonly NavListItem[] }`.
`NavListItem`: `{ id: string; label: string; icon?: ReactNode; disabled?: boolean; aside?: ReactNode; children?: readonly NavListItem[] }`.
Вложенные `children` рендерятся с отступом; disabled родителя гасит и детей.

## Примеры

```tsx
<NavList
  ariaLabel="Разделы настроек"
  activeId={activeId}
  onSelect={setActiveId}
  groups={[
    {
      title: 'Настройки',
      items: [{ id: 'general', label: 'Общие', icon: <Icon name="settings" /> }],
    },
  ]}
/>
```

## Зависимости

Использует только токены темы и `styled-components`; иконки приходят как
`ReactNode` (обычно из `@mai/icons`). Потребляется страницей настроек
(`@mai/settings`).