import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './card'

/**
 * Card — базовый контейнер карточки. Поверхность, граница, скругление
 * и тень собираются из токенов темы; содержимое (обложка, тело, футер)
 * добавляет потребитель. Интерактивная карточка приподнимается на hover.
 */
const meta = {
  title: 'UI/Foundation/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Базовый контейнер карточки: поверхность, граница, скругление и тень из токенов темы. Интерактивная карточка приподнимается при наведении; статичная (hero, панели) — нет.',
      },
    },
  },
  args: {
    interactive: true,
  },
  argTypes: {
    interactive: {
      control: 'boolean',
      description: 'Hover-эффект: подъём, усиленная тень и граница.',
    },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 600 }}>Заголовок карточки</div>
        <div style={{ marginTop: 8, fontSize: 14, opacity: 0.7 }}>
          Содержимое собирает потребитель: обложка, тело, футер.
        </div>
      </div>
    </Card>
  ),
}

export const Static: Story = {
  args: { interactive: false },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 560 }}>
      <div style={{ padding: 20 }}>
        <div style={{ fontWeight: 600 }}>Неинтерактивная карточка</div>
        <div style={{ marginTop: 8, fontSize: 14, opacity: 0.7 }}>
          Без hover-подъёма — для hero-блоков и панелей.
        </div>
      </div>
    </Card>
  ),
}
