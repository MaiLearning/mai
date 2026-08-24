import { Trash2, TriangleAlert } from 'lucide-react'
import styled from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { Button } from '@/app/theme/components'

const Plate = styled.section<{ $armed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid
    ${({ theme, $armed }) => ($armed ? theme.colors.danger : theme.colors.border)};
  background: ${({ theme, $armed }) => ($armed ? theme.colors.dangerSurface : theme.colors.body)};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  @media (min-width: 560px) {
    flex-direction: ${({ $armed }) => ($armed ? 'column' : 'row')};
    align-items: ${({ $armed }) => ($armed ? 'stretch' : 'center')};
  }
`
const PlateText = styled.div`
  flex: 1;

  strong {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin-top: 3px;
    font-size: 12.5px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`
const PlateActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  > * {
    flex: 1;
  }

  @media (min-width: 560px) {
    > * {
      flex: initial;
    }
  }
`

export interface DangerPlateProps {
  /** Подтверждён ли режим удаления (показ предупреждения вместо кнопки). */
  armed: boolean
  busy: boolean
  courseName: string
  onArm: () => void
  onDisarm: () => void
  onDelete: () => void
}

/** Опасная зона окна редактирования: удаление курса в два шага. */
export function DangerPlate({
  armed,
  busy,
  courseName,
  onArm,
  onDisarm,
  onDelete,
}: DangerPlateProps) {
  const { t } = useTranslation('courseModal')

  return (
    <Plate $armed={armed}>
      {armed ? (
        <>
          <PlateText>
            <strong>
              <TriangleAlert size={15} aria-hidden="true" />
              {t('danger.confirmTitle', { name: courseName })}
            </strong>
            <p>{t('danger.confirmText')}</p>
          </PlateText>
          <PlateActions>
            <Button variant="secondary" size="sm" type="button" onClick={onDisarm} disabled={busy}>
              {t('danger.cancel')}
            </Button>
            <Button variant="danger" size="sm" type="button" onClick={onDelete} disabled={busy}>
              <Trash2 size={15} aria-hidden="true" />
              {busy ? t('danger.deleting') : t('danger.confirm')}
            </Button>
          </PlateActions>
        </>
      ) : (
        <>
          <PlateText>
            <strong>{t('danger.title')}</strong>
            <p>{t('danger.description')}</p>
          </PlateText>
          <PlateActions>
            <Button variant="dangerSoft" size="sm" type="button" onClick={onArm} disabled={busy}>
              <Trash2 size={15} aria-hidden="true" />
              {t('danger.delete')}
            </Button>
          </PlateActions>
        </>
      )}
    </Plate>
  )
}
