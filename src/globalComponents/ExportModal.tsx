import React, { useContext, useState } from 'react'
import OptionToggleButton from './Buttons/OptionToggleButton'
import { RxCross2 } from 'react-icons/rx'
import * as d3 from 'd3'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import { ChartContext } from '../globalUtilities/chartContext'
import { scaleValueToCalibration } from '../globalUtilities/dotInteractionUtility'
import { type DataPoint } from '../types'
import { enqueueSnackbar } from 'notistack'
import { axiosRemoteData } from '../api/axiosRequests'

interface Props {
  toggleModal: any
}

const ExportModal: React.FC<Props> = ({ toggleModal }) => {
  const [toggleOption, setToggleOption] = useState<'SVG' | 'CSV'>('SVG')
  const [allowCollection, setAllowCollection] = useState<boolean>(false)
  const { svgRef, accessibleMode, setAccessibleMode } = useContext(ModeConfigurationContext)
  const { imageSrc, title, lines, X1, X2, Y1, Y2, scaleX, scaleY } = useContext(ChartContext)
  const handleToggle = (option: 'SVG' | 'CSV'): void => {
    setToggleOption(option)
  }
  const toggleAllowAllocation = (): void => {
    setAllowCollection(!allowCollection)
  }
  const toggleAccessibleMode = (): void => {
    setAccessibleMode(!accessibleMode)
  }
  const sendRemoteData = (): void => {
    if (allowCollection) {
      axiosRemoteData(getSVGData(), getCSVData(), imageSrc).then((r) => {
        if (!r) {
          enqueueSnackbar('Server Failed Storing Externally')
        } else {
          enqueueSnackbar('Stored Output Externally')
        }
      }).catch((r) => {
        enqueueSnackbar('Failed to store output externally')
      })
    }
  }

  // credit to https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an DaveTheScientist
  const getSVGData = (): undefined | string => {
    if (svgRef === undefined || svgRef.current === undefined) {
      return undefined
    }
    const originalSVG = d3.select(svgRef.current)
    const copiedSVG = d3.select(originalSVG.node()?.cloneNode(true) as SVGSVGElement)
    if (accessibleMode) {
      // credit for idea https://www.appsloveworld.com/d3js/100/10/zoom-to-bounding-box-of-path-on-externally-loaded-svg-using-d3
      let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity
      originalSVG.selectAll('*').each((d, i, nodes) => {
        const node = d3.select(nodes[i]).node() as SVGSVGElement
        if (node instanceof SVGGraphicsElement) {
          const box = node.getBBox()
          minX = Math.min(minX, box.x)
          minY = Math.min(minY, box.y)
          maxX = Math.max(maxX, box.x + box.width)
          maxY = Math.max(maxY, box.y + box.height)
        }
      })
      const originalSVGHeight = originalSVG.node()?.getBBox().height
      const originalSVGWidth = originalSVG.node()?.getBBox().width
      if (originalSVGHeight === undefined || originalSVGWidth === undefined) return ''
      const scaleToValWidth = 297 * 3.78
      const scaleToValHeight = 210 * 3.78
      const scaleFactor = Math.min((maxX - minX) / originalSVGWidth, (maxY - minY) / originalSVGHeight)
      const viewBoxWidth = (maxX - minX) / scaleFactor
      const viewBoxHeight = (maxY - minY) / scaleFactor
      copiedSVG.attr('viewBox', `${minX * 1.15 - 22} ${minY * 1.15 - 22} ${viewBoxWidth * 1.15} ${viewBoxHeight * 1.15}`)
      copiedSVG.attr('width', scaleToValWidth)
      copiedSVG.attr('height', scaleToValHeight)
      copiedSVG.selectAll('text')
        // .style('font-size', '42px')
        .style('font-family', 'Braille DE Computer ASCII')
    }
    return copiedSVG.node()?.outerHTML
  }
  const downloadAsSVG = (): void => {
    const svgData = getSVGData()
    if (svgData === undefined) {
      enqueueSnackbar('Setup your SVG first!')
      return
    }
    downloadFile(svgData, `${title}_export.svg`, 'image/svg+xml;charset=utf-8')
  }
  const getCSVData = (): string => {
    let csvData = ''
    lines.forEach((line) => {
      csvData += '\n' + line.title + '\n'
      csvData += 'xCoordinate, yCoordinate\n'
      line.dataPoints.forEach(({ xVal, yVal }: DataPoint) => {
        const adjustedPosition = scaleValueToCalibration({ xVal, yVal }, X1, X2, Y1, Y2, scaleX, scaleY)
        csvData += `${adjustedPosition.xVal}, ${adjustedPosition.yVal}\n`
      })
    })
    return csvData
  }
  const downloadAsCSV = (): void => {
    downloadFile(getCSVData(), `${title}_export.csv`, 'text/csv;charset=utf-8;')
  }
  const downloadFile = (data: string, filename: string, fileType: string): void => {
    const blob = new Blob([data], { type: fileType })
    const url = URL.createObjectURL(blob)
    enqueueSnackbar('Exported, download should start!')
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const handleDownload = (): void => {
    try {
      switch (toggleOption) {
        case ('SVG'):
          downloadAsSVG()
          break
        case ('CSV'):
          downloadAsCSV()
          break
          // case ('Image'):
          // break
        default:
      }
      sendRemoteData()
    } catch {
      enqueueSnackbar('Something went wrong downloading your files')
    }
  }
  return (
    <div className='fixed inset-0 inline-flex items-center justify-center z-100'>
      <div className={'fixed inset-0 bg-charcoal opacity-[0.675] z-100'}/>
      <div className='bg-neutral relative w-1/3 flex flex-col items-center justify-between rounded-md z-100 shadow-xl'>
        <button className='absolute right-3 top-3 text-right text-charcoal' onClick={toggleModal}>
          <RxCross2 size={26}/>
        </button>
        <div className='mt-8'>
          <label className="text-sm font-normal text-charcoal">Output Format</label>
          <div className='mt-[-1rem]'>
            <OptionToggleButton accent={true} selected={toggleOption} handlePress={handleToggle} options={['SVG', 'CSV']}/>
          </div>
        </div>
        <div className='w-[80%]'>
          <div className='mb-4 justify-start w-full'>
            <button onClick={toggleAccessibleMode} className='flex flex-row justify-center items-center '>
              <div className={`${accessibleMode ? 'bg-darkdogwater' : 'bg-lightgrey'} border-2 border-charcoal border-solid ml-2 p-3 rounded-md`}/>
              <span className="text-sm font-normal text-charcoal pl-2">
                    Adjust SVG for printing
                </span>
            </button>
          </div>
          <div className='mb-4 justify-start w-full'>
            <button onClick={toggleAllowAllocation} className='flex flex-row justify-center items-center '>
              <div className={`${allowCollection ? 'bg-darkdogwater' : 'bg-lightgrey'} border-2 border-charcoal border-solid ml-2 p-3 rounded-md`}/>
              <span className="text-sm font-normal text-charcoal pl-2">
                    Allow data-collection for future model training
                </span>
            </button>
          </div>
        </div>

        <button onClick={handleDownload} className="mb-4 bg-blue font-medium border-[1.5px] border-charcoal border-solid py-1 px-6 rounded text-charcoal text-base">
          Download
        </button>
      </div>
    </div>
  )
}

export default ExportModal
