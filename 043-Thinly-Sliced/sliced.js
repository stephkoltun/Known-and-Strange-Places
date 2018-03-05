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

  // image(depthImage,0,0,1024,848);
  // image(depthImage,1024,0,1024,848);
  //
  // noFill();
  // strokeWeight(3);
  //
  // stroke("rgba(200,200,0,0.1)");
  // for (var x = 50; x < depthImage.width-50; x++) {
  //   drawSection(x,"X");
  // }
  //
  // stroke("rgba(0,200,200,0.1)");
  // for (var y = 50; y < depthImage.height-50; y++) {
  //   drawSection(y,"Y");
  // }


}

function draw() {
  image(depthImage,0,0,1024,848);
  image(depthImage,1024,0,1024,848);

  strokeWeight(3);
  noFill();

  var xMPos = constrain(mouseX,0,1024);
  var x = floor(map(xMPos,0,1024,0,511));
  // draw the line at which the section is cut (MIDDLE)
  stroke("rgb(200, 200, 0)");
  line(x*2, 0, x*2, height);
  stroke("rgb(255, 255, 0)");
  drawSection(x, "X");

  var yMPos = constrain(mouseY,0,848);
  var y = floor(map(yMPos,0,848,0,424));
  stroke("rgb(0, 200, 200)");
  line(0, y*2, width, y*2);
  stroke("rgb(0, 255, 255)");
  drawSection(y, "Y");
}


function drawSection(_v, _mode) {
  // Get the raw depth as array of integers

  beginShape();
  if ( _mode == "X") {
    for (var y = 0; y < 424; y += skip) {
      var offset = _v + y * 512;
      var depthVal = depth[offset];
      var xPos = map(depthVal, 0, 255, 1024, 0);
      if (depthVal != 0) {
        vertex(xPos, y*2);
      }
    }
  } else if ( _mode == "Y") {
    for (var x = 0; x < 512; x += skip) {
      var offset = x + _v * 512;
      var depthVal = depth[offset];
      var yPos = map(depthVal, 0, 255, 848, 0);
      if (depthVal != 0) {
        vertex(x*2+1023, yPos);
      }
    }
  }

  endShape();
}
