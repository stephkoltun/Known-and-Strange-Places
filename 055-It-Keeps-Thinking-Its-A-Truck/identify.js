function preload(){
  console.log(detects.length);
}

function setup() {
  var cnv = createCanvas(800,640);
  cnv.parent("wrapper")
}

var curImageObj;
var curImage = -1;
var classList = [];
var curClassIndex = -1;

function draw() {

  if (frameCount % 40 == 0) {
    noStroke();
    fill(255,250);
    rect(0,0,width,height);

    if (curClassIndex < classList.length-1) {
      curClassIndex++;
    } else {
      // go to next image
      if (curImage < imageFiles.length-1) {
        curImage++;
      } else {
        curImage = 0;
      }

      curClassIndex = 0;
      classList = [];

      // gather the types of predictions
      for (var p = 0; p < detects[curImage].predictions.length; p++) {
        var thisClass = detects[curImage].predictions[p].class;
        if (classList.indexOf(thisClass) == -1) {
          classList.push(thisClass);
        } // else, it's already there
      }
    }
    showClasses();
    fill(0);
    if (classList.length > 0) {
      textAlign(CENTER,CENTER);
      textFont("Karla");
      textSize(32);
      text(classList[curClassIndex], width/2, 50);
    }
  }
}


function showClasses() {
  var path = imageFiles[curImage];
  loadImage(path, function(thisImg) {
    var predictions = detects[curImage].predictions;
    var targetClass = classList[curClassIndex];

    if (predictions.length > 0) {
      for (var p = 0; p < predictions.length; p++) {
        var box = predictions[p].box;
        var bWidth = box.right - box.left;
        var bHeight = box.bot - box.top;

        var detected = thisImg.get(box.left,box.top,bWidth,bHeight);

        if (predictions[p].class == targetClass) {
          image(detected, box.left, box.top);
        }
      }
    }
  });
}
