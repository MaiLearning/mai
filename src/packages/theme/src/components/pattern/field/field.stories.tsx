import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './field'
import { useFieldControl } from './fieldControl'

/** Демо-контрол, подписанный на контракт Field (пока примитивы не переведены). */
function WiredInput() {
  const props = useFieldControl()
  return <input {...props} />
}

/**
 * Field — семантический и функциональный контейнер одного элемента данных
 * формы. Compound-API: `Field.Label` / `Field.Description` / `Field.Error` /
 * `Field.ErrorMessage` / `Field.Counter`. Контрол участвует через контракт
 * `useFieldControl` и автоматически получает id, disabled/invalid и
 * aria-атрибуты.
 */
const meta = {
  title: 'UI/Pattern/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Контейнер одного элемента данных формы: подпись (`Field.Label`), описание (`Field.Description`), ошибки (`Field.Error` + `Field.ErrorMessage`), счётчик символов (`Field.Counter`). Контрол (`Input`, `Textarea`, `Checkbox` и др.) участвует через контракт `useFieldControl` и сам получает id, disabled/invalid и aria-атрибуты из контекста Field.',
      },
    },
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/** Минимальное поле: подпись, контрол и описание. */
export const Basic: Story = {
  render: () => (
    <Field>
      <Field.Label>Название</Field.Label>
      <WiredInput />
      <Field.Description>Например, «Основы C#».</Field.Description>
    </Field>
  ),
}

/** Обязательное поле — звёздочка у подписи и aria-required на контроле. */
export const Required: Story = {
  render: () => (
    <Field required>
      <Field.Label>Email</Field.Label>
      <WiredInput />
    </Field>
  ),
}

/** Несколько ошибок сразу — каждая своим сообщением. */
export const WithErrors: Story = {
  render: () => (
    <Field>
      <Field.Label>Имя пользователя</Field.Label>
      <WiredInput />
      <Field.Error>
        <Field.ErrorMessage>Обязательное поле</Field.ErrorMessage>
        <Field.ErrorMessage>Минимум 3 символа</Field.ErrorMessage>
      </Field.Error>
    </Field>
  ),
}

/** Счётчик символов: в норме и при превышении лимита. */
export const Counter: Story = {
  render: () => (
    <Field>
      <Field.Label>Описание</Field.Label>
      <WiredInput />
      <Field.Counter count={42} max={100} />
    </Field>
  ),
}

/** Отключённое поле — подпись и сообщения приглушены, контрол гаснет. */
export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <Field.Label>Только для чтения</Field.Label>
      <WiredInput />
      <Field.Description>Доступно после публикации.</Field.Description>
    </Field>
  ),
}

/**
 * Сахар-совместимость: плоские пропсы (`label`/`hint`/`error`/`count`/`max`),
 * используемые `@mai/fields` до миграции на compound.
 */
export const SugarBasic: Story = {
  args: {
    label: 'Название',
    hint: 'Например, «Основы C#».',
    children: <input id="sugar-name" defaultValue="React" />,
  },
}

/** Сахар: обязательное поле с ошибкой, перекрывающей подсказку. */
export const SugarError: Story = {
  args: {
    label: 'Ссылка',
    required: true,
    hint: 'Начинается с https://',
    error: 'Неверный формат ссылки.',
    children: <input id="sugar-url" defaultValue="not-a-url" />,
  },
}
