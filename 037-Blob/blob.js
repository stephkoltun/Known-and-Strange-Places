
var tileSize = 4000;
var tileNum = 1;
var extentSize = tileSize*tileNum;
var displaySize = tileSize/4;
var multiplier = 4;
var visibleSubSize = displaySize/(Math.pow(2,multiplier));
console.log(visibleSubSize);

var rgbImage,
    irImage;

var minBlobSize = 5;

function preload(){
  rgbImage = loadImage('img/SouthSlope_1200.png');
  irImage = loadImage('img/SlopeSlope_1200_IR.png');
}

function setup() {
  console.log("loaded");
  var cnv = createCanvas(displaySize, displaySize);
  cnv.parent("wrapper");  // set parent of canvas
  background(240);

  image(irImage,0,0);

  var source = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height)

  var groupedBlobs = findBlobs(source);
  var blobs = groupedBlobs.blobs;
  var counts = groupedBlobs.counts;
  console.log(blobs);
  console.log(counts);

  for(y = 0; y < source.height; y++){
    for(x = 0; x < source.width; x++){
      var thisPix = blobs[y][x];
      var thisCount = counts[thisPix];
      // if it's not part of a blob, make it white
      // if (x%20 == 0 && y%20==0){
      //   console.log('pixel', thisPix);
      //   console.log('count', thisCount);
      // }

      if (thisPix == 0) {
        noStroke();
        fill(255,255,255);
        rect(x,y,1,1);
      } else {
        // look up size of blob in the unique labels
        if (thisCount < minBlobSize) {
          noStroke();
          fill(0,255,255);
          rect(x,y,1,1);
        }
      }
    }
  }

}

function draw() {

}

//http://blog.acipo.com/blob-detection-js/
function findBlobs(src) {

  var xSize = src.width,
      ySize = src.height,
      srcPixels = src.data,
      x, y, pos;

  console.log(xSize, ySize);

  // This will hold the indecies of the regions we find
  var blobMap = [];
  var label = 1;

  // The labelTable remembers when blobs of different labels merge
  // so labelTabel[1] = 2; means that label 1 and 2 are the same blob
  var labelTable = [0];

  // Start by labeling every pixel as blob 0
  for(y=0; y<ySize; y++){
    blobMap.push([]);
    for(x=0; x<xSize; x++){
      blobMap[y].push(0);
    }
  }

  // Temporary variables for neighboring pixels and other stuff
  var nn, nw, ne, ww, ee, sw, ss, se, minIndex;
  var luma = 0;
  var isVisible = 0;

  // We're going to run this algorithm twice
  // The first time identifies all of the blobs candidates the second pass
  // merges any blobs that the first pass failed to merge
  var nIter = 5;
  while( nIter-- ){

    // We leave a 1 pixel border which is ignored so we do not get array
    // out of bounds errors
    for( y=1; y<ySize-1; y++){
      for( x=1; x<xSize-1; x++){

        pos = (y*xSize+x)*4;

        var r = srcPixels[pos];
        var g = srcPixels[pos+1];
        var b = srcPixels[pos+2];

        var hsl = rgbToHsl(r, g, b);
        var mapHue = map(hsl[0], 0,1,0,360);

        // check red hue to see if within range
        isVisible = (mapHue >= 340 || mapHue <=7);

        if (isVisible) {
          // Find the lowest blob index nearest this pixel
          nw = blobMap[y-1][x-1] || 0;
          nn = blobMap[y-1][x-0] || 0;
          ne = blobMap[y-1][x+1] || 0;
          ww = blobMap[y-0][x-1] || 0;
          ee = blobMap[y-0][x+1] || 0;
          sw = blobMap[y+1][x-1] || 0;
          ss = blobMap[y+1][x-0] || 0;
          se = blobMap[y+1][x+1] || 0;
          minIndex = ww;
          if( 0 < ww && ww < minIndex ){ minIndex = ww; }
          if( 0 < ee && ee < minIndex ){ minIndex = ee; }
          if( 0 < nn && nn < minIndex ){ minIndex = nn; }
          if( 0 < ne && ne < minIndex ){ minIndex = ne; }
          if( 0 < nw && nw < minIndex ){ minIndex = nw; }
          if( 0 < ss && ss < minIndex ){ minIndex = ss; }
          if( 0 < se && se < minIndex ){ minIndex = se; }
          if( 0 < sw && sw < minIndex ){ minIndex = sw; }

          // This point starts a new blob -- increase the label count and
          // and an entry for it in the label table
          if( minIndex === 0 ){
            blobMap[y][x] = label;
            labelTable.push(label);
            label += 1;

          // This point is part of an old blob -- update the labels of the
          // neighboring pixels in the label table so that we know a merge
          // should occur and mark this pixel with the label.
          } else {
            if( minIndex < labelTable[nw] ){ labelTable[nw] = minIndex; }
            if( minIndex < labelTable[nn] ){ labelTable[nn] = minIndex; }
            if( minIndex < labelTable[ne] ){ labelTable[ne] = minIndex; }
            if( minIndex < labelTable[ww] ){ labelTable[ww] = minIndex; }
            if( minIndex < labelTable[ee] ){ labelTable[ee] = minIndex; }
            if( minIndex < labelTable[sw] ){ labelTable[sw] = minIndex; }
            if( minIndex < labelTable[ss] ){ labelTable[ss] = minIndex; }
            if( minIndex < labelTable[se] ){ labelTable[se] = minIndex; }

            blobMap[y][x] = minIndex;
          }

        // This pixel isn't visible so we won't mark it as special
        } else {
          blobMap[y][x] = 0;
        }

      }
    }

    // Compress the table of labels so that every location refers to only 1
    // matching location
    var i = labelTable.length;
    while( i-- ){
      label = labelTable[i];
      while( label !== labelTable[label] ){
        label = labelTable[label];
      }
      labelTable[i] = label;
    }

    // Merge the blobs with multiple labels
    for(y=0; y<ySize; y++){
      for(x=0; x<xSize; x++){
        label = blobMap[y][x];
        if( label === 0 ){ continue; }
        while( label !== labelTable[label] ){
          label = labelTable[label];
        }
        blobMap[y][x] = label;
      }
    }
  }

  // The blobs may have unusual labels: [1,38,205,316,etc..]
  // Let's rename them: [1,2,3,4,etc..]
  var uniqueLabels = unique(labelTable);
  var i = 0;
  for( label in uniqueLabels ){
    labelTable[label] = i++;
  }

  // convert the blobs to the minimized labels
  for(y=0; y<ySize; y++){
    for(x=0; x<xSize; x++){
      label = blobMap[y][x];
      blobMap[y][x] = labelTable[label];
    }
  }

  //console.log(blobMap);

  // Return the blob data:
  return {blobs: blobMap, counts: uniqueLabels};
};

function unique(arr){
/// Returns an object with the counts of unique elements in arr
/// unique([1,2,1,1,1,2,3,4]) === { 1:4, 2:2, 3:1, 4:1 }

    var value, counts = {};
    var i, l = arr.length;
    for( i=0; i<l; i+=1) {
        value = arr[i];
        if( counts[value] ){
            counts[value] += 1;
        }else{
            counts[value] = 1;
        }
    }

    console.log(counts);
    return counts;
}







function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
