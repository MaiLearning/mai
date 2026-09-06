import { error as logError } from '@tauri-apps/plugin-log'
import { openUrl } from '@tauri-apps/plugin-opener'
import { i18next } from '@/app/i18n'
import { notifyError } from '@/utils/notifications'

/**
 * Открывает внешнюю ссылку в системном браузере через opener-плагин Tauri.
 * Ошибка пишется в лог и показывается тостом (сообщение — из theory-локали).
 */
export async function openExternal(url: string): Promise<void> {
  try {
    await openUrl(url)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    logError(`plugins/theory: open external url failed (${url}): ${message}`)
    notifyError(i18next.t('theory:open_external_failed'), url)
  }
}
