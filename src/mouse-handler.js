const { remote } = require('electron')
const NodeMouse = require('node-mouse')
const { handleScreenshotToText } = require('./screenshot-to-text-handler')

const offsetArea = 5
const { screen, app } = remote
const mouseEvent = new NodeMouse()

const selectedArea = document.getElementById('selected-area')

let coords = {}
let isRecording = false
let isSelectMode = false

mouseEvent.on('mousedown', () => {
  // tratar click fora do offset
  if (!coords.initial && isSelectMode && !isRecording) {
    const { x: xOffset, y: yOffset } = screen.getPrimaryDisplay().workArea

    coords.initial = screen.getCursorScreenPoint()
    selectedArea.style.left = `${coords.initial.x - xOffset}px`
    selectedArea.style.top = `${coords.initial.y - yOffset}px`
    setRecording()
  }

  if (isRecording) {
    configuraSelectedAreaWidth(screen.getCursorScreenPoint())
    configuraSelectedAreaHeight(screen.getCursorScreenPoint())
  }
})

mouseEvent.on('mouseup', async () => {
  if (!isSelectMode) {
    return
  }

  coords.final = getCurrentMousePositionNormalized(
    screen.getCursorScreenPoint()
  )

  if (isSelectedAreaSizeEnough()) {
    selectedArea.classList.add('loading')

    await handleScreenshotToText(coords)

    selectedArea.classList.remove('loading')

    setSelectModeOff()
  } else {
    delete coords.initial
    isRecording = false
  }
})

function getCurrentMousePositionNormalized(mousePosition) {
  return {
    x: mousePosition.x - offsetArea,
    y: mousePosition.y - offsetArea
  }
}

function configuraSelectedAreaWidth({ x }) {
  if (x < coords.initial.x) {
    selectedArea.style.left = `${x}px`
    selectedArea.style.width = `${coords.initial.x - x - offsetArea}px`
  } else {
    selectedArea.style.width = `${x - coords.initial.x - offsetArea}px`
  }
}

function configuraSelectedAreaHeight({ y }) {
  if (y < coords.initial.y) {
    selectedArea.style.top = `${y}px`
    selectedArea.style.height = `${coords.initial.y - y - offsetArea}px`
  } else {
    selectedArea.style.height = `${y - coords.initial.y - offsetArea}px`
  }
}

function setRecording() {
  selectedArea.style.display = 'block'
  isRecording = true
}

function setSelectModeOn() {
  isSelectMode = true
}

function setSelectModeOff() {
  isRecording = false
  isSelectMode = false
  selectedArea.style.display = 'none'
  coords = {}

  app.emit('hide-window')
}

function clearSelectedArea() {
  selectedArea.style.width = '0px'
  selectedArea.style.height = '0px'
}

function isSelectedAreaSizeEnough() {
  return (
    Math.abs(coords.initial.x - coords.final.x) > 15 &&
    Math.abs(coords.initial.y - coords.final.y) > 15
  )
}

app.on('show-select-area', () => {
  clearSelectedArea()
  setSelectModeOn()
})
