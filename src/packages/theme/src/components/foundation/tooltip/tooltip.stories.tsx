import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './tooltip'

/**
 * Tooltip — обёртка с нативной подсказкой браузера: текст из `content`
 * показывается через атрибут `title`. Собственной панели нет.
 */
const meta = {
  title: 'UI/Foundation/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Лёгкая обёртка вокруг `title`: показывает нативную подсказку браузера при наведении. Поведение и внешний вид — на стороне браузера.',
      },
    },
  },
  args: {
    content: 'Подсказка',
    children: 'Наведи на меня',
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'Текст подсказки.',
    },
    children: {
      control: 'text',
      description: 'Содержимое, к которому крепится подсказка.',
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Подсказка на иконке-кнопке — типовой сценарий. */
export const OnButton: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" aria-label={args.content}>
        ⚙
      </button>
    </Tooltip>
  ),
}
