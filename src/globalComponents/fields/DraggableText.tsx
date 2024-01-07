import React, { useContext, useEffect } from 'react'
import { ModeConfigurationContext } from '../../globalUtilities/modeConfigurationContext'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../constants/ItemTypes'
import { type PositionText } from '../../types'
interface Props {
  direction: boolean
}
const DraggableText: React.FC<Props> = ({ direction }) => {
  const { OCRText, setDragOCR } = useContext(ModeConfigurationContext)
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { type: 'text', OCRText },
    type: ItemTypes.BOX,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [OCRText])
  useEffect(() => {
    setDragOCR(isDragging)
  }, [isDragging])

  return (<p
                ref={drag}
                className={`flex items-center justify-center ${isDragging ? 'opacity-40' : ''} text-darkCharcoal pointer-events-auto`}
                onMouseDown={(event: any) => {
                  event.stopPropagation()
                }}
                style={{
                  cursor: 'move',
                  transform: 'translate(0, 0)',
                  whiteSpace: 'pre-line',
                  height: '100%',
                  width: '100%'
                }}>
                    {OCRText.length > 0 ? OCRText.map((val: PositionText) => val.text).join(direction ? '\n' : ' ') : 'No text found' }
  </p>)
}

export default DraggableText
