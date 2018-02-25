var colorVid;
var depthVid;
var threshold = 15;
var depthLoad = false;
var colorLoad = false;

function preload() {
  depthVid = createVideo(['mov/depth.mp4'], depthLoaded);
  colorVid = createVideo(['mov/color.mp4'], colorLoaded);
}

function setup() {
  createCanvas(423, 344);
}

function depthLoaded() {
  console.log("depth loaded");
  depthLoad = true;
  depthVid.hide();

  if (colorLoad) {
    colorVid.loop();
    depthVid.loop();
  }
}

function colorLoaded() {
  console.log("color loaded");
  colorLoad = true;
  colorVid.hide();

  if (depthLoad) {
    colorVid.loop();
    depthVid.loop();
  }
}

function keyPressed() {
  threshold++;
  console.log(threshold);
}

function draw() {
  background(0);
  if (colorLoad && depthLoad) {
    image(colorVid, 0, 0);

    depthVid.loadPixels();
    var depthPix = depthVid.pixels;

    for (var x = 0; x < depthVid.width; x++ ) {
      for (var y = 0; y < depthVid.height; y++ ) {
        var index = (x + y*depthVid.width) * 4;
        var depthVal = depthPix[index];

        if (depthVal >= threshold) {
          noStroke();
          fill(0);
          rect(x,y,1,1);
        }
      }
    }
  }
}
