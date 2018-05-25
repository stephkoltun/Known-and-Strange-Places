assembleImage("left");
assembleImage("right");

$('#streetLeft').click(assembleImage);
$('#streetRight').click(assembleImage);

var lastTime = Date.now();
var maxTime = 2500;

$('body').click(function() {
  lastTime = Date.now();
})

setInterval(function() {
  if ((Date.now() - lastTime) > maxTime) {
    lastTime = Date.now()
    assembleImage("left");
    assembleImage("right");
  };
}, 500);


function assembleImage(side) {
  let boros = ["Manhattan", "Bronx", "Brooklyn", "Queens", "Staten Island"];
  var element;
  if (side == "left") {
    element = "#streetLeft";
  } else if (side == "right") {
    element = "#streetRight";
  } else {
    element = "#" + side.currentTarget.id;
  }

  let random = Math.floor(Math.random() * Math.floor(nodes.features.length))
  let feature = nodes.features[random];

  let prevFeature;
  let nextFeature;
  if (random == 0) {
    prevFeature = nodes.features[1];
    nextFeature = nodes.features[2];
  } else if (random == nodes.features.length - 1) {
    prevFeature = nodes.features[random - 1];
    nextFeature = nodes.features[random - 2];
  } else {
    prevFeature = nodes.features[random - 1];
    nextFeature = nodes.features[random + 1];
  }

  let averageBearing = (prevFeature.properties.angle * 0.5 + nextFeature.properties.angle * 0.5 + feature.properties.angle) / 2;

  let featureData = {
    lat: feature.geometry.coordinates[0],
    lon: feature.geometry.coordinates[1],
    heading: feature.properties.angle,
    boro: boros[feature.properties.borocode-1]
  }

  requestImg(element, featureData);
}

function requestImg(classname, point) {
  var imgUrl = "https://maps.googleapis.com/maps/api/streetview?&key=" + key + "&size=640x320&location=" + point.lon + "," + point.lat + "&fov=90&heading=" + point.heading;

  convertFunction(imgUrl, function(base64Img){
      // console.log(point.boro);
      // var img = "<img src='"+base64Img+"'><h1>" + point.boro + "</h1>";
      var img = "<img src='"+base64Img+"'>";
      $(classname).html(img);
  });

  function convertFunction (url, callback){
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function() {
          var reader  = new FileReader();
          reader.onloadend = function () {
              callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.send();
  }
}
