const { app, BrowserWindow } = require('electron')

function onReady() {
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

  win.maximize()
  win.show()

  win.loadFile('index.html')
}

app.whenReady().then(() => setTimeout(onReady, 100))
