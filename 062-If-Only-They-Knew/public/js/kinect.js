var kinectron = null;
var w = 640, h = 480;

function setup() {
  console.log("create canvas");

  var cnv = createCanvas(w, h);
  cnv.parent("cnv");  // set parent of canvas

  kinectron = new Kinectron("stephanie",
  {
    "host": "sk6385.itp.io",
    "port": "9000",
    "path": "/peerjs",
    "secure":"true"
  });

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
