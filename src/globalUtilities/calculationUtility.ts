import { type Position } from '../types'
import moment from 'moment'

export const parseDate = (input: string): Date => {
  const formats = [
    'YYYY',
    'DD-MM-YYYY',
    'MM-YY',
    'MM,YY',
    'MM/YY',
    'MM.YY',
    'MM-YYYY',
    'DD-MM-YY',
    'MM,YYYY',
    'DD-MM,YYYY',
    'DD,MM,YY',
    'MM.YYYY',
    'DD.MM.YYYY',
    'DD.MM.YY',
    'MM/YYYY',
    'DD/MM/YYYY',
    'DD/MM/YY'
  ]
  const date = moment(input, formats, true)
  if (!date.isValid()) {
    throw new Error('invalid time')
  }
  return date.toDate()
}
export const calculatePositionOnPage = (localSvgRef: any, event: any): Position => {
  const { left, top, width } = localSvgRef.current.getBoundingClientRect()
  const divRect = (localSvgRef.current.parentNode as HTMLElement).getBoundingClientRect()
  const xVal = event.clientX - left - (divRect.width - width) / 2
  const yVal = event.clientY - top
  return { xVal, yVal }
}
