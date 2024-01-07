import {
  addPointLine, checkLineIntersection, getAvailableLineType, getLineFromKey, getScaleFactor,
  movePointOfLine,
  removePointLine, scaleValueToCalibration, updateLineType, updatePointLine,
  updateTitleLine
} from '../../src/globalUtilities/dotInteractionUtility'
import { allLineTypesArr } from '../../src/constants/chartTypes'

const linesAll = [
  {
    key: 'Line 1',
    title: 'New Line 1',
    dataPoints: [{
      key: 'point 1',
      xVal: 100,
      yVal: 100,
    },
      {
        key: 'point 2',
        xVal: 200,
        yVal: 200,
      },
      {
        key: 'point 3',
        xVal: 300,
        yVal: 300,
      }],
    lineType: 'Straight Line 2'
  },
  {
    key: 'Line 2',
    title: 'New Line 2',
    dataPoints: [{
      key: 'point 1',
      xVal: 100,
      yVal: 150,
    },
      {
        key: 'point 2',
        xVal: 200,
        yVal: 250,
      },
      {
        key: 'point 3',
        xVal: 30,
        yVal: 350,
      }],
    lineType: 'Straight Line 3'
  },
]
describe('Line and Point operations', () => {
  let lines = [...linesAll]
  const setLines = (val) => {
    lines = val
  }

  it('adds point to line', () => {
    const newPoint = {key: 'point 4', xVal: 400, yVal: 400}
    addPointLine(newPoint, 'Line 1', lines, setLines)
    expect(lines[0].dataPoints).toContain(newPoint)
  })

  it('removes point from line', () => {
    const pointToRemove = lines[0].dataPoints[0]
    removePointLine(pointToRemove, 'Line 1', lines, setLines)
    expect(lines[0].dataPoints).not.toContain(pointToRemove)
  })

  it('moves point line', () => {
    const newPos = {xVal: 500, yVal: 500}
    movePointOfLine(newPos, 'point 2', 'Line 1', setLines, [...linesAll])
    expect(lines[0].dataPoints[1]).toEqual({...newPos, key: 'point 2'})
  })

  it('updates title of line', () => {
    updateTitleLine('Updated Line 1', 'Line 1', setLines, lines)
    expect(lines[0].title).toEqual('Updated Line 1')
  })

  it('updates line type', () => {
    updateLineType('Straight Line 3', 'Line 1', setLines, lines)
    expect(lines[0].lineType).toEqual(allLineTypesArr[2])
  })

  it('gets an available line type', () => {
    const availableLineType = getAvailableLineType(lines)
    expect(allLineTypesArr).toContain(availableLineType)
  })

  it('updates point of a line', () => {
    const updatedPoint = {key: 'point 2', xVal: 600, yVal: 600}
    updatePointLine(updatedPoint, 'Line 1', setLines, [...linesAll])
    expect(lines[0].dataPoints[1]).toEqual(updatedPoint)
  })

  it('gets a line from its key', () => {
    const line = getLineFromKey('Line 1', lines)
    expect(line).toEqual(lines[0])
  })
})

