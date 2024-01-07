const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.window = {
  innerHeight: 768,
  innerWidth: 1024
}
global.Image = class {
  onload = jest.fn()
  src = ''
  naturalWidth = 400
  naturalHeight = 500
}
global.URL.createObjectURL = jest.fn()

