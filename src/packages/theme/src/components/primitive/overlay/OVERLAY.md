# Overlay

- **Слой:** primitive
- **Файлы:** `useOverlayPanel.ts` / `overlay.style.ts`
- **Потребители:** `Modal`, `Drawer`

## Назначение

Общий механизм модальных панелей: хук `useOverlayPanel` берёт на себя всё,
что нельзя выразить стилями, — блокировку прокрутки страницы, автофокус,
focus-trap по `Tab`, восстановление фокуса, закрытие по `Esc` и таймер
анимации закрытия. `overlay.style.ts` даёт общие keyframes подложки и
`CLOSE_DURATION_MS`, чтобы потребитель использовал ту же длительность, что и
таймер в хуке.

Это **механизм, а не компонент**: разметку подложки и самой панели задаёт
потребитель. `Modal` и `Drawer` выглядят по-разному и отличаются только
собственной разметкой поверх общей механики.

## Когда использовать

- Нужна панель поверх приложения: портал в `document.body`, блокировка
  прокрутки, `Esc`, ловушка фокуса.
- Нужен второй примитив такого рода, и не хочется писать эту механику
  заново. `Modal` и `Drawer` — ровно такие потребители.

## Когда НЕ использовать

- Панели без модальности: попап, который не блокирует страницу и не забирает
  фокус, — это `popover` (`usePopover` + `popover.style`), у него другой
  механизм.
- Нужна обычная отрисовка в потоке документа — тогда не нужен портал.

## API

### `useOverlayPanel(options): result`

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `opened` | `boolean` | — | Открыта ли панель |
| `onClose` | `() => void` | — | Запрос закрытия: `Esc` |
| `dismissible` | `boolean` | `true` | Разрешить закрытие по `Esc` |
| `closeDuration` | `number` | `CLOSE_DURATION_MS` (180) | Длительность анимации закрытия, мс |

| Результат | Тип | Описание |
|---|---|---|
| `mounted` | `boolean` | Портал смонтирован: после монтирования до конца анимации закрытия |
| `visible` | `boolean` | Панель видима, используется для анимаций |
| `closing` | `boolean` | Идёт анимация закрытия |
| `panelRef` | `RefObject<HTMLDivElement \| null>` | Ref панели: focus-trap и автофокус |
| `onKeyDown` | `(event: React.KeyboardEvent) => void` | Обработчик клавиатуры: `Esc` + focus-trap |

### `overlay.style.ts`

| Экспорт | Тип | Описание |
|---|---|---|
| `fadeIn` | `Keyframes` | Появление и затухание подложки |
| `CLOSE_DURATION_MS` | `number` | 180 — длительность закрытия, тот же таймер, что в хуке |

## Три состояния, а не два

Отличие от «просто показать/скрыть» — в том, что `mounted`, `visible` и
`closing` разведены:

- `mounted` — портал существует. Пока он `false`, в `document.body` ничего
  нет: панель не рендерится вовсе, и разметка не появляется на странице.
- `visible` — панель видима и страница заблокирована.
- `closing` — идёт анимация закрытия. Панель ещё в портале, но `visible`
  уже `false`, а по `closeDuration` её размонтируют и вернут фокус.

Без третьего состояния панель пропадала бы мгновенно и анимация закрытия не
играла бы. Поэтому `mounted` живёт дольше `visible` на время `closeDuration`.

## Пример

```tsx
function MyPanel({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { mounted, visible, closing, panelRef, onKeyDown } = useOverlayPanel({
    opened,
    onClose,
  })

  if (!mounted) return null

  return createPortal(
    <Backdrop $visible={visible} $closing={closing} onClick={onClose} data-testid="backdrop">
      <Panel ref={panelRef} $visible={visible} $closing={closing} onKeyDown={onKeyDown}>
        Содержимое панели
      </Panel>
    </Backdrop>,
    document.body,
  )
}
```

Собственная разметка — обязательное условие: хук не рисует ни подложку, ни
панель, он только даёт состояние, ref и обработчики.

## Зависимости

`react` (`useState`/`useEffect`/`useRef`/`useCallback`) и `styled-components`
(`keyframes`). Потребители дополнительно зовут `react-dom` (`createPortal`).
Из `foundation/` и `pattern/` ничего не использует: механизм самостоятелен и
лежит в примитивах рядом со своими двумя потребителями.
