const { remote } = require('electron')
const NodeMouse = require('node-mouse')
const { handleScreenshotToTextArea } = require('./screenshot')

const { screen } = remote
const mouseEvent = new NodeMouse()

mouseEvent.on('mousedown', event => {
  if (event.xDelta === 0 && event.yDelta === 0) {
    console.log(screen.getCursorScreenPoint())
  }
})

mouseEvent.on('mouseup', event => {
  if (event.xDelta === 0 && event.yDelta === 0) {
    console.log(screen.getCursorScreenPoint())

    handleScreenshotToTextArea()
  }
})
