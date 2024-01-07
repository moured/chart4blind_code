import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../globalUtilities/chartContext'
import 'intro.js/introjs.css'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import { type AppState } from '../types'
import { DEFAULT_APP_STATE, DEFAULT_LINE } from '../constants/mainTypesDefaults'
import { RxCross2 } from 'react-icons/rx'
import { type Step } from 'intro.js'
import { allLineTypesArr } from '../constants/chartTypes'
const TUT_IMAGE_HEIGHT: number = 1746
const TUT_IMAGE_WIDTH: number = 1049
interface Props {
  toggleAbout: any
  showAbout: boolean
}
const InteractiveTutorial: React.FC<Props> = ({ toggleAbout, showAbout }) => {
  const { setAccessibleMode, getAppState, setAppState, introJS, setToggleDataSidebar, setConfiguration, setToggleOption, redoHistory, setDraggingElement, undoHistory, svgRef } = useContext(ModeConfigurationContext)
  const { setTitle, setXTitle, setYTitle, setScaleX, setLines, setYAxisLabels, setX1, setX2, setY1, setY2, setImageSrc } = useContext(ChartContext)

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
      element: '#step1',
      intro: 'Welcome to the tutorial!',
      step: 1
    },
    {
      element: '#step3',
      intro: 'This is the main editor.',
      step: 3
    },
    {
      element: '#step4',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/movepoint_gif.gif" alt="AI Gif"/> Before starting, you must calibrate your chart. Move Y1,Y2 onto the Y axis and X1, X2 onto the X axis.`,
      step: 4
    },
    {
      element: '#step5',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/entervalue_gif.gif" alt="AI Gif"/> Enter the axis values where your calibration points are placed. This is an important step!`,
      step: 5
    },
    {
      element: '#step6',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}manual_gif.gif" alt='Manual GIF'> Press on the image to manually add data-points. Right click to remove one and click on the line to add an intermediate point. You can try it`,
      step: 6
    },
    {
      element: '#step7',
      intro: 'Your data points are shown here. Later, you can hover over a point in the editor to have it highlighted here like this.',
      step: 7
    },
    {
      element: '#step9',
      intro: 'This is the preview of your SVG output.',
      step: 9
    },
    {
      element: '#step15',
      intro: 'Select the currently edited line here, you can add more!',
      step: 15,
      position: 'left'
    },
    {
      element: '#step16',
      intro: 'Let\'s say we have a more complicated chart. We have a tool to automate this process!',
      step: 16
    },
    {
      element: '#step17',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/ai_gif.gif" alt="AI Gif"/> Automatically detect lines! Later, you can click on a line to add data points automatically. Watch out though! The tool is not always perfectly accurate.`,
      step: 17,
      position: 'right'
    },
    {
      element: '#step19',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/drag_drop_gif.gif" alt='OCR GIF'/> <p>This is the OCR tool. You highlight numbers/text and drag it onto any input field.</p>`,
      step: 19,
      position: 'right'
    },
    {
      element: '#step21',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/labels_gif.gif" alt='Labels GIF'/> The maximum and minimum values of your lines are used to generate axis labels. Select an entire axis and drop it in the advanced tab to manually create labels.`,
      step: 21,
      position: 'top'
    },
    {
      element: '#step25',
      intro: 'With custom labels and a few more points, your SVG can look like this!',
      step: 26
    },
    {
      element: '#step27',
      intro: 'After the tutorial, you can learn something about Accessible SVG documents here',
      step: 27
    },
    {
      element: '#step30',
      intro: `<img src="${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/congrats.gif" alt='congrats GIF'/> All done! Export your work as SVG or CSV. You can reopen the tutorial at any time.`,
      step: 30
    }
  ]

  useEffect(() => {
    if (introJS !== undefined) {
      introJS.setOptions({
        steps,
        exitOnOverlayClick: false
      })
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
          case 'step1':
            setX1({
              xVal: 90 * scaleWidth,
              yVal: 310 * scaleHeight,
              referenceValue: ''
            })
            setX2({
              xVal: 630 * scaleWidth,
              yVal: 310 * scaleHeight,
              referenceValue: ''
            })
            setY1({
              xVal: 60 * scaleWidth,
              yVal: 240 * scaleHeight,
              referenceValue: ''
            })
            setY2({
              xVal: 60 * scaleWidth,
              yVal: 80 * scaleHeight,
              referenceValue: ''
            })
            break
          case 'step4':
            setScaleX('time')
            setX1({
              xVal: 95.9375 * scaleWidth,
              yVal: 334.4375 * scaleHeight,
              referenceValue: '2011'
            })
            setX2({
              xVal: 655.8823529411765 * scaleWidth,
              yVal: 334.4375 * scaleHeight,
              referenceValue: '2019'
            })
            setY1({
              xVal: 62.9375 * scaleWidth,
              yVal: 258.4375 * scaleHeight,
              referenceValue: '1000'
            })
            setY2({
              xVal: 65.9375 * scaleWidth,
              yVal: 106.4375 * scaleHeight,
              referenceValue: '3000'
            })
            break
          case 'step6':
            setConfiguration({
              circlePlacer: true,
              ocrTool: false,
              autoTool: false
            })
            setLines([{
              ...DEFAULT_LINE,
              dataPoints: [
                {
                  key: '1',
                  xVal: 96.9375 * scaleWidth,
                  yVal: 213.4375 * scaleHeight
                },
                {
                  xVal: 170.9375 * scaleWidth,
                  yVal: 200.4375 * scaleHeight,
                  key: '2'
                },
                {
                  key: '3',
                  xVal: 236.9375 * scaleWidth,
                  yVal: 155.4375 * scaleHeight
                },
                {
                  key: '4',
                  xVal: 304.9375 * scaleWidth,
                  yVal: 179.4375 * scaleHeight
                }
              ]
            }])
            break
          case 'step5':
            setToggleDataSidebar(false)
            break
          case 'step7':
            setToggleOption('Image')
            setDraggingElement('2')
            setToggleDataSidebar(true)
            break
          case 'step9':
            setToggleOption('SVG')
            break
          case 'step15':
            setToggleDataSidebar(true)
            setImageSrc(`${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/testImage.jpg`)
            setConfiguration({
              circlePlacer: false,
              ocrTool: true,
              autoTool: false
            })
            break
          case 'step16':
            setToggleOption('Image')
            setAppState({
              ...DEFAULT_APP_STATE,
              imageSrc: `${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/complicatedLineChart.png`,
              svgRef
            }, () => {
              setConfiguration({
                circlePlacer: false,
                ocrTool: true,
                autoTool: false
              })
            })
            break
          case 'step17':
            setConfiguration({
              circlePlacer: false,
              ocrTool: false,
              autoTool: true
            })
            break
          case 'step19':
            setImageSrc(`${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/testImage.jpg`)
            setConfiguration({
              circlePlacer: false,
              ocrTool: true,
              autoTool: false
            })
            break
          case 'step21':
            setToggleOption('Image')
            setToggleDataSidebar(false)
            break
          case 'step25':
            setAccessibleMode(false)
            setTitle('International Profit')
            setXTitle('Years')
            setYTitle('Millions')
            setScaleX('time')
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
            break
          case 'step351':
            setAccessibleMode(true)
            break
          default:
            break
        }
      })
    }
  }, [introJS, showAbout])

  return <div className='fixed inset-0 flex items-center justify-center z-50'>
    <div className={'fixed inset-0 bg-charcoal opacity-[0.675]'}/>
    <div className='bg-neutral relative w-1/3 flex flex-col items-center justify-between rounded-md z-50 shadow-xl'>
      <div className='p-12'>
        <p>
          Given an image of a line chart, someone with visual impairment is not able to interact with the content. The image is flat. Using this tool, we can extract the data from the image by manually (or automatically) copying its content and exporting it in formats useful for someone with visual impairment. As you work, the SVG you produce can be viewed from within the tool. This entire process is guided through an interactive tutorial.
        <br/> Made by Omar Moured and Morris Baumgarten-Egemole </p>
      </div>
      <button className='absolute right-3 top-3 text-right text-charcoal' onClick={toggleAbout}>
        <RxCross2 size={26}/>
      </button>
      <button onClick={() => {
        setTutorialAppState(getAppState())
        setToggleOption('Image')
        setToggleDataSidebar(false)
        setDraggingElement(undefined)
        setAppState({ ...DEFAULT_APP_STATE, imageSrc: `${(process.env.PUBLIC_URL != null) ? process.env.PUBLIC_URL : ''}/testImage.jpg`, svgRef }, () => {
          setTimeout(() => { introJS.start() }, 600) // wait for image load so tutorial sees all divs
        })
      }} className="mb-4 bg-dogwater font-medium border-[1.5px] border-charcoal border-solid py-1 px-6 rounded text-charcoal text-base">
        Start Tutorial
      </button>
    </div>
  </div>
}

export default InteractiveTutorial
