var displayWidth;
var displayHeight;

var geoArray = [];
var minX, maxX, minY, maxY;

var distance = 3000; // metres

var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

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
]
var randomNum = Math.floor(Math.random()*colorPairs.length);
var thisColor = colorPairs[randomNum];

// $("#desc").css("color",thisColor.line);
// $("#desc").delay(5000).fadeOut(1000);

function setup() {
  displayWidth = $(window).width();
  displayHeight = $(window).height();
  createCanvas(displayWidth,displayHeight);
  background(thisColor.background);
  //start tracking location
  //navigator.geolocation.watchPosition(addLocation, gotError, geoOptions);
}

function draw() {

  if (frameCount % 30 == 0) {
    navigator.geolocation.getCurrentPosition(addLocation,gotError, geoOptions)
  }


  noFill();
  stroke(thisColor.line);
  strokeWeight(5);
  beginShape();

  for (var i = 0; i < geoArray.length; i++) {
    //map geo location to drawing coords
    var thisPoint = geoArray[i];
    var curX = map(thisPoint.longitude, minX, maxX, 0, displayWidth);
    var curY = map(thisPoint.latitude, minY, maxY, 0, displayHeight);
    vertex(curX, curY);

    // if (i != 0) {
    //   var prevX = map(geoArray[i-1].longitude, minX, maxX, 0, displayWidth);
    //   var prevY = map(geoArray[i-1].latitude, minY, maxY, 0, displayHeight);
    //   var d = abs(dist(curX,curY,prevX,prevY));
    // }

  }

  endShape();
}

function configure(position) {
  geoArray.push(position.coords);
  // radians
  var northBearing = 0;
  var eastBearing = Math.PI/2;
  var southBearing = Math.PI;
  var westBearing = 3*Math.PI/2;

  var vertOffset = distance;
  var horOffset = vertOffset*(displayWidth/displayHeight);

  console.log(vertOffset);
  console.log(horOffset); // meters
  //var vertOffset = horOffset*(displayWidth/displayHeight); // meters

  var newNorth = offsetFromPoint(vertOffset, northBearing, position.coords);
  var newSouth = offsetFromPoint(vertOffset, southBearing, position.coords);
  var newEast = offsetFromPoint(horOffset, eastBearing, position.coords);
  var newWest = offsetFromPoint(horOffset, westBearing, position.coords);

  console.log("orig", position.coords);
  console.log(newNorth);
  console.log(newSouth);
  console.log(newEast);
  console.log(newWest);

  maxX = newWest.longitude;
  minX = newEast.longitude;

  minY = newNorth.latitude;
  maxY = newSouth.latitude;

  fill(thisColor.line);
  var curX = map(position.coords.longitude, minX, maxX, 0, displayWidth);
  var curY = map(position.coords.latitude, minY, maxY, 0, displayHeight);
  ellipse(curX, curY, 8);
}

function offsetFromPoint(dist, bearing, coords) {
  // used the formula here: https://gis.stackexchange.com/questions/5821/calculating-latitude-longitude-x-miles-from-point
  var latInRadians = coords.latitude * (Math.PI/180);

  var latitudeOffset = dist * Math.cos(bearing) / 111111;
  var longitudeOffset = dist * Math.sin(bearing) / Math.cos(coords.latitude) / 111111;

  var newCoords = {
    latitude: coords.latitude + latitudeOffset,
    longitude: coords.longitude + longitudeOffset,
  }

  return newCoords;
}


function gotError(position) {
  console.log(position)
  alert("Please enable location services for this device and browser.");
}

function addLocation(position) {
  console.log("new position", position);
  geoArray.push(position.coords);
}
