import { type AppState, type Bbox, type fontSizes, type Line, type PositionCalibration } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { allLineTypesArr } from './chartTypes'

export const DEFAULT_LINE: Line = {
  key: '1',
  title: 'Line 1',
  dataPoints: [],
  lineType: allLineTypesArr[1]
}

export const DEFAULT_FONTS: fontSizes = {
  titleFont: 28,
  labelFont: 18,
  description: 16,
  textFont: 15
}

export const DEFAULT_POSITION_TEXT = {
  text: '',
  bbox: {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0
  }
}
export const DEFAULT_AXIS_TEXT = {
  text: '0',
  coordinate: 0
}

export const DEFAULT_CAL_POINT: PositionCalibration = { xVal: 0, yVal: 0, referenceValue: '' }

export const DEFAULT_APP_STATE: AppState = {
  title: '',
  xTitle: '',
  yTitle: '',
  xAxisLabels: [{ ...DEFAULT_AXIS_TEXT, id: uuidv4() }],
  yAxisLabels: [{ ...DEFAULT_AXIS_TEXT, id: uuidv4() }],
  lines: [{ ...DEFAULT_LINE, key: '1' }],
  selectedLine: '1',
  X1: DEFAULT_CAL_POINT,
  X2: DEFAULT_CAL_POINT,
  Y1: DEFAULT_CAL_POINT,
  Y2: DEFAULT_CAL_POINT,
  scaleX: 'linear',
  scaleY: 'linear',
  OCRText: [],
  dragOCR: false,
  configuration: {
    circlePlacer: true,
    ocrTool: false,
    autoTool: false
  },
  draggingElement: undefined,
  svgRef: undefined,
  imageSrc: '',
  description: '',
  accessibleMode: false
}

export const DEFAULT_BBOX: Bbox = {
  x0: 0,
  y0: 0,
  x1: 0,
  y1: 0
}
