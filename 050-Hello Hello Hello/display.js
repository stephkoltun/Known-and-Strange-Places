var displayWidth;
var displayHeight;

var minX, maxX, minY, maxY;

var colorPairs = [
  {
    line:"#28788E",
    background: "#E7493D"
  },
  {
    line:"#20A476",
    background: "#BFCE54"
  },
  {
    line:"#F05B53",
    background: "#8B508F"
  },
  {
    line:"#234994",
    background: "#B5BDC8"
  },
  {
    line:"#F63523",
    background: "#3385B7"
  },
];

var randomNum;
var thisColor;
var saveColor;

var curDataset = 1;
var geoArray = hello[curDataset].features;
var drawPosition = 0;

var handHelloVideo;
var tiltHelloVideo;

// $("#handVid").css("width", displayWidth/2);
// $("#handVid").css("height", displayHeight/2);

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';
var mapObj = new mapboxgl.Map({
  container: 'mapArea',
  style: 'mapbox://styles/mapbox/satellite-v9',
  center:[geoArray[140].properties.lon,geoArray[140].properties.lat],
  zoom: 15,
  interactive: false,
});

function setup() {
  displayWidth = $(window).width();
  displayHeight = $(window).height();
  var cnv = createCanvas(displayWidth,displayHeight);
  cnv.parent("wrapper");

  handHelloVideo = createVideo(['vid/handHello.mov'],handLoad);

  configure();
}

var handLoaded = false;
function handLoad() {
  console.log("video loaded");
  handHelloVideo.hide();
  handHelloVideo.loop();
  handLoaded = true;
}

function draw() {
  if (handLoaded) {
    thresholdHandHello();
    walkingHello();
  } else {
    if (frameCount % 5 == 0) {  // use this to set speed for drawing the walked hello
      walkingHello();
    }
  }

  computerHello();
}

function thresholdHandHello() {
  if (mouseIsPressed) {
    handHelloVideo.loadPixels();
    for (var i = 0; i < handHelloVideo.pixels.length; i+=4) {
      var r = handHelloVideo.pixels[i];
      var g = handHelloVideo.pixels[i+1];
      var b = handHelloVideo.pixels[i+2];
      var diff = abs(r-g) + abs(g-b);
      if (diff < 40) {
      } else {
        handHelloVideo.pixels[i] = 255;
        handHelloVideo.pixels[i+1] = 255;
        handHelloVideo.pixels[i+2] = 255;
      }
    }
    handHelloVideo.updatePixels();
    image(handHelloVideo, displayWidth/2, 0, displayWidth/2, displayHeight/2);
  } else {
    handHelloVideo.loadPixels();
    for (var i = 0; i < handHelloVideo.pixels.length; i+=4) {
      var r = handHelloVideo.pixels[i];
      var g = handHelloVideo.pixels[i+1];
      var b = handHelloVideo.pixels[i+2];
      var diff = abs(r-g) + abs(g-b);
      if (diff < 100) {
        handHelloVideo.pixels[i] = 255;
        handHelloVideo.pixels[i+1] = 125;
        handHelloVideo.pixels[i+2] = 85;
      } else {
        handHelloVideo.pixels[i] = 0;
        handHelloVideo.pixels[i+1] = 255;
        handHelloVideo.pixels[i+2] = 255;
      }
    }
    handHelloVideo.updatePixels();
    image(handHelloVideo, displayWidth/2, 0, displayWidth/2, displayHeight/2);
  }
}

function computerHello() {

  var multiplier = displayWidth/20;
  var xOffset = displayWidth/2;
  var yOffset = displayHeight/2 + multiplier/3*2;

  fill(112,169,248);
  noStroke();
  rect(displayWidth/2,displayHeight/2,displayWidth/2,displayHeight/2);

  noFill();
  stroke(151,60,145);

  push();
  translate(50+xOffset,50+yOffset);
  line(0,0,0,multiplier*4);
  line(0,multiplier*2,multiplier,multiplier*2);
  line(multiplier,multiplier*2,multiplier,multiplier*4);
  pop();

  push();
  translate(50+multiplier*2+xOffset,50+yOffset);
  line(0,0,0,multiplier*4);
  line(0,0,multiplier,0);
  line(0,multiplier*2,multiplier,multiplier*2);
  line(0,multiplier*4,multiplier,multiplier*4);
  pop();

  push();
  translate(50+multiplier*4+xOffset,50+yOffset);
  line(0,0,0,multiplier*4);
  line(0,multiplier*4,multiplier,multiplier*4);
  pop();

  push();
  translate(50+multiplier*6+xOffset,50+yOffset);
  line(0,0,0,multiplier*4);
  line(0,multiplier*4,multiplier,multiplier*4);
  pop();

  push();
  translate(50+multiplier*8+xOffset,50+yOffset);
  line(0,0,0,multiplier*4);
  line(0,0,multiplier,0);
  line(0,multiplier*4,multiplier,multiplier*4);
  line(multiplier,0,multiplier,multiplier*4);
  pop();
}

