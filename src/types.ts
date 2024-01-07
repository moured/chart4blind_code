import { type LineType, type scaleTypes } from './constants/chartTypes'
import { type configurationTypes } from './globalUtilities/modeConfigurationContext'
import type React from 'react'

export interface DataPoint {
  key: string
  xVal: number
  yVal: number
  desc?: string
}

export interface fontSizes {
  titleFont: number
  labelFont: number
  description: number
  textFont: number
}
export interface Position {
  xVal: number
  yVal: number
}

export interface CoordinateText {
  text: string | undefined
  xVal: number
  yVal: number
  desc?: string
}

export interface PositionCalibration {
  referenceValue: string
  xVal: number
  yVal: number
}
export interface PositionText {
  text: string
  bbox: Bbox
}
export interface PositionAxisID {
  text: string
  coordinate: number
  id: string
}

export interface Bbox {
  x0: number
  y0: number
  x1: number
  y1: number
}
export interface Line {
  key: string
  title: string
  dataPoints: DataPoint[]
  lineType: LineType
}

export interface AppState {
  title: string
  xTitle: string
  yTitle: string
  xAxisLabels: PositionAxisID[]
  yAxisLabels: PositionAxisID[]
  lines: Line[]
  selectedLine: string | undefined
  X1: PositionCalibration
  X2: PositionCalibration
  Y1: PositionCalibration
  Y2: PositionCalibration
  scaleX: scaleTypes
  scaleY: scaleTypes
  OCRText: PositionText[]
  dragOCR: boolean
  configuration: configurationTypes
  draggingElement: string | undefined
  svgRef: React.RefObject<SVGSVGElement> | undefined
  imageSrc: string
  description: string
  accessibleMode: boolean
}
