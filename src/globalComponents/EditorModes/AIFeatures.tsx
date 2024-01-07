import React, { useContext, useEffect, useState } from 'react'
import { getNextFreeNumber, handleLineAdd } from '../../charTypes/lineCharts/utilities/contextUtility'
import { type DataPoint, type Position } from '../../types'
import { ChartContext } from '../../globalUtilities/chartContext'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'
import { ImageContext } from '../../globalUtilities/imageContext'
import { getRemoteData } from '../../api/axiosRequests'
import LoadingIndicatorConfig from '../spacing_and_headers/LoadingIndicatorConfig'
import { enqueueSnackbar } from 'notistack'
import { v4 as uuidv4 } from 'uuid'
import { calculatePositionOnPage } from '../../globalUtilities/calculationUtility'
import CustomInputField from '../fields/CustomInputField'

interface Props {
  scale: number
  localSvgRef: React.RefObject<SVGSVGElement>
}
const AIFeatures: React.FC<Props> = ({ scale, localSvgRef }) => {
  const { lines, setLines, setSelectedLine, imageSrc } = useContext(ChartContext)
  const { saveHistory } = useContext(ModeConfigurationContext)
  const { imageWidth, imageHeight, originalImageHeight, originalImageWidth, setPos } = useContext(ImageContext)
  const scaleY = imageHeight / originalImageHeight
  const scaleX = imageWidth / originalImageWidth
  const [toggleMenu, setToggleMenu] = useState<boolean>(false)
  const [remoteData, setRemoteData] = useState<Array<Array<{ x: number, y: number }>>>([])
  const [indexSelected, setIndexSelected] = useState<number>()
  const [positionMenu, setPositionMenu] = useState<Position>({ xVal: 0, yVal: 0 })
  const [sliderValue, setSliderValue] = useState(20)
  const [extractedPoints, setExtractedPoints] = useState<DataPoint[]>([])
  const [lineTitle, setLineTitle] = useState<string>('')

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSliderValue(Number(event.target.value))
  }
  useEffect(() => {
    setLineTitle('Line ' + getNextFreeNumber(lines))
  }, [indexSelected])

  useEffect(() => {
    if (imageSrc === '') return
    setIndexSelected(undefined)
    setToggleMenu(false)
    setExtractedPoints([])
    setRemoteData([])
    const remoteFetcher = async (): Promise<void> => {
      const remoteData = await getRemoteData(imageSrc)
      if (remoteData !== undefined) {
        setRemoteData(remoteData)
      } else {
        throw new Error('failed')
      }
    }
    remoteFetcher().then(() => {}).catch(() => {
      enqueueSnackbar('AI Fetching failed', { variant: 'error' })
    })
  }, [imageSrc])

  useEffect(() => {
    if (remoteData.length === 0 || indexSelected === undefined) return
    if (indexSelected > remoteData.length - 1) return
    const array = remoteData[indexSelected]
    let output
    if (sliderValue >= array.length) {
      output = array
    } else {
      const ticks = Math.round(array.length / sliderValue)
      const result: Array<{ x: number, y: number }> = []
      for (let i = 0; i < array.length; i += ticks) {
        if (i >= array.length) break
        result.push(array[i])
      }
      output = result
    }
    const dataPointsArray: DataPoint[] = output.map(({ x, y }, index) => {
      return { xVal: x * scaleX, yVal: y * scaleY, key: uuidv4() }
    })
    setExtractedPoints(dataPointsArray)
  }, [indexSelected, sliderValue, remoteData])
  const handleAdd = (): void => {
    saveHistory()
    setIndexSelected(undefined)
    setToggleMenu(false)
    setExtractedPoints([])
    const tempAdded = handleLineAdd(lines, setLines, extractedPoints)
    setSelectedLine(tempAdded.key)
    enqueueSnackbar('New Line added. Edit it in Manual Tool')
  }

  const handleMouseDown = (event: any, index: number): void => {
    event.preventDefault()
    if (localSvgRef.current == null) return
    setToggleMenu(true)
    setIndexSelected(index)
    setPositionMenu(calculatePositionOnPage(localSvgRef, event))
  }
  const handleMouseMove = (event: any): void => {
    if (localSvgRef.current == null || localSvgRef.current.parentNode == null) return
    setPos(calculatePositionOnPage(localSvgRef, event))
  }
  const menuRenderer = (): React.ReactNode => {
    return (
        <div className="z-40 bg-sidegrey rounded-[1.25rem] w-full justify-center bg-opacity-75 items-center bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-grey via-neutral to-darkgrey">
          <div className="h-1.5" />
          <div className="pt-4 px-4 pb-2">
            <label htmlFor="slider" className="text-charcoal">Data Point Amount</label>
            <input id="slider" type="range" min="2" max="100" value={sliderValue} onChange={handleSliderChange}
                   className="slider w-full" />
          </div>
          <CustomInputField
              title="Line Title"
              type="text"
              value={lineTitle}
              onChange={setLineTitle}
          />
          <div className="flex justify-center items-center py-4">
            <button onClick={handleAdd} className="bg-blue font-medium border-[1.5px] border-charcoal border-solid py-1 px-6 rounded text-charcoal text-base">
              Add Line
            </button>
          </div>
        </div>
    )
  }
  const renderAllLines = (): React.ReactNode => {
    const colors = ['#57A773', '#5698D4', '#D9D9D9', '#E0AFA0', '#153243']
    return remoteData.map((line, index) => {
      const opacity = indexSelected === index ? 0.3 : 1
      const currentColor = colors[index % colors.length]
      return (<g key={uuidv4()}>
        <g className="automaticLines">
             <polyline
                  fill="none"
                  stroke={currentColor}
                  strokeWidth={1.4 * scale}
                  strokeOpacity={opacity}
                  points={line.map((point) => `${point.x * scaleX},${point.y * scaleY}`).join(' ')}
                  onMouseDown={(e) => {
                    handleMouseDown(e, index)
                  }}
              />
          {
            extractedPoints.map((point, pointIndex) => {
              return <circle
                    key={`circle-${pointIndex}`}
                    cx={point.xVal}
                    cy={point.yVal}
                    r={1.3 * scale}
                    strokeWidth={0.65 * scale}
                    stroke={'#153243'}
                    style={{ pointerEvents: 'none' }}
                    fill="#AEAEB4"
                />
            })
          }
        </g>
      </g>)
    })
  }

  return (
      <div className='flex h-full w-full items-center justify-center'
           onMouseMove={handleMouseMove}
      >
        <div style={{ position: 'relative', width: imageWidth, height: imageHeight, overflow: 'visible' }}>
                  <div className={`absolute ${remoteData.length === 0 ? '' : 'hidden'}`}>
                  <LoadingIndicatorConfig/>
                  </div>
              <div className={`${remoteData.length === 0 ? 'hidden' : ''}`} style={{ position: 'absolute', width: imageWidth, height: imageHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'visible' }}>
                <svg
                    className="absolute w-full h-full cursor-crosshair"
                     viewBox={`0 0 ${imageWidth} ${imageHeight}`}
                    style={{ overflow: 'visible' }}
                     onContextMenu={(e) => {
                       e.preventDefault()
                     }}>
                  <rect x="0" y="0" width={imageWidth} height={imageHeight} fillOpacity={0.5} fill='#000000' />
                  {renderAllLines()}
                </svg>
          </div>
          {toggleMenu &&
              <div className='absolute' style={{
                transform: `translate(${positionMenu.xVal + 16}px, ${positionMenu.yVal + 16}px)`
              }}>
            {menuRenderer()}
          </div>}
      </div>
      </div>)
}

export default AIFeatures
