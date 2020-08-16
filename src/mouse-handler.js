const { remote } = require('electron')
const NodeMouse = require('node-mouse')
const { handleScreenshotToImage } = require('./screenshot')

const { screen } = remote
const mouseEvent = new NodeMouse()

const selectedArea = document.getElementById('selected-area')
const body = document.getElementsByTagName('body')[0]

const coords = {}
let isRecording = false
let isSelectMode = false

mouseEvent.on('mousedown', () => {
  if (!coords.initial && isSelectMode && !isRecording) {
    const { x: xOffset, y: yOffset } = screen.getPrimaryDisplay().workArea

    coords.initial = screen.getCursorScreenPoint()
    selectedArea.style.left = `${coords.initial.x - xOffset}px`
    selectedArea.style.top = `${coords.initial.y - yOffset}px`

    isRecording = true
  }

  if (isRecording) {
    configuraSelectedAreaWidth(screen.getCursorScreenPoint())
    configuraSelectedAreaHeight(screen.getCursorScreenPoint())
  }
})

mouseEvent.on('mouseup', event => {
  if (event.xDelta === 0 && event.yDelta === 0 && isSelectMode) {
    coords.final = screen.getCursorScreenPoint()
    setSelectModeOff()
    handleScreenshotToImage(coords)
  }
})

function configuraSelectedAreaWidth({ x }) {
  if (x < coords.initial.x) {
    selectedArea.style.left = `${x}px`
    selectedArea.style.width = `${coords.initial.x - x}px`
  } else {
    selectedArea.style.width = `${x - coords.initial.x}px`
  }
}

function configuraSelectedAreaHeight({ y }) {
  if (y < coords.initial.y) {
    selectedArea.style.top = `${y}px`
    selectedArea.style.height = `${coords.initial.y - y}px`
  } else {
    selectedArea.style.height = `${y - coords.initial.y}px`
  }
}

function setSelectModeOn() {
  clearSelectedArea()

  isSelectMode = true
  body.classList.add('select-mode')
  selectedArea.style.display = 'block'
}

function setSelectModeOff() {
  isRecording = false
  isSelectMode = false
  body.classList.remove('select-mode')
  selectedArea.style.display = 'none'
}

function clearSelectedArea() {
  selectedArea.style.width = '0px'
  selectedArea.style.height = '0px'
}

exports.setSelectModeOn = setSelectModeOn
exports.setSelectModeOff = setSelectModeOff
