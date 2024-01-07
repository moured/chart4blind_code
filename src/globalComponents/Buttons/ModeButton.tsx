import React from 'react'
import { type IconType } from 'react-icons'

interface Props {
  toggleData: boolean
  handleToggle: () => void
  Icon: IconType
  size?: number
}

const ModeButton: React.FC<Props> = ({ toggleData, handleToggle, Icon, size }) => {
  return (
      <div className="flex justify-center items-center m-1">
          <button className={`border-4 border-darkCharcoal ${toggleData ? 'bg-dogwater' : 'bg-transparent'} w-11 h-11 flex items-center justify-center rounded-md`}
              onClick={handleToggle}>
              <div className={'text-darkCharcoal'}>
                  <Icon size={size !== undefined ? size : 28} />
              </div>
          </button>
      </div>
  )
}

export default ModeButton
