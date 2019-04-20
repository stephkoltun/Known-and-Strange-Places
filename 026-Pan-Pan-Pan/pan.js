var xOffset = tileSize/2*(-1)-(displaySize/2);
var yOffset = tileSize/2*(-1)-(displaySize/2);

function preload(){
  baseImage = loadImage('img/Stuyvesant_1200.png');

  for (var i = 0; i < tiles.length; i++) {
    tiles[i].loadedImg = loadImage(tiles[i].path);
    tiles[i].loadedImg.loadPixels();
  }
}

function setup() {
  var cnv = createCanvas(displaySize*3, displaySize*2);
  cnv.parent("wrapper");  // set parent of canvas
  //background(240);

  updateOffset();
  calculateVisibleTiles();

  updateAllViews();
}

function draw() {

}


function updateAllViews() {
  //drawTileBounds();
  // x: 1, y: 1
  drawVisibleTiles();

  // x: 3, y: 2
  push();
  translate(displaySize*2, displaySize);
  drawCrop();
  pop();

  // x: 3, y: 1
  push();
  translate(displaySize*2, 0);
  drawKey();
  pop();

  // x: 2, y: 1
  push();
  translate(displaySize, 0);
  drawVisibleTiles();
  drawVisibleGrid();
  pop();

  // x: 2, y: 2
  push();
  translate(displaySize, displaySize);
  writeTileIndex();
  pop();

  // x: 1, y: 2
  push();
  translate(0, displaySize);
  writeGlobalIndex();
  pop();

}

function writeGlobalIndex() {

  var keySize = map(displaySize, 0, extentSize, 0, displaySize);
  var xPos = map(xOffset*(-1), 0, extentSize, 0, displaySize);
  var yPos = map(yOffset*(-1), 0, extentSize, 0, displaySize);

  fill("#fff");
  noStroke();
  rect(0,0,displaySize,displaySize);

  var xEdge = xOffset*(-1);
  var yEdge = yOffset*(-1);

  for (var x = xEdge; x < xEdge+displaySize; x+= 60) {
    for (var y = yEdge; y < yEdge+displaySize; y+= 60) {

      fill("#000")
      noStroke();
      textFont('Inconsolata');
      textAlign(LEFT,CENTER);

      var xLabel = "x: " + Math.floor(x);
      var yLabel = "y: " + Math.floor(y);

      var textX = x - xEdge;
      var textY = y - yEdge;

      var indexVal = Math.floor(x) + Math.floor(y)*extentSize;

      textSize(9);
      text(indexVal, textX+6, textY+8);
      //textSize(9);
      //text(xLabel, textX+6, textY+14);
      //text(yLabel, textX+6, textY+24);

    }
  }
}

function writeTileIndex() {
  fill("#fff");
  noStroke();
  rect(0,0,displaySize,displaySize);

  var xEdge = xOffset*(-1);
  var yEdge = yOffset*(-1);

  for (var x = xEdge; x < xEdge+displaySize; x+= 60) {
    for (var y = yEdge; y < yEdge+displaySize; y+= 60) {

      fill("#000")
      noStroke();
      textFont('Inconsolata');
      textAlign(LEFT,CENTER);

      var textX = x - xEdge;
      var textY = y - yEdge;

      var xPos;
      var yPos;
      var tileLabel;
      if (x > tileSize) {
        xPos =  Math.floor(x) - tileSize;
      } else {
        xPos = Math.floor(x);
      }

      if (y > tileSize) {
        yPos = Math.floor(y) - tileSize;
      } else {
        yPos = Math.floor(y);
      }

      var indexVal;
      if ((x > tileSize) && (y > tileSize)) {
        //tileLabel = "03";
        fill("rgb(245,47,87)");
      } else if ((x < tileSize) && (y > tileSize)) {
        //tileLabel = "02";
        fill("#22b553");
      } else if ((x > tileSize) && (y < tileSize)) {
        //tileLabel = "01";
        fill("#4286f4");
      } else if ((x < tileSize) && (y < tileSize)) {
        //tileLabel = "00";
        fill("#F3752B");
      }

      indexVal = xPos + yPos*tileSize;

      // textSize(14);
      // text(tileLabel, textX+6, textY+8);
      textSize(9);
      text(indexVal, textX+6, textY+8);
      text(("x: " + xPos), textX+6, textY+18);
      text(("y: " + yPos), textX+6, textY+28);
    }
  }
}

function drawVisibleGrid() {

  if (visibleTiles.length > 1) {
    noFill();
    stroke(255);
    var strokeThick = 5;
    strokeWeight(strokeThick);
    // x line
    var xPos = xOffset+tileSize;
    if ((xPos > strokeThick) && (xPos < (displaySize-strokeThick))) {
      line(xPos,0,xPos,displaySize);
    }
    // y line
    var yPos = yOffset+tileSize;
    if ((yPos > strokeThick) && (yPos < (displaySize-strokeThick))) {
      line(0,yPos,displaySize,yPos);
    }
  }

  // label tiles
  // for (var i = 0; i < tiles.length; i++) {
  //   fill(255);
  //   noStroke();
  //   textFont('Fjalla One');
  //   textAlign(CENTER,CENTER);
  //   textSize(100);
  //   if (tiles[i].visible) {
  //     var tileLabel = "0" + tiles[i].id;
  //     var textX = tiles[i].drawX + tiles[i].visWidth/2;
  //     var textY = tiles[i].drawY + tiles[i].visHeight/2;
  //     text(tileLabel, textX, textY);
  //   }
  // }
}

