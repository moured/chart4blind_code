export enum ChartTypes {
  LINECHART = 'Line Chart',
}

export type scaleTypes = 'linear' | 'logarithmic' | 'time'

export interface LineType {
  width: number
  dashWidth: number
  title: string
}

export const allLineTypesArr: LineType[] = [
  { width: 1, dashWidth: 0, title: 'Straight Line 1' },
  { width: 2, dashWidth: 0, title: 'Straight Line 2' },
  { width: 3, dashWidth: 0, title: 'Straight Line 3' },
  { width: 1, dashWidth: 5, title: 'Dotted Line 1' },
  { width: 2, dashWidth: 10, title: 'Dotted Line 2' },
  { width: 3, dashWidth: 15, title: 'Dotted Line 3' }
]
