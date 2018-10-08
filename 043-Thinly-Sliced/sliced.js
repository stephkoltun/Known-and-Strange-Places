var rgbImage;
var depthImage;

var depth = [];
var skip = 1;

var mode = "single" // "single","double"

$("button").click(function() {
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
    $(this).addClass("inactive");
  } else {
    $(this).addClass("active");
    $(this).removeClass("inactive");
  }

  if ($(this).attr("id") == "hor") {
    showHorizontal = !showHorizontal;
  } else {
    showVertical = !showVertical;
  }
})

var showHorizontal = true;
var showVertical = true;

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
}

function draw() {

  if (mode == "single") {
    image(depthImage,512,0,1024,848);

    strokeWeight(3);
    noFill();

    var xMPos = constrain(mouseX,512,1536);
    var x = floor(map(xMPos,512,1536,0,511));
    // draw the line at which the section is cut (MIDDLE)
    if (showHorizontal) {
      // stroke("rgb(180, 180, 0)");
      // line(x*2, 0, x*2, height);
      noStroke();
      fill("rgba(180, 180, 0, 0.25)")
      rect(512,0,x*2, height);
      noFill();
      stroke("rgb(255, 255, 0)");
      drawSection(x, "X", 512);
    }

    if (showVertical) {
      var yMPos = constrain(mouseY,0,848);
      var y = floor(map(yMPos,0,848,0,424));
      // stroke("rgb(0, 200, 200)");
      // line(0, y*2, width/2, y*2);
      noStroke();
      fill("rgba(0, 200, 200, 0.25)")
      rect(512,0,width/2, y*2);
      noFill();
      stroke("rgb(0, 255, 255)");
      drawSection(y, "Y", 512);
    }

  }

  if (mode == "double") {
    image(depthImage,0,0,1024,848);
    image(depthImage,1024,0,1024,848);

    image(rgbImage, 0,0,1024,848);

    strokeWeight(3);
    noFill();

    var xMPos = constrain(mouseX,0,1024);
    var x = floor(map(xMPos,0,1024,0,511));
    // draw the line at which the section is cut (MIDDLE)
    if (showHorizontal) {
      stroke("rgb(180, 180, 0)");
      line(x*2, 0, x*2, height);
      noStroke();
      fill("rgba(180, 180, 0, 0.25)")
      rect(0,0,x*2, height);
      noFill();
      stroke("rgb(255, 255, 0)");
      drawSection(x, "X", 1023);
    }

    if (showVertical) {
      var yMPos = constrain(mouseY,0,848);
      var y = floor(map(yMPos,0,848,0,424));
      stroke("rgb(0, 200, 200)");
      line(0, y*2, width/2, y*2);
      noStroke();
      fill("rgba(0, 200, 200, 0.25)")
      rect(0,0,width/2, y*2);
      noFill();
      stroke("rgb(0, 255, 255)");
      drawSection(y, "Y", 1023);
    }
  }

}


function drawSection(_v, _mode, _xOffset) {
  // Get the raw depth as array of integers

  beginShape();
  if ( _mode == "X") {
    for (var y = 0; y < 424; y += skip) {
      var offset = _v + y * 512;
      var depthVal = depth[offset];
      var xPos = map(depthVal, 0, 255, 400, 0);  // how wide should our section be?
      if (depthVal != 0) {
        vertex(xPos+mouseX-700+_xOffset, y*2);
      }
    }
  } else if ( _mode == "Y") {
    for (var x = 0; x < 512; x += skip) {
      var offset = x + _v * 512;
      var depthVal = depth[offset];
      var yPos = map(depthVal, 0, 255, 400, 0); // how tall could our section be?
      if (depthVal != 0) {
        vertex(x*2+_xOffset, yPos+mouseY-200);
      }
    }
  }

  endShape();
}
