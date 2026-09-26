import { Icon } from '@mai/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import { PageHeader } from './pageHeader'

/**
 * PageHeader — шапка раздела: крошки, заголовок, описание и правый слот
 * действий, отделённый от контента границей.
 */
const meta = {
  title: 'UI/Pattern/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Шапка раздела страницы: необязательные хлебные крошки, заголовок, описание и правый верхний слот (поиск, действия). Задаёт вертикальный ритм и разделитель до контента; содержимое слотов собирает потребитель.',
      },
    },
  },
  args: {
    title: 'Общие',
    description: 'Внешний вид и язык интерфейса приложения.',
    breadcrumbs: (
      <Breadcrumbs
        ariaLabel="Путь"
        items={[
          { label: 'Настройки', onClick: () => {} },
          { label: 'Общие', current: true },
        ]}
      />
    ),
  },
  argTypes: {
    breadcrumbs: { control: false },
    actions: { control: false },
    title: { control: 'text' },
    description: { control: 'text' },
    titleAs: { control: 'select', options: ['h1', 'h2', 'h3'] },
  },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** С правым слотом действий. */
export const WithActions: Story = {
  args: {
    actions: (
      <button type="button" aria-label="Настройки">
        <Icon name="slidersHorizontal" />
      </button>
    ),
  },
}

/** Без крошек и описания — только заголовок. */
export const Minimal: Story = {
  args: {
    breadcrumbs: undefined,
    description: undefined,
  },
}
