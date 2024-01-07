import React, { useContext } from 'react'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import ModeButton from './Buttons/ModeButton'
import { RiCharacterRecognitionLine } from 'react-icons/ri'
import { CgShapeCircle } from 'react-icons/cg'
import { ImMagicWand } from 'react-icons/im'

const ToolBar: React.FC = () => {
  const { configuration, updateConfiguration } = useContext(ModeConfigurationContext)

  const toggleCirclePlacer = (): void => {
    updateConfiguration('circlePlacer')
  }
  const toggleOCR = (): void => {
    updateConfiguration('ocrTool')
  }
  const toggleAuto = (): void => {
    updateConfiguration('autoTool')
  }
  return (
        <div className="z-20 w-16 flex flex-col bg-sidegrey rounded-[1.25rem] justify-center bg-opacity-50 shadow-lg items-center
      bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-grey via-neutral to-darkgrey">
            <div className='h-4'/>
            <div data-description={'Circle Tool'}>
                <ModeButton Icon={CgShapeCircle} handleToggle={toggleCirclePlacer} toggleData={configuration.circlePlacer}/>
            </div>
            <div id='step19' data-description={'OCR Tool'}>
                <ModeButton Icon={RiCharacterRecognitionLine} handleToggle={toggleOCR}
                            toggleData={configuration.ocrTool}/>
            </div>
            <div id='step17' data-description={'AI Tool'}>
                <ModeButton Icon={ImMagicWand} size={24} handleToggle={toggleAuto} toggleData={configuration.autoTool}/>
            </div>
            <div className='h-8'/>
        </div>
  )
}

export default ToolBar
