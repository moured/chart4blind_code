import React, { useContext } from 'react'
import { ChartContext } from '../globalUtilities/chartContext'
import { ImageContext } from '../globalUtilities/imageContext'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import OCRFeatures from './EditorModes/OCRFeatures'
import CirclePlacerFeatures from './EditorModes/CirclePlacerFeatures'
import AIFeatures from './EditorModes/AIFeatures'
import LoadingIndicatorConfig from './spacing_and_headers/LoadingIndicatorConfig'

const ImageEditor: React.FC = () => {
  const { imageHeight, imageWidth, loaded } = useContext(ImageContext)
  const { imageSrc } = useContext(ChartContext)
  const { configuration } = useContext(ModeConfigurationContext)

  const scale = 2 * Math.max(imageHeight, imageWidth) / 2.7 / 100
  const localSvgRef = React.createRef<SVGSVGElement>()

  if (!loaded || imageHeight === 0 || imageWidth === 0) {
    return <LoadingIndicatorConfig/>
  }
  return (
        <div className="relative grid items-center h-full w-full">
            <div className="w-full flex items-center justify-center" >
                <img
                    alt="selected chart"
                    src={imageSrc}
                    className="z-0 absolute w-full h-full"
                    draggable="true"
                    onDragStart={(e) => { e.preventDefault() }}
                    style={{ height: imageHeight, width: imageWidth }}
                />
            </div>
            <div className='absolute w-full h-full flex justify-center items-center'>
                <div className="relative pointer-events-none" style={{ height: imageHeight, width: imageWidth }}>
                    <div className='absolute w-full h-full flex justify-center items-center' id='step16'>
                    </div>
                    <div className='absolute w-full h-full flex justify-center items-center' id='step3'>
                    </div>
                    <div className='absolute w-full h-full flex justify-center items-center' id='step4'>
                    </div>
                </div>
            </div>
            <svg ref={localSvgRef}
                 className="absolute cursor-crosshair"
                 viewBox={`0 0 ${imageWidth} ${imageHeight}`}
                 style={{ height: imageHeight, width: imageWidth, overflow: 'visible' }}
            />
            <div className={`absolute h-full w-full ${configuration.ocrTool ? '' : 'hidden'}`}
            data-description={'OCR Tool Editor'}>
                <OCRFeatures localSvgRef={localSvgRef} />
            </div>
            <div className={`absolute w-full h-full ${configuration.circlePlacer ? '' : 'hidden'}`}
                 data-description={'Circle Tool Editor'}
            >
                <CirclePlacerFeatures scale={scale} localSvgRef={localSvgRef} />
            </div>
            <div className={`absolute w-full h-full ${configuration.autoTool ? '' : 'hidden'}`}
                 data-description={'AI Tool Editor'}>
                <AIFeatures scale={scale} localSvgRef={localSvgRef} />
            </div>
        </div>
  )
}

export default ImageEditor
