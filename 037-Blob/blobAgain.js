var tileSize = 4000;
var tileNum = 1;
var extentSize = tileSize*tileNum;
var displaySize = 999;

var xOffset = 150;
var yOffset = 150;

var rgbImage;
var irImage;

function preload(){
  rgbImage = loadImage('img/SouthSlope_1200.png');
  irImage = loadImage('img/SlopeSlope_1200_IR.png');
}

function setup() {
  console.log("loaded");
  var cnv = createCanvas(displaySize, displaySize);
  cnv.parent("wrapper");  // set parent of canvas
  blobify();
}

var blobs = [];
var mode = "red";

function draw() {

}

var minCyan = 161;
var maxCyan = 186;
var maxRed = 330;
var minRed = 12;
var minBlobSize = 10;
var minDistance = 10;


function blobify() {
  var subset = irImage.get(xOffset,yOffset,displaySize,displaySize);
  subset.loadPixels();
  console.log(mode);
  blobs = [];

  // Begin loop to walk through every pixel
  for (var x = 0; x < displaySize; x++ ) {
    for (var y = 0; y < displaySize; y++ ) {
      var index = (x + y*displaySize) * 4;
      // What is current color
      var kR = subset.pixels[index];
      var kG = subset.pixels[index+1];
      var kB = subset.pixels[index+2];
      var kA = subset.pixels[index+3];

      var hsl = rgbToHsl(kR,kG,kB);
      var hue = map(hsl[0],0,1,0,360);

      var isVisible = false;
      if (mode == "cyan") {
        if (hue <= maxCyan && hue >= minCyan) {
          isVisible = true;
        } else {
          isVisible = false;
        }
      } else if (mode == "red") {
        if (hue >= maxRed || hue <= minRed) {
          isVisible = true;
        } else {
          isVisible = false;
        }
      }


      if (isVisible) {
        var found = false;
        for (var b = 0; b < blobs.length; b++) {
          var thisBlob = blobs[b];
          if (thisBlob.isNear(x, y)) {
            var c = "rgb(" + kR + "," + kG + "," + kB + ")";
            thisBlob.add(x, y, c);
            found = true;
            break;
          }
        }

        if (!found) {
          var b = new Blob(x, y);
          blobs.push(b);
        }
      }
    }
  }
  fill(255,255,0);
  noStroke();
  rect(0,0,displaySize,displaySize);
  for (var b = 0; b < blobs.length; b++) {
    var thisBlob = blobs[b];

    if (thisBlob.pixArray.length > minBlobSize) {
      thisBlob.show();
    }
  }

  removeSmallBlobs();

  console.log(blobs);
}

