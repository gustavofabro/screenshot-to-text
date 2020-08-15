const { remote } = require('electron')
const NodeMouse = require('node-mouse')
const { handleScreenshotToTextArea } = require('./screenshot')

const { screen } = remote
const mouseEvent = new NodeMouse()

const coords = {}
let isRecording = false

mouseEvent.on('mousedown', event => {
  if (event.xDelta === 0 && event.yDelta === 0 && isRecording) {
    coords.initial = screen.getCursorScreenPoint()
  }
})

mouseEvent.on('mouseup', event => {
  if (event.xDelta === 0 && event.yDelta === 0 && isRecording) {
    coords.final = screen.getCursorScreenPoint()
    isRecording = false
    handleScreenshotToTextArea(coords)
  }
})

exports.initRecording = () => {
  isRecording = true
}
