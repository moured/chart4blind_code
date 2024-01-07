import { type DataPoint, type Line, type Position, type PositionCalibration } from '../types'
import { allLineTypesArr, type LineType, type scaleTypes } from '../constants/chartTypes'
import { parseDate } from './calculationUtility'

export const addPointLine = (point: DataPoint | undefined, selectedLine: string | undefined, lines: Line[], setLines: any, index?: number): void => {
  if (point === undefined || selectedLine === undefined) return
  const lineIndex = lines.findIndex((line) => line.key === selectedLine)
  const tempLines = lines.slice()
  const tempPoints = tempLines[lineIndex].dataPoints.slice()
  tempPoints.splice(index !== undefined ? index + 1 : tempPoints.length, 0, point)
  tempLines[lineIndex] = {
    ...tempLines[lineIndex],
    dataPoints: tempPoints
  }
  setLines(tempLines)
}
export const removePointLine = (point: DataPoint, selectedLine: string | undefined, lines: Line[], setLines: any): void => {
  if (selectedLine === undefined) return
  const lineIndex = lines.findIndex((line) => line.key === selectedLine)
  if (lineIndex === -1) return
  const tempLines = lines.slice()
  const allDataPoints = tempLines[lineIndex].dataPoints.slice()
  const pointIndex = allDataPoints.findIndex((val) => val.key === point.key)
  allDataPoints.splice(pointIndex, 1)
  tempLines[lineIndex] = {
    ...tempLines[lineIndex],
    dataPoints: allDataPoints
  }
  setLines(tempLines)
}
// refactor move and update Point
export const movePointOfLine = (newPos: Position, key: string, lineKey: string | undefined, setLines: any, lines: Line[]): void => {
  const lineIndex = lines.findIndex((line) => line.key === lineKey)
  const pointIndex = lines[lineIndex].dataPoints.findIndex((point) => point.key === key)
  const tempPoints = lines[lineIndex].dataPoints.slice()
  tempPoints[pointIndex] = { ...newPos, key }
  const tempLines = lines.slice()
  tempLines[lineIndex] = {
    ...tempLines[lineIndex],
    dataPoints: tempPoints
  }
  setLines(tempLines)
}
export const updateTitleLine = (title: string, lineKey: string | undefined, setLines: any, lines: Line[]): void => {
  const lineIndex = lines.findIndex((line) => line.key === lineKey)
  const tempLines = lines.slice()
  tempLines[lineIndex] = {
    ...tempLines[lineIndex],
    title
  }
  setLines(tempLines)
}
export const updateLineType = (lineType: string, lineKey: string | undefined, setLines: any, lines: Line[]): void => {
  const lineTypeIndex = allLineTypesArr.findIndex((type) => type.title === lineType)
  const lineIndex = lines.findIndex((line) => line.key === lineKey)
  const tempLines = lines.slice()
  tempLines[lineIndex] = {
    ...tempLines[lineIndex],
    lineType: allLineTypesArr[lineTypeIndex]
  }
  setLines(tempLines)
}

export const getAvailableLineType = (lines: Line[]): LineType => {
  const usedAlready = lines.map(x => x.lineType)
  const availableLineTypes = allLineTypesArr.filter(lineType => !usedAlready.includes(lineType))
  if (availableLineTypes.length === 0) {
    const randomIndex = Math.floor(Math.random() * allLineTypesArr.length)
    return allLineTypesArr[randomIndex]
  } else {
    const randomIndex = Math.floor(Math.random() * availableLineTypes.length)
    return availableLineTypes[randomIndex]
  }
}
export const updatePointLine = (point: DataPoint, lineKey: string | undefined, setLines: any, lines: Line[]): void => {
  const lineIndex = lines.findIndex((line) => line.key === lineKey)
  const pointIndex = lines[lineIndex].dataPoints.findIndex((val) => val.key === point.key)
  const tempPoints = lines[lineIndex].dataPoints.slice()
  tempPoints[pointIndex] = point
  const tempLines = lines.slice()
  tempLines[lineIndex] = {
    ...tempLines[lineIndex],
    dataPoints: tempPoints
  }
  setLines(tempLines)
}

export const getLineFromKey = (key: string | undefined, lines: Line[]): Line | undefined => {
  return lines.find((line) => line.key === key)
}

