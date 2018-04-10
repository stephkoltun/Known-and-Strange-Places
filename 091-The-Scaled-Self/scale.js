var myCanvas = null;
var context = null;
var kinectron = null;
var frames = [];


function setup() {
	myCanvas = createCanvas(1440,810);
	context = myCanvas.drawingContext;

  // Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.218.176"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);
  // Connect with application over peer
  kinectron.makeConnection();
  // Set individual frame callbacks
	kinectron.startColor(rgbCallback);
	//kinectron.startKey(keyCallback);
}

var backgroundImg;

function rgbCallback(img) {
	loadImage(img.src, function(loadedImage) {
    backgroundImg = loadedImage;
		image(backgroundImg, 0, 0, 1440, 810);
		kinectron.stopAll();
		kinectron.startKey(keyCallback);
  });
}

function keyCallback(img) {
	loadImage(img.src, function(loadedImage) {
		image(backgroundImg, 0, 0, 1440, 810);
		//background(255);
		image(loadedImage, 0, 0, 1440, 810);

		var yOffset = 810-540;
		image(loadedImage, -50, yOffset, 960, 540);

		var yOffset = 810-270;
		image(loadedImage, 0, yOffset, 480, 270);

		var yOffset = 810-1053;
		image(loadedImage, 150, yOffset, 1872, 1053);

  });
}

function changeSize(factor) {
	var w = 960;
	var h = 540;

	push();
	translate(width/2, height/2);
	imageMode(CENTER);
	image(loadedImage, 0, 0, w/factor, h/factor);
	pop();
}

function draw() {

}
