const { setSelectModeOn } = require('./mouse-handler')

const body = document.getElementsByTagName('body')[0]

body.onkeydown = e => {
  if (e.key === 'Enter') {
    setSelectModeOn()
  }
}
