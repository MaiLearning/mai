import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Button } from '../button/button'
import type { DropdownMenuItem } from './dropdownMenu'
import { DropdownMenu } from './dropdownMenu'

/**
 * DropdownMenu — выпадающее меню действий. Триггер оборачивается в слот,
 * ловящий клик; панель рендерится порталом в body. Закрытие — кликом вне
 * или Esc, навигация — клавиатурой (↑ ↓ Home End Enter).
 */
const meta = {
  title: 'Theme/Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    trigger: <Button variant="secondary">Действия</Button>,
    items: [
      { id: 'edit', label: 'Редактировать' },
      { id: 'duplicate', label: 'Дублировать' },
      { id: 'export', label: 'Экспорт', hint: 'Ctrl+E' },
      { type: 'separator' },
      { id: 'delete', label: 'Удалить', danger: true },
    ],
    'aria-label': 'Действия с курсом',
  },
  argTypes: {
    trigger: { control: false, description: 'Содержимое триггера; клик открывает меню.' },
    items: {
      control: false,
      description: 'Пункты меню: действие, разделитель или подпись секции.',
    },
    disabled: { control: 'boolean', description: 'Отключает открытие меню.' },
    'aria-label': { control: 'text', description: 'Доступное имя меню.' },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Меню с подписями секций и разделителями. */
export const WithSections: Story = {
  args: {
    trigger: <Button variant="ghost">Панель</Button>,
    items: [
      { type: 'label', label: 'Просмотр' },
      { id: 'zoom-in', label: 'Приблизить' },
      { id: 'zoom-out', label: 'Отдалить' },
      { type: 'separator' },
      { type: 'label', label: 'Вставка' },
      { id: 'link', label: 'Ссылку' },
      { id: 'image', label: 'Изображение' },
    ],
  },
}

/** Меню с иконками пунктов. */
export const WithIcons: Story = {
  args: {
    trigger: <Button variant="ghost">Файл</Button>,
    items: [
      { id: 'save', label: 'Сохранить' },
      { id: 'copy', label: 'Копировать' },
      { id: 'trash', label: 'В корзину', danger: true },
    ],
  },
}

/** Пункт-разделитель отмечается `type: 'separator'` (без рендера). */
export const WithSeparator: Story = {
  args: {
    items: [
      { id: 'first', label: 'Первый' },
      { type: 'separator' },
      { id: 'archive', label: 'В архив' },
    ],
  },
}

/** Отключённый пункт меню. */
export const WithDisabledItem: Story = {
  args: {
    items: [
      { id: 'active', label: 'Доступно' },
      { id: 'blocked', label: 'Заблокировано', disabled: true },
    ],
  },
}

/** Отключённое меню целиком. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Клик по триггеру открывает меню, выбор пункта закрывает. */
export const Play: Story = {
  args: {
    trigger: <Button>Открыть меню</Button>,
    items: [{ id: 'first', label: 'Первый пункт', onSelect: fn() }],
  },
  play: async ({ args }) => {
    const item = args.items[0] as DropdownMenuItem
    await userEvent.click(screen.getByRole('button', { name: 'Открыть меню' }))
    await expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Первый пункт' }))
    await expect(item.onSelect).toHaveBeenCalled()
    await expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  },
}

/** Esc закрывает открытое меню. */
export const PlayEsc: Story = {
  args: {
    trigger: <Button>Открыть меню</Button>,
    items: [{ id: 'first', label: 'Первый пункт' }],
  },
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Открыть меню' }))
    await expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  },
}
