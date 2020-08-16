const { desktopCapturer } = require('electron')
const base64ToImage = require('base64-to-image')
const Jimp = require('jimp')
const path = require('path')
const handleOcr = require('./ocr-handler')

require('./mouse-handler')

async function getScreenshotBase64() {
  function getBase64FromStream(stream) {
    return new Promise(resolve => {
      const video = document.createElement('video')
      const imageFormat = 'image/png'

      video.style.cssText = 'position:absolutetop:-10000pxleft:-10000px'

      // eslint-disable-next-line func-names
      video.onloadedmetadata = function () {
        video.style.height = `${this.videoHeight}px`
        video.style.width = `${this.videoWidth}px`

        video.play()

        const canvas = document.createElement('canvas')
        canvas.width = this.videoWidth
        canvas.height = this.videoHeight

        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        video.remove()

        try {
          stream.getTracks()[0].stop()
        } finally {
          resolve(canvas.toDataURL(imageFormat))
        }
      }

      video.srcObject = stream
      document.body.appendChild(video)
    })
  }

  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  })
  const sourceEntireScreen = sources.find(
    source => source.name === 'Entire Screen'
  )

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceEntireScreen.id,
        minWidth: 1280,
        maxWidth: 4000,
        minHeight: 720,
        maxHeight: 4000
      }
    }
  })

  return getBase64FromStream(stream)
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
    coords.initial.x,
    coords.initial.y,
    coords.final.x - coords.initial.x,
    coords.final.y - coords.initial.y
  )

  return cropedImage.getBase64Async('image/png')
}

function saveBase64ToImageFile(base64Str) {
  const tmpFolder = path.normalize('tmp/')
  const options = { fileName: `file-${Date.now()}`, type: 'png' }
  const { fileName } = base64ToImage(base64Str, tmpFolder, options)

  return fileName
}

exports.handleScreenshotToImage = async coords => {
  const base64Data = await getScreenshotBase64()
  const cropedImageBase64Str = await cropImage(base64Data, coords)
  const imgFileName = await saveBase64ToImageFile(cropedImageBase64Str)

  await handleOcr(imgFileName)
}
