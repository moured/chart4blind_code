import { type PositionCalibration, type Line, type Position } from '../types'
import { scaleValueToCalibration } from '../globalUtilities/dotInteractionUtility'
import { type scaleTypes } from './chartTypes'

const getMinMax = (lines: Line[], compareProperty: 'xVal' | 'yVal'): [Position, Position] => {
  let min: Position = { xVal: Infinity, yVal: -Infinity }
  let max: Position = { xVal: -Infinity, yVal: Infinity }
  lines.forEach(line => {
    line.dataPoints.forEach(dataPoint => {
      if (compareProperty === 'xVal') {
        if (dataPoint[compareProperty] < min[compareProperty]) min = dataPoint
        if (dataPoint[compareProperty] > max[compareProperty]) max = dataPoint
      }
      if (compareProperty === 'yVal') {
        if (dataPoint[compareProperty] > min[compareProperty]) min = dataPoint
        if (dataPoint[compareProperty] < max[compareProperty]) max = dataPoint
      }
    })
  })
  return [min, max]
}

const dateFormatter = (scale: scaleTypes, val: number): string => {
  return scale === 'time'
    ? new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
    : val.toFixed(2).toString()
}

const textTemplate = {
  en: `The graphic depicts a line chart titled "{title}".
The x-axis is labeled "{x-label}" and displays values from {x-min} to {x-max}. The y-axis is labeled "{y-label}" and ranges from {y-min} to {y-max}.
The chart features {#lines} plots, titled {lineTitles}.`,
  de: `Die Abbildung zeigt ein Liniendiagramm mit dem Titel "{title}".
Die x-Achse trägt die Beschriftung "{x-label}" und zeigt Werte von {x-min} bis {x-max}. Die y-Achse trägt die Beschriftung "{y-label}" und wird von {y-min} bis {y-max} angezeigt.
Das Diagramm enthält {#lines} Plots, betitelt mit {lineTitles}.`
}

export const genGapText = (
  title: string, xAxisTitle: string, yAxisTitle: string,
  scaleX: scaleTypes, scaleY: scaleTypes, lines: Line[],
  X1: PositionCalibration | undefined, X2: PositionCalibration | undefined,
  Y1: PositionCalibration | undefined, Y2: PositionCalibration | undefined,
  lang: 'en' | 'de'
): string => {
  let gapText = textTemplate[lang]

  const [minX, maxX] = getMinMax(lines, 'xVal').map(pt => scaleValueToCalibration(pt, X1, X2, Y1, Y2, scaleX, scaleY))
  const [minY, maxY] = getMinMax(lines, 'yVal').map(pt => scaleValueToCalibration(pt, X1, X2, Y1, Y2, scaleX, scaleY))

  gapText = gapText.replace('{title}', title)
    .replace('{caption}', 'Some caption')
    .replace('{x-label}', xAxisTitle)
    .replace('{y-label}', yAxisTitle)
    .replace('{x-min}', dateFormatter(scaleX, minX.xVal))
    .replace('{x-max}', dateFormatter(scaleX, maxX.xVal))
    .replace('{y-min}', dateFormatter(scaleY, minY.yVal))
    .replace('{y-max}', dateFormatter(scaleY, maxY.yVal))
    .replace('{#lines}', lines.length.toString())
    .replace('{lineTitles}', lines.map((val: Line) => `"${val.title}"`).join(', '))

  const lineTextTemplate = {
    en: '"{lineX}" starts at ({startX} | {startY}). It reaches a global maximum at ({maxX} | {maxY}), a global minimum at ({minX} | {minY}) and ends at ({endX} | {endY}).',
    de: '“{lineX}” startet im Punkt ({startX} | {startY}). Sie erreicht ein globales Maximum bei ({maxX} | {maxY}), ein globales Minimum bei ({minX} | {minY}) und endet im Punkt ({endX} | {endY}).'
  }
  const pointsExists = {
    en: ' Additionally, the following plot points of "{lineX}" carry a label:',
    de: ' Des Weiteren gibt es an folgenden Punkten der Linie eine Beschriftung:'
  }
  const pointTextTemplate = {
    en: 'The plot point at ({pointX} | {pointY}) is labeled "{label}".',
    de: 'Der Punkt mit Koordinate ({pointX} | {pointY}) trägt die Beschriftung “{label}”.'
  }

  lines.forEach((line) => {
    if (line.dataPoints.length <= 1) return
    const startY = scaleValueToCalibration(line.dataPoints[0], X1, X2, Y1, Y2, scaleX, scaleY)
    const endY = scaleValueToCalibration(line.dataPoints[line.dataPoints.length - 1], X1, X2, Y1, Y2, scaleX, scaleY)
    const [minY, maxY] = getMinMax([line], 'yVal').map(pt => scaleValueToCalibration(pt, X1, X2, Y1, Y2, scaleX, scaleY))
    const [minX, maxX] = getMinMax([line], 'xVal').map(pt => scaleValueToCalibration(pt, X1, X2, Y1, Y2, scaleX, scaleY))

    let lineText = lineTextTemplate[lang]

    lineText = lineText.replace('{lineX}', line.title)
      .replace('{startX}', dateFormatter(scaleX, startY.xVal))
      .replace('{startY}', dateFormatter(scaleY, startY.yVal))
      .replace('{maxX}', dateFormatter(scaleX, maxX.xVal))
      .replace('{maxY}', dateFormatter(scaleY, maxY.yVal))
      .replace('{minX}', dateFormatter(scaleX, minX.xVal))
      .replace('{minY}', dateFormatter(scaleY, minY.yVal))
      .replace('{endX}', dateFormatter(scaleX, endY.xVal))
      .replace('{endY}', dateFormatter(scaleY, endY.yVal))

    let added = false
    line.dataPoints.forEach(point => {
      const adjustedPosition = scaleValueToCalibration(point, X1, X2, Y1, Y2, scaleX, scaleY)
      if (point.desc === undefined) return
      if (!added) {
        lineText += pointsExists[lang]
        lineText = lineText.replace('{lineX}', line.title)
        added = true
      }
      let pointText = pointTextTemplate[lang]
      pointText = pointText.replace('{pointX}', dateFormatter(scaleX, adjustedPosition.xVal))
        .replace('{pointY}', dateFormatter(scaleY, adjustedPosition.yVal))
        .replace('{label}', point.desc)
      lineText += '\n' + pointText
    })
    gapText += '\n' + lineText
  })

  return gapText
}
