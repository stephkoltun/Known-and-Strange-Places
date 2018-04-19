var keyVideo;
var backgroundImage;

var w = $(window).width();
var h = $(window).height();

var backW = $(window).width();
var hFactor = 0.5625;
var backH = backW*hFactor;

function setup() {
	createCanvas(w,h);
	frameRate(30);
	imageMode(CENTER);

	keyVideo = createVideo('action-01.mp4');
	keyVideo.hide();
	keyVideo.loop();
	backgroundImage = loadImage('background.png')
}

function draw() {
		imageMode(CENTER);
		image(backgroundImage, w/2, h/2, backW, backH);
		keyVideo.loadPixels()

		for (var y = 0; y < keyVideo.height; y+=1) {
		  for (var x = 0; x < keyVideo.width; x+=1) {
		    // loop over
		    var idx = (x + keyVideo.width*y)*4;

		    var r = keyVideo.pixels[idx];
		    var g = keyVideo.pixels[idx+1];
		    var b = keyVideo.pixels[idx+2];

				var total = r+g+b;

				if (total <= 6) {
					keyVideo.pixels[idx+3] = 0;
				}
		  }
		}

		keyVideo.updatePixels();

		if (mouseX > width/3*2) {
			var imageW = backW*1.85;
			var imageH = backH*1.85;
			var yOffset = h/2 + (backH - imageH)/3;
			imageMode(CENTER);
			image(keyVideo, w/2, yOffset, imageW, imageH);
		} else if (mouseX > width/3) {
			imageMode(CENTER);
			image(keyVideo, w/2, h/2, backW, backH)
		} else {
			var imageW = backW*0.35;
			var imageH = backH*0.35;
			var yOffset = h/2 + (backH - imageH)/3;
			imageMode(CENTER);
			image(keyVideo, w/2, yOffset, imageW, imageH);
		}

}
