import React, { useEffect, useContext, useState } from 'react'
import * as d3 from 'd3'
import { type CoordinateText, type fontSizes, type Position, type PositionAxisID } from '../../../types'
import { scaleValueToCalibration } from '../../../globalUtilities/dotInteractionUtility'
import { ChartContext } from '../../../globalUtilities/chartContext'
import { ImageContext } from '../../../globalUtilities/imageContext'
import { ModeConfigurationContext } from '../../../globalUtilities/modeConfigurationContext'
import { parseDate } from '../../../globalUtilities/calculationUtility'
import { type LineType, type scaleTypes } from '../../../constants/chartTypes'
import { DEFAULT_FONTS } from '../../../constants/mainTypesDefaults'

const D3SVGView: React.FC = () => {
  const {
    imageHeight,
    imageWidth
  } = useContext(ImageContext)
  const {
    title,
    description,
    xTitle,
    yTitle,
    xAxisLabels,
    yAxisLabels,
    lines,
    X1,
    X2,
    Y1,
    Y2,
    scaleX,
    scaleY
  } = useContext(ChartContext)
  const { svgRef, accessibleMode, toggleOption } = useContext(ModeConfigurationContext)
  const [fontSize, setFontSize] = useState<fontSizes>(DEFAULT_FONTS)
  const [ticks, setTicks] = useState<number>(7)
  useEffect(() => {
    if (accessibleMode) {
      const scaleFactor = 4 / 3
      const newViewBoxWidth = imageWidth * scaleFactor
      const newViewBoxHeight = imageHeight * scaleFactor
      const viewBoxX = (imageWidth - newViewBoxWidth) / 2
      const viewBoxY = (imageHeight - newViewBoxHeight) / 2
      svgRef?.current?.setAttribute(
        'viewBox',
          `${viewBoxX} ${viewBoxY} ${newViewBoxWidth} ${newViewBoxHeight}`
      )
    } else {
      svgRef?.current?.setAttribute(
        'viewBox',
        `${0} ${0} ${imageWidth} ${imageHeight}`
      )
    }
  }, [accessibleMode])

  useEffect(() => {
    const ticksAccessible = 4
    const ticksOtherwise = 7
    setTicks(accessibleMode ? ticksAccessible : ticksOtherwise)
    const scaleToValWidth = 297 * 3.78
    const scaleToValHeight = 210 * 3.78
    const accessibleFontScaleApproxScale = Math.max(scaleToValHeight / imageHeight, scaleToValWidth / imageWidth) // this just hopes the image is about the size of the chart within it, the font will be around 36 but not perfect
    setFontSize(accessibleMode
      ? {
          titleFont: 36 * 2.28 / accessibleFontScaleApproxScale,
          description: 36 * 2.28 / accessibleFontScaleApproxScale,
          labelFont: 36 * 2.28 / accessibleFontScaleApproxScale,
          textFont: 36 * 2.28 / accessibleFontScaleApproxScale
        }
      : DEFAULT_FONTS)
  }, [accessibleMode])
  // credit to https://d3-graph-gallery.com/graph/line_basic.html official D3 examples and the visual inspiration from Chartjs and stackoverflow for research
  const drawChart = (): void => {
    const tickAmountAuto = 9
    if (svgRef === undefined) return
    const datasets: Array<{ label: string, data: CoordinateText[], lineType: LineType }> = lines.map((line, index) => {
      const data: CoordinateText[] = line.dataPoints.map(point => {
        const adjustedPosition: Position = scaleValueToCalibration({
          xVal: point.xVal,
          yVal: point.yVal
        }, X1, X2, Y1, Y2, scaleX, scaleY)
        return {
          xVal: adjustedPosition.xVal,
          yVal: adjustedPosition.yVal,
          text: point.desc
        }
      })
      return {
        label: `${line.title} ${index + 1}`,
        data,
        lineType: line.lineType
      }
    })
    let allData: CoordinateText[] = []
    datasets.forEach(dataset => {
      allData = allData.concat(dataset.data)
    })
    if (allData.length === 0) {
      return
    }
    const xAxisPos = (X1.yVal + X2.yVal) / 2
    const yAxisPos = (Y1.xVal + Y2.xVal) / 2
    const drawBoxAround = (textElement: any, factor?: number): void => {
      const node = textElement.node()
      if (!(node instanceof SVGTextElement)) return
      if (accessibleMode) {
        const bbox = node.getBBox()
        const adjustedFactor = factor === undefined ? 1.1 : factor
        const newWidth = bbox.width * adjustedFactor
        const newX = bbox.x + (bbox.width - newWidth) / 2

        svg.append('rect')
          .attr('x', newX)
          .attr('y', bbox.y - bbox.height * 0.025)
          .attr('width', newWidth)
          .attr('height', bbox.height * 1.05)
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 1)
      }
    }

    const svg = d3.select(svgRef.current)
      .attr('width', imageWidth)
      .attr('height', imageHeight)
      .style('overflow', 'visible')
      .attr('data-desc', description)

    svg.selectAll('*').remove()

    const createScale = (range: [number, number], scale: scaleTypes, accessor: (d: Position) => string, axisLabels: PositionAxisID[]): d3.ScaleTime<number, number> | d3.ScaleLogarithmic<number, number> | d3.ScaleLinear<number, number> => {
      let minValue: number
      let maxValue: number
      if (axisLabels.length > 1) {
        if (scale === 'time') {
          try {
            minValue = d3.min(axisLabels, (d: PositionAxisID) => parseDate(d.text).getTime()) ?? 0
            maxValue = d3.max(axisLabels, (d: PositionAxisID) => parseDate(d.text).getTime()) ?? 0
          } catch (e) {
            minValue = 0
            maxValue = 0
          }
        } else {
          minValue = d3.min(axisLabels, (d: PositionAxisID) => Number(d.text)) ?? 0
          maxValue = d3.max(axisLabels, (d: PositionAxisID) => Number(d.text)) ?? 0
        }
      } else {
        minValue = d3.min(allData, (d) => Number(accessor(d))) ?? 0
        maxValue = d3.max(allData, (d) => Number(accessor(d))) ?? 0
      }

      switch (scale) {
        case 'linear':
          return d3.scaleLinear()
            .domain([minValue, maxValue])
            .rangeRound(range)
        case 'logarithmic':
          return d3.scaleLog()
            .domain([minValue > 0 ? minValue : 0.1, maxValue])
            .rangeRound(range)
        case 'time':
          // eslint-disable-next-line no-case-declarations
          let timeExtent
          if (axisLabels.length > 1) {
            try {
              timeExtent = d3.extent(axisLabels, (d: PositionAxisID) => parseDate(d.text).getTime())
            } catch (e) {
              timeExtent = d3.extent(allData, (d: Position) => Number(accessor(d)))
            }
          } else {
            timeExtent = d3.extent(allData, (d: Position) => Number(accessor(d)))
          }
          if (timeExtent[0] === undefined) throw new Error('Failed creating chart due to undefined values in the dataset.')
          return d3.scaleTime()
            .domain(timeExtent)
            .range(range)
        default:
          throw new Error('Something went wrong creating chart')
      }
    }

    let xScale: d3.ScaleTime<number, number> | d3.ScaleLogarithmic<number, number> | d3.ScaleLinear<number, number>
    let yScale: d3.ScaleTime<number, number> | d3.ScaleLogarithmic<number, number> | d3.ScaleLinear<number, number>
    if (xAxisLabels.length > 1) {
      const minValue = d3.min(xAxisLabels, (d: PositionAxisID) => d.coordinate) ?? 0
      const maxValue = d3.max(xAxisLabels, (d: PositionAxisID) => d.coordinate) ?? 0
      xScale = createScale([minValue, maxValue], scaleX, (d: Position) => d.xVal.toString(10), xAxisLabels)
    } else {
      xScale = createScale([yAxisPos, imageWidth], scaleX, (d: Position) => d.xVal.toString(10), xAxisLabels)
    }
    if (yAxisLabels.length > 1) {
      const minValue = d3.min(yAxisLabels, (d: PositionAxisID) => d.coordinate) ?? 0
      const maxValue = d3.max(yAxisLabels, (d: PositionAxisID) => d.coordinate) ?? 0
      yScale = createScale([maxValue, minValue], scaleY, (d: Position) => d.yVal.toString(10), yAxisLabels)
    } else {
      yScale = createScale([xAxisPos, 0], scaleY, (d: Position) => d.yVal.toString(10), yAxisLabels)
    }
    const line = d3.line<Position>()
      .x(d => xScale(d.xVal))
      .y(d => yScale(d.yVal))

    //  x axis labels
    let xTextPosition = -Infinity
    let adjustedXLabels = xAxisLabels
    if (!(xAxisLabels.length > 1)) {
      if (scaleX === 'time') {
        const timeScale = xScale as d3.ScaleTime<number, number>
        const timeFormat = d3.timeFormat('%Y')
        adjustedXLabels = timeScale.ticks(tickAmountAuto).map(tick => {
          return {
            text: timeFormat(tick),
            coordinate: timeScale(tick),
            id: 'tick-' + timeFormat(tick)
          }
        })
      } else {
        adjustedXLabels = xScale.ticks(tickAmountAuto).map(tick => {
          let format
          if (tick < 1 && tick > -1) {
            format = d3.format('.2f')
          } else if (tick < 3 && tick > -3) {
            format = d3.format('.1f')
          } else {
            format = d3.format('.0f')
          }
          return {
            text: format(tick),
            coordinate: xScale(tick),
            id: 'tick-' + format(tick)
          }
        })
      }
    }
    svg.append('line')
      .attr('x1', yAxisPos)
      .attr('x2', imageWidth)
      .attr('y1', xAxisPos)
      .attr('y2', xAxisPos)
      .style('stroke', accessibleMode ? 'black' : '#aeaeb4')
      .attr('stroke-width', 2.5)
    if (adjustedXLabels.length > ticks) {
      const stepSize = Math.ceil(adjustedXLabels.length / ticks)
      adjustedXLabels = adjustedXLabels.filter((_, i) => i % stepSize === 0)
      while (adjustedXLabels.length > ticks) {
        adjustedXLabels.pop()
      }
    }

    svg.selectAll('line.x')
      .data(adjustedXLabels)
      .enter()
      .append('line')
      .attr('class', 'xLineX')
      .attr('x1', (d) => d.coordinate)
      .attr('x2', (d) => d.coordinate)
      .attr('y1', xAxisPos)
      .attr('y2', xAxisPos + 10)
      .style('stroke', accessibleMode ? 'black' : '#aeaeb4')
      .attr('stroke-width', 2)
    svg.selectAll('text.x')
      .data(adjustedXLabels)
      .enter()
      .append('text')
      .attr('class', 'x')
      .attr('x', (d) => d.coordinate)
      .attr('y', xAxisPos + 10 + fontSize.labelFont)
      .attr('text-anchor', 'middle')
      .style('font-size', fontSize.description)
      .text((d) => d.text.toString())
    d3.selectAll('text.x')
      .each((d, i, nodes) => {
        const textElement = d3.select(nodes[i])
        drawBoxAround(textElement)
        const node = textElement.node()
        if (!(node instanceof SVGTextElement)) return
        if (textElement.empty()) return
        const textHeight = node.getBBox().height
        const bottomMostText = Number(textElement.attr('y')) + textHeight
        if (bottomMostText > xTextPosition) xTextPosition = bottomMostText
      })

    let yTextPosition: number = Infinity
    // y axis label
    let adjustedYLabels = yAxisLabels
    if (!(yAxisLabels.length > 1)) {
      adjustedYLabels = []
      if (scaleY === 'time') {
        const timeScale = yScale as d3.ScaleTime<number, number>
        const timeFormat = d3.timeFormat('%Y')
        adjustedYLabels = timeScale.ticks(tickAmountAuto).map(tick => {
          return {
            text: timeFormat(tick),
            coordinate: timeScale(tick),
            id: 'tick-' + timeFormat(tick)
          }
        })
      } else {
        adjustedYLabels = yScale.ticks(tickAmountAuto).map(tick => {
          let format
          if (tick < 1 && tick > -1) {
            format = d3.format('.2f')
          } else if (tick < 3 && tick > -3) {
            format = d3.format('.1f')
          } else {
            format = d3.format('.0f')
          }
          return {
            text: format(tick),
            coordinate: yScale(tick),
            id: 'tick-' + format(tick)
          }
        })
      }
    }
    svg.append('line')
      .attr('x1', yAxisPos)
      .attr('x2', yAxisPos)
      .attr('y1', 0)
      .attr('y2', xAxisPos)
      .style('stroke', accessibleMode ? 'black' : '#aeaeb4')
      .attr('stroke-width', 2.5)
    if (adjustedYLabels.length > ticks) {
      const stepSize = Math.ceil(adjustedYLabels.length / ticks)
      adjustedYLabels = adjustedYLabels.filter((_, i) => i % stepSize === 0)
      while (adjustedYLabels.length > ticks) {
        adjustedYLabels.pop()
      }
    }
    svg.selectAll('line.y')
      .data(adjustedYLabels)
      .enter()
      .append('line')
      .attr('class', 'y')
      .attr('x1', yAxisPos)
      .attr('x2', yAxisPos - 9)
      .attr('y1', (d) => d.coordinate)
      .attr('y2', (d) => d.coordinate)
      .style('stroke', accessibleMode ? 'black' : '#aeaeb4')
      .attr('stroke-width', 2)
    svg.selectAll('text.y')
      .data(adjustedYLabels)
      .enter()
      .append('text')
      .attr('class', 'y')
      .attr('x', yAxisPos - 15) //
      .attr('y', (d) => d.coordinate + fontSize.labelFont / 2 - fontSize.labelFont * 0.1)
      .attr('text-anchor', 'end')
      .style('font-size', fontSize.textFont)
      .text((d) => d.text.toString())
    d3.selectAll('text.y')
      .each((d, i, nodes) => {
        const textElement = d3.select(nodes[i])
        const node = textElement.node()
        if (!(node instanceof SVGTextElement)) return
        if (accessibleMode) {
          drawBoxAround(textElement)
        }
        if (textElement.empty()) return
        const textWidth = node.getBBox().width
        const leftMostText = Number(textElement.attr('x')) - textWidth - 10
        if (leftMostText < yTextPosition) yTextPosition = leftMostText
      })

    // lines and description
    datasets.forEach((dataset, index) => {
      svg.append('path')
        .datum(dataset.data)
        .attr('fill', 'none')
        .attr('stroke', accessibleMode ? 'black' : 'rgb(24,169,153)') // dataset.color
        .attr('stroke-width', dataset.lineType.width)
        .style('stroke-dasharray', dataset.lineType.dashWidth)
        .attr('d', line)
        .attr('data-desc', dataset.label)
        .each(function () {
          d3.select(this)
            .attr('id', 'step47')
        })
      const group = svg.append('g').attr('class', `group${index}`)

      group.selectAll('circle')
        .data(dataset.data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.xVal))
        .attr('cy', d => yScale(d.yVal))
        .attr('r', 0.1)
        .style('fill', accessibleMode ? 'black' : 'rgba(24,169,153, 0)')
        .attr('stroke', accessibleMode ? 'black' : 'rgba(24,169,153, 0)') // dataset.color
        .attr('stroke-width', 0.1)

      dataset.data.forEach((d: CoordinateText, _) => {
        if (d.text !== undefined && d.text !== '') {
          const element = group.append('text')
            .attr('y', yScale(d.yVal) - 20)
            .style('font-size', fontSize.description)
            .text(d.text.toString())
            .attr('x', xScale(d.xVal))
            .attr('text-anchor', 'middle')
            .each(function () {
              d3.select(this)
                .attr('id', 'step75')
            })
          drawBoxAround(element)
          group.append('circle')
            .attr('cx', xScale(d.xVal))
            .attr('cy', yScale(d.yVal))
            .attr('r', 5)
            .style('fill', accessibleMode ? 'black' : 'rgba(24,169,153)')
        }
      })
    })

    // Titles and axis information
    const xTitleElement = svg.append('text')
      .style('font-size', fontSize.labelFont)
      .attr('data-desc', 'X Axis Title')
      .style('text-anchor', 'middle')
      .text(xTitle)
      .attr('x', imageWidth / 2)
      .attr('y', xTextPosition)
      .each(function () {
        d3.select(this)
          .attr('id', 'step45')
      })

    const mainTitleElement = svg.append('text')
      .style('font-size', fontSize.titleFont)
      .attr('data-desc', 'Title')
      .attr('text-anchor', accessibleMode ? 'start' : 'middle')
      .text(title)
      .each(function () {
        d3.select(this)
          .attr('id', 'step46')
      })

    if (accessibleMode) {
      mainTitleElement.attr('x', -fontSize.description / 2)
        .attr('y', -fontSize.titleFont * 2)

      drawBoxAround(mainTitleElement, 1.05)
      // Y Title top
      const yTitleElement = svg.append('text')
        .style('font-size', fontSize.titleFont)
        .attr('data-desc', 'Y-Axis-Title')
        .style('text-anchor', 'middle')
        .attr('x', yAxisPos)
        .text(yTitle)
      let node = yTitleElement.node()
      if (node === null) return
      yTitleElement.attr('x', yAxisPos)
        .attr('y', -fontSize.titleFont / 1.65)
      drawBoxAround(yTitleElement, 1.05)
      node = xTitleElement.node()
      if (node === null) return
      xTitleElement.attr('x', imageWidth / 2)
        .attr('y', xTextPosition + fontSize.labelFont * 0.25)
      drawBoxAround(xTitleElement, 1.05)
    }
    if (!accessibleMode) {
      // Y-title normal
      svg.append('text')
        .style('text-anchor', 'middle')
        .style('font-size', fontSize.labelFont)
        .attr('data-desc', 'Y Axis Title')
        .attr('x', 0)
        .attr('y', 0)
        .text(yTitle)
        .attr('transform', `translate(${yTextPosition}, ${xTextPosition / 2}) rotate(-90)`)
      mainTitleElement
        .attr('x', imageWidth / 2)
        .attr('y', -fontSize.titleFont)
        .style('text-decoration', 'underline')
    }
  }

  useEffect(() => {
    drawChart()
  }, [title, xTitle, yTitle, xAxisLabels, yAxisLabels, lines, X1, X2, Y1, Y2, scaleX, scaleY, fontSize, ticks, accessibleMode, toggleOption])
  return (<div id='step25' data-description='SVG D3 Made'>
    <div id='step9'>
    {
        (X1.referenceValue === '' ||
        X2.referenceValue === '' ||
        Y1.referenceValue === '' ||
        Y2.referenceValue === '')
          ? <div className="flex w-full justify-center items-center text-charcoal">
        Calibrate your axes by adding reference values in the properties tab first!
      </div>
          : <div style={{ margin: 10 }}>
          <svg ref={svgRef}>
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </div>
  }
    </div>
      </div>
  )
}

export default D3SVGView
