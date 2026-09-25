import { definePluginSettings, systemSettingsDefinition } from '@mai/settings'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, mocked, userEvent, waitFor } from 'storybook/test'
import { z } from 'zod'
import { sendSettingsDelete, sendSettingsGet, sendSettingsUpdate } from '../../api'
import { SettingsSchemaForm } from './SettingsSchemaForm'

const definition = definePluginSettings({
  nameKey: 'settings.name',
  i18nNamespace: 'theory',
  schema: z.object({
    autosaveDelay: z.enum(['500', '1000', '2000']).default('500').meta({
      title: 'settings.autosaveDelay.label',
      description: 'settings.autosaveDelay.hint',
    }),
  }),
})

const emptyDefinition = definePluginSettings({
  i18nNamespace: 'theory',
  schema: z.object({}),
})

const unsupportedDefinition = definePluginSettings({
  i18nNamespace: 'theory',
  schema: z.object({
    delaySeconds: z.number().default(1),
  }),
})

const meta = {
  title: 'Settings/SchemaForm',
  component: SettingsSchemaForm,
  tags: ['autodocs'],
  args: {
    definition,
    domain: 'plugin' as const,
    itemId: 'story-theory',
  },
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    mocked(sendSettingsGet).mockResolvedValue(null)
    mocked(sendSettingsDelete).mockResolvedValue(true)
    mocked(sendSettingsUpdate).mockClear()
  },
} satisfies Meta<typeof SettingsSchemaForm>

export default meta
type Story = StoryObj<typeof meta>

/** Подписи и пояснения приходят из namespace определения по ключам схемы. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('radiogroup')).toBeInTheDocument()
    await expect(canvas.getByText('Задержка автосохранения')).toBeInTheDocument()
    await expect(
      canvas.getByText('Время ожидания после последнего изменения перед сохранением.'),
    ).toBeInTheDocument()
  },
}

/** Изменение значения уходит на бэкенд после паузы автосохранения. */
export const Autosave: Story = {
  args: { itemId: 'story-autosave' },
  play: async ({ canvas }) => {
    const option = await canvas.findByRole('radio', { name: '1000' })
    await userEvent.click(option)
    await waitFor(() => expect(sendSettingsUpdate).toHaveBeenCalledTimes(1), { timeout: 2000 })
  },
}

/** Пока пункт не загружен, видно состояние загрузки. */
export const Loading: Story = {
  args: { itemId: 'story-loading' },
  beforeEach: () => {
    mocked(sendSettingsGet).mockReturnValue(new Promise(() => undefined))
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Загрузка настроек…')).toBeInTheDocument()
  },
}

/** Ошибка чтения показывается в статусе формы. */
export const Error: Story = {
  args: { itemId: 'story-error' },
  beforeEach: () => {
    mocked(sendSettingsGet).mockRejectedValue(new globalThis.Error('API unavailable'))
  },
  play: async ({ canvas }) => {
    const error = await canvas.findByText('Не удалось выполнить операцию: API unavailable')
    expect(error).toBeInTheDocument()
  },
}

/** Сброс удаляет документ пункта и возвращает дефолты. */
export const Reset: Story = {
  args: { itemId: 'story-reset' },
  play: async ({ canvas }) => {
    const reset = await canvas.findByRole('button', { name: 'Сбросить настройки' })
    await waitFor(() => expect(reset).toBeEnabled())
    await userEvent.click(reset)
    await userEvent.click(canvas.getByRole('button', { name: 'Сбросить' }))
    await expect(sendSettingsDelete).toHaveBeenCalledWith('plugin', 'story-reset')
  },
}

/** Системные настройки «Общие» рендерятся той же формой по своему определению. */
export const SystemSettings: Story = {
  args: {
    definition: systemSettingsDefinition,
    domain: 'system',
    itemId: 'general',
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Тема оформления')).toBeInTheDocument()
    await expect(canvas.getByText('Системная')).toBeInTheDocument()
    await expect(canvas.getByText('Язык интерфейса')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Сбросить настройки' })).toBeEnabled()
  },
}

/** Пустая схема — понятное сообщение вместо пустой формы. */
export const EmptySchema: Story = {
  args: { definition: emptyDefinition, itemId: 'story-empty' },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('В этом разделе пока нет настроек.')).toBeInTheDocument()
  },
}

/** Неподдерживаемое поле не роняет страницу: ошибка схемы уходит в статус. */
export const UnsupportedSchema: Story = {
  args: { definition: unsupportedDefinition, itemId: 'story-unsupported' },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/Неподдерживаемый тип настройки/)).toBeInTheDocument()
  },
}
