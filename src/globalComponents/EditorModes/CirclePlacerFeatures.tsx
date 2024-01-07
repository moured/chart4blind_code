import React, { useContext, useRef, useState } from 'react'
import {
  addPointLine,
  movePointOfLine,
  removePointLine
} from '../../globalUtilities/dotInteractionUtility'
import { type PositionCalibration } from '../../types'
import { ChartContext } from '../../globalUtilities/chartContext'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'
import { ImageContext } from '../../globalUtilities/imageContext'
import { calculatePositionOnPage } from '../../globalUtilities/calculationUtility'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  scale: number
  localSvgRef: React.RefObject<SVGSVGElement>
}
const CirclePlacerFeatures: React.FC<Props> = ({ scale, localSvgRef }) => {
  const { lines, setLines, selectedLine, X1, X2, Y1, Y2, setX1, setX2, setY1, setY2 } = useContext(ChartContext)
  const { configuration, draggingElement, setDraggingElement, saveHistory } = useContext(ModeConfigurationContext)
  const { imageWidth, imageHeight, setPos } = useContext(ImageContext)

  const [mouseIsDown, setMouseDown] = useState<boolean>(false)
  const hoveringOverCircles = useRef<string[]>([])

  const [lineElement, setLineElement] = useState<number | undefined>()

  const handleMouseMove = (event: any): void => {
    // event.preventDefault()
    if (localSvgRef.current == null || localSvgRef.current.parentNode == null) return
    const pos = calculatePositionOnPage(localSvgRef, event)
    setPos(pos)
    // if element is being dragged
    if ((draggingElement !== undefined) && mouseIsDown) {
      switch (draggingElement) {
        case 'X1':
          setX1({
            ...X1, ...pos
          })
          break
        case 'X2':
          setX2({
            ...X2, ...pos
          })
          break
        case 'Y1':
          setY1({
            ...Y1, ...pos
          })
          break
        case 'Y2':
          setY2({
            ...Y2, ...pos
          })
          break
        default:
          movePointOfLine(pos, draggingElement, selectedLine, setLines, lines)
      }
    }
  }
  const handleMouseDown = (event: any, index?: number): void => {
    event.preventDefault()
    if (localSvgRef.current == null || localSvgRef.current.parentNode == null) return
    if (draggingElement !== undefined) {
      saveHistory()
    }
    setMouseDown(index === undefined)
    if (((draggingElement === undefined && lineElement === undefined) || index !== undefined)) {
      const key = uuidv4()
      saveHistory()
      setDraggingElement(key)
      addPointLine({ key, ...calculatePositionOnPage(localSvgRef, event) }, selectedLine, lines, setLines, index)
    }
  }

  const handleMouseUp = (event: any): void => {
    event.preventDefault()
    setMouseDown(false)
  }
  const handleMouseEnterElement = (key: string): void => {
    hoveringOverCircles.current.push(key)
    if (!mouseIsDown) {
      setDraggingElement(key)
    }
  }

  const handleMouseLeaveElement = (key: string): void => {
    hoveringOverCircles.current = hoveringOverCircles.current.filter(k => k !== key)
    if (!mouseIsDown) {
      setDraggingElement(undefined)
    }
  }
  const createCalibrationPoint = (posCal: PositionCalibration | undefined, key: string): React.ReactNode => {
    if (posCal === undefined) return <g/>
    const circleTextOffset = 2
    return (<g key={key}>
            <circle cx={posCal.xVal}
                    cy={posCal.yVal}
                    stroke="#153243"
                    r={1.3 * scale}
                    strokeWidth={0.5 * scale}
                    fill="#E0AFA0"
                    onMouseEnter={() => { handleMouseEnterElement(key) }}
                    onMouseLeave={() => { handleMouseLeaveElement(key) }}
            />
            <text x={posCal.xVal}
                  y={posCal.yVal - circleTextOffset * scale}
                  fill="#153243"
                  fontSize={3 * scale}
                  style={{ pointerEvents: 'none' }}
                  textAnchor="middle">{key}</text>)
        </g>)
  }
  const renderPointsAndLines = (): React.ReactNode => {
    return configuration.circlePlacer && lines.map((value, index) => {
      const lineSelected = value.key === selectedLine
      const opacity = lineSelected ? 1 : 0.15
      const radiusCircles = lineSelected ? 1.45 : 0.8 // 1.3
      const strokeCircle = lineSelected ? 0.65 : 0.4 // 0.65
      const strokeLine = 0.9 // 0.8

      return (<g key={index}>
                <g className="lines">
                    {
                        value.dataPoints.map((point, pointIndex, arr) => {
                          const draggingEl = point.key === draggingElement
                          const circleFillOpacity = draggingEl && mouseIsDown ? 0.45 : 1 // 0.7

                          const nextPoint = arr[pointIndex + 1]
                          return <g key={`group-${index}-${pointIndex}`}
                                      onContextMenu={(e) => {
                                        e.preventDefault()
                                        if (lineSelected && draggingElement !== undefined) {
                                          setMouseDown(false)
                                          saveHistory()
                                          removePointLine(point, selectedLine, lines, setLines)
                                          hoveringOverCircles.current = hoveringOverCircles.current.filter(k => k !== draggingElement)
                                          setDraggingElement(hoveringOverCircles.current[hoveringOverCircles.current.length - 1] as string | undefined)
                                        }
                                      }}>
                                {(pointIndex !== arr.length - 1) && <g>
                                    <line
                                    key={`line-${index}-${pointIndex}`}
                                      x1={point.xVal + radiusCircles * scale / Math.hypot(nextPoint.xVal - point.xVal, nextPoint.yVal - point.yVal) * (nextPoint.xVal - point.xVal)}
                                      y1={point.yVal + radiusCircles * scale / Math.hypot(nextPoint.xVal - point.xVal, nextPoint.yVal - point.yVal) * (nextPoint.yVal - point.yVal)}
                                      x2={point.xVal + (Math.hypot(nextPoint.xVal - point.xVal, nextPoint.yVal - point.yVal) - radiusCircles * scale) / Math.hypot(nextPoint.xVal - point.xVal, nextPoint.yVal - point.yVal) * (nextPoint.xVal - point.xVal)}
                                      y2={ point.yVal + (Math.hypot(nextPoint.xVal - point.xVal, nextPoint.yVal - point.yVal) - radiusCircles * scale) / Math.hypot(nextPoint.xVal - point.xVal, nextPoint.yVal - point.yVal) * (nextPoint.yVal - point.yVal)}
                                      stroke="#153243"
                                      strokeWidth={strokeLine * scale}
                                      fill='none'
                                      strokeOpacity={opacity}
                                      style={{ pointerEvents: lineSelected ? 'auto' : 'none' }}
                                />
                                    <line
                                        key={`hitslop-${index}-${pointIndex}`}
                                        x1={point.xVal}
                                        y1={point.yVal}
                                        x2={nextPoint.xVal}
                                        y2={nextPoint.yVal}
                                        stroke="#000000"
                                        strokeWidth={2.2 * scale}
                                        strokeOpacity={0}
                                        onMouseEnter={() => { lineSelected && setLineElement(pointIndex) }}
                                        onMouseLeave={() => { lineSelected && setLineElement(undefined) }}
                                        onMouseDown={ (e) => {
                                          handleMouseDown(e, pointIndex)
                                        }}
                                        style={{ pointerEvents: lineSelected ? 'auto' : 'none' }}
                                    />
                                </g>}
                            { <circle
                                    key={`circle-${index}-${pointIndex}`}
                                    cx={point.xVal}
                                    cy={point.yVal}
                                    r={radiusCircles * scale}
                                    strokeWidth={strokeCircle * scale}
                                    stroke='#153243'
                                    fill="#AEAEB4"
                                    fillOpacity = {circleFillOpacity}
                                    opacity={opacity}
                                    onMouseEnter={() => { lineSelected && handleMouseEnterElement(point.key) }}
                                    onMouseLeave={() => { lineSelected && handleMouseLeaveElement(point.key) }}
                                    style={{ pointerEvents: lineSelected ? 'auto' : 'none' }}
                            />}
                            </g>
                        })
                    }
                </g>
            </g>)
    })
  }
  return (<div className={`flex h-full w-full items-center justify-center ${mouseIsDown && draggingElement !== undefined ? 'cursor-none' : 'cursor-crosshair'}`}
               onMouseMove={handleMouseMove}
               onClick={handleMouseUp}
               onMouseUp={handleMouseUp}
               onMouseDown={handleMouseDown}
      >
    <div style={{ position: 'relative', width: imageWidth, height: imageHeight, overflow: 'visible' }}>
      <svg className={'absolute w-full h-full'}
               viewBox={`0 0 ${imageWidth} ${imageHeight}`}
               style={{ overflow: 'visible' }}
               onContextMenu={(e) => {
                 e.preventDefault()
               }}
               id='step6'
          >
            <rect x="0" y="0" width={imageWidth} height={imageHeight} fillOpacity={0.15} fill='#ffffff' />
            <g>
              <rect x="0" y="0" width={imageWidth} height={imageHeight} opacity={0} />
          {renderPointsAndLines()}
                  <g>
                      {createCalibrationPoint(X1, 'X1')}
                      {createCalibrationPoint(X2, 'X2')}
                      {createCalibrationPoint(Y1, 'Y1')}
                      {createCalibrationPoint(Y2, 'Y2')}
                  </g>
              </g>
          </svg>
        </div>
      </div>
  )
}

export default CirclePlacerFeatures
