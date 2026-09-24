# Field

- **Слой:** pattern
- **Файлы:** `field.tsx` / `fieldControl.tsx` / `field.style.ts` / `field.stories.tsx`

## Назначение

Семантический и функциональный контейнер **одного элемента данных формы**.
Field не отвечает за то, как пользователь вводит данные, — это забота
**контрола**. Field отвечает за то, как элемент данных представлен в форме:
подпись, описание, ошибки, счётчик и связь label ↔ control ↔ сообщения.

```tsx
<Field required disabled>
  <Field.Label>Username</Field.Label>

  <Input />

  <Field.Description>
    Your public username.
  </Field.Description>

  <Field.Error>
    <Field.ErrorMessage>Username is required</Field.ErrorMessage>
  </Field.Error>

  <Field.Counter count={5} max={10} />
</Field>
```

## Когда использовать

- Любой один элемент данных формы, которому нужны подпись, описание,
  ошибка и/или счётчик.
- Базис конкретных полей (`TextField`, `TextAreaField`, `NumberField`,
  `PasswordField`, `SearchField` — пакет `@mai/fields`).

## Когда НЕ использовать

- Множественный выбор без текстовой обвязки — `CheckboxGroup` (pattern).
- Контрол ввода без обвязки — примитив `Input`/`Textarea`/`Checkbox`
  напрямую.

## API

### Корень `Field`

| Пропс | Тип | Описание |
|---|---|---|
| `required` | `boolean` | Обязательное поле: звёздочка у подписи, `aria-required` на контроле |
| `disabled` | `boolean` | Блокировка: приглушает подпись/сообщения; контрол гаснет |
| `children` | `ReactNode` | Контрол и подкомпоненты |
| `className` | `string` | Класс контейнера |

### Подкомпоненты

| Компонент | Пропсы | Описание |
|---|---|---|
| `Field.Label` | `children`, `htmlFor?`, `required?`, `className?` | Подпись; `htmlFor` привязывается к зарегистрированному контролу автоматически |
| `Field.Description` | `children`, `className?` | Подсказка/описание под контролом; id попадает в `aria-describedby` |
| `Field.Error` | `children?`, `className?` | Контейнер ошибок; наличие — `invalid` и `role="alert"` |
| `Field.ErrorMessage` | `children`, `className?` | Отдельная строка ошибки |
| `Field.Counter` | `count`, `max`, `className?` | Счётчик `count/max`; danger при превышении |

## Контракт Control

`Control` — не проекция Field, а **подмножество элементов, участвующих
в Field по контракту** (`fieldControl.tsx`):

- `useFieldControl({ id?, disabled?, invalid? })` — хук для примитивов-
  контролов (`Input`, `Textarea`, `Checkbox` и кастомных `PasswordInput`,
  `PinInput`). Возвращает готовые пропсы на нативный элемент: `id`,
  `disabled`, `aria-required`, `aria-invalid`, `aria-describedby`.
- `FieldControlProps` — базовые пропсы контрола; тип членства в семействе.
- Свои пропсы контрола имеют приоритет над контекстом Field; вне Field
  хук отдаёт собственные значения без автоматики.

## Сахар-совместимость

До перевода `@mai/fields` на compound API `Field` принимает плоские
пропсы, собираемые в те же подкомпоненты:

`label`, `htmlFor`, `hint` (→ `Description`), `error` (→ `Error` +
`ErrorMessage`), `count`/`max` (→ `Counter`).

После миграции утилизируются.

## Зависимости

`react` (context, `useId`, effects), `fieldControl.tsx`, `field.style.ts`.
Потребители — поля пакета `@mai/fields` (через сахар, до миграции) и
примитивы-контролы через контракт `useFieldControl`.