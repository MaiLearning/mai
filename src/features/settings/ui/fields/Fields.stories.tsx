import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  ActionSetting,
  InfoSetting,
  InputSetting,
  SelectSetting,
  SettingRecord,
  SliderSetting,
  ToggleSetting,
} from '.'

function InputDemo() {
  const [value, setValue] = useState('14')

  return (
    <InputSetting
      name="Размер шрифта"
      description="Базовый размер шрифта в пикселях"
      type="number"
      value={value}
      onChange={setValue}
      min={10}
      max={32}
    />
  )
}

function ToggleDemo() {
  const [checked, setChecked] = useState(true)

  return (
    <ToggleSetting
      name="Автосохранение"
      description="Сохранять изменения автоматически"
      checked={checked}
      onChange={setChecked}
    />
  )
}

function SelectDemo() {
  const [value, setValue] = useState('side')

  return (
    <SelectSetting
      name="Раскладка"
      description="Расположение панели содержимого"
      value={value}
      onChange={setValue}
      options={[
        { value: 'side', label: 'Сбоку' },
        { value: 'bottom', label: 'Снизу' },
        { value: 'hidden', label: 'Скрыта' },
      ]}
    />
  )
}

function SliderDemo() {
  const [value, setValue] = useState(100)

  return (
    <SliderSetting
      name="Масштаб"
      description="Масштаб отображения содержимого"
      value={value}
      onChange={setValue}
      min={50}
      max={200}
      step={10}
      format={(value: number) => `${value}%`}
    />
  )
}

const meta = {
  title: 'Settings/Fields',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Шаблоны записей настроек: единый вид (название + описание + контрол) для всех секций, включая секции плагинов. Значения и колбэки передаются пропсами.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Каркас записи: название + описание + произвольный контрол. */
export const Record: Story = {
  render: () => (
    <SettingRecord name="Каркас записи" description="Общая рамка для любого контрола настройки">
      <span>контрол</span>
    </SettingRecord>
  ),
}

/** Поле ввода: текст или число. */
export const Input: Story = {
  render: () => <InputDemo />,
}

/** Переключатель: включить/выключить. */
export const Toggle: Story = {
  render: () => <ToggleDemo />,
}

/** Выпадающий список: выбор одного из n вариантов. */
export const Select: Story = {
  render: () => <SelectDemo />,
}

/** Слайдер: числовое значение в диапазоне. */
export const Slider: Story = {
  render: () => <SliderDemo />,
}

/** Действие: кнопка с описанием. */
export const Action: Story = {
  render: () => (
    <ActionSetting
      name="Очистить кэш"
      description="Удаляет временные файлы плагина"
      label="Очистить"
      variant="danger"
      onClick={() => {}}
    />
  ),
}

/** Сведения: значение только для чтения. */
export const Info: Story = {
  render: () => (
    <InfoSetting name="Версия" description="Версия установленного плагина" value="1.2.3" />
  ),
}
