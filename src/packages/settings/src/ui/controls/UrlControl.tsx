import { TextControl, type TextControlProps } from './TextControl'

export type UrlControlProps = Omit<TextControlProps, 'type'>

/** Ввод http(s)-ссылки (поле типа `url_input`). */
export function UrlControl(props: UrlControlProps) {
  return <TextControl {...props} type="url" />
}
