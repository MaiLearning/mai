import styled from 'styled-components'
import { useTranslation } from '@/app/i18n'

/** Строка ошибки формы (рендерится внизу тела модалки). */
export const FormError = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.dangerSurface};
  background: ${({ theme }) => theme.colors.dangerSurface};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  font-weight: 500;
`

const BadgeRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.warning};
  }
`

/** Бейдж «есть несохранённые изменения» для футера окна редактирования. */
export function DirtyBadge() {
  const { t } = useTranslation('courseModal')

  return <BadgeRoot>{t('dirtyBadge')}</BadgeRoot>
}
