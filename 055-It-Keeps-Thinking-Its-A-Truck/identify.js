var imgArray = [];

function preload(){
  console.log(detects.length);

  for (var im = 0; im < 100; im++) {
    //for (var im = 0; im < imageFiles.length; im++) {
    var path = imageFiles[im];
    var temp = loadImage(path);
    imgArray.push(temp);
  }
}

var acceptableImages = 0;
function setup() {
  var cnv = createCanvas(800,640);
  cnv.parent("wrapper");

  // for (var i = 0; i < imgArray.length; i++) {
  //   var prevWidth = 0;
  //   //image(imgArray[i],0,0);
  //   var thisImg = imgArray[i];
  //   var imgOffset = 150*acceptableImages;
  //   var horizontalOffset = 10;
  //
  //   var predictions = detects[i].predictions;
  //
  //   if (predictions.length != 0) {
  //     acceptableImages++;
  //     for (var p = 0; p < predictions.length; p++) {
  //       var box = predictions[p].box;
  //       var bWidth = box.right - box.left;
  //       var bHeight = box.bot - box.top;
  //
  //       // noFill();
  //       // stroke(0,255,255);
  //       // rect(box.left,box.top,bWidth,bHeight);
  //
  //       var detected = thisImg.get(box.left,box.top,bWidth,bHeight);
  //
  //       if (predictions[p].class == 'person') {
  //         image(detected, box.left, box.top);
  //         //tint(255, 60);
  //       }
  //
  //
  //
  //       //image(detected, 10+prevWidth, 10+imgOffset);
  //       prevWidth = prevWidth + bWidth + horizontalOffset;
  //     }
  //   }
  // }
}

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
      curImage++;
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
      text
      text(classList[curClassIndex], 20, 20);
    }
  }
}


function showClasses() {
  var thisImg = imgArray[curImage];
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


}
