import { error as logError } from '@tauri-apps/plugin-log'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Spinner } from '@/app/theme/components/Spinner'
import { updateResource } from '@/entities/resource/services'
import type { PluginRenderProps } from '@/features/plugin/core/types'
import { notifyError, notifySuccess } from '@/utils/notifications'
import { CodeWorkspace } from './components/CodeWorkspace'
import { useCodeContent } from './lib/useCodeContent'
import { EmptyState, EmptyText, GhostButton, SpinnerWrap, Viewer } from './viewer.style'

/** Свежесозданный шаг без содержимого — открываем сразу в редакторе. */
function looksFresh(content: ReturnType<typeof useCodeContent>['content']): boolean {
  if (content.steps.length !== 1) return false
  const s = content.steps[0]

  return (
    s.title.trim() === '' &&
    s.instructions.trim() === '' &&
    s.starterCode === '' &&
    s.expectedOutput === ''
  )
}

/**
 * CodeViewer — viewer плагина code: урок кода с шагами, исполнением
 * и проверкой. Контент тянет через сущность `code-plugin`; пустой урок
 * предлагает создать первый шаг.
 */
export function CodeViewer({ resourceId, courseId, data, onReady }: PluginRenderProps) {
  const {
    loading,
    content,
    saveState,
    addStep,
    deleteStep,
    updateStep,
    setLanguage,
    setStepCode,
    setStepResult,
    resetStep,
  } = useCodeContent(resourceId)

  const [title, setTitle] = useState(data?.name ?? '')
  const savedTitleRef = useRef(data?.name ?? '')
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    if (!loading) onReadyRef.current?.()
  }, [loading])

  const commitTitle = async () => {
    const name = title.trim()
    if (!data || !name || name === savedTitleRef.current) return

    try {
      await updateResource({ resourceId, courseId, name, typeKey: data.typeKey })
      savedTitleRef.current = name
      notifySuccess('Название сохранено', `Урок переименован в «${name}»`)
    } catch (e) {
      logError(
        `plugins/code: rename resource failed: ${e instanceof Error ? e.message : String(e)}`,
      )
      notifyError('Не удалось сохранить название')
      setTitle(savedTitleRef.current)
    }
  }

  if (loading) {
    return (
      <Viewer>
        <SpinnerWrap>
          <Spinner label="Загрузка урока" />
        </SpinnerWrap>
      </Viewer>
    )
  }

  if (content.steps.length === 0) {
    return (
      <Viewer>
        <EmptyState>
          <EmptyText>В этом уроке пока нет шагов</EmptyText>
          <GhostButton type="button" onClick={() => addStep()}>
            <Plus size={16} /> Добавить первый шаг
          </GhostButton>
        </EmptyState>
      </Viewer>
    )
  }

  return (
    <CodeWorkspace
      key={resourceId}
      content={content}
      initialMode={looksFresh(content) ? 'edit' : 'solve'}
      saveState={saveState}
      title={title}
      onTitleChange={setTitle}
      onTitleCommit={() => void commitTitle()}
      addStep={addStep}
      deleteStep={deleteStep}
      updateStep={updateStep}
      setLanguage={setLanguage}
      setStepCode={setStepCode}
      setStepResult={setStepResult}
      resetStep={resetStep}
    />
  )
}