function drawTileBounds() {
  fill(240);
  noStroke();
  rect(0,0,width,height);
  for (var i = 0; i < tiles.length; i++) {
    stroke(0);
    strokeWeight(3);
    noFill();
    rect(tiles[i].curX,tiles[i].curY, tileSize, tileSize);
  }
}

function calculateVisibleTiles() {
  visibleTiles = [];// empty array
  for (var i = 0; i < tiles.length; i++) {
    // check x
    var xWithin = (tiles[i].curX >= 0 && tiles[i].curX <= displaySize) || (((tiles[i].curX + tileSize) <= displaySize) && ((tiles[i].curX + tileSize) >= 0)) || ((tiles[i].curX <= 0) && (tiles[i].curX+tileSize >= displaySize));
    var yWithin = (tiles[i].curY >= 0 && tiles[i].curY <= displaySize) || (((tiles[i].curY + tileSize) <= displaySize) && ((tiles[i].curY + tileSize) >= 0)) || ((tiles[i].curY <= 0) && (tiles[i].curY+tileSize >= displaySize));

    if (xWithin && yWithin) {
      tiles[i].visible = true;
      visibleTiles.push(i);

      // what are our visible coordinates?
      // how much is visible?
      if (tiles[i].curX >= 0 && tiles[i].curX <= displaySize) {
        tiles[i].visX1 = 0;
        tiles[i].drawX = tiles[i].curX;
        tiles[i].visWidth = displaySize - tiles[i].drawX; // this is now correct
        tiles[i].visX2 = tiles[i].visX1 + tiles[i].visWidth;
      } else if (tiles[i].curX <= 0) {
        tiles[i].drawX = 0;
        tiles[i].visX1 = Math.abs(tiles[i].curX);
        if ((tileSize - tiles[i].visX1) >= displaySize) {
          tiles[i].visWidth = displaySize - tiles[i].drawX;
        } else {
          tiles[i].visWidth = tileSize - tiles[i].visX1;
        }
        tiles[i].visX2 = tiles[i].visX1 + tiles[i].visWidth;
      }

      if (tiles[i].curY >= 0 && tiles[i].curY <= displaySize) {
        tiles[i].visY1 = 0;
        tiles[i].drawY = tiles[i].curY;
        tiles[i].visHeight = displaySize - tiles[i].drawY; // this is now correct
        tiles[i].visY2 = tiles[i].visY1 + tiles[i].visHeight;
      } else if (tiles[i].curY <= 0) {
        tiles[i].drawY = 0;
        tiles[i].visY1 = Math.abs(tiles[i].curY);
        if ((tileSize - tiles[i].visY1) >= displaySize) {
          tiles[i].visHeight = displaySize - tiles[i].drawY;
        } else {
          tiles[i].visHeight = tileSize - tiles[i].visY1;
        }
        tiles[i].visY2 = tiles[i].visY1 + tiles[i].visHeight;
      }
    } else {
      tiles[i].visible = false;
    }
  }
  //console.log(tiles);
};

function drawKey() {
  image(baseImage, 0, 0, displaySize, displaySize);
  fill(255)
  noStroke()
  // stroke(255);
  // strokeWeight(6);
  var keySize = map(displaySize, 0, extentSize, 0, displaySize);
  var xPos = map(xOffset*(-1), 0, extentSize, 0, displaySize);
  var yPos = map(yOffset*(-1), 0, extentSize, 0, displaySize);
  //console.log(xOffset, yOffset);
  rect(xPos,yPos,keySize,keySize);
}

function drawCrop() {
  fill(255);
  noStroke();
  rect(0,0,displaySize,displaySize);
  var crop = baseImage.get(xOffset*(-1), yOffset*(-1), displaySize, displaySize);
  var xPos = map(xOffset*(-1), 0, extentSize, 0, displaySize);
  var yPos = map(yOffset*(-1), 0, extentSize, 0, displaySize);
  var keySize = map(displaySize, 0, extentSize, 0, displaySize);
  image(crop, xPos, yPos, keySize, keySize);
}

function drawVisibleTiles() {

  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].visible && tiles[i].visWidth >= 1 && tiles[i].visHeight >= 1) {
      var subset = tiles[i].loadedImg.get(tiles[i].visX1,tiles[i].visY1,tiles[i].visWidth, tiles[i].visHeight);
      image(subset, tiles[i].drawX, tiles[i].drawY);
    }
  }
}

function updateOffset() {
  for (var i = 0; i < tiles.length; i++) {
    // start with the tiles cornered
    tiles[i].curX = tiles[i].globalX*tileSize+xOffset;
    tiles[i].curY = tiles[i].globalY*tileSize+yOffset;
  }
}

function mouseDragged() {
  // is it in the pannable area?
  var shiftX = mouseX - pmouseX;
  var shiftY = mouseY - pmouseY;

  var newXOffset = xOffset + shiftX;
  var newYOffset = yOffset + shiftY;

  if ((newXOffset <= 0) && (newXOffset >= ((extentSize)*-1+displaySize)) && (newYOffset <= 0) && (newYOffset >= ((extentSize)*-1)+displaySize)) {

    xOffset = newXOffset;
    yOffset = newYOffset;

    updateOffset();
    calculateVisibleTiles();

    updateAllViews();
  }

}
