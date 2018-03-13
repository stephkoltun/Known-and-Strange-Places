//Get camera video
const constraints = {
    audio: false,
    video: {
        width: {min: 640, ideal: 960, max: 1280},
        height: {min: 480, ideal: 540, max: 720}
    }
};

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        document.getElementById("myVideo").srcObject = stream;
        console.log("Got local user video");

    })
    .catch(err => {
        console.log('navigator.getUserMedia error: ', err)
    });
