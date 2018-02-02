var baseImage;
var sortedPixels = [];

var maxZoomLevels = 6;
var zoomLevel = Math.floor((Math.random() * maxZoomLevels) + 1);;
console.log(zoomLevel);

function replaceImgs() {
  switch(zoomLevel) {
    case 1:
      $("#zoomaerial img").attr("src", "img/zoom/stuyvesant-1.png");
      $("#cropaerial img").attr("src", "img/crop/stuyvesant-1.png");
      break;
    case 2:
      $("#zoomaerial img").attr("src", "img/zoom/stuyvesant-2.png");
      $("#cropaerial img").attr("src", "img/crop/stuyvesant-2.png");
      break;
    case 3:
      $("#zoomaerial img").attr("src", "img/zoom/stuyvesant-3.png");
      $("#cropaerial img").attr("src", "img/crop/stuyvesant-3.png");
      break;
    case 4:
      $("#zoomaerial img").attr("src", "img/zoom/stuyvesant-4.png");
      $("#cropaerial img").attr("src", "img/crop/stuyvesant-4.png");
      break;
    case 5:
      $("#zoomaerial img").attr("src", "img/zoom/stuyvesant-5.png");
      $("#cropaerial img").attr("src", "img/crop/stuyvesant-5.png");
      break;
    case 6:
      $("#zoomaerial img").attr("src", "img/zoom/stuyvesant-6.png");
      $("#cropaerial img").attr("src", "img/crop/stuyvesant-6.png");
      break;
  }
}


function preload(){
  baseImage = loadImage('img/zoom/stuyvesant-1.png');
}
function setup() {
  var cnvwidth = 1200;
  var cnvheight = 1200;
  var cnv = createCanvas(cnvwidth, cnvheight);
  cnv.parent("sampleaerial");  // set parent of canvas
  //background(0,255,255);

  // use the most zoomed in image
  baseImage.loadPixels();
  //console.log(dog3.pixels);

  for (var p = 0; p < baseImage.pixels.length; p += 4) {
    var r = baseImage.pixels[p];
    var g = baseImage.pixels[p+1];
    var b = baseImage.pixels[p+2];
    var a = baseImage.pixels[p+3];

    sortedPixels.push(color(r,g,b,a));

    if (sortedPixels.length == baseImage.pixels.length/4) {
      console.log(sortedPixels);
      sampleColor();
    }
  }
}

var firedTime = 0;
var waitTime = 500;
function mouseWheel(e) {
  var now = Date.now();
  var timePassed = now - firedTime;
  if (e.deltaY > 4 && (timePassed > waitTime)) {
    console.log("increase zoom");
    changeZoom("up");
    firedTime = now;
  } else if (e.deltaY < -4 && (timePassed > waitTime)) {
    console.log("decrease zoom");
    changeZoom("down");
    firedTime = now;
  }
}


function sampleColor() {
  console.log("replace colors", zoomLevel);

  var imgWidth = 1200;
  var nSubs;

  switch(zoomLevel) {
    case 1:
      nSubs = imgWidth;
      break;
    case 2:
      nSubs = floor(imgWidth/2);
      break;
    case 3:
      nSubs = floor(imgWidth/4);
      break;
    case 4:
      nSubs = floor(imgWidth/8);
      break;
    case 5:
      nSubs = floor(imgWidth/16);
      break;
    case 6:
      nSubs = floor(imgWidth/30);
      break;
  }

  var subSize = imgWidth/nSubs;
  var totalSubs = nSubs*nSubs;

  if (nSubs != imgWidth) {
    for (var m = 0; m < imgWidth; m+=subSize) {
      for (var n = 0; n < imgWidth; n+=subSize) {
        var r = 0;
        var g = 0;
        var b = 0;

        //console.log(m);

        //Within subdivisions
        for (var i = 0; i < subSize; i++)
        {
          for (var j = 0; j < subSize; j++)
          {
            //Get position, e.g. array index number
            var position = (i + m) + ((j * imgWidth)+ (n * imgWidth));

            //Get color from pixel[position]
            var pixelColor = sortedPixels[position];


            //Add RGB component to r,g,b
            r += red(pixelColor);
            g += green(pixelColor);
            b += blue(pixelColor);
          }
        }

        //Calculate average subdivision color
        var avgR = r / (subSize * subSize);
        var avgG = g / (subSize * subSize);
        var avgB = b / (subSize * subSize);
        var avgColor = color(avgR, avgG, avgB);

        noStroke();
        fill(avgColor);
        rect(m, n, subSize, subSize);
      }
    }
  } else {
    image(baseImage, 0, 0);
  }
}
