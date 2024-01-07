import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../globalUtilities/chartContext'
import { ImageContext } from '../globalUtilities/imageContext'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'

const ZoomLens: React.FC = () => {
  const { imageSrc, selectedLine, lines } = useContext(ChartContext)
  const { pos, imageHeight, imageWidth } = useContext(ImageContext)
  const { draggingElement, configuration } = useContext(ModeConfigurationContext)

  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
  const mouseDown = (event: any): void => {
    setMouseIsDown(true)
  }
  const mouseUp = (event: any): void => {
    setMouseIsDown(false)
  }
  useEffect(() => {
    document.addEventListener('mousedown', mouseDown, true)
    document.addEventListener('mouseup', mouseUp, true)
    document.addEventListener('click', mouseUp, true)
    return () => {
      document.removeEventListener('mousedown', mouseDown, true)
      document.removeEventListener('mouseup', mouseUp, true)
      document.removeEventListener('click', mouseUp, true)
    }
  }, [])
  const renderPointsLinesZoom = (): React.ReactNode => {
    return configuration.circlePlacer && lines.map((value, index) => {
      const lineSelected = value.key === selectedLine
      if (!lineSelected) return null
      const radiusCircles = 1.45
      const strokeCircle = 0.65
      const scale = 5
      return (<g key={index}>
                <g className="lines">
                    {
                        value.dataPoints.map((point, pointIndex, arr) => {
                          const draggingEl = point.key === draggingElement
                          const circleFillOpacity = draggingEl && mouseIsDown ? 0.1 : 1
                          return <g key={`groupZoom-${index}-${pointIndex}`}>
                                { <circle
                                    key={`circle-${index}-${pointIndex}`}
                                    cx={point.xVal}
                                    cy={point.yVal}
                                    r={radiusCircles * scale}
                                    strokeWidth={strokeCircle * scale}
                                    stroke='#153243'
                                    fill= {draggingEl && mouseIsDown ? '#E0AFA0' : '#AEAEB4'}
                                    fillOpacity = {circleFillOpacity}
                                    opacity={draggingEl && mouseIsDown ? 0.8 : 0.3}
                                />}
                            </g>
                        })
                    }
                </g>
            </g>)
    })
  }
  // motivated partially through https://dev.to/anxiny/create-an-image-magnifier-with-react-3fd7
  const lensSizePx = 11 * 16 // default tailwind + browsers
  const lensCenterX = pos.xVal * lensSizePx / imageWidth
  const lensCenterY = pos.yVal * lensSizePx / imageHeight
  const aspectRatio = imageWidth / imageHeight
  const transformX = 50 - (lensCenterX * 100) / lensSizePx
  const transformY = 50 - (lensCenterY * 100) / lensSizePx / aspectRatio
  const wrapperStyle = {
    transform: `translate(${transformX * 12}%, ${transformY * 12}%) scale(12)`
  }
  return (
        <div className="m-4 absolute top-0 right-0 w-[11rem] h-[11rem] overflow-hidden border-2 border-charcoal rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className={'absolute border-[1px] h-full bg-charcoal'}/>
                <div className={'absolute border-[1px] w-full bg-charcoal'}/>
            </div>
            <div className='absolute inset-0' style={wrapperStyle}>
                    <svg className="absolute inset-0 z-40"
                         viewBox={`0 0 ${imageWidth} ${imageHeight}`}>
                        {renderPointsLinesZoom()}
                    </svg>
                        <img className='absolute inset-0' src={imageSrc} alt="Zoom"/>
                </div>
            <p className="z-10 absolute bottom-0 left-0 m-2 text-sm font-medium text-charcoal">
                X: {pos.xVal.toFixed(3)} {'\n'}
                Y: {pos.yVal.toFixed(3)}
            </p>
        </div>
  )
}

export default ZoomLens
