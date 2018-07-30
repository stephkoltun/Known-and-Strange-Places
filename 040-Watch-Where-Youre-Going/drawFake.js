var displayWidth;
var displayHeight;

var minX, maxX, minY, maxY;

var distance = 700; // metres

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
var randomNum;
var thisColor;
var saveColor;

var curDataset = 0;
var geoArray = hello[curDataset].features;
console.log(geoArray);
var drawPosition = 1;

function setup() {
  displayWidth = 2000;
  displayHeight = 1200;
  var cnv = createCanvas(displayWidth,displayHeight);
  cnv.parent("drawArea");
  configure();
}

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';
var mapObj = new mapboxgl.Map({
   container: 'mapArea',
   style: 'mapbox://styles/mapbox/satellite-v9',
   center:[geoArray[140].properties.lon,geoArray[140].properties.lat],
   zoom: 15.6,
   interactive: false,
 });


function mousePressed() {
  $("#drawArea").css("background-color", "rgba(0,0,0,0)");
  thisColor.line = "#FFFFFF";
}

function mouseReleased() {
  $("#drawArea").css("background-color", thisColor.background);
  thisColor.line = saveColor;
}

function draw() {
  if (frameCount % 5 == 0) {
    noFill();
    strokeCap(ROUND);
    strokeJoin(ROUND);
    stroke(thisColor.line);
    strokeWeight(8);

    beginShape();
      for (var i = 0; i < drawPosition; i++) {
        //map geo location to drawing coords
        var thisPoint = geoArray[i].properties;
        var curX = map(thisPoint.lon, minX, maxX, 0, displayWidth);
        var curY = map(thisPoint.lat, minY, maxY, 0, displayHeight);
        vertex(curX, curY);
      }
    endShape();

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
}

function configure() {
  // set colors
  randomNum = Math.floor(Math.random()*colorPairs.length);
  thisColor = colorPairs[randomNum];
  saveColor = colorPairs[randomNum].line;
  $("#drawArea").css("background-color", thisColor.background);

  var position = hello[curDataset].features[140];

  // recenter map
  mapObj.jumpTo({center:[geoArray[140].properties.lon,geoArray[140].properties.lat]});

  // radians
  var northBearing = 0;
  var eastBearing = Math.PI/2;
  var southBearing = Math.PI;
  var westBearing = 3*Math.PI/2;

  var vertOffset = distance;
  var horOffset = (vertOffset+250)*(displayWidth/displayHeight);

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

  // noStroke();
  // fill(thisColor.line);
  // var curX = map(position.properties.lon, minX, maxX, 0, displayWidth);
  // var curY = map(position.properties.lat, minY, maxY, 0, displayHeight);
  // ellipse(curX, curY, 8);
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
