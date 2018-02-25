var colorVid;
var depthVid;
var threshold = 100;
function setup() {
  createCanvas(423, 344);
  colorVid = createVideo(['img/color.mov']);
  colorVid.hide();

  depthVid = createVideo(['img/depth.mov']);
  depthVid.hide();
}

function draw() {
  image(colorVid, 0, 0);

  depthVid.loadPixels();
  var depthPix = depthVid.pixels;

  for (var x = 0; x < depthVid.width; x++ ) {
    for (var y = 0; y < depthVid.height; y++ ) {
      var index = (x + y*displaySize) * 4;

      var depthVal = depthPix[index];

      if (depthVal <= 100) {
        noStroke();
        fill();
        rect(x,y,1,1);
      }
    }
  }
}
