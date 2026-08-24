import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { I18nProvider } from '@/app/i18n/provider'
import { Button, Modal, ModalBody, ModalFooter, ModalFooterSpacer } from '@/app/theme/components'
import type { Course } from '@/entities/course'
import {
  ColorPairPicker,
  CourseFormFields,
  CoursePreviewHeader,
  DangerPlate,
  emptyCourseForm,
  StatusPicker,
  TagInput,
  useCourseForm,
} from '.'

const meta = {
  title: 'Features/CourseModal',
  decorators: [
    (Story) => (
      <I18nProvider>
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta

export default meta

const sampleCourse: Course = {
  id: 'course-1',
  name: 'React с нуля до продакшена',
  description: 'Практический курс по современному frontend на React.',
  tags: ['Frontend', 'React'],
  colorFrom: '#5b46f5',
  colorTo: '#b794fa',
  status: 'in_progress',
  createdAt: 0,
  updatedAt: 0,
}
/** Обёртка с открытой модалкой в композиционном режиме (как в окнах курса). */
function ModalShell({
  eyebrow,
  initial,
  children,
}: {
  eyebrow: string
  initial?: Parameters<typeof useCourseForm>[0]
  children?: React.ReactNode
}) {
  const [opened, setOpened] = useState(true)
  const titleId = 'story-course-modal-title'
  const { values, setField, errors } = useCourseForm(initial ?? emptyCourseForm, opened)

  return (
    <>
      {!opened && <Button onClick={() => setOpened(true)}>Открыть модалку</Button>}
      <Modal opened={opened} onClose={() => setOpened(false)} labelledBy={titleId}>
        <CoursePreviewHeader
          values={values}
          eyebrow={eyebrow}
          onClose={() => setOpened(false)}
          titleId={titleId}
        />
        <ModalBody>
          <CourseFormFields values={values} errors={errors} setField={setField} />
          {children}
        </ModalBody>
        <ModalFooter>
          <ModalFooterSpacer />
          <Button variant="ghost" onClick={() => setOpened(false)}>
            Отмена
          </Button>
          <Button type="button">Сохранить</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const CreateModal: StoryObj = {
  name: 'Окно создания курса',
  render: () => <ModalShell eyebrow="Новый курс" />,
}

export const EditModalWithDangerZone: StoryObj = {
  name: 'Окно редактирования + опасная зона',
  render: () => (
    <ModalShell
      eyebrow="Редактирование курса"
      initial={{
        ...emptyCourseForm,
        name: sampleCourse.name,
        description: sampleCourse.description ?? '',
        tags: sampleCourse.tags,
        gradient: {
          from: sampleCourse.colorFrom ?? emptyCourseForm.gradient.from,
          to: sampleCourse.colorTo ?? emptyCourseForm.gradient.to,
        },
        status: sampleCourse.status,
      }}
    >
      <DangerPlate
        armed={false}
        busy={false}
        courseName={sampleCourse.name}
        onArm={fn()}
        onDisarm={fn()}
        onDelete={fn()}
      />
    </ModalShell>
  ),
}

export const ColorPairPickerStory: StoryObj = {
  name: 'Выбор пары цветов',
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ColorPairPickerState />
    </div>
  ),
}

function ColorPairPickerState() {
  const [gradient, setGradient] = useState(emptyCourseForm.gradient)
  return <ColorPairPicker value={gradient} onChange={setGradient} />
}

export const StatusPickerStory: StoryObj = {
  name: 'Выбор статуса',
  render: () => <StatusPickerState />,
}

function StatusPickerState() {
  const [status, setStatus] = useState<Course['status']>('draft')
  return (
    <StatusPicker
      value={status}
      options={[
        { value: 'draft', label: 'Черновик', hint: 'Виден только вам' },
        { value: 'in_progress', label: 'В процессе', hint: 'Доступен студентам' },
        { value: 'completed', label: 'Завершён', hint: 'Материал закрыт' },
      ]}
      onChange={setStatus}
    />
  )
}

export const TagInputStory: StoryObj = {
  name: 'Ввод тегов',
  render: () => <TagInputState />,
}

function TagInputState() {
  const [tags, setTags] = useState<string[]>(['Frontend'])
  return (
    <TagInput value={tags} onChange={setTags} suggestions={['Backend', 'Дизайн', 'Аналитика']} />
  )
}