describe('scaleValueToCalibration', () => {
  it('returns (0, 0) for missing calibrations', () => {
    const value = { xVal: 100, yVal: 200 }
    expect(scaleValueToCalibration(value, undefined, undefined, undefined, undefined, 'linear', 'linear')).toEqual({ xVal: 0, yVal: 0 })
  })

  it('returns (0, 0) for missing or NaN reference vals', () => {
    const value = { xVal: 100, yVal: 200 }
    const calibration = { referenceValue: 'not a number', xVal: 0, yVal: 0 }
    expect(scaleValueToCalibration(value, calibration, calibration, calibration, calibration, 'linear', 'linear')).toEqual({ xVal: 0, yVal: 0 })
  })

  it('handles linear scale right', () => {
    const value = { xVal: 200, yVal: 200 }
    const X1 = { referenceValue: '0', xVal: 0, yVal: 0 }
    const X2 = { referenceValue: '100', xVal: 200, yVal: 0 }
    const Y2 = { referenceValue: '100', xVal: 0, yVal: 0 }
    const Y1 = { referenceValue: '0', xVal: 0, yVal: 200 }
    expect(scaleValueToCalibration(value, X1, X2, Y1, Y2, 'linear', 'linear')).toEqual({ xVal: 100, yVal: 0 })
  })

  it('handles logarithmic scale right', () => {
    const value = { xVal: 100, yVal: 200 }
    const X1 = { referenceValue: '1', xVal: 0, yVal: 0 }
    const X2 = { referenceValue: '100', xVal: 200, yVal: 0 }
    const Y2 = { referenceValue: '100', xVal: 0, yVal: 0 }
    const Y1 = { referenceValue: '0', xVal: 0, yVal: 200 }
    expect(scaleValueToCalibration(value, X1, X2, Y1, Y2, 'logarithmic', 'logarithmic')).toEqual({ xVal: 10, yVal: 0 })
  })

  it('handles time scale rightX', () => {
    const value = { xVal: 100, yVal: 200 }
    const X1 = { referenceValue: '2000', xVal: 0, yVal: 200 }
    const X2 = { referenceValue: '2020', xVal: 200, yVal: 200 }
    const Y2 = { referenceValue: '100', xVal: 0, yVal: 0 }
    const Y1 = { referenceValue: '0', xVal: 0, yVal: 200 }
    expect(scaleValueToCalibration(value, X1, X2, Y1, Y2, 'time', 'linear')).toEqual({ xVal: 1262257200000, yVal: 0 })
  })
  it('handles time scale rightY', () => {
    const value = { xVal: 0, yVal: 100 }
    const X1 = { referenceValue: '0', xVal: 0, yVal: 200 }
    const X2 = { referenceValue: '100', xVal: 200, yVal: 200 }
    const Y2 = { referenceValue: '2020', xVal: 0, yVal: 0 }
    const Y1 = { referenceValue: '2000', xVal: 0, yVal: 200 }
    expect(scaleValueToCalibration(value, X1, X2, Y1, Y2, 'linear', 'time')).toEqual({ xVal: 0, yVal: 1262257200000 })
  })
})
describe('getScaleFactor', () => {
  it('correct scale factor linear scale', () => {
    const xy1 = { referenceValue: '0', xVal: 0, yVal: 0 }
    const xy2 = { referenceValue: '100', xVal: 200, yVal: 200 }
    expect(getScaleFactor('x', 'linear', xy1, xy2)).toEqual(0.5)
    expect(getScaleFactor('y', 'linear', xy1, xy2)).toEqual(0.5)
  })

  it('correct scale factor logarithmic scale', () => {
    const xy1 = { referenceValue: '1', xVal: 0, yVal: 0 }
    const xy2 = { referenceValue: '100', xVal: 200, yVal: 200 }
    expect(getScaleFactor('x', 'logarithmic', xy1, xy2)).toBeCloseTo(0.01, 2)
    expect(getScaleFactor('y', 'logarithmic', xy1, xy2)).toBeCloseTo(0.01, 2)
  })

  it('correct scale factor time scale', () => {
    const xy1 = { referenceValue: '2000', xVal: 0, yVal: 0 }
    const xy2 = { referenceValue: '2020', xVal: 200, yVal: 200 }
    expect(getScaleFactor('x', 'time', xy1, xy2)).toBeCloseTo(3155760000, 2)
    expect(getScaleFactor('y', 'time', xy1, xy2)).toBeCloseTo(3155760000, 2)
  })

  it('0 for undefined scale', () => {
    const xy1 = { referenceValue: '0', xVal: 0, yVal: 0 }
    const xy2 = { referenceValue: '100', xVal: 200, yVal: 200 }
    expect(getScaleFactor('x', 'randomVal', xy1, xy2)).toEqual(0)
    expect(getScaleFactor('y', 'randomVal', xy1, xy2)).toEqual(0)
  })
})

describe('checkLineIntersection', () => {
  it('returns intersection for intersecting lines', () => {
    expect(checkLineIntersection(0, 0, 10, 10, 0, 10, 10, 0)).toEqual({ xVal: 5, yVal: 5 })
  })

  it('throws error for non intersecing', () => {
    expect(() => checkLineIntersection(0, 0, 10, 0, 0, 10, 10, 10)).toThrowError('Error')
  })
})
