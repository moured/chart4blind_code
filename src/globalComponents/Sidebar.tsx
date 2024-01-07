import React, { useContext } from 'react'
import LineDataSideBar from '../charTypes/lineCharts/components/LineDataSideBar'
import LinePropertiesSideBar from '../charTypes/lineCharts/components/LinePropertiesSideBar'
import MainToggleButton from './Buttons/MainToggleButton'
import { ModeConfigurationContext } from '../globalUtilities/modeConfigurationContext'

const Sidebar: React.FC = () => {
  const { setToggleDataSidebar, toggleDataSidebar } = useContext(ModeConfigurationContext)
  const handleToggle = (): void => {
    setToggleDataSidebar(!toggleDataSidebar)
  }
  return (
        <div className="flex flex-col flex-shrink-0 w-96 px-3 pt-2 h-full">
            <h2 className="font-medium pb-2 text-base">Chart Manipulation</h2>
            <MainToggleButton toggleData={toggleDataSidebar} handleToggle={handleToggle}/>
            <div className="pb-2"/>
                <div className="w-[22.75rem] overflow-y-scroll">
                    <div className={`${toggleDataSidebar ? '' : 'hidden'}`}
                         data-description={'data side bar'}
                    >
                        <LineDataSideBar/>
                    </div>
                    <div className={`${toggleDataSidebar ? 'hidden' : ''}`}
                         data-description={'properties side bar'}
                    >
                        <LinePropertiesSideBar/>
                    </div>
                </div>
        </div>
  )
}

export default Sidebar
