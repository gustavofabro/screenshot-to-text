const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

const assetsFolder = path.resolve(__dirname, 'assets')

let tray
let win

function onReady() {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    center: true,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    alwaysOnTop: true
  })

  win.loadFile('index.html')

  configureTray()
  configureEvents()
}

function configureEvents() {
  app.on('show-select-area', () => {
    win.show()
    win.maximize()
  })

  app.on('hide-window', () => {
    win.hide()
  })

  app.on('capture-finished-success', () => {})

  app.on('capture-finished-fail', () => {})
}

function configureTray() {
  tray = new Tray(`${assetsFolder}/icon-default.png`)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Get text from image',
      type: 'normal',
      click() {
        app.emit('show-select-area')
        tray.setImage(`${assetsFolder}/icon-default.png`)
        tray.setContextMenu(contextMenu)
      }
    },
    {
      label: 'Minimize',
      type: 'normal',
      click() {
        app.emit('hide-window')
        tray.setContextMenu(contextMenu)
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.exit()
      }
    }
  ])

  tray.setToolTip('Screenshot to text')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => setTimeout(onReady, 300))
