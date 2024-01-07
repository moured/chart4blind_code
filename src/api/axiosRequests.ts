import axios from 'axios'
import FormData from 'form-data'
import { v4 as uuidv4 } from 'uuid'

const REMOTE_URL: string = '/api/trans4line/'
const REMOTE_URL_SAVE: string = '/api/savechart/'

async function urlToBlob (url: string): Promise<Blob> {
  const response = await fetch(url)
  return await response.blob()
}
export const getRemoteData = async (objectUrl: string | undefined): Promise<[[{ x: number, y: number }]] | undefined> => {
  if (objectUrl === undefined) {
    throw new Error('No image selected')
  }
  const blob = await urlToBlob(objectUrl)
  const formData = new FormData()
  formData.append('file', blob, 'image.png')
  const r = await axios.post(REMOTE_URL, formData)
  return r.data // .replace(/'/g, '"')
}

export const axiosRemoteData = async (SVGData: string | undefined, CSVData: string, image: string): Promise<boolean> => {
  if (SVGData === undefined) throw new Error('SVG Data failed')
  const SVGBlob = new Blob([SVGData], { type: 'image/svg+xml;charset=utf-8' })
  const CSVBlob = new Blob([CSVData], { type: 'text/csv;charset=utf-8;' })
  const imageBlob = await urlToBlob(image)
  const formData = new FormData()
  formData.append('svg', SVGBlob, 'svgUserMade.svg')
  formData.append('csv', CSVBlob, 'csvUserPoint.txt')
  formData.append('image', imageBlob, 'image.png')
  const uuid = uuidv4()
  formData.append('uuid', uuid)
  const r = await axios.post(REMOTE_URL_SAVE, formData)
  return r.status === 200
}
