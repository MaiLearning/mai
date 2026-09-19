import { useTranslation } from '@mai/i18n'
import { BadgeRoot, FormError } from './FormFeedback.style'

/** Бейдж «есть несохранённые изменения» для футера окна редактирования. */
export function DirtyBadge() {
  const { t } = useTranslation('course')

  return <BadgeRoot>{t('dirtyBadge')}</BadgeRoot>
}

export { FormError }
