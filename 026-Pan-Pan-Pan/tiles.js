var baseImage;
var displaySize;
var tileSize = 1250;
var tileNum = 2;
var extentSize = tileSize*tileNum;

var visibleTiles;

if ($(window).width()/3 < $(window).height()/2) {
  displaySize = Math.floor($(window).width()/3);
} else {
  displaySize = Math.floor($(window).height()/2);
}

var tiles = [
  {
    id: 0,
    globalX: 0,
    globalY: 0,
    curX: 0,
    curY: 0,
    drawX: 0,
    drawY: 0,
    visX1: 0,
    visX2: displaySize,
    visY1: 0,
    visY2: displaySize,
    visWidth: 0,
    path: 'img/tiles/01.png',
    visible: true,
    loadedImg: null,
    sortedPixels: [],
  },
  {
    id: 1,
    globalX: 1,
    globalY: 0,
    curX: tileSize,
    curY: 0,
    drawX: 0,
    drawY: 0,
    visX1: 0,
    visX2: 0,
    visY1: 0,
    visY2: 0,
    visWidth: 0,
    path: 'img/tiles/02.png',
    visible: false,
    loadedImg: null,
    sortedPixels: [],
  },
  {
    id: 2,
    globalX: 0,
    globalY: 1,
    curX: 0,
    curY: tileSize,
    drawX: 0,
    drawY: 0,
    visX1: 0,
    visX2: 0,
    visY1: 0,
    visY2: 0,
    visWidth: 0,
    path: 'img/tiles/03.png',
    loadedImg: null,
    visible: false,
    sortedPixels: [],
  },
  {
    id: 3,
    globalX: 1,
    globalY: 1,
    curX: tileSize,
    curY: tileSize,
    drawX: 0,
    drawY: 0,
    visX1: 0,
    visX2: 0,
    visY1: 0,
    visY2: 0,
    visWidth: 0,
    path: 'img/tiles/04.png',
    loadedImg: null,
    visible: false,
    visible: false,
    sortedPixels: [],
  },
]
