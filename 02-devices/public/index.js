const audioSource = document.querySelector('#audio-source')
const audioOutput = document.querySelector('#audio-output')
const videoSource = document.querySelector('#video-source')


if (!navigator.mediaDevices || 
    !navigator.mediaDevices.enumerateDevices) {
    
    console.log('enumerateDevices is not supported!')
} else {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(enumerateDevices)
        .catch(handleError)
}


function enumerateDevices() {
    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices)
        .catch(handleError)
}

function gotDevices(deviceInfos) {
    deviceInfos.forEach((deviceInfo) => {
        console.log(deviceInfo.kind + ": label = " 
				+ deviceInfo.label + ": id = "
				+ deviceInfo.deviceId + ": groupId = "
				+ deviceInfo.groupId);	


        let option = document.createElement('option')
        option.text = deviceInfo.label
        option.value = deviceInfo.deviceId

        if (deviceInfo.kind === 'audioinput') audioSource.appendChild(option)
        if (deviceInfo.kind === 'audiooutput') audioOutput.appendChild(option)
        if (deviceInfo.kind === 'videoinput') videoSource.appendChild(option)
    })
}

function handleError(err) {
    console.log(err.name + ': ' + err.message)
}