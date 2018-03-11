var trackingData;

function preload(){
  trackingData = loadTable('tsq-monday.csv','csv','header');
}

function setup() {
  var cnv = createCanvas(800,640);
  cnv.parent("wrapper");

  frameRate(5);
}

function draw() {

  //get rows with frame count number
  var prevFrame = frameCount + 1;
  var nextFrame = frameCount + 2;

  var regexPrev = '^' + prevFrame + '$';
  var regexPrevInput = new RegExp(regexPrev, 'g');
  var prevRows = trackingData.matchRows(regexPrevInput, 'frame_id');

  var regexNext = '^' + nextFrame + '$';
  var regexNextInput = new RegExp(regexNext, 'g');
  var nextRows = trackingData.matchRows(regexNextInput, 'frame_id');



  for (var r = 0; r < prevRows.length; r++) {
    var prevFeature = prevRows[r].obj;

    var colorNum = prevFeature.track_id % 147;
    var color = CSS_COLOR_NAMES[colorNum];
    noStroke();
    fill(color);
    var xPos = prevFeature.x;
    var yPos = prevFeature.y;
    ellipse(xPos,yPos,5,5);

    stroke(color);
    strokeWeight(3);
    noFill();
    // find matching object in next frame
    for (var m = 0; m < nextRows.length; m++) {
      var nextFeature = nextRows[m].obj;
      if (nextFeature.track_id == prevFeature.track_id) {
        line(prevFeature.x, prevFeature.y, nextFeature.x, nextFeature.y)
      }
    }




    //rect(feature.x,feature.y,feature.w,feature.h);
  }
}

// var table;
// function setup()
// { table = new p5.Table();
//   table.addColumn('name');
//   table.addColumn('type');
//   var newRow = table.addRow();
//   newRow.setString('name', 'Lion');
//   newRow.setString('type', 'Mammal');
//   newRow = table.addRow();
//   newRow.setString('name', 'Snake');
//   newRow.setString('type', 'Reptile');
//   newRow = table.addRow();
//   newRow.setString('name', 'Mosquito'); n
//   ewRow.setString('type', 'Insect');
//   newRow = table.addRow();
//   newRow.setString('name', 'Lizard');
//   newRow.setString('type', 'Reptile');
//   var rows = table.matchRows('R.*', 'frame_id');
//
//   for (var i = 0; i < rows.length; i++) {
//     print(rows[i].getString('name') + ': ' + rows[i].getString('type'));
//   }
// } // Sketch prints: // Snake: Reptile // Lizard: Reptile
