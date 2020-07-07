const mediaStreamConstraints = {
    video: true,
    audio: true
}

const localVideo = document.querySelector('video')

function gotLocalMediaStream(mediaStream) {
    localVideo.srcObject = mediaStream
}

function handleLocalMediaStreamError(err) {
    console.log('navigator.mediaDevices.getUserMedia error:', error)
}

navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream)
    .catch(handleLocalMediaStreamError)