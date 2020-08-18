const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

const assetsFolder = path.resolve(__dirname, 'assets')

function onReady() {
  configureTray()

  const win = new BrowserWindow({
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
    alwaysOnTop: true
  })
  win.loadFile('index.html')

  app.on('show-select-area', () => {
    win.show()
    win.maximize()
  })

  app.on('hide-window', () => {
    win.hide()
  })
}

function configureTray() {
  const tray = new Tray(`${assetsFolder}/icon.jpg`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Get text from image',
      type: 'normal',
      click() {
        app.emit('show-select-area')
        tray.setContextMenu(contextMenu)
      }
    },
    {
      label: 'Minimize',
      type: 'normal',
      click: () => {
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
      click: () => app.exit()
    }
  ])

  tray.setToolTip('Screenshot to text')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => setTimeout(onReady, 100))
