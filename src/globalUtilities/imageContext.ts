import React from 'react'
import { type Position } from '../types'

/*
The context for the app is defined here. It stores the list of subTokens and MasterTokens, callbacks to edit them
(functions provided when setting them as state in AppAuthenticated) and stores whether the user logs in for the first
time
 */

interface imageContextParams {
  imageHeight: number
  imageWidth: number
  originalImageHeight: number
  originalImageWidth: number
  loaded: boolean
  pos: Position
  setPos: any
}
const initialDefaults: imageContextParams = {
  imageHeight: 0,
  imageWidth: 0,
  originalImageHeight: 0,
  originalImageWidth: 0,
  loaded: false,
  pos: { xVal: 0, yVal: 0 },
  setPos: () => {}
}

export const ImageContext = React.createContext<imageContextParams>(initialDefaults)
