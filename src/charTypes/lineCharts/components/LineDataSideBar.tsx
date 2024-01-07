import React, { useContext } from 'react'
import { ChartContext } from '../../../globalUtilities/chartContext'
import DividerWithText from '../../../globalComponents/spacing_and_headers/DividerWithText'
import CustomInputField from '../../../globalComponents/fields/CustomInputField'
import DataPointGrid from '../../../globalComponents/DataPointGrid'
import {
  getLineFromKey,
  updateLineType,
  updateTitleLine
} from '../../../globalUtilities/dotInteractionUtility'
import { deleteLine, handleLineAdd } from '../utilities/contextUtility'
import DropDownMenu, { type DropDownOption } from '../../../globalComponents/fields/DropDownMenu'
import { allLineTypesArr } from '../../../constants/chartTypes'
import SmallDropDownMenu from '../../../globalComponents/fields/SmallDropDownMenu'

const LineDataSideBar: React.FC = () => {
  const { selectedLine, setSelectedLine, lines, setLines } = useContext(ChartContext)
  return (
        <div className="w-full overflow-x-hidden">
            <div>
                <div className="pr-8" id='step15'>
                    <DropDownMenu
                        title="Select Line"
                        options={lines}
                        onChange={setSelectedLine}
                        onDelete={(option: DropDownOption) => { deleteLine(option.key, setSelectedLine, selectedLine, lines, setLines) }}
                        onAdd={() => { return handleLineAdd(lines, setLines) }}
                        value={getLineFromKey(selectedLine, lines)?.title}
                        emptyText='Select a Line'
                    />
                </div>

            </div>
            { selectedLine !== undefined && <div>
                <DividerWithText text="Line Details"/>
                <div
                    data-description={'line title entry'}
                >
                    <CustomInputField
                        title="Line Title"
                        type="text"
                        value={getLineFromKey(selectedLine, lines)?.title}
                        onChange={(val: string) => { updateTitleLine(val, selectedLine, setLines, lines) }}
                    />
                </div>
              <div className='pb-4 pl-3'
                   data-description={'Type entry'}
              >
                <SmallDropDownMenu
                  title="Line Output Type"
                  options={allLineTypesArr.map(x => ({ key: x.title, title: x.title }))}
                  onChange={(value: string) => { updateLineType(value, selectedLine, setLines, lines) }}
                  value={getLineFromKey(selectedLine, lines)?.lineType.title as string}
                />
              </div>
                    <div id='step7'
                         data-description={'data point grid'}
                    >
                        <DividerWithText text="Data Points for Line"/>
                        <DataPointGrid/>
                    </div>
                    <div className='h-8'/>
                </div>
            }
        </div>
  )
}

export default LineDataSideBar
