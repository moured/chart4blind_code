import { calculatePositionOnPage, parseDate } from '../../src/globalUtilities/calculationUtility'

describe('parses Dates', () => {
  it('get invalid dates', () => {
    expect(() => parseDate('12312312312')).toThrow()
    expect(() => parseDate('12.3123.12312')).toThrow()
    expect(() => parseDate('15.13.2019')).toThrow()
    expect(() => parseDate('15,09.2019')).toThrow()
  })
  it('gets valid dates', () => {
    expect(parseDate('19.02.2001')).toEqual(new Date('2001-02-18T23:00:00.000Z'))
  })
})
describe('position on page', () => {
  it('should calc pos on page', () => {
    const event = {
      clientX: 100,
      clientY: 100,
    }
    const localSvgRef = {
      current: {
        getBoundingClientRect: () => ({
          left: 10,
          top: 10,
          width: 50,
        }),
        parentNode: {
          getBoundingClientRect: () => ({
            width: 80,
          })
        }
      }
    }
    const expectedPosition = {
      xVal: event.clientX - localSvgRef.current.getBoundingClientRect().left - (localSvgRef.current.parentNode.getBoundingClientRect().width - localSvgRef.current.getBoundingClientRect().width) / 2,
      yVal: event.clientY - localSvgRef.current.getBoundingClientRect().top,
    }
    const result = calculatePositionOnPage(localSvgRef, event)
    expect(result).toEqual(expectedPosition)
  })
})

