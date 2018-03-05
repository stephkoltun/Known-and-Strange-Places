function preload(){
  console.log(detects.length);
}

function setup() {
  var cnv = createCanvas(800,640);
  cnv.parent("wrapper")
}

var curImage = 0;
var predTotal;
var predIndex = 0;

function draw() {
  if (frameCount % 40 == 0) {
    noStroke();
    fill(255,250);
    rect(0,0,width,height);

    getCounts();
  }
}

function getCounts() {
  var predictions = detects[curImage].predictions;
  predTotal = predictions.length;

  if (predTotal == 0) {
    curImage++;
    getCounts();
    predIndex = 0;
    predTotal = 0;
  } else {
    showClasses();
  }
}


function showClasses() {
  var predictions = detects[curImage].predictions;

  var path = imageFiles[curImage];
  loadImage(path, function(thisImg) {
    var box = predictions[predIndex].box;
    var bWidth = box.right - box.left;
    var bHeight = box.bot - box.top;
    var detected = thisImg.get(box.left,box.top,bWidth,bHeight);

    // var scaleWidth;
    // var scaleHeight;
    // if (bWidth > bHeight) {
    //   scaleWidth = width/2;
    //   scaleHeight = (bHeight*scaleWidth)/bWidth;
    // } else {
    //   scaleHeight = height/2;
    //   scaleWidth = (scaleHeight*bWidth)/bHeight;
    // }
    //
    // var xPos = width/2 - scaleWidth/2;
    // var yPos = height/2 - scaleHeight/2;
    // image(detected, xPos, yPos, scaleWidth, scaleHeight);

    var xPos = width/2 - bWidth*3/2;
    var yPos = height/2 - bHeight*3/2;
    image(detected, 0, yPos, bWidth*3, bHeight*3);

    fill(0);
    textFont("Karla");
    textSize(48);

    textAlign(LEFT,CENTER);
    var a = "";
    var firstLetter = predictions[predIndex].class.substring(0,1);
    if (firstLetter == "e" || firstLetter == "a" || firstLetter == "u" || firstLetter == "i" || firstLetter == "o") {
      a = "an ";
    } else {
      a = "a ";
    }
    text("This is " + a + predictions[predIndex].class, 0, height-60);
    // textAlign(CENTER,CENTER);
    // text(predictions[predIndex].class, width/2, height-60);

    if (predIndex < predTotal-1) {
      predIndex++;
    } else {
      predIndex = 0;
      predTotal = 0;
      // go to next image
      if (curImage < imageFiles.length-1) {
        curImage++;
      } else {
        curImage = 0;
      }
    }
  });


}
