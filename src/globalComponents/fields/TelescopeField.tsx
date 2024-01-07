import React, { useContext } from 'react'
import CustomInputField from './CustomInputField'
import { type PositionAxisID } from '../../types'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../../constants/ItemTypes'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'
import { ChartContext } from '../../globalUtilities/chartContext'

interface Props {
  field: PositionAxisID
  fields: PositionAxisID[]
  appendFields: any
  onChangeText: any
  onChangeValue: any
  accessor: 'x' | 'y'
  index: number
}

const TelescopeField: React.FC<Props> = ({ field, fields, appendFields, onChangeText, onChangeValue, accessor, index }) => {
  const { configuration } = useContext(ModeConfigurationContext)
  const { scaleX, scaleY } = useContext(ChartContext)

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: any) => {
      if (item.OCRText.length > 0) {
        appendFields(index, item.OCRText)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [configuration.ocrTool, fields, index])
  return (
      <div className='flex flex-row items-center justify-between' ref={drop}>
      <div className='pr-2'>
        <CustomInputField
            type="number"
            value={field.text}
            onChange={onChangeText}
            noPadding={true}
            utilDrag={false}
            scaleType={accessor === 'x' ? scaleX : scaleY}
        />
      </div>
        <CustomInputField
        type="number"
        value={field.coordinate.toString(10)}
        onChange={onChangeValue}
        noPadding={true}
        scaleType='linear'
        utilDrag={false}
        />
  </div>
  )
}

export default TelescopeField
