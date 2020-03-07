var trackingData;
var capture;

//var videoLoad = false;

function preload(){
  trackingData = loadTable('data/timesquare_720.csv','csv','header');
}

function setup() {
  var cnv = createCanvas(1280,720);
  cnv.parent("wrapper");


  frameRate(30);

  // for (var i = 1; i < 500; i++) {
  //   drawTrackedBody(i);
  // }

}



var curFrame = 1;


function draw() {

  //background(255,20);

  var path = "frames/frame_" + (frameCount-1) + ".jpg";
  loadImage(path, function(thisImg) {

    //get rows with frame count number
    var regex = '^' + curFrame + '$';
    var regexInput = new RegExp(regex, 'g');
    var rows = trackingData.matchRows(regexInput, 'frame_id');

    for (var r = 0; r < rows.length; r++) {
      var feature = rows[r].obj;

      var colorNum = feature.track_id % 120 *2;
      var color = hexLarge[colorNum];

      // stroke(color);
      // strokeWeight(3);
      // fill(color);

      if (feature.w < 200) {

        //rect(feature.x,feature.y,feature.w,feature.h);
        var detected = thisImg.get(feature.x,feature.y,feature.w,feature.h);
        image(detected, feature.x,feature.y);

      }
    }
  });
  curFrame++;
}


function drawTrackedBody(id) {
  var regex = '^' + id + '$';
  var regexInput = new RegExp(regex, 'g');
  //console.log(regexInput);
  var tracked = trackingData.matchRows(regexInput, 'track_id');

  var colorNum = id % 147;
  var color = CSS_COLOR_NAMES[colorNum];
  stroke(color);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  strokeWeight(11);
  noFill();

  if (tracked.length > 25) {
    var simplePoints = smoothCurve(tracked);

    var d = dist(simplePoints[0].x, simplePoints[0].y,simplePoints[simplePoints.length-1].x, simplePoints[simplePoints.length-1].y);

    if (d > 30) {
      beginShape();
      curveVertex(simplePoints[0].x, simplePoints[0].y);

      for (var s = 0; s < simplePoints.length; s++) {
        curveVertex(simplePoints[s].x, simplePoints[s].y);
      }
      curveVertex(simplePoints[simplePoints.length-1].x, simplePoints[simplePoints.length-1].y);
      endShape();
    }
  }
}

function smoothCurve(tracked) {
  var arrayOfPoints = [];
  var tolerance = 10;
  for (var p = 0; p < tracked.length; p++) {
    var feature = tracked[p].obj;
    var pair = {};
    pair.x = parseInt(feature.x);
    pair.y = parseInt(feature.y);
    arrayOfPoints.push(pair);
  }

  var simplePoints = simplify(arrayOfPoints,tolerance);
  return simplePoints;
}
