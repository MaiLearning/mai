import { useTranslation } from '@mai/i18n'
import { Button } from '@mai/theme'
import { Trash2, TriangleAlert } from 'lucide-react'
import { Plate, PlateActions, PlateText } from './DangerPlate.style'

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
  const { t } = useTranslation('course')

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
            {/* dangerSoft → outline: в @mai/theme нет мягкого danger-варианта */}
            <Button variant="outline" size="sm" type="button" onClick={onArm} disabled={busy}>
              <Trash2 size={15} aria-hidden="true" />
              {t('danger.delete')}
            </Button>
          </PlateActions>
        </>
      )}
    </Plate>
  )
}
