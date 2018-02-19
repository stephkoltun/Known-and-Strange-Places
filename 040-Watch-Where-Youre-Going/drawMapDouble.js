var displayWidth;
var displayHeight;

var geoArray = [];
var geoFeats = {
  "type": "Feature",
  "geometry": {
      "type": "LineString",
      "coordinates": []
  }
};

var minX, maxX, minY, maxY;

var distance = 200; // metres

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';
var mapObj = new mapboxgl.Map({
   container: 'mapCon',
   // satellite imagery styling
   style: 'mapbox://styles/mapbox/satellite-v9',
   center:[-73.9541134, 40.675237599999996],    // this should be a random point
   zoom: 18,   // 10 - what scale
 });

var colorPairs = [
  {
    line:"#28788E",
    background: "#E7493D"
  },
  {
    line:"#EC959E",
    background: "#BF7B45"
  },
  {
    line:"#20A476",
    background: "#BFCE54"
  },
  {
    line:"#8E2C3A",
    background: "#89817F"
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

$("#desc").css("color",thisColor.line);
$("#desc").delay(5000).fadeOut(1000);

function setup() {
  displayWidth = $(window).width();
  displayHeight = $(window).height()/2;
  var cnv = createCanvas(displayWidth,displayHeight);
  cnv.parent("draw");
  background(thisColor.background);
  //start tracking location
  navigator.geolocation.watchPosition(addLocation, gotError, geoOptions);
}

function draw() {
  noFill();
  stroke(thisColor.line);
  strokeWeight(5);
  beginShape();

  for (var i = 0; i < geoArray.length; i++) {
    //map geo location to drawing coords
    var thisPoint = geoArray[i];
    var curX = map(thisPoint.longitude, minX, maxX, 0, displayWidth);
    var curY = map(thisPoint.latitude, minY, maxY, 0, displayHeight);

    if (geoArray.length >= 4) {
       curveVertex(curX, curY);
       // if it's the last, duplicate it
       if (i == geoArray.length-1) {
         curveVertex(curX, curY);
       }
    } else {
      vertex(curX, curY);
    }

  }

  endShape();
}

function configure(position) {

  mapObj.jumpTo([position.coords.latitude,position.coords.longitude]);

  geoArray.push(position.coords);
  // push it twice so that we can draw from it when curving
  geoArray.push(position.coords);
  // radians
  var northBearing = 0;
  var eastBearing = Math.PI/2;
  var southBearing = Math.PI;
  var westBearing = 3*Math.PI/2;

  var horOffset = distance // meters
  var vertOffset = horOffset*(displayWidth/displayHeight); // meters

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
  ellipse(curX, curY, 10);
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

var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

function gotError(position) {
  console.log(position)
  alert("Please enable location services for this device and browser.");
}

function addLocation(position) {
  console.log("new position", position);
  geoArray.push(position.coords);
  geoFeats.geometry.coordinates.push([position.coords.longitude, position.coords.latitude])

  if (geoArray.length >= 1) {
    console.log("draw on aerial");

    if (mapObj.getLayer("route") != undefined) {
      console.log(geoFeats);
      mapObj.removeSource("route");
      mapObj.removeLayer("route");

    }

    mapObj.addSource("route", {
      "type": "geojson",
      "data": geoFeats
    });

    mapObj.addLayer({
          "id": "route",
          "type": "line",
          "source": "route",
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
          "paint": {
              "line-color": thisColor.line,
              "line-width": 8
          }
    });



  }
}