var subSize = 9;
var step = (subSize-1)/2;
var allowableMisc = subSize*subSize/2;
function removeSmallBlobs() {
  var originalImage = createImage(displaySize,displaySize);
  originalImage.loadPixels();
  loadPixels(); // canvas
  var blobRemovedImage = pixels;
  var rgbSub = rgbImage.get(xOffset,yOffset,displaySize,displaySize);
  rgbSub.loadPixels();

  for (var y = step; y < displaySize-step; y+=subSize) {  // look at a 3x3 area
    for (var x = step; x < displaySize-step; x+=subSize) {
      var index = (x + y*displaySize) * 4;

      var sum = 0; // blob size
      // evaluate only a 3x3 area
      for (var ky = -step; ky <= step; ky++) {
        for (var kx = -step; kx <= step; kx++) {
          // Calculate the adjacent pixel for center kernel point
          var pos = ((x + kx) + (y + ky)*displaySize) * 4;

          var kR = blobRemovedImage[pos];
          var kG = blobRemovedImage[pos+1];
          var kB = blobRemovedImage[pos+2];
          var kA = blobRemovedImage[pos+3];

          // if this pixel is cyan, add to the incrementer
          if (kR == 255 && kG == 255 && kB == 0) {
            sum++;
          }
        }
      }

      if (sum >= allowableMisc) {
        for (var ky = -step; ky <= step; ky++) {
          for (var kx = -step; kx <= step; kx++) {
            var pos = ((x + kx) + (y + ky)*displaySize) * 4;

            originalImage.pixels[pos] = 255;
            originalImage.pixels[pos+1] = 255;
            originalImage.pixels[pos+2] = 255;
            originalImage.pixels[pos+3] = 255;
          }
        }
      } else {
        for (var ky = -step; ky <= step; ky++) {
          for (var kx = -step; kx <= step; kx++) {
            // Calculate the adjacent pixel for center kernel point
            var pos = ((x + kx) + (y + ky)*displaySize) * 4;

            var kR = blobRemovedImage[pos];
            var kG = blobRemovedImage[pos+1];
            var kB = blobRemovedImage[pos+2];
            var kA = blobRemovedImage[pos+3];

            // assign colored different pixel to new image
            originalImage.pixels[pos] = rgbSub.pixels[pos];
            originalImage.pixels[pos+1] = rgbSub.pixels[pos+1];
            originalImage.pixels[pos+2] = rgbSub.pixels[pos+2];
            originalImage.pixels[pos+3] = 255;
          }
        }
      }
    }
  }
  originalImage.updatePixels();
  image(originalImage,0,0);
}

class Blob {

  constructor(x, y) {
    this.minx = x;
    this.miny = y;
    this.maxx = x;
    this.maxy = y;
    this.pixArray = [];
    this.coordArray = [];
    this.colorArray = [];
  }

  show() {
    for (var ind = 0; ind < this.pixArray.length; ind++) {
      noStroke();
      fill(this.colorArray[ind]);
      fill(this.colorArray[ind]);
      var x = this.coordArray[ind][0];
      var y = this.coordArray[ind][1];
      rect(x,y,1,1);
    }
  }

  add(x, y, color) {
    var index = (x + y*displaySize) * 4;
    this.pixArray.push(index);
    this.coordArray.push([x,y]);
    this.colorArray.push(color);

    if (x < this.minx) {
      this.minx = x;
    } else if ( x > this.maxx) {
      this.maxx = x;
    }

    if (y < this.miny) {
      this.miny = y;
    } else if ( y > this.maxy) {
      this.maxy = y;
    }
  }

  size() {
    return (this.maxx-this.minx)*(this.maxy-this.miny);
  }

  isNear(x, y) {
    var cx = (this.minx + this.maxx) / 2;
    var cy = (this.miny + this.maxy) / 2;

    var d = Math.abs(x - cx) + Math.abs(y - cy);
    if (d < minDistance) {
      return true;
    } else {
      return false;
    }
  }
}


function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function drawBaseImage() {
  var subset = rgbImage.get(xOffset, yOffset, displaySize, displaySize);
  image(subset,0,0);
}

function clearCanvas() {
  fill(255);
  rect(0,0,displaySize,displaySize);
}

var dragging = false;
function mouseDragged() {
      dragging = true;
      var shiftX = mouseX - pmouseX;
      var shiftY = mouseY - pmouseY;

      var newXOffset = xOffset - shiftX;
      var newYOffset = yOffset - shiftY;

      if ((newXOffset >= 0) && (newXOffset <= (extentSize-displaySize)) && (newYOffset >= 0) && (newYOffset <= (extentSize-displaySize))) {

        xOffset = newXOffset;
        yOffset = newYOffset;

        drawBaseImage();
      }

}

function mouseReleased() {
  if (dragging) {
    clearCanvas();
    blobify();
    dragging = false;
  }
}

$(document).keypress(function(e) {
  if(e.keyCode == 32) {
    console.log("--- toggle mode");
    if (mode == 'cyan') {
      mode = "red";
    } else if (mode == 'red') {
      mode = "cyan";
    }
    clearCanvas();
    blobify();
  }
});
