//Parameters
const s = document.getElementById('objDetect');
const sourceVideo = s.getAttribute("data-source");  //the source video to use
const uploadWidth = s.getAttribute("data-uploadWidth"); //the width of the upload file
const mirror = s.getAttribute("data-mirror") || true; //mirror the boundary boxes
const updateInterval = s.getAttribute("data-updateInterval") || 300; //the max rate to upload images
const apiServer = s.getAttribute("data-apiServer") || window.location.origin + '/image'; //the full TensorFlow Object Detection API server url
const imageChangeThreshold = s.getAttribute("data-motionThreshold") || 0.05; //how much the image can change before we trigger motion

//for our video selector
let v = document.getElementById(sourceVideo);

//for starting events
let isPlaying = false,
    gotMetadata = false;

// ----------- Canvas setup ----------- //
//create a canvas to grab an image for upload
let imageCanvas = document.createElement('canvas'),
    imageCtx = imageCanvas.getContext("2d");

imageCanvas.id = "origVid";

//create a canvas for drawing object boundaries
let drawCanvas = document.createElement('canvas'),
    drawCtx = drawCanvas.getContext("2d");
document.body.appendChild(drawCanvas);

//Used for motion detection
let lastFrameData = null,
    lastFrameTime = null;

let print = false;

let figure = true;

var body = document.getElementById("body");

body.addEventListener('mousemove', function(e) {

  if (e.pageX > window.outerWidth/2 && figure != true) {
    figure = true;
  }
  if (e.pageX < window.outerWidth/2 && figure != false) {
    figure = false;
  }
});

//Draw boxes and labels on each detected object
function drawBoxes(objects) {
    //clear the previous drawings

    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

    var len = objects[0].picture.length;
    var src = "data:image/jpeg;base64, ";
    src += objects[0].picture;
    // var newImage = document.getElementById('fill');
    // newImage.src = src;
    // newImage.width = drawCanvas.width;
    // newImage.height = drawCanvas.height;

    var receivedImage = new Image();
    receivedImage.width = v.width;
    receivedImage.height = v.height;
    receivedImage.onload = function() {

         //drawCtx.drawImage(receivedImage, 0, 0, drawCanvas.width, drawCanvas.height);

         //filter out objects that contain a class_name and then draw boxes and labels on each
         objects.filter(object => object.class_name).forEach(object => {

             let x = object.x * drawCanvas.width;
             let y = object.y * drawCanvas.height;
             let width = (object.width * drawCanvas.width) - x;
             let height = (object.height * drawCanvas.height) - y;

             //flip the x axis if local video is mirrored
             // if (mirror) {
             //     x = drawCanvas.width - (x + width);
             // }

             if (figure) {
               drawCtx.drawImage(receivedImage, x-40, y-40, width, height, x, y, width, height);
             } else {
               drawCtx.drawImage(receivedImage, 0, 0, drawCanvas.width, drawCanvas.height);
               drawCtx.fillStyle="#FFFFFF";
               drawCtx.fillRect(x, y, width, height);
             }
         });

    };
    receivedImage.src = src;


}

//Add file blob to a form and post
function postFile(file) {

    //Set options as form data
    let formdata = new FormData();
    formdata.append("image", file);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', apiServer, true);
    xhr.onload = function () {
        if (this.status === 200) {
          let objects = JSON.parse(this.response);
          //console.log(objects);
          if (objects.length > 1) {

            //draw the boxes
            drawBoxes(objects);

            //dispatch an event
            let event = new CustomEvent('objectDetection', {detail: objects});
            document.dispatchEvent(event);

            //start over
            sendImageFromCanvas();
          }
        }
        else {
            console.error(xhr);
        }
    };
    xhr.send(formdata);
}


//Function to measure the change in an image
//ToDo: improve this - convert to greyscale
function imageChange(sourceCtx, changeThreshold) {

    let changedPixels = 0;
    const threshold = changeThreshold * sourceCtx.canvas.width * sourceCtx.canvas.height;   //the number of pixes that change change

    let currentFrame = sourceCtx.getImageData(0, 0, sourceCtx.canvas.width, sourceCtx.canvas.height).data;

    //handle the first frame
    if (lastFrameData === null) {
        lastFrameData = currentFrame;
        return true;
    }

    //look for the number of pixels that changed
    for (let i = 0; i < currentFrame.length; i += 4) {
        let lastPixelValue = lastFrameData[i] + lastFrameData[i + 1] + lastFrameData[i + 2];
        let currentPixelValue = currentFrame[i] + currentFrame[i + 1] + currentFrame[i + 2];

        //see if the change in the current and last pixel is greater than 10; 0 was too sensitive
        if (Math.abs(lastPixelValue - currentPixelValue) > (10)) {
            changedPixels++
        }
    }

    //console.log("current frame hits: " + hits);
    lastFrameData = currentFrame;
    return (changedPixels > threshold);
}


//Check if the image has changed & enough time has passeed sending it to the API
function sendImageFromCanvas() {

    imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, uploadWidth, uploadWidth * (v.videoHeight / v.videoWidth));

    let imageChanged = imageChange(imageCtx, imageChangeThreshold);
    let enoughTime = (new Date() - lastFrameTime) > updateInterval;

    if (imageChanged && enoughTime) {
        lastFrameTime = new Date();
        imageCanvas.toBlob(postFile, 'image/jpeg');
    }
    else {
        setTimeout(sendImageFromCanvas, updateInterval);
    }
}

//Start object detection
function startObjectDetection() {

    console.log("starting object detection");

    //Set canvas sizes base don input video
    drawCanvas.width = v.videoWidth;
    drawCanvas.height = v.videoHeight;

    imageCanvas.width = uploadWidth;
    imageCanvas.height = uploadWidth * (v.videoHeight / v.videoWidth);

    //Some styles for the drawcanvas
    drawCtx.lineWidth = 0;

    //Now see if we should send an image
    sendImageFromCanvas();
}

//Starting events

//check if metadata is ready - we need the video size
v.onloadedmetadata = () => {
    console.log("video metadata ready");
    gotMetadata = true;
    if (isPlaying)
        startObjectDetection();
};

//see if the video has started playing
v.onplaying = () => {
    console.log("video playing");
    isPlaying = true;
    if (gotMetadata) {
        startObjectDetection();
    }
};