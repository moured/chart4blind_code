import React, { useContext, useEffect, useState } from 'react'
import { type scaleTypes } from '../../constants/chartTypes'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../../constants/ItemTypes'
import { type PositionText } from '../../types'
import { parseDate } from '../../globalUtilities/calculationUtility'

interface Props {
  title?: string
  type: string
  value: string | undefined
  onChange: any
  increaseHeight?: boolean
  noPadding?: boolean
  placeholder?: string
  scaleType?: scaleTypes
  utilDrag?: boolean
  noDesign?: boolean
}

const CustomInputField: React.FC<Props> = ({ type, value, onChange, title, increaseHeight, placeholder, noPadding, scaleType, utilDrag, noDesign }) => {
  const [intermediateValue, setIntermediateValue] = useState<string | undefined>(value)
  const { configuration, saveHistory, dragOCR } = useContext(ModeConfigurationContext)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: any) => {
      utilDrag === undefined && globalChange(item.OCRText.map((val: PositionText) => val.text).join(' '))
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [configuration.ocrTool])

  // this doesnt work with telescopeInputFields as expected since the asyncronous useState hasnt updated the fields array so
  // the individual entry can't be edited
  useEffect(() => {
    globalChange(value)
  }, [scaleType, value])
  const handleBlur = (): void => {
    if (intermediateValue !== undefined) globalChange(intermediateValue)
  }
  const regexNumber: RegExp = /^-?(\d+\.?\d*|\.\d*)$/
  const lenientRegex: RegExp = /^[0-9]*([/.-][0-9]*){0,2}$/

  const globalChange = (str: string | undefined): void => {
    if (type === 'number') {
      if (scaleType === 'time' && str !== undefined) {
        try {
          parseDate(str)
          setIntermediateValue(str)
          onChange(str)
        } catch (e) {
          onChange('')
          setIntermediateValue('')
        }
      } else if (str !== undefined) {
        const removeComma = str.replace(/,/g, '')
        if (!isNaN(Number(removeComma))) {
          onChange(removeComma)
          setIntermediateValue(removeComma)
        } else {
          onChange('')
          setIntermediateValue('')
        }
      }
    } else {
      onChange(str)
      setIntermediateValue(str)
    }
  }

  const changerFunction = (value: string, change: any): void => {
    if (type === 'number') {
      if (scaleType === 'linear' || scaleType === 'logarithmic') {
        const removeComma = value.replace(/,/g, '')
        if (regexNumber.test(removeComma) || value === '') {
          change(removeComma)
        } else {
          change('')
        }
      } else if (scaleType === 'time') {
        if (value === '' || lenientRegex.test(value)) {
          change(value)
        } else {
          change('')
        }
      }
    } else {
      setIntermediateValue(value)
    }
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (intermediateValue === '' || intermediateValue === undefined) {
      saveHistory()
    }
    changerFunction(e.target.value, setIntermediateValue)
  }

  return (
        <div ref={drop} className={` ${noPadding === true ? '' : 'mx-5'}`}>
            {
                title !== undefined && <div>
                <label className="text-xs font-normal text-charcoal">{title}</label>
            </div>
            }
          {increaseHeight === true
            ? <textarea
              className={`relative ${dragOCR ? 'z-40' : 'z-0'} ${isOver && configuration.ocrTool ? 'border-blue' : 'border-darkgrey'} ${configuration.ocrTool ? 'border-dashed' : ''} ${intermediateValue !== '' ? 'text-charcoal' : 'text-darkgrey'} ${increaseHeight !== undefined ? 'pb-12' : ''} 
                ${noDesign !== undefined ? 'px-0.5 py-1 text-sm text-charcoal w-full bg-transparent' : 'py-1.5 px-4 w-full rounded-md border-[1.5px] font-normal text-sm bg-truegrey'} font-normal`}
              value={intermediateValue}
              onChange={handleValueChange}
              onBlur={handleBlur}
            />
            : <input
              type="text"
              className={`relative ${dragOCR ? 'z-40' : 'z-0'} ${isOver && configuration.ocrTool ? 'border-blue' : 'border-darkgrey'} ${configuration.ocrTool ? 'border-dashed' : ''} ${intermediateValue !== '' ? 'text-charcoal' : 'text-darkgrey'} ${increaseHeight !== undefined ? 'pb-12' : ''} 
                ${noDesign !== undefined ? 'px-0.5 py-1 text-sm text-charcoal w-full bg-transparent' : 'py-1.5 px-4 w-full rounded-md border-[1.5px] font-normal text-sm bg-truegrey'} font-normal`}
              value={intermediateValue}
              onChange={handleValueChange}
              placeholder={placeholder}
              onBlur={handleBlur}
            />
          }
        </div>
  )
}

export default CustomInputField
