import React, { useContext } from 'react'
import { type DataPoint } from '../types'
import { ChartContext } from '../globalUtilities/chartContext'
import { IoTrashOutline } from 'react-icons/io5'
import {
  getLineFromKey,
  removePointLine,
  scaleValueToCalibration,
  updatePointLine
} from '../globalUtilities/dotInteractionUtility'
import CustomInputField from './fields/CustomInputField'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'

const DataPointGrid: React.FC = () => {
  const { selectedLine, lines, X1, X2, Y1, Y2, scaleX, scaleY, setLines } = useContext(ChartContext)
  const { draggingElement } = useContext(ModeConfigurationContext)
  return <div className="mx-4 mb-4">
        <div className="mr-10">
            <div className="w-full grid gap-1 text-center text-sm" style={{ gridTemplateColumns: '10% 30% 30% 30%' }}>
                <span className="bg-neutral py-1 rounded">#</span>
                <span className="bg-neutral py-1 rounded">X-value</span>
                <span className="bg-neutral py-1 rounded">Y-value</span>
                <span className="bg-neutral py-1 rounded">Description</span>
            </div>
        </div>
        {(X1.referenceValue === '' ||
            X2.referenceValue === '' ||
            Y1.referenceValue === '' ||
            Y2.referenceValue === '')
          ? <div className="flex w-full pl-1 pt-2 mr-10 items-center text-darkgrey text-xs">
                Calibrate your axes by adding reference values in the properties tab first!
            </div>
          : <div>
                {getLineFromKey(selectedLine, lines)?.dataPoints.length === 0 &&
                    <div className="flex w-full pl-1 pt-2 mr-10 items-center text-darkgrey text-xs">
                    Click on the image to add data points, their value are displayed here
                    </div>
                }
                {getLineFromKey(selectedLine, lines)?.dataPoints.map(({ xVal, yVal, desc, key }: DataPoint, index) => {
                  const adjustedPosition = scaleValueToCalibration({ xVal, yVal }, X1, X2, Y1, Y2, scaleX, scaleY)
                  return <div key={key} className={`flex flex-row w-full my-0.5 ${draggingElement === key ? 'bg-dogwater' : ''} rounded-md`}>
                    <div className="w-full grid gap-1 items-center text-center text-sm"
                         style={{ gridTemplateColumns: '10% 30% 30% 30%' }}>
                        <span className="truncate">{index}</span>
                        <span
                            className="truncate">{scaleX !== 'time'
                              ? adjustedPosition.xVal.toFixed(3)
                              : new Date(adjustedPosition.xVal).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              })}</span>
                        <span
                            className="truncate">{scaleY !== 'time'
                              ? adjustedPosition.yVal.toFixed(3)
                              : new Date(adjustedPosition.yVal).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              })}</span>
                        <CustomInputField
                            type="text"
                            value={desc}
                            onChange={(value: string) => {
                              updatePointLine({ xVal, yVal, desc: value, key }, selectedLine, setLines, lines)
                            }}
                            noPadding={true}
                            noDesign={true}
                        />
                    </div>
                      <button onClick={() => {
                        removePointLine({ xVal, yVal, desc, key }, selectedLine, lines, setLines)
                      }}>
                          <IoTrashOutline className="text-charcoal text-lg w-10"/>
                      </button>

                </div>
                })}
            </div>}
    </div>
}

export default DataPointGrid
