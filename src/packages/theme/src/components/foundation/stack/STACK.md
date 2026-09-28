# Stack

- **Слой:** foundation
- **Файлы:** `stack.tsx` / `stack.style.ts` / `stack.stories.tsx`

## Назначение

Универсальный контейнер раскладки для вертикального (`column`) или
горизонтального (`row`) расположения элементов. Решает только механику
расположения: ось, зазор и выравнивание по поперечной оси. Не несёт
смысловой нагрузки — ничего не знает о том, что внутри.

## Когда использовать

- Элементы интерфейса выстраиваются в колонку или ряд с одинаковым
  зазором между соседями (кнопки в тулбаре, группа полей, список блоков).
- Когда нужен «простой и без лишнего API» раскладчик: `Stack` —
  узкий строитель оси + зазора.

## Когда НЕ использовать

- Нужно управлять распределением по главной оси (`justify-content`),
  переносом (`flex-wrap`) или произвольным flex-поведением — используйте
  `Flex` (foundation).
- Нужен нейтральный блок без осей — используйте `Box` (foundation).
- Нужна конкретная семантика (действие, выбор, ввод) — это слой
  `primitive/` или `pattern/`.

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Ось раскладки |
| `gap` | `SpacingKey \| number` | — | Зазор: ключ каталога `theme.spacing` или число базовых шагов |
| `align` | `flex-start \| flex-end \| center \| stretch \| baseline` | `stretch` | Выравнивание по поперечной оси |

Плюс все атрибуты `<div>` (`style`, `className`, `onClick`, …).

## Примеры

```tsx
// Колонка с токеном зазора
<Stack gap="md">
  <Block>А</Block>
  <Block>B</Block>
</Stack>

// Ряд кнопок
<Stack direction="horizontal" gap="sm" align="center">
  <Button>Сохранить</Button>
  <Button variant="ghost">Отмена</Button>
</Stack>

// Числовой зазор
<Stack direction="horizontal" gap={24}>
  <Panel />
  <Panel />
</Stack>
```

## Зависимости

Импортирует только `stack.style.ts` и `base/theme` (тип `SpacingKey`).
Из `primitive/`, `pattern/` и `component/` ничего не использует.