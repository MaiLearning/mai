import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { styled } from 'styled-components'
import {
  ItemHint,
  ItemIcon,
  ItemLabel,
  MenuItemButton,
  MenuList,
  MenuSeparator,
  MenuSurface,
  SectionLabel,
  SubmenuChevron,
} from './popover.style'
import { usePopover } from './usePopover'

/** Триггер-демо: на такие элементы `usePopover` вешает `triggerRef`. */
const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;

  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'hoverAlpha')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`

const playOnClick = fn()

const meta = {
  title: 'UI/Primitive/Popover',
  parameters: {
    docs: {
      description: {
        component:
          'Инфраструктура всплывающих панелей: хук `usePopover` (открытие/закрытие, позиционирование с флипом от краёв, закрытие по клику вне/Esc, фокус панели) и общая палитра меню из `popover.style`. Панель монтируется потребителем при `opened` и позиционируется через `coords`.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

/** Меню поверх триггера: флип от краёв вьюпорта, Esc и клик вне закрывают. */
export const Dropdown: Story = {
  render: () => {
    const { opened, toggle, close, triggerRef, panelRef, coords } = usePopover<HTMLButtonElement>()
    const [selected, setSelected] = useState('Просмотр')

    const items = ['Просмотр', 'Редактирование', 'Дублировать']

    return (
      <div style={{ padding: 4 }}>
        <TriggerButton ref={triggerRef} onClick={toggle}>
          {selected}
        </TriggerButton>
        {opened && (
          <MenuSurface ref={panelRef} tabIndex={-1} style={{ ...coords }}>
            <MenuList>
              {items.map((item) => (
                <li key={item}>
                  <MenuItemButton
                    $active={item === selected}
                    onClick={() => {
                      setSelected(item)
                      close()
                    }}
                  >
                    <ItemIcon />
                    <ItemLabel>{item}</ItemLabel>
                  </MenuItemButton>
                </li>
              ))}
              <MenuSeparator />
              <li>
                <MenuItemButton $danger onClick={close}>
                  <ItemIcon $danger>
                    <TrashIcon />
                  </ItemIcon>
                  <ItemLabel>Удалить</ItemLabel>
                  <ItemHint>⌫</ItemHint>
                </MenuItemButton>
              </li>
            </MenuList>
          </MenuSurface>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Минимальный dropdown на `usePopover` + поверхность меню: клик по пункту выбирает и закрывает, Esc/клик вне — закрывают.',
      },
    },
  },
}

/** Триггер с иконкой, подсказкой-шорткатом и подменю-шевроном. */
export const RichMenu: Story = {
  render: () => {
    const { opened, toggle, close, triggerRef, panelRef, coords } = usePopover<HTMLButtonElement>()

    return (
      <div style={{ padding: 4 }}>
        <TriggerButton ref={triggerRef} onClick={toggle}>
          Открыть меню
        </TriggerButton>
        {opened && (
          <MenuSurface ref={panelRef} tabIndex={-1} style={{ ...coords }}>
            <MenuList>
              <li>
                <SectionLabel>Действия</SectionLabel>
              </li>
              <li>
                <MenuItemButton onClick={close}>
                  <ItemIcon>
                    <CopyIcon />
                  </ItemIcon>
                  <ItemLabel>Скопировать</ItemLabel>
                  <ItemHint>⌘C</ItemHint>
                </MenuItemButton>
              </li>
              <li>
                <MenuItemButton onClick={close}>
                  <ItemIcon>
                    <ExportIcon />
                  </ItemIcon>
                  <ItemLabel>Экспорт</ItemLabel>
                  <ItemHint>⌘E</ItemHint>
                </MenuItemButton>
              </li>
              <li>
                <MenuItemButton onClick={close}>
                  <ItemIcon />
                  <ItemLabel>Сгруппировать</ItemLabel>
                  <SubmenuChevron>
                    <ChevronIcon />
                  </SubmenuChevron>
                </MenuItemButton>
              </li>
            </MenuList>
          </MenuSurface>
        )}
      </div>
    )
  },
}

/** Клик по пункту вызывает его обработчик. */
export const Play: Story = {
  render: () => {
    const { opened, toggle, triggerRef, panelRef, coords } = usePopover<HTMLButtonElement>()

    return (
      <div style={{ padding: 4 }}>
        <TriggerButton ref={triggerRef} onClick={toggle}>
          Нажми меня
        </TriggerButton>
        {opened && (
          <MenuSurface ref={panelRef} tabIndex={-1} style={{ ...coords }}>
            <MenuList>
              <li>
                <MenuItemButton onClick={playOnClick}>
                  <ItemLabel>Пункт</ItemLabel>
                </MenuItemButton>
              </li>
            </MenuList>
          </MenuSurface>
        )}
      </div>
    )
  },
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Нажми меня' }))
    await userEvent.click(screen.getByRole('button', { name: 'Пункт' }))
    await expect(playOnClick).toHaveBeenCalledOnce()
  },
}

function IconFrame({ children }: { children: ReactNode }) {
  return <span aria-hidden="true">{children}</span>
}

function TrashIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 6h18M8 6V4h8v2m1 0-1 14H8L7 6" />
      </svg>
    </IconFrame>
  )
}

function CopyIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
    </IconFrame>
  )
}

function ExportIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
    </IconFrame>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
