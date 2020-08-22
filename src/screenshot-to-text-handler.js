const { desktopCapturer, clipboard, remote } = require('electron')

const { app } = remote
const base64ToImage = require('base64-to-image')
const fs = require('fs')
const Jimp = require('jimp')
const path = require('path')
const handleOcr = require('./ocr-handler')

async function getScreenshotBase64() {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: 4000,
      height: 4000
    }
  })

  const sourceEntireScreen = sources.find(
    source => source.name === 'Entire Screen'
  )

  return sourceEntireScreen.thumbnail.toDataURL()
}

async function cropImage(base64data, coords) {
  const encondedImageBuffer = Buffer.from(
    base64data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''),
    'base64'
  )

  const screenHeight = window.screen.height
  const screenWidth = window.screen.width

  const image = await Jimp.read(encondedImageBuffer)
  image.resize(screenWidth, screenHeight)

  const cropedImage = await image.crop(
    coords.initial.x + 1,
    coords.initial.y + 1,
    coords.final.x - 1 - coords.initial.x,
    coords.final.y - 1 - coords.initial.y
  )

  return cropedImage.getBase64Async('image/png')
}

function saveBase64ToImageFile(base64Str) {
  const tmpFolder = path.normalize('tmp/')
  const options = { fileName: `file-${Date.now()}`, type: 'png' }
  const { fileName } = base64ToImage(base64Str, tmpFolder, options)

  return fileName
}

function removeTmpFile(fileName) {
  const filePath = path.resolve(__dirname, '..', 'tmp', fileName)
  fs.unlinkSync(filePath)
}

function copyTextToClipboard(text) {
  clipboard.writeText(text)
}

exports.handleScreenshotToText = async coords => {
  const imageBase64 = await getScreenshotBase64()
  const cropedImageBase64 = await cropImage(imageBase64, coords)
  const imgFileName = await saveBase64ToImageFile(cropedImageBase64)
  const text = await handleOcr(imgFileName)

  copyTextToClipboard(text)
  removeTmpFile(imgFileName)

  app.emit(text.trim() ? 'capture-finished-success' : 'capture-finished-fail')
}
