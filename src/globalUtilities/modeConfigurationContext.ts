import React from 'react'
import { type AppState, type PositionText } from '../types'

/*
The context for the configuration made using the sidebar is stored here
 */

export interface configurationTypes {
  circlePlacer: boolean
  ocrTool: boolean
  autoTool: boolean
}
interface modeConfigParams {
  OCRText: PositionText[]
  setOCRText: any
  dragOCR: boolean
  setDragOCR: any
  configuration: configurationTypes
  updateConfiguration: any
  setConfiguration: any
  draggingElement: string | undefined
  setDraggingElement: any
  svgRef: React.RefObject<SVGSVGElement> | undefined
  saveHistory: any
  undoHistory: React.MutableRefObject<AppState[]> | undefined
  redoHistory: React.MutableRefObject<AppState[]> | undefined
  getAppState: any
  setAppState: any
  introJS: any
  toggleDataSidebar: boolean
  setToggleDataSidebar: any
  toggleOption: 'SVG' | 'Image'
  setToggleOption: any
  accessibleMode: boolean
  setAccessibleMode: any
}

export const modeConfigDefaults: modeConfigParams = {
  OCRText: [],
  setOCRText: () => {},
  dragOCR: false,
  setDragOCR: () => {},
  configuration: {
    circlePlacer: false,
    ocrTool: false,
    autoTool: false
  },
  updateConfiguration: () => {},
  setConfiguration: () => {},
  draggingElement: '',
  setDraggingElement: () => {},
  svgRef: undefined,
  saveHistory: undefined,
  undoHistory: undefined,
  redoHistory: undefined,
  getAppState: () => {},
  setAppState: () => {},
  introJS: undefined,
  toggleDataSidebar: false,
  setToggleDataSidebar: () => {},
  toggleOption: 'Image',
  setToggleOption: () => {},
  accessibleMode: false,
  setAccessibleMode: () => {}
}

export const ModeConfigurationContext = React.createContext<modeConfigParams>(modeConfigDefaults)
