# Popover (usePopover + popover.style)

- **Слой:** primitive
- **Файлы:** `usePopover.ts` / `popover.style.ts` / `popover.stories.tsx`

## Назначение

Инфраструктура всплывающих панелей (попапов, меню, дропдаунов):
`usePopover` — хук, владеющий открытием/закрытием, позиционированием с
флипом от краёв вьюпорта, закрытием по клику вне панели и `Esc` и
фокусом панели при открытии. `popover.style` — стилевая палитра попапов:
поверхность меню и её элементы (пункт, иконка, подсказка, разделитель,
заголовок секции, шеврон подменю), которую потребители комбинируют для
своих панелей.

У попапа **нет** встроенного визуала: поведение даёт `usePopover`,
внешний вид собирает потребитель из палитры `popover.style` (или своих
стилей).

## Когда использовать

- Любой попап: управляемый хук + панель, монтируемая при `opened`,
  позиционируемая через `coords`.
- Меню в `Select`/`DropdownMenu`/`ContextMenu` (легаси `ui/`, используют
  `usePopover` и/или палитру `popover.style`).

## Когда НЕ использовать

- Модальный диалог — `Modal` (primitive).

## Стори

`popover.stories.tsx` — демо `usePopover` в связке с поверхностью меню:
dropdown (выбор пункта, Esc/клик вне), богатое меню (иконка + шорткат +
шеврон) и play-проверка обработчика пункта.

## API

### `usePopover<TTrigger extends HTMLElement>()`

Возвращает:

| Поле | Тип | Описание |
|---|---|---|
| `opened` | `boolean` | Открыта ли панель |
| `open` / `close` / `toggle` | `() => void` | Управление |
| `triggerRef` | `Ref<TTrigger>` | На триггер |
| `panelRef` | `Ref<HTMLDivElement>` | На панель (`tabIndex={-1}`) |
| `coords` | `{left, top}` | Позиция панели |

## Примеры

```tsx
const { opened, toggle, triggerRef, panelRef, coords } = usePopover<HTMLButtonElement>()
<Button ref={triggerRef} onClick={toggle}>…</Button>
{opened && (
  <MenuSurface ref={panelRef} tabIndex={-1} style={{ ...coords }}>
    <MenuList>
      <li><MenuItemButton onClick={close}>…</MenuItemButton></li>
    </MenuList>
  </MenuSurface>
)}
```

## Стилевые экспорты

`popover.style.ts` экспортирует `MENU_WIDTH` и палитру: `MenuSurface`,
`MenuList`, `MenuItemButton`, `ItemIcon`, `ItemLabel`, `ItemHint`,
`SubmenuChevron`, `MenuSeparator`, `SectionLabel`.

## Зависимости

`usePopover` — чистый React-хук (не стилизуется). `popover.style` — styled
компоненты. Используются только внутри пакета темы; наружу не экспортируются.