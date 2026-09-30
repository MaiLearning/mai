import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './scrollArea'

const longContent = Array.from({ length: 30 }, (_, index) => `Элемент списка №${index + 1}`)

/**
 * ScrollArea — область прокрутки дизайн-системы Mai с тематическим
 * скроллбаром. Прозрачная обёртка над `<div>`: `height` задаёт фикс-
 * ированную высоту, `maxHeight` — максимальную (ниже начинается прокрутка).
 */
const meta = {
  title: 'Theme/Components/Foundation/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Область прокрутки со скроллбаром, стилизованным под токены темы. `height` — фиксированная высота, `maxHeight` — максимальная; контент шире/выше контейнера прокручивается.',
      },
    },
  },
  args: {
    height: '200px',
    children: longContent.map((item) => <div key={item}>{item}</div>),
  },
  argTypes: {
    height: { control: 'text', description: 'Фиксированная высота контейнера.' },
    maxHeight: { control: 'text', description: 'Максимальная высота: ниже — прокрутка.' },
    children: { control: false, description: 'Прокручиваемое содержимое.' },
  },
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

/** Фиксированная высота — прокрутка всегда включена. */
export const Playground: Story = {}

/** Максимальная высота: короткий контент растягивается, длинный — прокручивается. */
export const MaxHeight: Story = {
  args: {
    height: undefined,
    maxHeight: '180px',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <ScrollArea {...args} maxHeight="180px">
        <div>Короткий контент не превышает maxHeight.</div>
        <div>Строка вторая.</div>
      </ScrollArea>
      <ScrollArea {...args} maxHeight="180px">
        {longContent.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </ScrollArea>
    </div>
  ),
}
