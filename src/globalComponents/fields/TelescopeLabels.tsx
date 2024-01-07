import React, { useContext } from 'react'
import { type PositionAxisID, type PositionText } from '../../types'
import { IoAddOutline, IoRemoveOutline } from 'react-icons/io5'
import TelescopeField from './TelescopeField'
import { DEFAULT_AXIS_TEXT } from '../../constants/mainTypesDefaults'
import { v4 as uuidv4 } from 'uuid'
import { parseDate } from '../../globalUtilities/calculationUtility'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'

interface Props {
  accessor: 'x' | 'y'
  fields: PositionAxisID[]
  setFields: any
}
const TelescopeLabels: React.FC<Props> = ({ accessor, fields, setFields }) => {
  const { saveHistory } = useContext(ModeConfigurationContext)
  const insertField = (index: number): void => {
    console.log('test')
    const tempFields = fields.slice()
    tempFields.splice(index + 1, 0, { ...DEFAULT_AXIS_TEXT, id: uuidv4() })
    console.log(tempFields.length, fields.length, 'length')
    setFields(tempFields)
  }
  const bboxXOffset = (posText: PositionText): number => {
    return Math.round(((posText.bbox.x0 + posText.bbox.x1) / 2) * 100) / 100
  }

  const bboxYOffset = (posText: PositionText): number => {
    return Math.round(((posText.bbox.y0 + posText.bbox.y1) / 2) * 100) / 100
  }
  const appendFields = (index: number, values: PositionText[]): void => {
    saveHistory()
    const tempFields = fields.slice()
    const roundedValues = values.map((val: PositionText) => {
      let trimmed = val.text.trim()
      try {
        parseDate(trimmed)
      } catch (e) {
        trimmed = trimmed.replace(/,/g, '')
      }
      return { text: trimmed, coordinate: accessor === 'x' ? bboxXOffset(val) : bboxYOffset(val), id: uuidv4() }
    }).filter(val => val !== null)
    if (roundedValues !== null) {
      tempFields.splice(index, 1, ...roundedValues)
      setFields(tempFields)
    }
  }
  const removeField = (index: number): void => {
    saveHistory()
    let tempFields = fields.slice()
    tempFields.splice(index, 1)
    if (tempFields.length === 0) {
      tempFields = [{ ...DEFAULT_AXIS_TEXT, id: uuidv4() }]
    }
    setFields(tempFields)
  }
  const updateFieldText = (index: number, value: string): void => {
    const tempFields = fields.slice()
    tempFields[index] = { ...tempFields[index], text: value }
    setFields(tempFields)
  }

  const updateFieldCoordinate = (index: number, value: number): void => {
    const tempFields = fields.slice()
    tempFields[index] = { ...tempFields[index], coordinate: value }
    setFields(tempFields)
  }
  const createButtons = (index: number): React.ReactNode => {
    return <div className="flex flex-row items-center pl-2">
      <button className={'bg-blue w-3 h-3 flex items-center justify-center rounded-2xl opacity-80 m-1'}
              onClick={() => { insertField(index) }}>
        <div className={'text-white'}>
          <IoAddOutline size={13} />
        </div>
      </button>
      <button className={'bg-blue w-3 h-3 flex items-center justify-center rounded-2xl opacity-80 m-1'}
              onClick={() => { removeField(index) }}>
        <div className={'text-white'}>
          <IoRemoveOutline size={13} />
        </div>
      </button>
    </div>
  }

  // isMin={index === 0
  // isMax={index === fields.length - 1}
  return (<div className='flex flex-col px-4'>
    <div className='w-full grid mx-1 mt-1' style={{ gridTemplateColumns: '40% 40% 20%' }}>
      <p className='text-xs'>Text</p>
      <p className='text-xs pl-2'>{accessor.toLocaleUpperCase()}-coordinate</p>
    </div>
        {fields.map((val, index) => {
          return (
              <div key={val.id} className='w-full grid mx-1 mt-1'
                   style={{ gridTemplateColumns: '80% 20%' }}>
                  <TelescopeField
                      field={val}
                      fields={fields}
                      appendFields={appendFields}
                      onChangeText={(value: string) => {
                        updateFieldText(index, value)
                      }}
                      onChangeValue={(value: string) => {
                        updateFieldCoordinate(index, Number(value))
                      }}
                      accessor={accessor}
                      index={index}
                  />
                {createButtons(index)}
              </div>
          )
        })
        }
      </div>
  )
}

export default TelescopeLabels
