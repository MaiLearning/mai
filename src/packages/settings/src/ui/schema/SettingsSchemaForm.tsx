import { useTranslation } from '@mai/i18n'
import { Button, Modal, Text } from '@mai/theme'
import { useCallback, useMemo, useState } from 'react'
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

  const title = definition.nameKey ? t(definition.nameKey) : tSettings('nav.title')
  const description = definition.descriptionKey
    ? t(definition.descriptionKey)
    : tSettings('page.description')

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
  const status = loading
    ? tSettings('states.loading')
    : saving
      ? tSettings('states.saving')
      : problem
        ? tSettings('errors.action', { error: problem })
        : null

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
    <SettingsSection title={title} description={description}>
      <Form>
        {ready ? fieldNodes : null}
        {ready && fieldNodes.length === 0 ? (
          <Text size="sm" color="gray">
            {tSettings('form.empty')}
          </Text>
        ) : null}
        {status ? <Status>{status}</Status> : null}
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
