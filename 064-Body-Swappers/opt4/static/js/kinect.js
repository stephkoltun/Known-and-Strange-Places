var kinectron = null;
var w = 800, h = 600

function setup() {
  console.log("create canvas");

  var cnv = createCanvas(w, h);
  cnv.parent("cnv");  // set parent of canvas

  kinectron = new Kinectron("128.122.6.157");

  // kinectron = new Kinectron("stephanie",
  // {
  //   "host": "sk6385.itp.io",
  //   "port": "9000",
  //   "path": "/peerjs",
  //   "secure":"true"
  // });

  kinectron.makeConnection();
  kinectron.setColorCallback(addBackground);
	kinectron.setBodiesCallback(addBody);

   kinectron.startMultiFrame(["color", "body"]);
}

function draw() {
  // do nothing
}

function addBackground(img) {
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0, w, h,);
  });
}

function addBody(bodies) {
  for (var b = 0; b < bodies.length; b++) {
    if (bodies[b].tracked == true) {
      var body = bodies[b];
      var midSpine = body.joints[1];
      var x = map(midSpine.depthX,0,1,0,w);
      var y = map(midSpine.depthY,0,1,0,h);

      placeX = x;
      placeY = y;

      // console.log(x,y);
      //
      // let drawCanvas = document.getElementById('drawCnv'),
      //     drawCtx = drawCanvas.getContext("2d");
      // drawCtx.fillRect(x,y,10,10);
    }
  }
}

// function addBody(img) {
//   loadImage(img.src, function(loadedBodyImage) {
//     clear();
//     var imgH = (w*424)/512;
//     var yOffset = (h - imgH)/2;
//     image(loadedBodyImage, 0, yOffset, w, imgH);
//   })
// }
