import React, { type ChangeEvent, useContext, useState } from 'react'
import { ChartTypes } from '../constants/chartTypes'
import { ChartContext } from '../globalUtilities/chartContext'

import { IoAccessibilityOutline, IoFolderOpenOutline } from 'react-icons/io5'
import ExportModal from './ExportModal'
import { enqueueSnackbar } from 'notistack'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import UndoRedo from './UndoRedo'
import InteractiveTutorial from './InteractiveTutorial'
import { DEFAULT_APP_STATE } from '../constants/mainTypesDefaults'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import AccessibilityTutorial from './AccessibilityTutorial'

const Header: React.FC = () => {
  const { imageSrc, setX1, setX2, setY1, setY2 } = useContext(ChartContext)
  const { setAppState } = useContext(ModeConfigurationContext)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [showAbout, setShowAbout] = useState<boolean>(true)
  const [showAccess, setShowAccess] = useState<boolean>(false)

  const toggleModal = (): void => {
    setShowModal(!showModal)
  }
  const toggleAbout = (): void => {
    setShowAbout(!showAbout)
  }
  const toggleAccess = (): void => {
    setShowAccess(!showAccess)
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if ((files != null) && files.length > 0) {
      const file = files[0]
      const newImageSrc = URL.createObjectURL(file)
      setAppState({ ...DEFAULT_APP_STATE, imageSrc: newImageSrc })
      const imageTemp = new Image()
      imageTemp.src = newImageSrc
      imageTemp.onload = () => {
        const entryHeight = window.innerHeight / 1.5
        const entryWidth = window.innerWidth / 1.87
        let imageHeight: number
        let imageWidth: number
        if ((imageTemp.naturalWidth / imageTemp.naturalHeight) > 0.65 && (imageTemp.naturalWidth / imageTemp.naturalHeight) < 1.35) {
          imageHeight = entryWidth * 0.75 * imageTemp.naturalHeight / imageTemp.naturalWidth
          imageWidth = entryWidth * 0.75
        } else if (imageTemp.naturalWidth > imageTemp.naturalHeight) {
          imageHeight = entryWidth * imageTemp.naturalHeight / imageTemp.naturalWidth
          imageWidth = entryWidth
        } else {
          imageHeight = entryHeight
          imageWidth = entryHeight * imageTemp.naturalWidth / imageTemp.naturalHeight
        }
        const axisOffset = 50
        setX1({ xVal: axisOffset * 2, yVal: imageHeight - axisOffset, referenceValue: '' })
        setX2({ xVal: imageWidth - axisOffset, yVal: imageHeight - axisOffset, referenceValue: '' })
        setY1({ xVal: axisOffset, yVal: imageHeight - axisOffset * 2, referenceValue: '' })
        setY2({ xVal: axisOffset, yVal: axisOffset, referenceValue: '' })
      }
    }
    enqueueSnackbar('Image uploaded')
  }

  return (
        <header className="flex items-center justify-between border-b border-darkgrey p-2 text-center font-normal text-sm lg:text-base">
            <div className='flex items-center justify-start min-w-[30%] z-30'>
                <label className="cursor-pointer ml-5" id='step2'
                >
                    <IoFolderOpenOutline size={32} />
                    <input aria-label='folder import' type="file" accept="image/jpeg, image/png" onChange={handleFileChange} style={{ display: 'none' }}/>
                </label>
                <button className="ml-5" id="step1" onClick={toggleAbout}
                        aria-label={'about button'}
                >
                    {showAbout && <InteractiveTutorial toggleAbout={toggleAbout} showAbout={showAbout}/>}
                    <IoIosHelpCircleOutline size={32}/>
                </button>
                <button className="ml-5" id="step27" onClick={toggleAccess}
                        aria-label={'accessibility button'}
                >
                  {showAccess && <AccessibilityTutorial toggleAccess = {toggleAccess} showAccess={showAccess}/>}
                  <IoAccessibilityOutline size={25}/>
                </button>
                <UndoRedo/>
            </div>
            <h1 className="absolute inset-x-0 text-center">
                {ChartTypes.LINECHART}
            </h1>
            <div className='flex items-center justify-end min-w-[30%] z-30'
            data-description='export button'>
                {
                imageSrc !== ''
                  ? <button aria-label='export button' onClick={toggleModal} className="bg-blue font-medium border-[1.5px] border-charcoal border-solid py-1 px-6 mr-6 rounded text-charcoal text-base" id='step30'>
                            Export
                        </button>
                  : <div className="opacity-0 font-medium border-[1.5px] border-solid py-1 px-6 mr-6 text-base">
                                Export
                            </div>
                    }
            </div>
            {showModal && <ExportModal toggleModal={toggleModal}/>}
        </header>
  )
}

export default Header
