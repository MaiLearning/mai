# Modal

- **Слой:** primitive
- **Файлы:** `modal.tsx` / `modal.style.ts` / `modal.stories.tsx`

## Назначение

Модальное окно через портал в `document.body`: оверлей, панель с
`role="dialog"` + `aria-modal`, focus-trap по `Tab`, восстановление
фокуса и скролла при закрытии, закрытие по `Esc`/клику по оверлею.
Композиционные части: `ModalBody`, `ModalFooter`, `ModalFooterSpacer`.

## Когда использовать

- Действие, требующее блокирующего диалога с фокусом (подтверждение,
  создание/редактирование, форма).

## Когда НЕ использовать

- Некритичная подсказка/меню у триггера — попап (`usePopover`, primitive).

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `opened` | `boolean` (обязателен) | — | Открыто ли окно |
| `onClose` | `() => void` (обязателен) | — | Запрос закрытия |
| `title` | `string` | — | Заголовок + auto-labelling панели |
| `labelledBy` | `string` | — | Собственный `aria-labelledby` |
| `dismissible` | `boolean` | `true` | Возможность закрыть по `Esc`/оверлею |
| `width` | `number` | `620` | Ширина панели, px |
| `footer` | `ReactNode` | — | Футер с действиями |
| `children` | `ReactNode` (обязателен) | — | Контент |

## Зависимости

Использует `react-dom` (`createPortal`), `modal.style.ts`. Совместим с
`@mai/settings`-страницами и сценариями `course`/`sidebar`.