import React from 'react'

/*
This is a text divider with a text description
 */

interface textDividerProps {
  text: string
}

export const DividerWithText: React.FC<textDividerProps> = (props) => {
  return (
            <div>
                <h2 className="text-sm my-[0.1rem]">
                    {props.text}
                </h2>
                <hr className="border-darkgrey mb-1.5"/>
            </div>
  )
}
export default DividerWithText
