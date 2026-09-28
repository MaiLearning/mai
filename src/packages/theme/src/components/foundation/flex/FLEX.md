# Flex

- **Слой:** foundation
- **Файлы:** `flex.tsx` / `flex.style.ts` / `flex.stories.tsx`

## Назначение

Flex-контейнер раскладки: направление, выравнивание по обеим осям,
перенос и зазор между дочерними элементами. Полноценный доступ к
flex-модели через узкий пропс-API с токенами темы для `gap`.

## Когда использовать

- Нужен контроль над flex: направление, `justify-content`,
  `align-items`, `flex-wrap`.
- Нужно распределение элементов по главной оси
  (`space-between`, `space-evenly`, …) или перенос строк.

## Когда НЕ использовать

- Достаточно оси + зазора без лишнего API — используйте `Stack`.
- Нужен нейтральный блок без flex-модели — используйте `Box`.

## API

| Пропс | Тип | Дефолт | Описание |
|---|---|---|---|
| `direction` | `row \| column \| row-reverse \| column-reverse` | `'row'` | Направление раскладки |
| `align` | `flex-start \| flex-end \| center \| stretch \| baseline` | `stretch` | Выравнивание по поперечной оси |
| `justify` | `flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | `flex-start` | Распределение по главной оси |
| `wrap` | `nowrap \| wrap \| wrap-reverse` | `'nowrap'` | Перенос элементов |
| `gap` | `SpacingKey \| number` | — | Зазор: ключ каталога `theme.spacing` или число базовых шагов |

Плюс все атрибуты `<div>`.

## Примеры

```tsx
// Шапка: слева заголовок, справа кнопка
<Flex justify="space-between" align="center">
  <Heading level={3}>Курс</Heading>
  <Button>Редактировать</Button>
</Flex>

// Адаптивная строка с переносом
<Flex wrap="wrap" gap="sm">
  <Tag>Введение</Tag>
  <Tag>Основы</Tag>
  <Tag>Практика</Tag>
</Flex>

// Центрирование по обеим осям
<Flex align="center" justify="center" style={{ height: 120 }}>
  <Spinner />
</Flex>
```

## Зависимости

Импортирует только `flex.style.ts` и `base/theme` (тип `SpacingKey`).
Из `primitive/`, `pattern/` и `component/` ничего не использует.