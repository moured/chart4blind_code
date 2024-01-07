import React, { useContext, useState } from 'react'
import { ChartContext } from '../../../globalUtilities/chartContext'
import CustomInputField from '../../../globalComponents/fields/CustomInputField'
import DividerWithText from '../../../globalComponents/spacing_and_headers/DividerWithText'
import SmallDropDownMenu from '../../../globalComponents/fields/SmallDropDownMenu'
import AdvancedButton from '../../../globalComponents/Buttons/AdvancedButton'
import TelescopeLabels from '../../../globalComponents/fields/TelescopeLabels'
import { genGapText } from '../../../constants/gapText'

const LinePropertiesSideBar: React.FC = () => {
  const { title, lines, description, setDescription, setTitle, xTitle, xAxisLabels, yAxisLabels, setXAxisLabels, setYAxisLabels, setXTitle, yTitle, setYTitle, X1, setX1, X2, setX2, Y1, setY1, Y2, setY2, scaleY, scaleX, setScaleY, setScaleX } = useContext(ChartContext)
  const [advancedX, setAdvancedX] = useState<boolean>(false)
  const [advancedY, setAdvancedY] = useState<boolean>(false)

  return (
        <div className="w-full h-full overflow-x-hidden">
            <DividerWithText text="Calibration - Values at Points"/>
            <div className="w-full pl-5 grid grid-cols-3 gap-x-2 mb-1.5" id='step5'
                 data-description={'calibration entry fields'}
            >
                <CustomInputField
                    title="X1"
                    type="number"
                    value={X1.referenceValue}
                    onChange={(val: string) => {
                      setX1({ ...X1, referenceValue: val })
                    }}
                    noPadding={true}
                    scaleType={scaleX}
                />
                <CustomInputField
                    title="X2"
                    type="number"
                    value={X2.referenceValue}
                    onChange={(val: string) => {
                      setX2({ ...X2, referenceValue: val })
                    }}
                    noPadding={true}
                    scaleType={scaleX}
                />
                <div data-description={'X scale type chooser'}>
                <SmallDropDownMenu
                    title = 'Scale X'
                    onChange={setScaleX}
                    options={[
                      { key: 'linear', title: 'linear' },
                      { key: 'logarithmic', title: 'log' },
                      { key: 'time', title: 'date' }
                    ]}
                    value={scaleX === 'logarithmic' ? 'log' : scaleX}/>
                </div>
                <CustomInputField
                    title="Y1"
                    type="number"
                    value={Y1.referenceValue}
                    onChange={(val: string) => {
                      setY1({ ...Y1, referenceValue: val })
                    }}
                    noPadding={true}
                    scaleType={scaleY}
                />
                <CustomInputField
                    title="Y2"
                    type="number"
                    value={Y2.referenceValue}
                    onChange={(val: string) => {
                      setY2({ ...Y2, referenceValue: val })
                    }}
                    noPadding={true}
                    scaleType={scaleY}
                />
                <div data-description={'Y scale type chooser'}>
                    <SmallDropDownMenu
                        title = 'Scale Y'
                        onChange={setScaleY}
                        options={[
                          { key: 'linear', title: 'linear' },
                          { key: 'logarithmic', title: 'log' },
                          { key: 'time', title: 'date' }
                        ]}
                        value={scaleY === 'logarithmic' ? 'log' : scaleY}/>
                </div>

            </div>
            <DividerWithText text="Graph Information"/>
            <CustomInputField
                title="Title"
                type="text"
                value={title}
                onChange={setTitle}
            />

            <CustomInputField
                title="X-Axis Title"
                type="text"
                value={xTitle}
                onChange={setXTitle}
            />
            <div className={`${advancedX ? 'mb-[-1px]' : 'mb-[-10px]'}`}>
            <div data-description='advancedXEntry'>
                <AdvancedButton toggleData={advancedX} handleToggle={() => {
                  setAdvancedX(!advancedX)
                }}/>
            </div>
            {
                advancedX
                  ? <div className='mt-[-3px] rounded-md bg-neutral pb-3'>
                        {
                            <div>
                                <label className="text-[0.82rem] font-normal text-charcoal pl-3">Custom Axis Labels</label>
                            </div>
                        }
                        <TelescopeLabels accessor='x' fields={xAxisLabels} setFields={setXAxisLabels}/>
                    </div>
                  : null
            }
            </div>
            <CustomInputField
                title="Y-Axis Title"
                type="text"
                value={yTitle}
                onChange={setYTitle}
            />
            <div className={`${advancedX ? 'mb-[-1px]' : 'mb-[-10px]'}`}>
            <div className='w-full mt-1' id='step21' data-description='advancedYEntry'>
                <AdvancedButton toggleData={advancedY} handleToggle={() => {
                  setAdvancedY(!advancedY)
                }}/>
            </div>
            {
                advancedY
                  ? <div className='mt-[-3px] rounded-md bg-neutral pb-3'>
                        {
                            <div>
                                <label className="text-[0.82rem] font-normal text-charcoal pl-3">Custom Axis Labels</label>
                            </div>
                        }
                        <TelescopeLabels accessor='y' fields={yAxisLabels} setFields={setYAxisLabels}/>
                    </div>
                  : null
            }
            </div>
            <div className="mt-3"/>
            <DividerWithText text="Additional Information"/>
          <div id='step80'>
            <CustomInputField
            title="Description"
            type="text"
            value={description}
            onChange={setDescription}
            increaseHeight={true}
          />
          </div>
          <div className='flex flex-row'>
            <button onClick={() => {
              setDescription(genGapText(title, xTitle, yTitle, scaleX, scaleY, lines, X1, X2, Y1, Y2, 'en'))
            }}
                  className="bg-neutral ml-5 font-light border-[1.5px] border-charcoal border-solid py-0.5 px-4 rounded text-charcoal text-sm">
            Auto-fill English
          </button>
            <button onClick={() => {
              setDescription(genGapText(title, xTitle, yTitle, scaleX, scaleY, lines, X1, X2, Y1, Y2, 'de'))
            }}
                    className="bg-neutral ml-1 mr-5 font-light border-[1.5px] border-charcoal border-solid py-0.5 px-4 rounded text-charcoal text-sm">
              Auto-fill German
            </button>
          </div>

          <div className='h-8'/>
        </div>
  )
}
export default LinePropertiesSideBar
