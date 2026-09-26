# Drawer

- **Слой:** primitive
- **Файлы:** `drawer.tsx` / `drawer.style.ts` / `drawer.stories.tsx`
- **Общий механизм:** `../overlay/useOverlayPanel.ts` (+ `overlay.style.ts`)

## Назначение

Выезжающая панель поверх приложения (`right`/`left`/`bottom`) через портал в
`document.body`. Делит с `Modal` общий overlay-механизм: блокировка скролла,
focus-trap по `Tab`, автофокус, восстановление фокуса, закрытие по `Esc`.
Тело прокручивается, шапка и футер фиксированы.

## Когда использовать

- Боковая панель контента: настройки, детали ресурса, фильтры.
- Нижняя шторка (bottom sheet) на мобильных.

## Когда НЕ использовать

- Блокирующий диалог по центру — `Modal`.
- Некритичная подсказка/меню у триггера — попап (`usePopover`).

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `opened` | `boolean` (обязателен) | — | Открыта ли панель |
| `onClose` | `() => void` (обязателен) | — | Запрос закрытия |
| `side` | `right \| left \| bottom` | `'right'` | Сторона выезда |
| `size` | `sm \| md \| lg \| full` | `'md'` | Ширина (right/left) или высота (bottom) |
| `title` | `string` | — | Заголовок + auto-labelling панели |
| `labelledBy` | `string` | — | Собственный `aria-labelledby` |
| `dismissible` | `boolean` | `true` | Закрытие по `Esc`/оверлею/кнопке |
| `footer` | `ReactNode` | — | Футер с действиями |
| `children` | `ReactNode` (обязателен) | — | Содержимое |
| `className` | `string` | — | Класс панели |

Композиционные части: `DrawerBody`, `DrawerFooter`, `DrawerFooterSpacer`.

## Примеры

```tsx
<Drawer opened={opened} onClose={close} side="right" size="lg" title="Настройки">
  <DrawerBody>…</DrawerBody>
  <DrawerFooter>
    <Button>Сохранить</Button>
  </DrawerFooter>
</Drawer>
```

## Зависимости

Использует `react-dom` (`createPortal`), `@mai/icons` (`CloseIcon`) и общий
механизм `primitive/overlay`. Цвета — только через `theme.utils.*`.