const path = require('path')
const Tesseract = require('tesseract.js')

async function handleOcr(imgFileName) {
  const result = await getTextFromImage(imgFileName)

  return result.data.text
}

async function getTextFromImage(imgFileName) {
  const tmpFolder = path.resolve(__dirname, '..', 'tmp')

  return Tesseract.recognize(`${tmpFolder}/${imgFileName}`, 'eng')
}

module.exports = handleOcr
