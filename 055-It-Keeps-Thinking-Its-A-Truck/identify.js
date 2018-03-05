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
  var cnv = createCanvas(800,1280);
  cnv.parent("wrapper");

  for (var i = 0; i < imgArray.length; i++) {
    var prevWidth = 0;
    //image(imgArray[i],0,0);
    var thisImg = imgArray[i];
    var imgOffset = 150*acceptableImages;
    var horizontalOffset = 10;

    var predictions = detects[i].predictions;

    if (predictions.length != 0) {
      acceptableImages++;
      for (var p = 0; p < predictions.length; p++) {
        var box = predictions[p].box;
        var bWidth = box.right - box.left;
        var bHeight = box.bot - box.top;

        // noFill();
        // stroke(0,255,255);
        // rect(box.left,box.top,bWidth,bHeight);

        var detected = thisImg.get(box.left,box.top,bWidth,bHeight);

        if (predictions[p].class == 'truck' || predictions[p].class == 'car') {
          image(detected, box.left, box.top);
          tint(255, 100);
        }

        if (predictions[p].class == 'person') {
          image(detected, box.left, box.top+640);
          tint(255, 60);
        }



        //image(detected, 10+prevWidth, 10+imgOffset);
        prevWidth = prevWidth + bWidth + horizontalOffset;
      }
    }
  }
}

function draw() {

}
