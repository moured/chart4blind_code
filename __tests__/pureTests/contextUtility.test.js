import React from 'react'
import {
  deleteLine,
  getNextFreeNumber,
  handleLineAdd,
  lineExists
} from '../../src/charTypes/lineCharts/utilities/contextUtility'

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
describe('Context Utility lines', () => {
  let lines = []
  const setLines = (val) => {
    lines = val
  }
  it('deletes a line and selected line set to first', () => {
    deleteLine('Line 2', () => {}, 'Line 2', linesAll, setLines)
    expect(lines).toEqual(linesAll.slice(0, 1))
  })
  it('doesnt do anything if no line fÏound', () => {
    deleteLine('Linesdsdfsdfsdf', () => {}, 'Line 2', linesAll, setLines)
    expect(lines).toEqual(linesAll)
  })
  it('get line exists', () => {
    expect(lineExists('Line 1', linesAll)).toBeTruthy()
  })
  it('get line not exists', () => {
    expect(lineExists('Line asdasd', linesAll)).toBeFalsy()
  })
  it('adds a line', () => {
    const  {title} = handleLineAdd(linesAll, setLines)
    expect(title).toEqual('Line 3')
  })
})
describe('Next free line number', () => {
  it('get next free number', () => {
    const number = getNextFreeNumber(linesAll)
    expect(number).toEqual("3")
  })
})
