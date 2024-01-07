import React from 'react'

interface Props {
  toggleData: boolean
  handleToggle: () => void
}

const MainToggleButton: React.FC<Props> = ({ toggleData, handleToggle }) => {
  return (
        <div className="flex w-full bg-lightgrey px-1 py-[0.2rem] rounded-md"
             data-description={`Properties Toggle visible: ${toggleData ? 'true' : 'false'}`}
        >
            <button
                className={`flex-grow mr-1 py-1 ${toggleData ? 'border-[1.5px]  border-charcoal text-charcoal  bg-green' : 'bg-lightgrey text-darkgrey'} rounded-md`}
                onClick={handleToggle}
            >
                Data
            </button>
            <button
                className={`flex-grow py-1 ${!toggleData ? 'border-[1.5px] border-charcoal text-charcoal  bg-green' : 'bg-lightgrey text-darkgrey'} rounded-md`}
                onClick={handleToggle}
            >
                Properties
            </button>
        </div>
  )
}

export default MainToggleButton
