const path = require('path')
const Tesseract = require('tesseract.js')
const { clipboard } = require('electron')

async function handleOcr(imgFileName) {
  const result = await getTextFromImage(imgFileName)

  result.data.text && copyTextToClipboard(result.data.text)
}

async function getTextFromImage(imgFileName) {
  const tmpFolder = path.resolve(__dirname, '..', 'tmp')

  return Tesseract.recognize(`${tmpFolder}/${imgFileName}`)
}

function copyTextToClipboard(text) {
  clipboard.writeText(text)
}

module.exports = handleOcr
