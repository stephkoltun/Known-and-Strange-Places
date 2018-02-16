// initialize map
mapboxgl.accessToken = key;
// terrapattern coordinates seem to be at the center of a 256 image grid, zoom level 18
var configSmallest = {
  cols: 3,
  rows: 3,
  totalTiles: 9,
  dim: 256,
  zoom: 18,
  divIds: ['tile1', 'tile2', 'tile3', 'tile4','tile5','tile6','tile7','tile8','tile9'],
  includeTiles: [1,2,3,6,7,8,11,12,13],
}

var configLargest = {
  cols: 4,
  rows: 4,
  totalTiles: 16,
  dim: 64,
  zoom: 16,
  divIds: ['tile1', 'tile2', 'tile3', 'tile4', 'tile5', 'tile6', 'tile7', 'tile8', 'tile9', 'tile10', 'tile11', 'tile12', 'tile13', 'tile14', 'tile15', 'tile16'],
  includeTiles: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24],
}
var curIndex = -1;

var configSmallObj = {
  'tile1': null,
  'tile2': null,
  'tile3': null,
  'tile4': null,
  'tile5': null,
  'tile6': null,
  'tile7': null,
  'tile8': null,
  'tile9': null,
};

var copyInterval;
function setUpContainers(config) {
  if (curIndex < tileOne.features.length-2) {
    curIndex++;
  } else {
    curIndex = 0;
  }

  console.log(curIndex);

  var containID;
  var newContainer;
  var displayID;


  if ($('#wrapper').length != 0) {
    console.log("remove wrapper");
    $('#wrapper').empty();
    $('#wrapper').remove();
    containID = "#replace";
    displayID = "tempReplace";
    newContainer = '<div id="replace"></div>';
    $("#tempWrapper").show();
    $("#tempReplace").hide();
  } else if ($('#replace').length != 0) {
    console.log("remove replace");
    $('#replace').empty();
    $('#replace').remove();
    containID = "#wrapper";
    displayID = "tempWrapper";
    newContainer = '<div id="wrapper"></div>';
    $("#tempReplace").show();
    $("#tempWrapper").hide();
  }

  $('body').append(newContainer);

  for (var i = 0; i < config.totalTiles; i++) {
    var newDiv = '<div class="tile" id="' + config.divIds[i] + '"></div>';
    $(containID).append(newDiv);

    $(containID).css("width", config.dim*config.cols);
    $(containID).css("height", config.dim*config.rows);

    var selectString = "#" + displayID;

    $(selectString).attr("width", config.dim*config.cols);
    $(selectString).attr("height", config.dim*config.rows);

    $('.tile').css("width", config.dim);
    $('.tile').css("height", config.dim);

    var tileIndex = config.includeTiles[i];
    var mapObject = allTiles[tileIndex-1];

    var map = new mapboxgl.Map({
        container: config.divIds[i],
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: mapObject.similarPlaces[curIndex].geometry.coordinates,
        zoom: config.zoom,
        interactive: false,
    });

    map.on('render', function() {
      copyCanvas(config, displayID);
    })
  }
}

function copyCanvas(config, displayID) {
  var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
  // get the 2D canvas
  var canvas2D = document.getElementById(displayID);
  var ctx2D = canvas2D.getContext("2d");

  for (var c = 0; c < canvasAll.length; c++) {
    var canvas = canvasAll[c];
    var y = Math.floor(c/config.cols);
    var yPos = y * config.dim;
    var x = c - y*config.cols;
    var xPos = x * config.dim;
    // draw the webGL canvas as an image to the 2D canvas
    ctx2D.drawImage(canvas, xPos, yPos);
  }

  if (canvasAll.length == config.totalTiles) {
    removeOld = setInterval(removeCanvas,700, displayID);
  }
}

var removeOld;
var intervalTrack = 0;
function removeCanvas(displayID) {
  intervalTrack++;
  if (intervalTrack > 0) {
    intervalTrack = 0;
    clearInterval(removeOld);
  }
}

$(document).keypress(function(e) {
  if(e.keyCode == 32) {
    console.log("--- stop interval");
    clearInterval(showSimilar);
  }
});
