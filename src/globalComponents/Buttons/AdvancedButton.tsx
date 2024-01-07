import React from 'react'
import { IoChevronDownSharp, IoChevronUpSharp } from 'react-icons/io5'

interface Props {
  toggleData: boolean
  handleToggle: () => void
}

const AdvancedButton: React.FC<Props> = ({ toggleData, handleToggle }) => {
  return (
            <button onClick={handleToggle} className='w-full relative flex justify-center'>
                <div className={'text-darkgrey text-xs flex items-center flex-col'}>
                    Advanced
                    {toggleData ? <IoChevronUpSharp className='mt-[-4px]' size={17} /> : <IoChevronDownSharp className='mt-[-4px]' size={17} /> }
                </div>
            </button>
  )
}

export default AdvancedButton
