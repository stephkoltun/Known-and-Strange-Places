// Declare Kinectron
var kinectron = null;


var w, h;


function setup() {
  w = $(window).width();
  h = $(window).height();
  console.log("create canvas");

  var cnv = createCanvas(w, h);
  cnv.parent("cnv");  // set parent of canvas

  var kinectronIP = "192.168.1.5";
  kinectron = new Kinectron(kinectronIP);

  kinectron.makeConnection();

  kinectron.startKey(addBody);
}

function draw() {
  // do nothing
}

function addBody(img) {
  loadImage(img.src, function(loadedBodyImage) {
    clear();
    var imgH = (w*424)/512;
    var yOffset = (h - imgH)/2;
    image(loadedBodyImage, 0, yOffset, w, imgH);
  })
}
