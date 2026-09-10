import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { findSettingsSection, useSettingsSections } from '../registry'

/**
 * Main-область для динамической секции /settings/:sectionId:
 * резолвит секцию в реестре и рендерит её компонент.
 * Неизвестный идентификатор — редирект на «Общие».
 */
export function SectionOutlet() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const sections = useSettingsSections()
  const navigate = useNavigate()
  const section = sectionId ? findSettingsSection(sections, sectionId) : undefined

  useEffect(() => {
    if (sectionId && !section) navigate('/settings/general', { replace: true })
  }, [sectionId, section, navigate])

  if (!section?.component) return null
  const Component = section.component

  return <Component />
}