function walkingHello() {
  if (mouseIsPressed) {
    fill("rgba(0,0,0,0)");
  } else {
    fill(thisColor.background);
  }

  noStroke();
  rect(0,0,displayWidth/2, displayHeight/2);


  noFill();
  strokeCap(ROUND);
  strokeJoin(ROUND);
  strokeWeight(8);
  if (mouseIsPressed) {
    stroke("rgba(255,255,255,255)");
  } else {
    stroke(thisColor.line);
  }

  push();
  translate(displayWidth/4, displayHeight/2);
  rotate(hello[curDataset].rotate);
  beginShape();
  for (var i = 0; i < drawPosition; i++) {
    //map geo location to drawing coords
    var thisPoint = geoArray[i].properties;
    var curX = map(thisPoint.lon, minX, maxX, 0, displayWidth/2);
    var curY = map(thisPoint.lat, minY, maxY, 0, displayHeight/2);
    vertex(curX-(displayWidth/hello[curDataset].Xdivider), curY-(displayHeight/hello[curDataset].Ydivider));
  }
  endShape();
  pop();


  if (drawPosition == (geoArray.length-1)) {
    if (curDataset < hello.length-1) {
      curDataset++;
    } else {
      curDataset = 0;
    }

    geoArray = hello[curDataset].features;  // change to next hello
    clear();  // erase the canvas
    configure();  // reset the extents
    drawPosition = 0; //start from the beginning

  } else if (drawPosition < geoArray.length-1) {
    drawPosition++;
  }
}

function configure() {

  // set colors
  randomNum = Math.floor(Math.random()*colorPairs.length);
  thisColor = colorPairs[randomNum];
  saveColor = colorPairs[randomNum];

  var position = hello[curDataset].features[140];

  // recenter map
  mapObj.jumpTo({center:[geoArray[140].properties.lon,geoArray[140].properties.lat]});

  // radians
  var northBearing = 0;
  var eastBearing = Math.PI/2;
  var southBearing = Math.PI;
  var westBearing = 3*Math.PI/2;

  var distance = 300; // metres

  var vertOffset = distance;
  var horOffset = (vertOffset+250)*((displayWidth/2)/(displayHeight/2));

  console.log(vertOffset);
  console.log(horOffset); // meters

  var newNorth = offsetFromPoint(vertOffset, northBearing, position.properties);
  var newSouth = offsetFromPoint(vertOffset, southBearing, position.properties);
  var newEast = offsetFromPoint(horOffset, eastBearing, position.properties);
  var newWest = offsetFromPoint(horOffset, westBearing, position.properties);

  console.log("orig", position.properties);
  console.log(newNorth);
  console.log(newSouth);
  console.log(newEast);
  console.log(newWest);

  maxX = newWest.longitude;
  minX = newEast.longitude;

  minY = newNorth.latitude;
  maxY = newSouth.latitude;
}

function offsetFromPoint(dist, bearing, coords) {
  // used the formula here: https://gis.stackexchange.com/questions/5821/calculating-latitude-longitude-x-miles-from-point
  var latInRadians = coords.lat * (Math.PI/180);

  var latitudeOffset = dist * Math.cos(bearing) / 111111;
  var longitudeOffset = dist * Math.sin(bearing) / Math.cos(coords.lat) / 111111;

  var newCoords = {
    latitude: coords.lat + latitudeOffset,
    longitude: coords.lon + longitudeOffset,
  }

  return newCoords;
}

function mousePressed() {
  clear();
}
