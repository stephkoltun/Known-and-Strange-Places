// initialize map
mapboxgl.accessToken = key;

// terrapattern coordinates seem to be at the center of a 256 image grid, zoom level 18
var configSmallest = {
  cols: 2,
  rows: 2,
  totalTiles: 4,
  dim: 256,
  zoom: 18,
  divIds: ['tile1', 'tile2', 'tile3', 'tile4'],
  includeTiles: [1,2,6,7]
}

var configLargest = {
  cols: 4,
  rows: 4,
  totalTiles: 16,
  dim: 64,
  zoom: 16,
  divIds: ['tile1', 'tile2', 'tile3', 'tile4', 'tile5', 'tile6', 'tile7', 'tile8', 'tile9', 'tile10', 'tile11', 'tile12', 'tile13', 'tile14', 'tile15', 'tile16'],
  includeTiles: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24]
}
var curIndex = -1;

function setUpContainers(config) {
  curIndex++;
  console.log(curIndex);

  var containID;
  var newContainer;

  if ($('#wrapper').length != 0) {
    console.log("remove wrapper");
    $('#wrapper').empty();
    $('#wrapper').remove();
    containID = "#replace";
    newContainer = '<div id="replace"></div>';
  } else if ($('#replace').length != 0) {
    console.log("remove replace");
    $('#replace').empty();
    $('#replace').remove();
    containID = "#wrapper";
    newContainer = '<div id="wrapper"></div>';
  }

  $('body').append(newContainer);

  for (var i = 0; i < config.totalTiles; i++) {
    var newDiv = '<div class="tile" id="' + config.divIds[i] + '"></div>';
    $(containID).append(newDiv);

    $(containID).css("width", config.dim*config.cols);
    $(containID).css("height", config.dim*config.rows);

    $('.tile').css("width", config.dim);
    $('.tile').css("height", config.dim);

    var tileIndex = config.includeTiles[i];
    var mapObject = allTiles[tileIndex-1];
    console.log("load " + tileIndex);
    var map = new mapboxgl.Map({
        container: config.divIds[i],
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: mapObject.similarPlaces[curIndex].geometry.coordinates,
        zoom: config.zoom,
        interactive: false,
    });
  }
  //
}
