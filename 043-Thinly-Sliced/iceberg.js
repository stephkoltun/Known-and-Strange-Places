var rgbImage;
var depthImage;

var depth = [];
var skip = 1;

function preload(){
  depthImage = loadImage('img/depth.png');
  rgbImage = loadImage('img/color.png');
}

function setup() {
  var cnv = createCanvas(2048,848);
  cnv.parent("wrapper");

  depthImage.loadPixels();

  for (var d = 0; d < depthImage.pixels.length; d+=4) {
    depth.push(depthImage.pixels[d]);
  }

  // THESE ARE THE LINES TO DRAW THE OVERLAID SECTIONS - LIKE ICEBERGS
  image(depthImage,0,0,1024,848);
  image(depthImage,1024,0,1024,848);

  noFill();
  strokeWeight(3);

  stroke("rgba(200,200,0,0.1)");
  for (var x = 50; x < depthImage.width-50; x++) {
    drawSection(x,"X");
  }

  stroke("rgba(0,200,200,0.1)");
  for (var y = 50; y < depthImage.height-50; y++) {
    drawSection(y,"Y");
  }
}
