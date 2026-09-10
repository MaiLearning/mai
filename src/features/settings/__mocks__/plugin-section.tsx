import { Sparkles } from 'lucide-react'
import type { SettingsSection } from '../core/types'
import {
  InfoSetting,
  InputSetting,
  SelectSetting,
  SliderSetting,
  ToggleSetting,
} from '../ui/fields'
import { usePluginSettings } from '../use-plugin-settings'

/**
 * Мок секции плагина для стори: показывает контракт settings.tsx и
 * работу usePluginSettings на шаблонах полей. Реальные плагины
 * подключаются отдельной задачей (корневой settings.tsx в src/plugins/<name>).
 */
export function MockPluginSectionComponent() {
  const { settings, ready, setSetting } = usePluginSettings('demo')

  return (
    <div>
      <h2>Плагин-пример</h2>
      <InputSetting
        name="Размер шрифта"
        description="Базовый размер шрифта в просмотрщике плагина"
        type="number"
        value={String(settings['editor.fontSize'] ?? 14)}
        onChange={(value) => setSetting('editor.fontSize', Number(value) || 14)}
        min={10}
        max={32}
        disabled={!ready}
      />
      <SelectSetting
        name="Раскладка"
        description="Расположение панели содержимого"
        value={String(settings['layout'] ?? 'side')}
        onChange={(value) => setSetting('layout', value)}
        options={[
          { value: 'side', label: 'Сбоку' },
          { value: 'bottom', label: 'Снизу' },
          { value: 'hidden', label: 'Скрыта' },
        ]}
        disabled={!ready}
      />
      <SliderSetting
        name="Масштаб"
        description="Масштаб отображения содержимого"
        value={Number(settings['zoom'] ?? 100)}
        onChange={(value) => setSetting('zoom', value)}
        min={50}
        max={200}
        step={10}
        format={(value) => `${value}%`}
        disabled={!ready}
      />
      <ToggleSetting
        name="Автосохранение"
        description="Сохранять изменения автоматически"
        checked={Boolean(settings['autosave'])}
        onChange={(checked) => setSetting('autosave', checked)}
        disabled={!ready}
      />
      <InfoSetting name="Версия" description="Версия плагина" value="1.0.0 (мок)" />
    </div>
  )
}

export const mockPluginSection: SettingsSection = {
  id: 'demo-plugin',
  icon: Sparkles,
  label: 'Плагин-пример',
  fields: [
    { id: 'fontSize', label: 'Размер шрифта', keywords: ['шрифт', 'font', 'размер'] },
    { id: 'layout', label: 'Раскладка', keywords: ['раскладка', 'панель', 'layout'] },
    { id: 'zoom', label: 'Масштаб', keywords: ['масштаб', 'zoom'] },
    { id: 'autosave', label: 'Автосохранение', keywords: ['автосохранение', 'autosave'] },
  ],
  component: MockPluginSectionComponent,
}
