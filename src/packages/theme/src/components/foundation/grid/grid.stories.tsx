import type { Meta, StoryObj } from '@storybook/react-vite'
import type { GridAlign, GridJustify } from './grid'
import { Grid } from './grid'

const aligns: GridAlign[] = ['start', 'center', 'end', 'stretch', 'baseline']
const justifies: GridJustify[] = ['start', 'center', 'end', 'stretch']

/** Плитка, чтобы видеть треки, а не текст, который их растягивает. */
function Cell({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '12px 8px',
        textAlign: 'center',
        borderRadius: 6,
        background: 'color-mix(in srgb, currentColor 12%, transparent)',
        outline: '1px dashed currentColor',
      }}
    >
      {label}
    </div>
  )
}

/**
 * Grid — колоночная раскладка. Задаёт шаблон треков, зазор и выравнивание
 * элементов внутри треков; отступы идут через каталог `theme.spacing` или
 * число базовых шагов.
 */
const meta = {
  title: 'Theme/Components/Foundation/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Колоночная раскладка: элементы попадают в общие колонки, а не просто стоят рядом. `columns` задаёт либо число равных колонок, либо готовый шаблон треков; `min` вместо этого упаковывает колонки по минимальной ширине трека, и число колонок сверху не ограничено. `gap` принимает ключ каталога темы или число базовых шагов.',
      },
    },
  },
  argTypes: {
    columns: {
      control: 'text',
      description: 'Число равных колонок (`3`) или шаблон треков дословно (`1fr auto 1fr auto`).',
    },
    min: {
      control: 'text',
      description:
        'Минимальная ширина трека: колонок столько, сколько влезет. Побеждает `columns`, если переданы оба.',
    },
    gap: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Зазор между строками и колонками: ключ каталога или число базовых шагов.',
    },
    align: {
      control: 'select',
      options: aligns,
      description: 'Выравнивание элементов по поперечной оси внутри треков (`align-items`).',
    },
    justify: {
      control: 'select',
      options: justifies,
      description: 'Выравнивание элементов по главной оси внутри треков (`justify-items`).',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'main', 'article', 'aside', 'nav'],
      description: 'Семантический тег корня.',
    },
    children: { control: false, description: 'Содержимое сетки.' },
  },
} satisfies Meta<typeof Grid>

export default meta

type Story = StoryObj<typeof meta>

/** Сетка с плитками. */
export const Playground: Story = {
  args: {
    columns: 3,
    min: undefined,
    gap: 'md',
    align: 'stretch',
    justify: 'stretch',
    children: undefined,
  },
  render: (args) => (
    <Grid {...args}>
      {['1', '2', '3', '4', '5', '6'].map((n) => (
        <Cell key={n} label={n} />
      ))}
    </Grid>
  ),
}

/** Число колонок: потолок фиксирован и не растёт вместе с шириной. */
export const EqualColumns: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {[2, 4, 10].map((columns) => (
        <div key={columns}>
          <p>
            columns={columns} — <code>repeat({columns}, 1fr)</code>
          </p>
          <Grid columns={columns} gap="sm">
            {Array.from({ length: columns * 2 }, (_, i) => (
              <Cell key={i} label={`${i + 1}`} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
}

/** Готовый шаблон треков: колонки бывают неравными. */
export const TrackTemplate: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <p>
          <code>columns=&quot;18px 1fr auto&quot;</code> — иконка, подпись, действие
        </p>
        <Grid columns="18px 1fr auto" gap="sm" align="center">
          <Cell label="◆" />
          <Cell label="Переименовать" />
          <Cell label="⏎" />
        </Grid>
      </div>
      <div>
        <p>
          <code>columns=&quot;1fr auto 1fr auto&quot;</code> — пара «термин — определение»
        </p>
        <Grid columns="1fr auto 1fr auto" gap="sm" align="center">
          <Cell label="Термин" />
          <Cell label="→" />
          <Cell label="Определение" />
          <Cell label="✕" />
        </Grid>
      </div>
    </div>
  ),
}

/**
 * `min` упаковывает колонки: их число — функция ширины контейнера, а не
 * заданное число. Потолка сверху нет, поэтому на широкой области колонок
 * становится больше.
 */
export const AutoFlow: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {[280, 420, 560].map((width) => (
        <div key={width}>
          <p>
            контейнер {width}px, <code>min=&quot;{width}px&quot;</code>
          </p>
          <div style={{ width, outline: '1px dashed currentColor' }}>
            <Grid min={`${width}px`} gap="sm">
              {['1', '2', '3', '4', '5', '6', '7'].map((n) => (
                <Cell key={n} label={n} />
              ))}
            </Grid>
          </div>
        </div>
      ))}
    </div>
  ),
}

/** Выравнивание элементов внутри треков: треки растянуты, элементы — нет. */
export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {aligns.map((align) => (
        <div key={align}>
          <p>align=&quot;{align}&quot; · justify=&quot;center&quot;</p>
          <Grid columns={4} gap="sm" align={align} justify="center">
            {['1', '2', '3', '4'].map((n) => (
              <div
                key={n}
                style={{
                  padding: '4px 12px',
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'color-mix(in srgb, currentColor 18%, transparent)',
                }}
              >
                {n}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
}

/** Семантический тег корня. */
export const SemanticTag: Story = {
  args: {
    as: 'section',
    columns: 2,
    gap: 'md',
    children: 'Сетка отрисована как <section>.',
  },
  render: (args) => (
    <Grid {...args}>
      <Cell label="1" />
      <Cell label="2" />
    </Grid>
  ),
}

/** Множество значений `justify` в гриде не пересекается с `Flex`. */
export const JustifyIsNotFlexJustify: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {justifies.map((justify) => (
        <div key={justify}>
          <p>
            justify=&quot;{justify}&quot; → <code>justify-items: {justify}</code>
          </p>
          <Grid
            columns={3}
            gap="sm"
            justify={justify}
            style={{ background: 'color-mix(in srgb, currentColor 6%, transparent)' }}
          >
            {['1', '2', '3'].map((n) => (
              <Cell key={n} label={n} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
}
