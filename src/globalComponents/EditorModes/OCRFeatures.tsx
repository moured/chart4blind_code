import React, { useContext, useEffect, useState } from 'react'
import { type Bbox, type Position, type PositionText } from '../../types'
import { calculatePositionOnPage } from '../../globalUtilities/calculationUtility'
import DraggableText from '../fields/DraggableText'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'
import { ImageContext } from '../../globalUtilities/imageContext'
import Tesseract from 'tesseract.js'
import { ChartContext } from '../../globalUtilities/chartContext'
import LoadingIndicatorConfig from '../spacing_and_headers/LoadingIndicatorConfig'

interface Props {
  localSvgRef: React.RefObject<SVGSVGElement>
}
const OCRFeatures: React.FC<Props> = ({ localSvgRef }) => {
  const { setOCRText, draggingElement, setDraggingElement, dragOCR } = useContext(ModeConfigurationContext)
  const { imageWidth, imageHeight, setPos, originalImageWidth, originalImageHeight } = useContext(ImageContext)
  const { imageSrc } = useContext(ChartContext)
  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
  const [startMouse, setStartMouse] = useState<Position>()
  const [endMouse, setEndMouse] = useState<Position>()
  const [boundingBoxes, setBoundingBoxes] = useState<PositionText[]>()
  useEffect(() => {
    if (!dragOCR) {
      setStartMouse(undefined)
      setEndMouse(undefined)
    }
  }, [dragOCR])
  useEffect(() => {
    let currentRequestId = 0
    let isMounted = true
    const getBoundingBoxes = async (requestId: number): Promise<void> => {
      if (imageSrc === '') {
        setBoundingBoxes([])
        return
      }
      const result = await Tesseract.recognize(imageSrc, 'eng')
      if (result === undefined || result.data.blocks === null) {
        setBoundingBoxes([])
        return
      }
      const scaleX = imageWidth / originalImageWidth
      const scaleY = imageHeight / originalImageHeight
      const boundingBoxes: PositionText[] = []
      for (const block of result.data.blocks) {
        for (const paragraph of block.paragraphs) {
          for (const line of paragraph.lines) {
            for (const word of line.words) {
              boundingBoxes.push({
                text: word.text,
                bbox: {
                  x0: word.bbox.x0 * scaleX,
                  x1: word.bbox.x1 * scaleX,
                  y0: word.bbox.y0 * scaleY,
                  y1: word.bbox.y1 * scaleY
                }
              })
            }
          }
        }
      }
      if (isMounted && requestId === currentRequestId) {
        setBoundingBoxes(boundingBoxes)
      }
    }
    getBoundingBoxes(++currentRequestId).catch(() => {})
    return () => {
      isMounted = false
    }
  }, [imageSrc, originalImageWidth, originalImageHeight, imageWidth, imageHeight])

  useEffect(() => {
    setStartMouse(undefined)
    setEndMouse(undefined)
  }, [boundingBoxes])

  if (boundingBoxes === undefined) {
    return <LoadingIndicatorConfig/>
  }
  const searchBoundingBoxes = (boundingBoxes: PositionText[], searchBox: Bbox): PositionText[] => {
    const result: PositionText[] = []

    for (const box of boundingBoxes) {
      if (
        searchBox.x0 <= box.bbox.x0 &&
        searchBox.y0 <= box.bbox.y0 &&
        searchBox.x1 >= box.bbox.x1 &&
        searchBox.y1 >= box.bbox.y1
      ) {
        result.push({ text: box.text, bbox: box.bbox })
      }
    }
    return result
  }
  const adjustedPoints = (startMouse: Position, endMouse: Position): { x: number, y: number, width: number, height: number } => {
    let x = startMouse.xVal
    let y = startMouse.yVal
    let width = endMouse.xVal - startMouse.xVal
    let height = endMouse.yVal - startMouse.yVal
    if (width < 0) {
      x = endMouse.xVal
      width = -width
    }
    if (height < 0) {
      y = endMouse.yVal
      height = -height
    }
    return {
      x, y, width, height
    }
  }
  const createDraggableObject = (): React.ReactNode => {
    if (endMouse === undefined || startMouse === undefined) {
      return <div/>
    }
    const adjustedPosition = adjustedPoints(startMouse, endMouse)
    return <div className='absolute flex justify-center items-center pointer-events-none' style={{
      top: adjustedPosition.y,
      left: adjustedPosition.x,
      width: adjustedPosition.width,
      height: adjustedPosition.height,
      overflow: 'visible'
    }}>
          <div className='w-full h-full flex justify-center items-center'>
            { !mouseIsDown && <DraggableText direction={adjustedPosition.width < adjustedPosition.height}/> }
          </div>
    </div>
  }
  const dragBox = (): React.ReactNode => {
    if (endMouse === undefined || startMouse === undefined) {
      return <g/>
    }
    const adjustedPosition = adjustedPoints(startMouse, endMouse)
    return (
        <g key='singleBoundingBox'>
          <rect
              x={adjustedPosition.x}
              y={adjustedPosition.y}
              width={adjustedPosition.width}
              height={adjustedPosition.height}
              fill='#F9F9F9'
              stroke='#aeaeb4'
              strokeDasharray='5,5'
              strokeWidth="2"
              fillOpacity={mouseIsDown ? 0.9 : 1}
              onMouseEnter={() => { handleMouseEnterElement('rectDrag') }}
              onMouseLeave={handleMouseLeaveElement}
          />
        </g>
    )
  }
  const handleMouseMove = (event: any): void => {
    if (localSvgRef.current == null || localSvgRef.current.parentNode == null) return
    const pos = calculatePositionOnPage(localSvgRef, event)
    setPos(pos)
    if (mouseIsDown) {
      setEndMouse(pos)
    }
  }
  const handleMouseDown = (event: any): void => {
    event.preventDefault()
    if (localSvgRef.current == null || localSvgRef.current.parentNode == null) return
    const pos = calculatePositionOnPage(localSvgRef, event)
    setMouseIsDown(true)
    setOCRText([])
    setDraggingElement(undefined)
    setStartMouse(pos)
    setEndMouse(pos)
  }

  const handleMouseUp = (event: any): void => {
    event.preventDefault()
    setMouseIsDown(false)
    if (startMouse != null && endMouse != null) {
      const adjustedPosition = adjustedPoints(startMouse, endMouse)
      const result = searchBoundingBoxes(boundingBoxes, { x0: adjustedPosition.x, y0: adjustedPosition.y, x1: adjustedPosition.x + adjustedPosition.width, y1: adjustedPosition.y + adjustedPosition.height })
      if (result.length > 0) {
        setOCRText(result)
      } else {
        setOCRText([])
      }
    }
  }
  const handleMouseEnterElement = (key: string): void => {
    if (draggingElement === undefined) {
      setDraggingElement(key)
    }
  }

  const handleMouseLeaveElement = (): void => {
    if (!mouseIsDown) {
      setDraggingElement(undefined)
    }
  }

  const drawBoundingBoxes = (): React.ReactNode => {
    return boundingBoxes.map((box, i) => {
      return (
          <rect
              key={i}
              x={box.bbox.x0 - 2}
              y={box.bbox.y0 - 2}
              width={box.bbox.x1 - box.bbox.x0 + 4}
              height={box.bbox.y1 - box.bbox.y0 + 4}
              fill='#F9F9F9'
              fillOpacity='0'
              stroke='#D9D9D9'
              strokeDasharray='5,5'
              strokeWidth="1.5"
          />
      )
    })
  }
  return (
      <div className='w-full h-full'>
        <div className={'flex h-full w-full items-center justify-center cursor-crosshair'}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseDown={handleMouseDown}
        >
          <div style={{ position: 'relative', width: imageWidth, height: imageHeight, overflow: 'visible' }}>
            <svg className="absolute w-full h-full cursor-crosshair"
                 viewBox={`0 0 ${imageWidth} ${imageHeight}`}
                 style={{ overflow: 'visible' }}
                 onContextMenu={(e) => {
                   e.preventDefault()
                 }}>
              <g>
                <rect x="0" y="0" width={imageWidth} height={imageHeight} opacity={0} />
                {drawBoundingBoxes()}
                {dragBox()}
              </g>
            </svg>
            { createDraggableObject() }
          </div>
        </div>
      </div>
  )
}

export default OCRFeatures
