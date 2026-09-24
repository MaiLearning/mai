import { TextControl, type TextControlProps } from './TextControl'

export type DateControlProps = Omit<TextControlProps, 'type'>

/** Ввод даты в формате `YYYY-MM-DD` (поле типа `date_input`). */
export function DateControl(props: DateControlProps) {
  return <TextControl {...props} type="date" />
}
