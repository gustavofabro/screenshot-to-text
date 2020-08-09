const { desktopCapturer } = require('electron');
const base64ToImage = require('base64-to-image');

function handleScreenshotToText() {
  return getScreenshotBase54()
    .then(saveBase64ToImageFile)
}

function getScreenshotBase54() {
  return new Promise((resolve, reject) => {
    const imageFormat = 'image/png';

    function handleStream(stream) {
      const video = document.createElement('video');

      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

      video.onloadedmetadata = function () {
        video.style.height = this.videoHeight + 'px';
        video.style.width = this.videoWidth + 'px';

        video.play();

        const canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(imageFormat))
        video.remove();

        try {
          stream.getTracks()[0].stop();
        } catch (e) { }
      }

      video.srcObject = stream;
      document.body.appendChild(video);
    };

    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      const sourceEntireScreen = sources
        .find(source => source.name == 'Entire Screen')

      try {
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
        });
        handleStream(stream);
      } catch (e) {
        reject(e)
      }
    });
  })
}

function saveBase64ToImageFile(base64Str) {
  const path = './';
  const options = { fileName: `file-${Date.now()}`, type: 'png' };

  const { imageType, fileName } = base64ToImage(base64Str, path, options);

}