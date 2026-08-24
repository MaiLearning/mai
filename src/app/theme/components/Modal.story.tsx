import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useState } from 'react'
import { fn } from 'storybook/test'
import { Button } from './Button'
import { Modal, ModalBody, ModalFooter, ModalFooterSpacer } from './Modal'

/** Колбэк программного закрытия, который получают дети обёртки. */
type Close = () => void
/** Контент или футер: либо узел, либо функция от close (программное закрытие). */
type Slot = ReactNode | ((close: Close) => ReactNode)
const resolveSlot = (slot: Slot, close: Close): ReactNode =>
  typeof slot === 'function' ? slot(close) : slot
interface ModalTriggerProps {
  opened?: boolean
  title?: string
  labelledBy?: string
  dismissible?: boolean
  width?: number
  onClose?: Close
  /** Контент модалки; close — программное закрытие. */
  children: Slot
  /** Футер модалки; close — программное закрытие. */
  footer?: Slot
}
/**
 * Обёртка для стори: модалка закрыта по умолчанию и открывается кнопкой.
 * Нужна, чтобы оверлей открытой модалки не перекрывал docs-страницу.
 */
function ModalTrigger({
  title,
  labelledBy,
  dismissible,
  width,
  onClose,
  children,
  footer,
}: ModalTriggerProps) {
  const [opened, setOpened] = useState(false)
  const close = () => {
    onClose?.()
    setOpened(false)
  }
  return (
    <>
      <Button onClick={() => setOpened(true)}>Открыть модалку</Button>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        labelledBy={labelledBy}
        dismissible={dismissible}
        width={width}
        footer={footer === undefined ? undefined : resolveSlot(footer, close)}
      >
        {resolveSlot(children, close)}
      </Modal>
    </>
  )
}
const meta = {
  title: 'Theme/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    opened: false,
    children: undefined,
    onClose: fn(),
    width: 620,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Модальное окно: портал в body, размытие фона, анимации открытия/закрытия, bottom sheet на мобильных, ' +
          'focus trap, scroll-lock и возврат фокуса на триггер. ' +
          'В стори модалка закрыта по умолчанию и открывается кнопкой — иначе оверлей перекрывает docs-страницу.',
      },
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/** Типовое использование: заголовок, контент, футер с кнопками. */
export const Default: Story = {
  render: (args) => (
    <ModalTrigger
      {...args}
      title="Подтверждение удаления"
      footer={(close) => (
        <>
          <Button variant="secondary" onClick={close}>
            Отмена
          </Button>
          <Button onClick={close}>Удалить</Button>
        </>
      )}
    >
      {() => <>Курс «Основы React» и все его материалы будут удалены безвозвратно.</>}
    </ModalTrigger>
  ),
}

/** Длинное содержимое — внутренняя прокрутка при переполнении по высоте. */
export const LongContent: Story = {
  render: (args) => (
    <ModalTrigger {...args} title="Длинное содержимое">
      {() =>
        Array.from({ length: 40 }, (_, i) => (
          <p key={i}>
            Абзац {i + 1}: контент внутри модального окна прокручивается, если не помещается по
            высоте экрана.
          </p>
        ))
      }
    </ModalTrigger>
  ),
}

/** Композиционный режим без title: потребитель сам собирает хедер, тело и футер. */
export const Composition: Story = {
  render: (args) => (
    <ModalTrigger {...args} labelledBy="composition-title">
      {(close) => (
        <>
          <ModalBody>
            <h3 id="composition-title">Заголовок потребителя</h3>
            <p>
              Без пропа title модалка не рисует хедер: потребитель сам собирает ModalBody,
              ModalFooter и передаёт labelledBy с id своего заголовка.
            </p>
          </ModalBody>
          <ModalFooter>
            <ModalFooterSpacer />
            <Button variant="secondary" onClick={close}>
              Отмена
            </Button>
            <Button onClick={close}>Сохранить</Button>
          </ModalFooter>
        </>
      )}
    </ModalTrigger>
  ),
}

/** dismissible=false: Esc, клик по фону и крестик не закрывают окно. */
export const NotDismissible: Story = {
  render: (args) => (
    <ModalTrigger {...args} title="Сохранение…" dismissible={false}>
      {(close) => (
        <>
          <p>Окно нельзя закрыть вручную — Esc, клик по фону и крестик заблокированы.</p>
          <p>Программное закрытие работает всегда:</p>
          <Button variant="secondary" onClick={close}>
            Закрыть программно
          </Button>
        </>
      )}
    </ModalTrigger>
  ),
}
