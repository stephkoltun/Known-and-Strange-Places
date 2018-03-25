console.log("sketch loaded");

var video;
var videoWidth = 720;
var subsX = 4;
var totalSubs = subsX * subsX;
var subWidth = videoWidth/subsX;
var videoLoaded = false;

var normalOrder;
var shuffleOrder;

function setup() {
  var cnv = createCanvas(720,720);
  cnv.parent("wrapper");
  frameRate(30);

  normalOrder = createOrder(subsX);
  console.log(normalOrder);

  shuffleOrder = shuffleArray(normalOrder);
  console.log(shuffleOrder);

  video = createVideo(['park.mp4'], function() {
    // callback for once the video is loaded
    videoLoaded = true;
    video.hide();
    video.loop();
    video.volume(0);
  });

}



function draw() {

  if (videoLoaded) {

    if (frameCount % 150 == 0) {
      shuffleOrder = shuffleArray(normalOrder);
    }

    var originalImages = [];

    for (var i = 0; i < totalSubs; i++) {
      var imageObj = video.get(normalOrder[i].x, normalOrder[i].y, subWidth, subWidth);
      image(imageObj, shuffleOrder[i].x, shuffleOrder[i].y);
    }
  } else {
    background(255);
    noStroke();
    fill("#000");
    textFont('Karla');
    textSize(32);
    textAlign(CENTER, CENTER);
    text("loading...", width/2, height/2)
  }
}

function createOrder(subs) {
    var xyPairs = [];
    for (var x = 0; x < subs; x++) {
        for (var y = 0; y < subs; y++) {
              var pair = {
                  'x': x*subWidth,
                  'y': y*subWidth
              };
              xyPairs.push(pair);
        }
    }
    return xyPairs;
}

function shuffleArray (originalArray) {
    var array = [].concat(originalArray);
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
