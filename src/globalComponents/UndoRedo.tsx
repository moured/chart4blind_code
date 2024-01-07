import React, { useContext, useEffect } from 'react'
import { ChartContext } from '../globalUtilities/chartContext'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'
import { enqueueSnackbar } from 'notistack'
import { CiRedo, CiUndo } from 'react-icons/ci'
import 'intro.js/introjs.css'

const UndoRedo: React.FC = () => {
  const { imageSrc } = useContext(ChartContext)
  // moved these to context since there was a seemingly unfixable bug with useState, useCallBack and useRef that
  // with neither combination avoiding infinite render loops or stale states being updated
  const { undoHistory, redoHistory, setAppState } = useContext(ModeConfigurationContext)
  useEffect(() => {
    if (undoHistory === undefined || redoHistory === undefined) return
    undoHistory.current = []
    redoHistory.current = []
    // setAppState(DEFAULT_APP_STATE)
  }, [imageSrc])

  const undo = (): void => {
    if (undoHistory === undefined || redoHistory === undefined) return
    const tempArray = undoHistory.current.slice()
    const remember = tempArray.pop()
    undoHistory.current = tempArray

    if (remember === undefined) {
      enqueueSnackbar('Nothing to undo')
      return
    }
    redoHistory.current = [...redoHistory.current, remember]
    setAppState(remember)
  }
  const redo = (): void => {
    if (undoHistory === undefined || redoHistory === undefined) return
    const tempArray = redoHistory.current.slice()
    const remember = tempArray.pop()
    redoHistory.current = tempArray
    if (remember === undefined) {
      enqueueSnackbar('Nothing to redo')
      return
    }
    undoHistory.current = [...undoHistory.current, remember]
    setAppState(remember)
  }
  return (<div className='flex justify-center'>
    <button className="cursor-pointer ml-5" onClick={undo}
            data-description={'undo'}
    >
      <CiUndo size={32} />
    </button>
    <button className="ml-5" onClick={redo}
            data-description={'redo'}
    >
      <CiRedo size={32}/>
    </button>
  </div>)
}

export default UndoRedo
