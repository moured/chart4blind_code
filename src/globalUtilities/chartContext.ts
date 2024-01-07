import React from 'react'
import { type Line, type PositionCalibration, type PositionAxisID } from '../types'
import { type scaleTypes } from '../constants/chartTypes'

/*
The context for the app is defined here. It stores the list of subTokens and MasterTokens, callbacks to edit them
(functions provided when setting them as state in AppAuthenticated) and stores wheather the user logs in for the first
time
 */
interface chartContextParams {
  title: string
  xTitle: string
  yTitle: string
  setTitle: any
  setXTitle: any
  setYTitle: any
  xAxisLabels: PositionAxisID[]
  setXAxisLabels: any
  yAxisLabels: PositionAxisID[]
  setYAxisLabels: any
  lines: Line[]
  setLines: any
  selectedLine: string | undefined
  setSelectedLine: any
  X1: PositionCalibration
  setX1: any
  X2: PositionCalibration
  setX2: any
  Y1: PositionCalibration
  setY1: any
  Y2: PositionCalibration
  setY2: any
  imageSrc: string
  setImageSrc: any
  scaleX: scaleTypes
  setScaleX: any
  scaleY: scaleTypes
  setScaleY: any
  description: string
  setDescription: any
}

const initialDefault: chartContextParams = {
  title: '',
  xTitle: '',
  yTitle: '',
  setTitle: () => {},
  setXTitle: () => {},
  setYTitle: () => {},
  xAxisLabels: [],
  setXAxisLabels: () => {},
  yAxisLabels: [],
  setYAxisLabels: () => {},
  lines: [],
  setLines: () => {},
  selectedLine: '',
  setSelectedLine: () => {},
  X1: { xVal: 0, yVal: 0, referenceValue: '' },
  setX1: () => {},
  X2: { xVal: 0, yVal: 0, referenceValue: '' },
  setX2: () => {},
  Y1: { xVal: 0, yVal: 0, referenceValue: '' },
  setY1: () => {},
  Y2: { xVal: 0, yVal: 0, referenceValue: '' },
  setY2: () => {},
  imageSrc: '',
  setImageSrc: () => {},
  scaleX: 'linear',
  setScaleX: () => {},
  scaleY: 'linear',
  setScaleY: () => {},
  description: '',
  setDescription: () => {}
}

export const ChartContext = React.createContext<chartContextParams>(initialDefault)
