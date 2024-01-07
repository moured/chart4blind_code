import { type DataPoint, type Line } from '../../../types'
import { type DropDownOption } from '../../../globalComponents/fields/DropDownMenu'
import { v4 as uuidv4 } from 'uuid'
import { getAvailableLineType } from '../../../globalUtilities/dotInteractionUtility'

export const deleteLine = (key: string, setSelectedLine: any, selectedLine: string | undefined, lines: Line[], setLines: any): void => {
  const allLines = lines.filter((line) => line.key !== key)
  if (!lineExists(selectedLine, allLines)) {
    setSelectedLine(allLines[0]?.key)
  }
  setLines(allLines)
}

export const lineExists = (key: string | undefined, lines: Line[]): boolean => {
  const lineIndex = lines.findIndex((line) => line.key === key)
  return !(lineIndex === -1)
}
export const getNextFreeNumber = (lines: Line[]): string => {
  const allKeys = new Set(lines.map(line => {
    const lastChar = line.title.slice(-1)
    return isNaN(Number(lastChar)) ? 0 : Number(lastChar)
  }))
  let nextKey = 1
  while (allKeys.has(nextKey)) {
    nextKey++
  }
  return nextKey.toString()
}

export const handleLineAdd = (lines: Line[], setLines: any, dataPoints?: DataPoint[]): DropDownOption => {
  const lineNumber = getNextFreeNumber(lines)
  const key = uuidv4()
  setLines([...lines, {
    key,
    title: `Line ${lineNumber}`,
    dataPoints: dataPoints !== undefined ? dataPoints : [],
    lineType: getAvailableLineType(lines)
  }])
  return { key, title: `Line ${lineNumber}` }
}
