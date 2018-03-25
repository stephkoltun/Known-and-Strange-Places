
var video;
var videoWidth = 720;
var subWidth = videoWidth/3;
var x = [0,240,480];
var y = [0,240,480];
var videoLoaded = false;

function setup() {
  var cnv = createCanvas(720,720);
  cnv.parent("wrapper");

  frameRate(60);

  video = createVideo(['park.mp4'], function() {
    videoLoaded = true;
    video.hide();
    video.loop();
    video.volume(0);
  });

}

function videoLoad() {

}

function draw() {

  if (videoLoaded) {
    var topLeft = video.get(x[0],y[0],subWidth,subWidth);
    var topMid = video.get(x[1],y[0],subWidth,subWidth);
    var topRight = video.get(x[2],y[0],subWidth,subWidth);

    var midLeft = video.get(x[0],y[1],subWidth,subWidth);
    var midMid = video.get(x[1],y[1],subWidth,subWidth);
    var midRight = video.get(x[2],y[1],subWidth,subWidth);

    var botLeft = video.get(x[0],y[2],subWidth,subWidth);
    var botMid = video.get(x[1],y[2],subWidth,subWidth);
    var botRight = video.get(x[2],y[2],subWidth,subWidth);

    image(topLeft,x[2],y[1]);
    image(topMid,x[1],y[1]);
    image(topRight,x[1],y[2]);

    image(midLeft,x[0],y[2]);
    image(midMid,x[0],y[0]);
    image(midRight,x[2],y[0]);

    image(botLeft,x[1],y[0]);
    image(botMid,x[2],y[2]);
    image(botRight,x[0],y[1]);
  }


}
