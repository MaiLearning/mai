import type { Meta, StoryObj } from '@storybook/react-vite'
import type { JSX, ReactNode } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Button } from '../../../src/components/primitive/button/button'
import type { DropdownMenuItem } from './dropdownMenu'
import { DropdownMenu } from './dropdownMenu'

/**
 * Локальные глифы пунктов меню. Иконки вне каталога `@mai/icons` рисуются
 * собственным SVG прямо в стории (см. ICONS.md @mai/icons).
 */
type GlyphProps = { className?: string }

function glyph(paths: ReactNode): (props: GlyphProps) => JSX.Element {
  return () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}

const EditIcon = glyph(
  <>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </>,
)

const SaveIcon = glyph(
  <>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </>,
)

const CopyIcon = glyph(
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
)

const TrashIcon = glyph(
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </>,
)

const ExportIcon = glyph(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5" />
    <path d="M12 3v12" />
  </>,
)

const ZoomInIcon = glyph(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="M11 8v6" />
    <path d="M8 11h6" />
  </>,
)

const ZoomOutIcon = glyph(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="M8 11h6" />
  </>,
)

const LinkIcon = glyph(
  <>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </>,
)

const ImageIcon = glyph(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </>,
)

/**
 * DropdownMenu — выпадающее меню действий. Триггер оборачивается в слот,
 * ловящий клик; панель рендерится порталом в body. Закрытие — кликом вне
 * или Esc, навигация — клавиатурой (↑ ↓ Home End Enter).
 */
const meta = {
  title: 'DropdownMenu/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    trigger: <Button variant="secondary">Действия</Button>,
    items: [
      { id: 'edit', label: 'Редактировать', icon: <EditIcon /> },
      { id: 'duplicate', label: 'Дублировать', icon: <CopyIcon /> },
      { id: 'export', label: 'Экспорт', hint: 'Ctrl+E', icon: <ExportIcon /> },
      { type: 'separator' },
      { id: 'delete', label: 'Удалить', danger: true, icon: <TrashIcon /> },
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
      { id: 'zoom-in', label: 'Приблизить', icon: <ZoomInIcon /> },
      { id: 'zoom-out', label: 'Отдалить', icon: <ZoomOutIcon /> },
      { type: 'separator' },
      { type: 'label', label: 'Вставка' },
      { id: 'link', label: 'Ссылку', icon: <LinkIcon /> },
      { id: 'image', label: 'Изображение', icon: <ImageIcon /> },
    ],
  },
}

/** Меню с иконками пунктов. */
export const WithIcons: Story = {
  args: {
    trigger: <Button variant="ghost">Файл</Button>,
    items: [
      { id: 'save', label: 'Сохранить', icon: <SaveIcon /> },
      { id: 'copy', label: 'Копировать', icon: <CopyIcon /> },
      { id: 'trash', label: 'В корзину', danger: true, icon: <TrashIcon /> },
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
