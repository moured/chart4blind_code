import React, { useContext, useEffect, useState } from 'react'
import ZoomLens from './ZoomLens'
import { type Position } from '../types'
import ImageEditor from './ImageEditor'
import { ImageContext } from '../globalUtilities/imageContext'
import { ChartContext } from '../globalUtilities/chartContext'
import ToolBar from './ToolBar'
import D3SVGView from '../charTypes/lineCharts/components/D3SVGView'
import OptionToggleButton from './Buttons/OptionToggleButton'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'

const Editor: React.FC = () => {
  const { imageSrc } = useContext(ChartContext)
  const { toggleOption, setToggleOption } = useContext(ModeConfigurationContext)

  const [pos, setPos] = useState<Position>({ xVal: 0, yVal: 0 })

  const handleToggle = (option: 'SVG' | 'Image'): void => {
    setToggleOption(option)
  }
  const [loaded, setLoaded] = useState<boolean>(false)
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [imageWidth, setImageWidth] = useState<number>(0)
  const [originalImageHeight, setOriginalImageHeight] = useState<number>(0)
  const [originalImageWidth, setOriginalImageWidth] = useState<number>(0)

  useEffect(() => {
    const imageTemp = new Image()
    imageTemp.src = imageSrc
    imageTemp.onload = () => {
      const entryHeight = window.innerHeight / 1.5
      const entryWidth = window.innerWidth / 1.87
      let imageHeight: number
      let imageWidth: number
      if ((imageTemp.naturalWidth / imageTemp.naturalHeight) > 0.7 && (imageTemp.naturalWidth / imageTemp.naturalHeight) < 1.3) {
        setImageHeight(entryWidth * 0.75 * imageTemp.naturalHeight / imageTemp.naturalWidth)
        setImageWidth(entryWidth * 0.75)
      } else if (imageTemp.naturalWidth > imageTemp.naturalHeight) {
        imageHeight = entryWidth * imageTemp.naturalHeight / imageTemp.naturalWidth
        imageWidth = entryWidth
        setImageWidth(imageWidth)
        setImageHeight(imageHeight)
      } else {
        imageHeight = entryHeight
        imageWidth = entryHeight * imageTemp.naturalWidth / imageTemp.naturalHeight
        setImageHeight(imageHeight)
        setImageWidth(imageWidth)
      }
      setLoaded(true)
      setOriginalImageHeight(imageTemp.naturalHeight)
      setOriginalImageWidth(imageTemp.naturalWidth)
    }
  }, [imageSrc])
  // maybe find better solution than loading original image to check aspect ratio
  const toggleImage = toggleOption === 'Image'
  return (
        <main className="flex flex-col items-start justify-start h-full w-full bg-neutral dot-background relative">
          <div className={`absolute flex h-full w-full left-10 items-center ${toggleImage ? '' : 'hidden'}`}>
                <ToolBar/>
          </div>
            <ImageContext.Provider value={{
              loaded,
              imageHeight,
              imageWidth,
              originalImageHeight,
              originalImageWidth,
              pos,
              setPos
            }}>
              <div className="z-20 flex w-full justify-center">
                <OptionToggleButton selected={toggleOption} handlePress={handleToggle} options={['Image', 'SVG']}/>
                {toggleImage && <ZoomLens/>}
              </div>
              <div className="flex w-full justify-center items-center h-full">
                <div className={`${toggleImage ? '' : 'hidden'} h-full w-full`}>
                  <ImageEditor />
                </div>
                <div className={`${toggleImage ? 'hidden' : ''}`}>
                  <D3SVGView />
                </div>
              </div>
            </ImageContext.Provider>
        </main>
  )
}

export default Editor
