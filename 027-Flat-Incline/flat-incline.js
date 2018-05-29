var baseImage;
var displaySize;
var tileSize = 2500;
var tileNum = 1;
var extentSize = tileSize*tileNum;
var displaySize = tileSize/4;
var multiplier = 4;
var visibleSubSize = displaySize/(Math.pow(2,multiplier));
var checkSmallSize;
console.log(visibleSubSize);

var rgbImage;
var gridImage;


function preload(){
  baseImage = loadImage('img/Harlem_2400_2500x2500_DEM.png');
  rgbImage = loadImage('img/Harlem_2400_2500x2500_RGB.png');
}

function setup() {
  console.log("loaded");
  var cnv = createCanvas(displaySize, displaySize);
  cnv.parent("wrapper");  // set parent of canvas
  //background(240);

  //updateOffset();
  //calculateVisibleTiles();
  drawSubdivision(xOffset, yOffset, displaySize, displaySize);
  drawBaseImage();
}

function draw() {

}

$("#subsizeSlider").on('mouseup', function() {
  multiplier = parseInt(subsizeSlider.value);
  visibleSubSize = displaySize/(Math.pow(2,multiplier));
  clearCanvas();
  //drawBaseImage();
})

function mouseReleased() {
  if (!dragging) {
    var result = subs.filter(filterBySize);
    console.log(result);
    result.length > 0 ? visibleSubSize = result[0].width : visibleSubSize = checkSmallSize;

    clearCanvas();
    subs = [];
    drawSubdivision(xOffset, yOffset, displaySize, displaySize, mouseX, mouseY);

  } else if (dragging) {
    //clearCanvas();
    drawBaseImage();
    //drawSubdivision(xOffset, yOffset, displaySize, displaySize);
    dragging = false;
  }

  function filterBySize(subdiv) {
    if (mouseX-1 >= subdiv.minX && mouseX-1 <= subdiv.maxX) {

      if (mouseY-1 >= subdiv.minY && mouseY-1 <= subdiv.maxY) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  return false
}

var dragging = false;
function mouseDragged() {
    if (mouseY > 200) {
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
}


var minSubSize = 8;
var brightnessThreshold = 75;
var deltaThreshold = 20;

var xOffset = 150;
var yOffset = 150;

var subs = [];

function drawBaseImage() {
  var subset = rgbImage.get(xOffset, yOffset, displaySize, displaySize);
  image(subset,0,0);
}

function clearCanvas() {
  fill(255);
  rect(0,0,displaySize,displaySize);
}

function drawSubdivision(_posX, _posY, _width, _height) {

  var drawX = _posX - xOffset;
  var drawY = _posY - yOffset;

  var subdiv = baseImage.get(_posX, _posY, _width, _height);
  subdiv.loadPixels();
  var brightnessArray = [];
  var totalBright = 0;
  var frequency = 5;
  var delta;
  var averageBrightness;
  var maxBright = 0;
  var minBright = 1000;

  for (var i = 0; i < subdiv.pixels.length; i+=(4*frequency)) {

    var r = subdiv.pixels[i];
    var g = subdiv.pixels[i+1];
    var b = subdiv.pixels[i+2];
    var a = subdiv.pixels[i+3];

    var hsl = rgbToHsl(r,g,b);
    var brightness = map(hsl[2],0,1,0,255);
    brightnessArray.push(brightness);
    totalBright += brightness;

    if (brightness > maxBright) {
      maxBright = brightness
    }
    if (brightness < minBright) {
      minBright = brightness
    }
  }
  delta = Math.abs(maxBright - minBright);
  averageBrightness = totalBright/(subdiv.pixels.length/4/frequency);

  if (delta <= deltaThreshold && _width > minSubSize) {
    // this subdivision is of its final size
    fill(255,0,0);
    noStroke();
    textAlign(CENTER,CENTER);
    //text(delta,drawX+_width/2, drawY+_height/2);

    if (_width == visibleSubSize) {
      var rgbSub = rgbImage.get(_posX, _posY, _width, _height);
      noFill();
      noStroke();
      image(rgbSub, drawX, drawY);
    }
    noFill();
    stroke(150);
    strokeWeight(0.5);
    rect(drawX, drawY, _width, _height);

    var subProperties = {
      "minX": _posX-xOffset,
      "minY": _posY-yOffset,
      "maxX": _posX + _width -xOffset,
      "maxY": _posY + _height -yOffset,
      "width": _width,
      "height": _height
    };
    subs.push(subProperties);

  } else if ( _width/2 > minSubSize) {
    //console.log("min: " + brightnessArray[0] + ", max: " + brightnessArray[brightnessArray.length-1] + ", delta: " + delta);
    var newWidth = _width/2;
    var newHeight = _height/2;
    drawSubdivision(_posX, _posY, newWidth, newHeight);
    drawSubdivision(_posX, (_posY + newHeight), newWidth, newHeight);
    drawSubdivision((_posX + newWidth), _posY, newWidth, newHeight);
    drawSubdivision((_posX + newWidth), (_posY + newHeight), newWidth, newHeight);
  } else {
    // fill(255,0,0);
    // noStroke();
    noFill();
    stroke(150);
    var drawX = _posX - xOffset;
    var drawY = _posY - yOffset;
    rect(drawX, drawY, _width, _height);
    checkSmallSize = _width;
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
