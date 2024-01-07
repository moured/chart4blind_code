import React, { useContext, useState } from 'react'
import { IoChevronDownSharp, IoChevronUpSharp } from 'react-icons/io5'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'

export interface DropDownOption {
  key: string
  title: string
}

interface Props {
  title?: string
  options: DropDownOption[]
  onChange: (option: string) => void
  value: string
}

const SmallDropDownMenu: React.FC<Props> = ({ title, options, onChange, value }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { saveHistory } = useContext(ModeConfigurationContext)
  const handleSelect = (option: DropDownOption): void => {
    saveHistory()
    onChange(option.key)
    setShowDropdown(false)
  }

  return (
        <div className="ml-2 relative w-full">
            {title !== undefined && <label className="text-xs font-normal text-charcoal">{title}</label>}
            <div className="flex items-center">
                <button
                    type="button"
                    className={`border-[1.5px] py-1 pl-2 pr-1 flex items-center justify-between font-normal border-darkgrey bg-truegrey ${
                        value !== '' ? 'text-charcoal' : 'text-darkgrey'
                    } rounded-md`}
                    onClick={() => {
                      setShowDropdown(!showDropdown)
                    }}
                >
                    <div className="block truncate text-sm">{value}</div>
                    {showDropdown
                      ? (
                        <IoChevronUpSharp className="text-darkgrey text-lg" />
                        )
                      : (
                        <IoChevronDownSharp className="text-darkgrey text-lg" />
                        )}
                </button>
            </div>

            {showDropdown && (
                <div className="absolute z-10 pb-1 bg-truegrey border-[1.5px] border-darkgrey rounded-md z-50">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="relative mx-2 h-full py-2 pl-2 pr-3 flex items-center border-b border-darkgrey justify-between text-sm"
                            onClick={() => {
                              handleSelect(option)
                            }}
                        >
                            <div className="block truncate text-charcoal">
                                {option.title}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
  )
}

export default SmallDropDownMenu
