import React, { useContext, useEffect, useState } from 'react'
import 'intro.js/introjs.css'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import { type AppState } from '../types'
import { DEFAULT_APP_STATE, DEFAULT_LINE } from '../constants/mainTypesDefaults'
import { RxCross2 } from 'react-icons/rx'
import { type Step } from 'intro.js'
import { allLineTypesArr } from '../constants/chartTypes'
import { ChartContext } from '../globalUtilities/chartContext'
const TUT_IMAGE_HEIGHT: number = 1746
const TUT_IMAGE_WIDTH: number = 1049
interface Props {
  toggleAccess: any
  showAccess: boolean
}
const AccessibilityTutorial: React.FC<Props> = ({ toggleAccess, showAccess }) => {
  const { setAccessibleMode, getAppState, setAppState, introJS, setToggleDataSidebar, setToggleOption, redoHistory, setDraggingElement, undoHistory, svgRef } = useContext(ModeConfigurationContext)

  const { setScaleX, setLines, setYAxisLabels, setX1, setX2, setY1, setY2, setXTitle, setYTitle, setTitle } = useContext(ChartContext)

  const entryWidth = window.innerWidth / 1.87

  const spaceHeight = entryWidth * TUT_IMAGE_HEIGHT / TUT_IMAGE_WIDTH
  const spaceWidth = entryWidth

  const WIDTH_TUT_EXTRACTION = 710
  const HEIGHT_TUT_EXTRACTION = WIDTH_TUT_EXTRACTION * TUT_IMAGE_HEIGHT / TUT_IMAGE_WIDTH

  const scaleWidth = spaceWidth / WIDTH_TUT_EXTRACTION
  const scaleHeight = spaceHeight / HEIGHT_TUT_EXTRACTION

  const [tutorialAppState, setTutorialAppState] = useState<AppState>(getAppState())
  const steps: Step[] = [
    {
      element: '#step27',
      intro: 'A chart can be turned into an SVG easily. However, there are various features that greatly improve its accessiblity.',
      step: 1
    },
    {
      element: '#step46',
      intro: 'A concise and accurate title can help convey what the chart is about.',
      step: 2
    },
    {
      element: '#step45',
      intro: 'The x and y-axis should both have titles specifying the scale.',
      step: 3
    },
    {
      element: '#step47',
      intro: 'Each line should have a unique thickness and stroke so someone with visual impairment can distinguish between them.',
      step: 4
    },
    {
      element: '#step75',
      intro: 'When relevant, some descriptions along with some data points can add detail. Make sure no element are overlapping.',
      step: 5
    },
    {
      element: '#step80',
      intro: 'A description of trends and further information can go a long way in understanding a charts contents, especially in conjunction with other information',
      step: 6
    }
  ]
  const setSVGCond = (): void => {
    setAccessibleMode(true)
    setScaleX('time')
    setTitle('Profit')
    setXTitle('Years')
    setYTitle('Millions')
    setLines([{
      ...DEFAULT_LINE,
      lineType: allLineTypesArr[3],
      dataPoints: [{ key: '1', xVal: 104.671875 * scaleWidth, yVal: 232.828125 * scaleHeight },
        { key: '2', xVal: 177.671875 * scaleWidth, yVal: 216.828125 * scaleHeight },
        { key: '3', xVal: 252.671875 * scaleWidth, yVal: 166.828125 * scaleHeight },
        { key: '4', xVal: 328.671875 * scaleWidth, yVal: 191.828125 * scaleHeight },
        { key: '5', xVal: 407.671875 * scaleWidth, yVal: 169.828125 * scaleHeight },
        { key: '6', xVal: 480.671875 * scaleWidth, yVal: 113.828125 * scaleHeight, desc: 'Company Handover' },
        { key: '7', xVal: 628.671875 * scaleWidth, yVal: 241.828125 * scaleHeight },
        { key: '8', xVal: 703.671875 * scaleWidth, yVal: 116.828125 * scaleHeight }]
    },
    {
      key: '2',
      title: 'Line 2',
      lineType: allLineTypesArr[2],
      dataPoints: [
        { xVal: 104.81405933194895 * scaleWidth, yVal: 267.03664908637614 * scaleHeight, key: '0' },
        { xVal: 129.6041065598373 * scaleWidth, yVal: 264.86208354007016 * scaleHeight, key: '1' },
        { xVal: 154.39415378772563 * scaleWidth, yVal: 262.252604884503 * scaleHeight, key: '2' },
        { xVal: 179.18420101561398 * scaleWidth, yVal: 260.5129524474582 * scaleHeight, key: '3' },
        { xVal: 203.97424824350233 * scaleWidth, yVal: 270.08104085120453 * scaleHeight, key: '4' },
        { xVal: 228.76429547139065 * scaleWidth, yVal: 280.9538685827345 * scaleHeight, key: '5' },
        { xVal: 253.554342699279 * scaleWidth, yVal: 290.08704387721974 * scaleHeight, key: '6' },
        { xVal: 278.34438992716736 * scaleWidth, yVal: 280.0840423642121 * scaleHeight, key: '7' },
        { xVal: 303.1344371550557 * scaleWidth, yVal: 268.3413884141598 * scaleHeight, key: '8' },
        { xVal: 327.924484382944 * scaleWidth, yVal: 256.5987344641074 * scaleHeight, key: '9' },
        { xVal: 352.71453161083235 * scaleWidth, yVal: 252.6845164807566 * scaleHeight, key: '10' },
        { xVal: 377.5045788387207 * scaleWidth, yVal: 249.205211606667 * scaleHeight, key: '11' },
        { xVal: 402.29462606660906 * scaleWidth, yVal: 245.7259067325774 * scaleHeight, key: '12' },
        { xVal: 427.0846732944974 * scaleWidth, yVal: 240.50694942144304 * scaleHeight, key: '13' },
        { xVal: 451.87472052238576 * scaleWidth, yVal: 234.85307900104743 * scaleHeight, key: '14' },
        { xVal: 476.66476775027405 * scaleWidth, yVal: 230.50394790843546 * scaleHeight, key: '15' },
        { xVal: 501.4548149781624 * scaleWidth, yVal: 240.50694942144304 * scaleHeight, key: '16' },
        { xVal: 526.2448622060508 * scaleWidth, yVal: 252.6845164807566 * scaleHeight, key: '17' },
        { xVal: 551.0349094339391 * scaleWidth, yVal: 265.2969966493314 * scaleHeight, key: '18' },
        { xVal: 575.8249566618274 * scaleWidth, yVal: 280.51895547347334 * scaleHeight, key: '19' },
        { xVal: 600.6150038897158 * scaleWidth, yVal: 296.6107405161377 * scaleHeight, key: '20' },
        { xVal: 625.4050511176041 * scaleWidth, yVal: 311.3977862310185 * scaleHeight, key: '21' },
        { xVal: 650.1950983454925 * scaleWidth, yVal: 297.9154798439213 * scaleHeight, key: '22' },
        { xVal: 674.9851455733808 * scaleWidth, yVal: 279.21421614568976 * scaleHeight, key: '23' },
        { xVal: 699.7751928012691 * scaleWidth, yVal: 261.3827786 * scaleHeight, key: '24' }]
    }])
    setYAxisLabels([
      { text: 3500, coordinate: 62 * scaleHeight, id: '9b2e6e51-cfa3-473e-a8fe-f10ef840f345' },
      { text: 3000, coordinate: 95 * scaleHeight, id: '7152d971-9db6-4248-a1ea-e33107f99cde' },
      { text: 2500, coordinate: 128 * scaleHeight, id: 'c2b76699-e16f-469a-87fd-514531c5b724' },
      { text: 2000, coordinate: 162 * scaleHeight, id: '3c6bd92e-d221-4147-ae9d-0de5609e0032' },
      { text: 1500, coordinate: 195 * scaleHeight, id: '7a020167-9c1c-4b89-81bf-7da72431883b' },
      { text: 1000, coordinate: 228 * scaleHeight, id: 'fd43e8f2-bdfd-41b9-8033-919ad6b71ced' },
      { text: 500, coordinate: 261 * scaleHeight, id: '3e30ba39-5664-4510-9942-4695aa6a0e60' },
      { text: 0, coordinate: 294 * scaleHeight, id: 'c9f48aab-c753-4f22-bfb2-505171343740' }])
    setX1({ xVal: 95.9375 * scaleWidth, yVal: 334.4375 * scaleHeight, referenceValue: '2011' })
    setX2({ xVal: 655.8823529411765 * scaleWidth, yVal: 334.4375 * scaleHeight, referenceValue: '2019' })
    setY1({ xVal: 62.9375 * scaleWidth, yVal: 258.4375 * scaleHeight, referenceValue: '1000' })
    setY2({ xVal: 65.9375 * scaleWidth, yVal: 106.4375 * scaleHeight, referenceValue: '3000' })

    setToggleOption('SVG')
  }
  useEffect(() => {
    if (showAccess && introJS !== undefined) {
      introJS.setOptions({ steps, exitOnOverlayClick: false })
      introJS.onexit(function () {
        setToggleOption('Image')
        setAppState(tutorialAppState)
        if (undoHistory !== undefined) undoHistory.current = []
        if (redoHistory !== undefined) redoHistory.current = []
      })
      introJS.oncomplete(function () {
        setToggleOption('Image')
        setAppState(tutorialAppState)
        if (undoHistory !== undefined) undoHistory.current = []
        if (redoHistory !== undefined) redoHistory.current = []
      })
      introJS.onbeforechange((targetElement: { id: any }) => {
        if (targetElement === undefined) return
        switch (targetElement.id) {
          case 'step27':

            break
          default:
            break
        }
      })
    }
  }, [introJS, showAccess])

  return <div className='fixed inset-0 flex items-center justify-center z-50'>
    <div className={'fixed inset-0 bg-charcoal opacity-[0.675]'}/>
    <div className='bg-neutral relative w-1/3 flex flex-col items-center justify-between rounded-md z-50'>
      <div className='p-12'>
        <p>
          Making an SVG accessible requires multiple steps. This demonstration is not a tutorial for the application,
          instead it briefly teaches some guidelines for accessible chart creation.
        </p>
      </div>
      <button className='absolute right-3 top-3 text-right text-charcoal' onClick={toggleAccess}>
        <RxCross2 size={26}/>
      </button>
      <button onClick={() => {
        setTutorialAppState(getAppState())
        setToggleOption('SVG')
        setToggleDataSidebar(false)
        setDraggingElement(undefined)

        setAppState({ ...DEFAULT_APP_STATE, imageSrc: `${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/testImage.jpg`, svgRef }, () => {
          setTimeout(() => {
            setSVGCond()
            setTimeout(() => {
              introJS.start()
            }, 600)
          }, 600)
        })
      }} className="mb-4 bg-green font-medium border-[1.5px] border-charcoal border-solid py-1 px-6 rounded text-charcoal text-base">
        Start Explanation
      </button>
    </div>
  </div>
}

export default AccessibilityTutorial
