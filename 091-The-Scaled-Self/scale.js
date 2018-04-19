
var kinectron = null;

var keyed = false;
var keyImage;

function setup() {
	createCanvas(1440,810);
	frameRate(30);
  // Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.216.13"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);
  // Connect with application over peer
  kinectron.makeConnection();
  // Set individual frame callbacks
	kinectron.startColor(rgbCallback);
	//kinectron.startKey(keyCallback);
}

function draw() {
	if (keyed == true && keyImage != null) {
		image(backgroundImg, 0, 0, 1440, 810);
		//background(255);
		image(keyImage, 0, 0, 1440, 810);

		var yOffset = 810-540;
		image(keyImage, -100, yOffset, 960, 540);
		image(keyImage, 500, yOffset, 960, 540);

		var yOffset = 810-405;
		image(keyImage, -50, yOffset, 720, 405);
		image(keyImage, 800, yOffset, 720, 405);

		var yOffset = 810-270;
		image(keyImage, 0, yOffset, 480, 270);
		image(keyImage, 1000, yOffset, 480, 270);
	}
}

var backgroundImg;

function rgbCallback(img) {
	loadImage(img.src, function(loadedImage) {
    backgroundImg = loadedImage;
		image(backgroundImg, 0, 0, 1440, 810);

		if (keyed == false) {
			console.log("change!");
			kinectron.stopAll();
			kinectron.startKey(keyCallback);
			keyed = true;
			console.log(keyed);
		}
  });
}

function keyCallback(img) {
	loadImage(img.src, function(loadedImage) {
		keyImage = loadedImage
  });
}

// function keyCallback(img) {
// 	loadImage(img.src, function(loadedImage) {
// 		image(backgroundImg, 0, 0, 1440, 810);
// 		//background(255);
// 		image(loadedImage, 0, 0, 1440, 810);
//
// 		var yOffset = 810-540;
// 		image(loadedImage, -50, yOffset, 960, 540);
//
// 		var yOffset = 810-270;
// 		image(loadedImage, 0, yOffset, 480, 270);
//
// 		var yOffset = 810-1053;
// 		image(loadedImage, 150, yOffset, 1872, 1053);
//   });
// }
