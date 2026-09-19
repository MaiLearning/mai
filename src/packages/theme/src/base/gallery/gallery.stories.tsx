import type { Meta, StoryObj } from '@storybook/react-vite'
import { fontVariants, monoFonts, sansFonts } from '../fonts/fontVariants'
import { FontGallery } from './gallery'
import { GalleryGrid } from './gallery.style'

const fontLabels = (fonts: typeof sansFonts) =>
  Object.fromEntries(fonts.map((f) => [f.id, f.label]))

/**
 * Витрина шрифтов дизайн-системы Mai. Файлы шрифтов лежат в
 * base/fonts/varN/ (один sans + один mono на вариант), реестр —
 * fontVariants.ts. Шрифт применяется перекрытием токенов темы,
 * поэтому витрина показывает финальный вид компонентов.
 */
const meta = {
  title: 'Design/Base/Fonts',
  component: FontGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    sansId: sansFonts[0].id,
    monoId: monoFonts[0].id,
  },
  argTypes: {
    sansId: {
      control: 'select',
      options: sansFonts.map((f) => f.id),
      labels: fontLabels(sansFonts),
      description: 'Основной шрифт интерфейса',
    },
    monoId: {
      control: 'select',
      options: monoFonts.map((f) => f.id),
      labels: fontLabels(monoFonts),
      description: 'Моноширинный шрифт (код)',
    },
  },
} satisfies Meta<typeof FontGallery>

export default meta

type Story = StoryObj<typeof meta>

/** Режим переключения: sans и mono выбираются независимо в controls. */
export const Switcher: Story = {}

/** Режим сравнения: все варианты рядом, одинаковые образцы. */
export const Comparison: Story = {
  render: () => (
    <GalleryGrid>
      {fontVariants.map((v) => (
        <FontGallery key={v.id} sansId={v.sans.id} monoId={v.mono.id} title={v.label} />
      ))}
    </GalleryGrid>
  ),
}
