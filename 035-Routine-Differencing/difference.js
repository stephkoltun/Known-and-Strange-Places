// TEST WITH A VIDEO!!!!

var imgArray = [
  {
    path: 'img/frame-3.png',
    loaded: null,
  },
  {
    path: 'img/frame-4.png',
    loaded: null,
  },
  {
    path: 'img/frame-5.png',
    loaded: null,
  },
  {
    path: 'img/frame-6.png',
    loaded: null,
  },
  {
    path: 'img/frame-7.png',
    loaded: null,
  },
  {
    path: 'img/frame-8.png',
    loaded: null,
  },
  {
    path: 'img/frame-9.png',
    loaded: null,
  },
  {
    path: 'img/frame-10.png',
    loaded: null,
  },
  {
    path: 'img/frame-10.png',
    loaded: null,
  },
  {
    path: 'img/frame-10.png',
    loaded: null,
  },
  {
    path: 'img/frame-11.png',
    loaded: null,
  },
  {
    path: 'img/frame-12.png',
    loaded: null,
  },
  {
    path: 'img/frame-13.png',
    loaded: null,
  },
];

var canvasWidth = 800;
var canvasHeight = 640;
var curImg = 1; // start at 1 so we always compare backwards to the previous frame
var differenceThreshold = 25;
var sameTransparency = 50;

// load all the images and assign them back to the object
function preload(){
  for (var img = 0; img < imgArray.length; img++) {
    imgArray[img].loaded = loadImage(imgArray[img].path);
  }
}

function setup() {
  console.log("loaded");
  var cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent("canvas");  // set parent of canvas
  background(240);
  frameRate(1);
}

function draw() {

  differenceFrames(imgArray[curImg-1].loaded,imgArray[curImg].loaded);

  if (curImg < imgArray.length-1) {
    curImg++;
  }
}


function differenceFrames(_frame, _second) {
  _frame.loadPixels();
  _second.loadPixels();

  var diffImage = createImage(canvasWidth,canvasHeight);
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
        diffImage.pixels[index] = 255;
        diffImage.pixels[index+1] = 255;
        diffImage.pixels[index+2] = 255;
        diffImage.pixels[index+3] = sameTransparency;
      }
    }
  }
  diffImage.updatePixels();
  image(diffImage,0,0);
}
