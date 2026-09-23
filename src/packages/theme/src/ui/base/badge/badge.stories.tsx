import type { Meta, StoryObj } from '@storybook/react-vite'
import type { IntentName } from '../../../base/theme'
import { Badge } from './badge'

const tones: IntentName[] = ['neutral', 'accent', 'success', 'warning', 'danger', 'info']

/**
 * Badge — компактная метка статуса или категории. `soft` даёт приглушённую
 * подложку с текстом роли, `solid` — насыщенную заливку с контрастным
 * текстом из токена `contrastText`. Тоны семантичны и маппятся на палитру
 * интентов темы.
 */
const meta = {
  title: 'Theme/Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компактная метка статуса или категории. `soft` — tint-подложка с текстом роли, `solid` — насыщенная заливка с контрастным текстом. Тоны семантичны: neutral для нейтрального интерфейса, accent для акцента, success/warning/danger/info для статусов.',
      },
    },
  },
  args: {
    children: 'Бейдж',
    tone: 'accent',
    variant: 'soft',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: tones,
      description: 'Смысловая роль бейджа.',
    },
    variant: {
      control: 'radio',
      options: ['soft', 'solid'],
      description: 'Стиль заливки: приглушённая подложка или насыщенная.',
    },
    children: {
      control: 'text',
      description: 'Текст метки.',
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Приглушённые подложки всех тонов — для сравнения палитры. */
export const Soft: Story = {
  args: { variant: 'soft' },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tones.map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
}

/** Насыщенные заливки с контрастным текстом. */
export const Solid: Story = {
  args: { variant: 'solid' },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tones.map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
}

/** Примеры реальных статусов. */
export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Badge tone="accent" variant="solid">
        Новое
      </Badge>
      <Badge tone="success" variant="soft">
        Опубликовано
      </Badge>
      <Badge tone="warning" variant="soft">
        Черновик
      </Badge>
      <Badge tone="danger" variant="soft">
        Ошибка
      </Badge>
      <Badge tone="neutral" variant="soft">
        Архив
      </Badge>
    </div>
  ),
}
