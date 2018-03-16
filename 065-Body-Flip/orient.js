var myCanvas = null;
var context = null;
var kinectron = null;
var frames = [];


function setup() {
	myCanvas = createCanvas(960,540);
	context = myCanvas.drawingContext;

  // Define and create an instance of kinectron
  var kinectronIpAddress = "128.122.6.157"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);
  // Connect with application over peer
  kinectron.makeConnection();
  // Set individual frame callbacks
	kinectron.startColor(rgbCallback);
}

var backgroundImg;

function rgbCallback(img) {
	loadImage(img.src, function(loadedImage) {
    backgroundImg = loadedImage;
		image(backgroundImg, 0, 0);
		kinectron.stopAll();
		kinectron.startKey(keyCallback);
  });
}

function keyCallback(img) {

	loadImage(img.src, function(loadedImage) {
		image(backgroundImg, 0, 0);
		// image(loadedImage, 0, 0);
		push();
		translate(width/2, height/2);
		imageMode(CENTER);
		rotate(PI / 2 * 90);
    image(loadedImage, 0, 0);
		pop();
  });
}

function draw() {

}
