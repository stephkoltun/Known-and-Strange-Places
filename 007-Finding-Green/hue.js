var aerialImage;
var hueImage;

var imgSize;

function setup() {
  createCanvas(windowWidth,windowHeight);
  aerialImage = loadImage("img/randallsAerial.jpg");
  hueImage = loadImage("img/randallsHue.png");

  if (windowWidth > windowHeight) {
    imgSize = windowWidth;
  } else {
    imgSize = windowHeight;
  }
}

function draw() {
  image(aerialImage, 0, 0, imgSize, imgSize);

  if (mouseX != 0) {
    let cropX = (mouseX/imgSize)*hueImage.height;

    let cropHue = hueImage.get(0,0,cropX,hueImage.height);
    image(cropHue, 0, 0, mouseX, imgSize);
  }
}
