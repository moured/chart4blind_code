import React, { useContext, useState } from 'react'
import { IoChevronDownSharp, IoChevronUpSharp, IoAddOutline } from 'react-icons/io5'
import { HiOutlineTrash } from 'react-icons/hi'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'

export interface DropDownOption {
  key: string
  title: string
}

interface Props {
  title?: string
  options: DropDownOption[]
  onChange: (key: string) => void
  onDelete?: (option: DropDownOption) => void
  onAdd?: () => DropDownOption
  value?: string
  emptyText?: string
}

const DropDownMenu: React.FC<Props> = ({ title, options, onChange, onDelete, onAdd, value, emptyText }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { saveHistory } = useContext(ModeConfigurationContext)
  const handleSelect = (option: DropDownOption): void => {
    saveHistory()
    onChange(option.key)
    setShowDropdown(false)
  }
  const handleDelete = (option: DropDownOption): void => {
    if (onDelete !== undefined) {
      saveHistory()
      onDelete(option)
    }
  }

  return (
        <div className="mx-4 mb-4 relative w-full">
            {
                title !== undefined && <label className="text-sm font-normal text-charcoal">{title}</label>
            }
            <div className="flex items-center">
                <button
                    type="button"
                    className={`border-[1.5px] py-2.5 pl-6 pr-14 flex items-start justify-between font-normal border-darkgrey bg-truegrey ${(value !== '') ? 'text-charcoal' : 'text-darkgrey'} py-2 px-4 w-full rounded-md`}
                    onClick={() => { setShowDropdown(!showDropdown) }}
                >
                    <div className={`block truncate ${emptyText !== undefined && value === undefined ? 'text-darkgrey' : ''}`}>
                        {value === undefined ? emptyText : value}
                    </div>
                    {
                        showDropdown
                          ? <IoChevronUpSharp className="text-darkgrey text-xl" />
                          : <IoChevronDownSharp className="text-darkgrey text-xl" />

                    }
                </button>

            </div>

            {showDropdown && (
                <div className="absolute z-50 w-full py-1 bg-truegrey border-[1.5px] border-darkgrey rounded-md ">
                    {options.map((option, index) => (
                        <div key={index} className="relative h-full py-1 pl-3 pr-9 flex items-center justify-between">
                            <div
                                className="relative cursor-pointer h-full w-full py-2 pl-3 pr-5 justify-between flex border-b border-darkgrey"
                                onClick={() => { handleSelect(option) }}
                            >
                                <div className="block truncate text-charcoal w-full">
                                    {option.title}
                                </div>
                                {(onDelete !== undefined) && <button onClick={(event) => {
                                  saveHistory()
                                  event.stopPropagation()
                                  handleDelete(option)
                                }}>
                                    <HiOutlineTrash size={24} className="text-charcoal text-lg" />
                                </button>}
                            </div>
                        </div>
                    ))}
                    {(onAdd !== undefined) && <div className="flex w-full items-center justify-center">
                        <button
                            onClick={() => {
                              saveHistory()
                              handleSelect(onAdd())
                            }}
                            className="py-2 text-center text-sm text-green flex justify-center items-center h-full"
                        >
                            <IoAddOutline className="text-darkgrey text-lg" />
                            Add new
                        </button>
                    </div>}
                </div>
            )}
        </div>
  )
}

export default DropDownMenu
