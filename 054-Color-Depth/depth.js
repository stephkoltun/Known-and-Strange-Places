var rgbImage;
var depthImage;

var depth = [];
var colors = []
var skip = 1;

var maxDepth = 0;
var minDepth = 255;

function preload(){
  depthImage = loadImage('img/depth.png');
  rgbImage = loadImage('img/color.png');
}

function setup() {
  var cnv = createCanvas(1024,848);
  cnv.parent("wrapper");


  depthImage.loadPixels();
  for (var d = 0; d < depthImage.pixels.length; d+=4) {
    depth.push(depthImage.pixels[d]);
    if (depthImage.pixels[d] < minDepth){
      minDepth = depthImage.pixels[d]
    }

    if (depthImage.pixels[d] > maxDepth) {
      maxDepth  = depthImage.pixels[d];
    }
  }

  rgbImage.loadPixels();
  for (var c = 0; c < rgbImage.pixels.length; c+=4) {
    var r = rgbImage.pixels[c];
    var g = rgbImage.pixels[c+1];
    var b = rgbImage.pixels[c+2];

    colors.push([r,g,b]);
  }

  for (var y = 0; y < 424; y++) {
    drawSection(y, 50);
  }
}

function draw() {

}


function drawSection(_v, opac) {
  // Get the raw depth as array of integers

  for (var x = 0; x < 512; x += skip) {
    var index = x + _v * 512;

    var col = colors[index];
    noStroke();
    fill(col[0],col[1],col[2], opac);
    ellipseMode(CENTER);

    var depthVal = depth[index];
    var yPos = map(depthVal, minDepth, maxDepth, 848, 0);
    if (depthVal != 0) {
      ellipse(x*2, yPos, 6, 6);
    }
  }
}

$('body').mousemove(function(event) {
  console.log(event);
  if ((event.pageX) > $(window).width()/2) {
    $('#wrapper').hide();
    $("#orig").show();
  } else {
    $('#wrapper').show();
    $("#orig").hide();
  }
})