export const scaleValueToCalibration = (value: Position,
  X1: PositionCalibration | undefined,
  X2: PositionCalibration | undefined,
  Y1: PositionCalibration | undefined,
  Y2: PositionCalibration | undefined,
  scaleX: scaleTypes,
  scaleY: scaleTypes): Position => {
  if (X1 === undefined || X2 === undefined || Y1 === undefined || Y2 === undefined ||
      X1.referenceValue === '' || X2.referenceValue === '' || Y1.referenceValue === '' || Y2.referenceValue === '' ||
      X1.referenceValue === undefined || X2.referenceValue === undefined || Y1.referenceValue === undefined || Y2.referenceValue === undefined) return { xVal: 0, yVal: 0 }
  let qIntersect: Position
  try {
    qIntersect = checkLineIntersection(X1.xVal, X1.yVal, X2.xVal, X2.yVal, Y1.xVal, Y1.yVal, Y2.xVal, Y2.yVal)
  } catch (e) {
    return { xVal: 0, yVal: 0 }
  }

  // Find units/pixel value
  const unitsPerPixelX = getScaleFactor('x', scaleX, X1, X2)
  const unitsPerPixelY = getScaleFactor('y', scaleY, Y1, Y2)

  let adjustedX: number = (value.xVal - qIntersect.xVal) * unitsPerPixelX
  let adjustedY: number = (value.yVal - qIntersect.yVal) * unitsPerPixelY

  const originValueX = (value: number): number => {
    return value - unitsPerPixelX * Math.min(X1.xVal - qIntersect.xVal, X2.xVal - qIntersect.xVal)
  }
  const originValueY = (value: number): number => {
    return value - unitsPerPixelY * Math.max(Y1.yVal - (qIntersect.yVal), Y2.yVal - qIntersect.yVal)
  }
  if (scaleX === 'linear') {
    const minLinear = Math.min(Number(X1.referenceValue), Number(X2.referenceValue))
    adjustedX += originValueX(minLinear)
  }
  if (scaleY === 'linear') {
    const minLinear = Math.min(Number(Y1.referenceValue), Number(Y2.referenceValue))
    adjustedY += originValueY(minLinear)
  }
  if (scaleX === 'logarithmic') {
    const minLog = Math.min(Number(X1.referenceValue), Number(X2.referenceValue))
    if (minLog > 0) adjustedX += originValueX(Math.log10(minLog))
    adjustedX = Math.pow(10, adjustedX)
  }
  if (scaleY === 'logarithmic') {
    const minLog = Math.min(Number(Y1.referenceValue), Number(Y2.referenceValue))
    if (minLog > 0) adjustedY += originValueY(Math.log10(minLog))
    adjustedY = Math.pow(10, adjustedY)
  }
  if (scaleX === 'time') {
    try {
      const minTime = Math.min(parseDate(X1.referenceValue).getTime(), parseDate(X2.referenceValue).getTime())
      adjustedX += originValueX(minTime)
    } catch (e) {}
  }
  if (scaleY === 'time') {
    try {
      const minTime = Math.min(parseDate(Y1.referenceValue).getTime(), parseDate(Y2.referenceValue).getTime())
      adjustedY += originValueY(minTime)
    } catch (e) {}
  }
  return { xVal: adjustedX, yVal: adjustedY }
}

export const getScaleFactor = (axis: 'x' | 'y', scale: scaleTypes, xy1: PositionCalibration, xy2: PositionCalibration): number => {
  const denominator = axis === 'x' ? xy2.xVal - xy1.xVal : xy2.yVal - xy1.yVal
  switch (scale) {
    case 'linear':
      return (Number(xy2.referenceValue) - Number(xy1.referenceValue)) / denominator
    case 'logarithmic':
      return (Math.log10(Number(xy2.referenceValue)) - Math.log10(Number(xy1.referenceValue))) / denominator
    case 'time':
      try {
        return (parseDate(xy2.referenceValue).getTime() - parseDate(xy1.referenceValue).getTime()) / denominator
      } catch (e) {
        return 0
      }
    default:
      return 0
  }
}

// By Justin C Round
// http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
/* eslint-disable */
export function checkLineIntersection (line1StartX: number, line1StartY: number,
  line1EndX: number, line1EndY: number,
  line2StartX: number, line2StartY: number,
  line2EndX: number, line2EndY: number): Position {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  let denominator; let a; let b; let numerator1; let numerator2; const result: Position = {
    xVal: 0,
    yVal: 0
  }
  denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY))
  if (denominator === 0) {
    throw new Error('Error')
  }
  a = line1StartY - line2StartY
  b = line1StartX - line2StartX
  numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b)
  // numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
  a = numerator1 / denominator
  // b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.xVal = line1StartX + (a * (line1EndX - line1StartX))
  result.yVal = line1StartY + (a * (line1EndY - line1StartY))

  // consider check?
  // if line1 is a segment and line2 is infinite, they intersect if:
  // if line2 is a segment and line1 is infinite, they intersect if:
  // if (!(a > 0 && a < 1) && !(b > 0 && b < 1)) {
  // console.log(result)
  //  throw new Error("Error")
  // }
  // if line1 and line2 are segments, they intersect if both of the above are true
  return result
}
/* eslint-enable */
