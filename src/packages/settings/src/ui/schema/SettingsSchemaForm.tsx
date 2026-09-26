import { useTranslation } from '@mai/i18n'
import { notifyError } from '@mai/notifications'
import { Alert, Button, Modal, Spinner, Text } from '@mai/theme'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type SettingsDefinition,
  type SettingsDocument,
  type SettingsFieldSpec,
  settingsFieldSpecs,
} from '../../core'
import { settingsErrorMessage, useSettingsValues } from '../../services'
import { SettingsFieldRenderer } from '../field/SettingsFieldRenderer'
import { SettingsSection } from '../layout/SettingsSection'
import { Action, Form, Status } from './SettingsSchemaForm.style'

export type SettingsSchemaFormProps = {
  /** Определение настроек: Zod-схема + JSON Schema полей. */
  definition: SettingsDefinition
  /** Домен настроек: system / plugin / course. */
  domain: SettingsDocument['domain']
  /** Пункт настроек: pluginId, идентификатор раздела или courseId. */
  itemId: string
}

/**
 * Форма настроек по определению: поля рендерятся в порядке свойств JSON Schema,
 * подписи, пояснения и варианты выбора переводятся по конвенции имён полей
 * (`<поле>.label`, `<поле>.hint`, `<поле>.options.<значение>`) в namespace
 * определения. Изменения сохраняются автоматически с паузой автосохранения.
 */
export function SettingsSchemaForm({ definition, domain, itemId }: SettingsSchemaFormProps) {
  const { t } = useTranslation(definition.i18nNamespace)
  const { t: tSettings } = useTranslation('settings')
  const { values, ready, loading, saving, error, setValue, reset, canReset } = useSettingsValues(
    definition,
    domain,
    itemId,
  )
  const [resetOpened, setResetOpened] = useState(false)

  const { specs, schemaError } = useMemo(() => {
    if (!ready) return { specs: [] as SettingsFieldSpec[], schemaError: null }

    try {
      return { specs: settingsFieldSpecs(definition, values), schemaError: null }
    } catch (e) {
      // Неподдерживаемое поле в схеме плагина не должно ронять страницу настроек.
      return { specs: [] as SettingsFieldSpec[], schemaError: settingsErrorMessage(e) }
    }
  }, [definition, ready, values])

  const labelsOf = useCallback(
    (spec: SettingsFieldSpec): Record<string, string> | undefined =>
      spec.optionLabelKeys
        ? Object.fromEntries(
            Object.entries(spec.optionLabelKeys).map(([option, key]) => [
              option,
              t(key, { defaultValue: option }),
            ]),
          )
        : undefined,
    [t],
  )

  const problem = error ?? schemaError
  const notice = loading ? tSettings('states.loading') : saving ? tSettings('states.saving') : null

  // Ошибки и конфликты показываем тостом; успешное автосохранение — только инлайн.
  const lastNotified = useRef<string | null>(null)
  useEffect(() => {
    if (!problem) {
      lastNotified.current = null

      return
    }
    if (lastNotified.current === problem) return
    lastNotified.current = problem
    notifyError(tSettings('errors.action', { error: problem }))
  }, [problem, tSettings])

  const handleReset = async () => {
    await reset()
    setResetOpened(false)
  }

  const fieldNodes = specs.map((spec) => (
    <SettingsFieldRenderer
      key={spec.key}
      fieldKey={spec.key}
      field={spec.field}
      label={t(spec.labelKey, { defaultValue: spec.key })}
      hint={t(spec.hintKey, { defaultValue: '' }) || undefined}
      labels={labelsOf(spec)}
      disabled={saving}
      onChange={(value) => setValue(spec.key, value)}
    />
  ))

  return (
    <SettingsSection>
      <Form>
        {ready ? fieldNodes : null}
        {ready && fieldNodes.length === 0 ? (
          <Text size="sm" color="gray">
            {tSettings('form.empty')}
          </Text>
        ) : null}
        {notice ? (
          <Status>
            {loading ? <Spinner label={notice} /> : null}
            <span>{notice}</span>
          </Status>
        ) : null}
        {problem ? (
          <Alert variant="error">{tSettings('errors.action', { error: problem })}</Alert>
        ) : null}
        <Action>
          <Button
            variant="danger"
            disabled={!ready || !canReset || saving}
            onClick={() => setResetOpened(true)}
          >
            {tSettings('reset.action')}
          </Button>
        </Action>
      </Form>
      <Modal
        opened={resetOpened}
        onClose={() => setResetOpened(false)}
        title={tSettings('confirm.title')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpened(false)}>
              {tSettings('reset.cancel')}
            </Button>
            <Button variant="danger" onClick={() => void handleReset()}>
              {tSettings('confirm.action')}
            </Button>
          </>
        }
      >
        <Text>{tSettings('confirm.description')}</Text>
      </Modal>
    </SettingsSection>
  )
}
