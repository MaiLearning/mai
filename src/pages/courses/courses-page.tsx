import { useTranslation } from '@/app/i18n'

/** Страница управления курсами (заглушка). */
export function CoursesPage() {
  const { t } = useTranslation('home')

  return (
    <div>
      <h1>{t('coursesPage.title')}</h1>
      <div />
    </div>
  )
}
