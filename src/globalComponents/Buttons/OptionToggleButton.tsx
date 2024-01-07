import React from 'react'

interface Props {
  options: string[]
  handlePress: any
  selected: string
  accent?: boolean
}

const OptionToggleButton: React.FC<Props> = ({ handlePress, options, selected, accent }) => {
  return (
        <div className="flex bg-lightgrey px-1 py-[0.2rem] rounded-md my-4 text-md font-normal" style={{ width: options.length * 17 * 4 }}
             data-description={`Clicked away from ${selected} mode`}
        >
            {
                options.map((val: string) => {
                  return <button
                      key={val}
                        className={`flex-grow mr-1 py-1 ${val === selected ? `border-[1.5px]  border-charcoal text-charcoal  ${accent !== undefined ? 'bg-green' : 'bg-dogwater'}` : 'bg-lightgrey text-darkgrey'} rounded-md`}
                        onClick={() => { handlePress(val) }}
                  >
                        {val}
                    </button>
                })
            }
        </div>
  )
}

export default OptionToggleButton
