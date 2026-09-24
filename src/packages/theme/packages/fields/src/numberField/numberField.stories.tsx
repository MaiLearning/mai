import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { NumberField } from './numberField'

/**
 * NumberField — числовое поле со степперами −/+. Нативный
 * `<input type="number">` в обвязке Field.
 */
const meta = {
  title: 'Fields/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Числовое поле: нативный `<input type="number">` в обвязке `Field` со степперами −/+ справа. Значение — число: `value?: number`, `onChange(value: number)`. Степперы учитывают `min`/`max` и шаг `step`.',
      },
    },
  },
  args: {
    label: 'Порядок',
    value: 5,
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'number', description: 'Текущее числовое значение.' },
    min: { control: 'number', description: 'Минимальное значение.' },
    max: { control: 'number', description: 'Максимальное значение.' },
    step: { control: 'number', description: 'Шаг степперов.' },
    showSteppers: { control: 'boolean', description: 'Показывать степперы −/+.' },
  },
} satisfies Meta<typeof NumberField>

export default meta

type Story = StoryObj<typeof meta>

/** Числовое поле со степперами. */
export const Basic: Story = {}

/** Поле с границами — степперы замирают на краях. */
export const Bounded: Story = {
  args: { min: 1, max: 10, step: 1 },
}

/** Поле без степперов. */
export const WithoutSteppers: Story = {
  args: { showSteppers: false },
}

/** Поле с подсказкой. */
export const WithHint: Story = {
  args: { hint: 'Где показывать материал в лекции.' },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Живой пример: степперы и ввод через локальный стейт. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(5)
    return <NumberField {...args} value={value} onChange={setValue} />
  },
}

/** Клик по «+» увеличивает значение на шаг. */
export const Play: Story = {
  args: { value: 5, step: 5, onChange: fn() },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Увеличить' }))
    await expect(args.onChange).toHaveBeenCalledWith(10)
  },
}
