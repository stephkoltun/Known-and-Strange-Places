// TEST WITH A VIDEO!!!!
var canvasWidth = 800;
var canvasHeight = 640;
var curImg = 1; // start at 1 so we always compare backwards to the previous frame
var differenceThreshold = 25;
var sameTransparency = 255;
var framerate = 3;

var multiplier = 2.4; //1920/800 to be full width


// load all the images and assign them back to the object
function preload(){
  for (var img = 0; img < imgArray.length; img++) {
    imgArray[img].loaded = loadImage(imgArray[img].path);
  }
}

function setup() {
  console.log("loaded");
  var cnv = createCanvas(canvasWidth*multiplier, canvasHeight*multiplier);
  cnv.parent("canvas");  // set parent of canvas
  background(240);
  frameRate(framerate);

  diffImage = createImage(canvasWidth,canvasHeight);
}

var diffImage;

function draw() {

  differenceFrames(imgArray[curImg-1].loaded,imgArray[curImg].loaded, removeSmallBlobs);

  if (curImg < imgArray.length-1) {
    curImg++;
  }
}



function removeSmallBlobs(secondFrame) {
  var blobRemovedImage = createImage(canvasWidth,canvasHeight);
  blobRemovedImage.loadPixels();
  diffImage.loadPixels();
  for (var y = 1; y < canvasHeight-1; y+=4) {  // look at a 4x4 area
    for (var x = 1; x < canvasWidth-1; x+=4) {
      var index = (x + y*canvasWidth) * 4;

      var sum = 0; // blob size
      // evaluate only a 3x3 area
      for (var ky = -1; ky <= 1; ky++) {
        for (var kx = -1; kx <= 1; kx++) {
          // Calculate the adjacent pixel for center kernel point
          var pos = ((x + kx) + (y + ky)*canvasWidth) * 4;

          var kR = diffImage.pixels[pos];
          var kG = diffImage.pixels[pos+1];
          var kB = diffImage.pixels[pos+2];
          var kA = diffImage.pixels[pos+3];

          // if this pixel is cyan, add to the incrementer
          if (kR == 0 && kG == 255 && kB == 255) {
            sum++;
          }
        }
      }

      if (sum >= 1) {
        for (var ky = -1; ky <= 1; ky++) {
          for (var kx = -1; kx <= 1; kx++) {
            var pos = ((x + kx) + (y + ky)*canvasWidth) * 4;
            blobRemovedImage.pixels[pos] = 255;
            blobRemovedImage.pixels[pos+1] = 255;
            blobRemovedImage.pixels[pos+2] = 255;
            blobRemovedImage.pixels[pos+3] = 255;
          }
        }
      } else {
        for (var ky = -1; ky <= 1; ky++) {
          for (var kx = -1; kx <= 1; kx++) {
            // Calculate the adjacent pixel for center kernel point
            var pos = ((x + kx) + (y + ky)*canvasWidth) * 4;

            var kR = diffImage.pixels[pos];
            var kG = diffImage.pixels[pos+1];
            var kB = diffImage.pixels[pos+2];
            var kA = diffImage.pixels[pos+3];

            // remove cyan pixels
            // if (kR == 0 && kG == 255 && kB == 255) {
            //   // revert to the original pixel
            //   // THIS ISNT ACTUALLY DOING ANYTHING
            //   secondFrame[pos] = 255;
            //   secondFrame[pos+1] = 255;
            //   secondFrame[pos+2] = 255;
            //   secondFrame[pos+3] = 255;
            // } else {
              // assign colored different pixel to new image
              blobRemovedImage.pixels[pos] = kR;
              blobRemovedImage.pixels[pos+1] = kG;
              blobRemovedImage.pixels[pos+2] = kB;
              blobRemovedImage.pixels[pos+3] = 255;
            // }
          }
        }
      }
    }
  }
  blobRemovedImage.updatePixels();
  image(blobRemovedImage,0,0,canvasWidth*multiplier,canvasHeight*multiplier);
}

function differenceFrames(_frame, _second, callback) {
  _frame.loadPixels();
  _second.loadPixels();

  diffImage.loadPixels();

  for (var y = 0; y < canvasHeight; y++) {
    for (var x = 0; x < canvasWidth; x++) {

      var index = (x + y*canvasWidth) * 4;

      var aR = _frame.pixels[index];
      var aG = _frame.pixels[index+1];
      var aB = _frame.pixels[index+2];

      var bR = _second.pixels[index];
      var bG = _second.pixels[index+1];
      var bB = _second.pixels[index+2];

      var diff = Math.abs(bR-aR) + Math.abs(bG-aG) + Math.abs(bB-aB);

      // if the pixel is relatively different enough
      // draw the pixel from the second frame
      if (diff > differenceThreshold) {
        diffImage.pixels[index] = bR;
        diffImage.pixels[index+1] = bG;
        diffImage.pixels[index+2] = bB;
        diffImage.pixels[index+3] = 255;
      } else {
        diffImage.pixels[index] = 0;
        diffImage.pixels[index+1] = 255;
        diffImage.pixels[index+2] = 255;
        diffImage.pixels[index+3] = sameTransparency;
      }
    }
  }
  diffImage.updatePixels();
  callback(_second.pixels);
}
