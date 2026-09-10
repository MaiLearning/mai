import { useAtomValue, useSetAtom } from 'jotai'
import { BookOpen, Settings } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesAtom, loadCoursesAtom } from '@/entities/course'
import type { SettingsGroup, SettingsSection } from './core/types'
import { CourseSettings } from './sections/course'
import { GeneralSettings } from './sections/general'

/**
 * Слот реестра для секций internal-плагинов: плагин объявляет корневой
 * файл settings.tsx с экспортом SettingsSection[], реестр собирает их.
 * Подключение реальных плагинов — отдельная задача; сейчас слот пуст.
 */
export const INTERNAL_SETTINGS_SECTIONS: SettingsSection[] = []

/**
 * Слот реестра для секций external-плагинов (External Plugin API, в
 * планах). Отдельный слот — сайдбар и поиск не меняются при появлении
 * внешних плагинов: группы «Встроенные/Сторонние плагины» уже разведены.
 */
export const EXTERNAL_SETTINGS_SECTIONS: SettingsSection[] = []

/** Разрешает название: i18n-ключ (реактивен к языку) или готовый текст. */
export function resolveLabel(
  t: (key: string) => string,
  item: { label?: string; labelKey?: string },
): string {
  if (item.labelKey) return t(item.labelKey)

  return item.label ?? ''
}

/** Секция «Общие»: системные настройки — тема оформления, язык. */
const generalSection: SettingsSection = {
  id: 'general',
  icon: Settings,
  labelKey: 'settings.sections.general',
  fields: [
    {
      id: 'theme',
      labelKey: 'settings.fields.theme',
      keywords: ['theme', 'светлая', 'тёмная', 'системная', 'light', 'dark', 'system'],
      group: 'Оформление',
    },
    {
      id: 'language',
      labelKey: 'settings.fields.language',
      keywords: ['language', 'язык', 'локализация', 'русский', 'english'],
      group: 'Оформление',
    },
  ],
  component: GeneralSettings,
}

/** Жёстко зашитые встроенные секции (доступ есть только у приложения). */
const builtinSections: SettingsSection[] = [generalSection]

/** Группа «Общие» — без заголовка, как в референсе. */
const generalGroup: SettingsGroup = {
  id: 'general',
  sections: builtinSections,
}

/**
 * Собирает группы плагинов из слотов реестра. Пустой слот — группу
 * не показываем (в v1 подключение плагинов — отдельная задача).
 */
function pluginGroups(): SettingsGroup[] {
  const groups: SettingsGroup[] = []
  if (INTERNAL_SETTINGS_SECTIONS.length > 0) {
    groups.push({
      id: 'internal-plugins',
      headerKey: 'settings.groups.plugins',
      sections: INTERNAL_SETTINGS_SECTIONS,
    })
  }
  if (EXTERNAL_SETTINGS_SECTIONS.length > 0) {
    groups.push({
      id: 'external-plugins',
      headerKey: 'settings.groups.external',
      sections: EXTERNAL_SETTINGS_SECTIONS,
    })
  }

  return groups
}

/**
 * Группы сайдбара: «Общие» (жёстко), плагинные группы (из слотов),
 * «Курсы» (динамически из store course). Ключи label/header резолвятся
 * через i18next — переключение языка обновляет сайдбар.
 */
export function useSettingsGroups(): SettingsGroup[] {
  const { t } = useTranslation('settings')
  const courses = useAtomValue(coursesAtom)
  const loadCourses = useSetAtom(loadCoursesAtom)

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const courseSections: SettingsSection[] = courses.map((course) => ({
    id: `course-${course.id}`,
    icon: BookOpen,
    label: course.name,
    // Параметрический маршрут: шелл рендерит CourseSettings по courseId
    path: `/settings/course/${course.id}`,
    component: CourseSettings,
  }))

  const resolved = (group: SettingsGroup): SettingsGroup => ({
    ...group,
    header: group.headerKey ? t(group.headerKey) : group.header,
    sections: group.sections.map((s) => ({ ...s, label: resolveLabel(t, s) })),
  })

  return [
    resolved(generalGroup),
    ...pluginGroups().map(resolved),
    ...(courseSections.length > 0
      ? [
          resolved({
            id: 'courses',
            headerKey: 'settings.groups.courses',
            sections: courseSections,
          }),
        ]
      : []),
  ]
}

/** Плоский список всех секций всех групп (включая динамические курсы). */
export function useSettingsSections(): SettingsSection[] {
  return useSettingsGroups().flatMap((group) => group.sections)
}

/** Поиск секции по идентификатору среди всех групп. */
export function findSettingsSection(
  sections: SettingsSection[],
  id: string,
): SettingsSection | undefined {
  return sections.find((section) => section.id === id)
}
