import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ColorPicker } from './ColorPicker'

/** Выбор цвета: SV-квадрат + Hue-слайдер вместо системного пикера. */
const meta = {
  title: 'Course/UI/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: { color: { control: { type: 'color' } } },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

/** Нейтральный серый цвет по умолчанию. */
export const Default: Story = {
  args: { color: '#6d6a85' },
}

/** Красный оттенок. */
export const Red: Story = {
  args: { color: '#e0393e' },
}

/** Синий оттенок. */
export const Blue: Story = {
  args: { color: '#5b46f5' },
}

/** Тёмный графитовый. */
export const Dark: Story = {
  args: { color: '#1c1929' },
}

/** Яркий зелёный. */
export const Green: Story = {
  args: { color: '#34d399' },
}
