var baseImage;
var displaySize;
var tileSize = 2500;
var tileNum = 1;
var extentSize = tileSize*tileNum;
var displaySize = tileSize/4;


function preload(){
  baseImage = loadImage('img/Harlem_2400_2500x2500_DEM.png');
}

function setup() {
  console.log("loaded");
  var cnv = createCanvas(displaySize, displaySize);
  cnv.parent("wrapper");  // set parent of canvas
  //background(240);

  //updateOffset();
  //calculateVisibleTiles();
  drawBaseImage();
  drawSubdivision(xOffset, yOffset, displaySize, displaySize);
}

function draw() {

}

var minSubSize = 8;
var brightnessThreshold = 75;
var deltaThreshold = 15;

var xOffset = 150;
var yOffset = 150;

function drawBaseImage() {
  var subset = baseImage.get(xOffset, yOffset, displaySize, displaySize);
  image(subset,0,0);
}

function drawSubdivision(_posX, _posY, _width, _height) {
  var subdiv = baseImage.get(_posX, _posY, _width, _height);
  subdiv.loadPixels();
  var brightnessArray = [];
  var totalBright = 0;
  var frequency = 5;
  var delta;
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
  //console.log(delta)
  //console.log(delta);
  // check average brightness
  var averageBrightness = totalBright/(subdiv.pixels.length/4/frequency);
  //console.log(averageBrightness);
  //console.log(brightnessArray);
  var drawX = _posX - xOffset;
  var drawY = _posY - yOffset;

  if (delta <= deltaThreshold && _width > minSubSize) {

  //if (averageBrightness > brightnessThreshold && _width > minSubSize) {
    fill(255,0,0);
    noStroke();
    textAlign(CENTER,CENTER);
    //text(delta,drawX+_width/2, drawY+_height/2);
    noFill();
    stroke(255,0,0);
    strokeWeight(0.5);
    rect(drawX, drawY, _width, _height);
  } else if ( _width/2 > minSubSize) {
    //console.log("min: " + brightnessArray[0] + ", max: " + brightnessArray[brightnessArray.length-1] + ", delta: " + delta);
    var newWidth = _width/2;
    var newHeight = _height/2;
    drawSubdivision(_posX, _posY, newWidth, newHeight);
    drawSubdivision(_posX, (_posY + newHeight), newWidth, newHeight);
    drawSubdivision((_posX + newWidth), _posY, newWidth, newHeight);
    drawSubdivision((_posX + newWidth), (_posY + newHeight), newWidth, newHeight);
  } else {
    //console.log("smallest");
    fill(255,0,0);
    noStroke();
    //noFill();
    //stroke(0,0,255);
    var drawX = _posX - xOffset;
    var drawY = _posY - yOffset;
    rect(drawX, drawY, _width, _height);
  }
}




function mouseDragged() {
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
  drawSubdivision(xOffset, yOffset, displaySize, displaySize);
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
