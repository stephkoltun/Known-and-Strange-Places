var tileSize = 4000;
var tileNum = 1;
var extentSize = tileSize*tileNum;
var displaySize = tileSize/4;
var multiplier = 4;
var visibleSubSize = displaySize/(Math.pow(2,multiplier));

var capture;
var w = 800,
    h = 800;

function preload(){
  rgbImage = loadImage('img/SouthSlope_1200.png');
  capture = loadImage('img/SlopeSlope_1200_IR.png');
}

function setup() {
    console.log("draw image");
    //capture = createCapture(VIDEO);
    //createCanvas(w, h);
    var cnv = createCanvas(w, h);
    cnv.parent("wrapper");  // set parent of canvas
    image(capture,0,0);
    noLoop();
    //capture = capture.get(0,0,w,h);
    //capture.hide();
}

var captureMat, gray, blurred, thresholded, rgb, hsv, redRange;
var contours, hierarchy;
function cvSetup() {
    console.log("setup cv");
    captureMat = new cv.Mat(h, w, cv.CV_8UC4);
    rgb = new cv.Mat(h, w, cv.CV_8UC3);
    hsv = new cv.Mat(h, w, cv.CV_8UC3);
    gray = new cv.Mat(h, w, cv.CV_8UC1);
    blurred = new cv.Mat(h, w, cv.CV_8UC1);
    thresholded = new cv.Mat(h, w, cv.CV_8UC1);
    redRange = new cv.Mat(h, w, cv.CV_8UC3);
    ir = cv.imread('defaultCanvas0');
}
var ir;
var ready = false;
function cvReady() {
    //console.log("check ready");
    if(!cv || !cv.loaded) return false;
    if(ready) return true;
    cvSetup();
    ready = true;
    return true;
}

function draw() {
    if (cvReady()) {
        //capture.loadPixels();
        var read = true;
        if (read) {

            // how do we find contours
            // use open cv js - https://docs.opencv.org/3.3.1/d5/daa/tutorial_js_contours_begin.html

            // cv.cvtColor(captureMat, gray, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);
            // cv.blur(gray, blurred, [blurRadius, blurRadius], [-1, -1], cv.BORDER_DEFAULT);
            // cv.threshold(blurred, thresholded, threshold, 255, cv.ThresholdTypes.THRESH_BINARY.value);
            fill(255)
            rect(0,0,w,h);

            cv.cvtColor(ir, rgb, cv.COLOR_RGBA2RGB);
            cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
            //cv.imshow('defaultCanvas0', hsv);

            var lowValue = 120;
            var lowScalar = new cv.Scalar(100,0,0);
            var highValue = 179;
            var highScalar = new cv.Scalar(highValue, 255, 255);
            var low = new cv.Mat(h,w, rgb.type(), highScalar);
            var high = new cv.Mat(h,w, rgb.type(), lowScalar);

            cv.inRange(rgb, low, high, redRange);
            cv.imshow('defaultCanvas0', redRange);
            rgb.delete(); redRange.delete(); low.delete(); high.delete();

            //cv.inRange(hsv,redRange)

            //cv.inRange(hsv, low, high, redRange);
            // low.delete(); high.delete();

            // cv.threshold(redRange, thresholded, threshold, 255, cv.ThresholdTypes.THRESH_BINARY.value);
            // contours = new cv.MatVector();
            // hierarchy = new cv.Mat();
            //arguments: (image, contours, hierarchy, mode, method, offset = new cv.Point(0, 0))
            //cv.findContours(redRange, contours, hierarchy, 3, 2, [0, 0]);
        }
    }

    //image(capture, 0, 0, w, h);

    if (contours) {
        noStroke();
        for (var i = 0; i < contours.size(); i++) {
            fill(0, 0, 255, 128);
            var contour = contours.get(i);
            beginShape();
            var k = 0;
            for (var j = 0; j < contour.total(); j++) {
                var x = contour.get_int_at(k++);
                var y = contour.get_int_at(k++);
                vertex(x, y);
            }
            endShape(CLOSE);

            noFill();
            stroke(255, 255, 255)
            var box = cv.boundingRect(contour);
            rect(box.x, box.y, box.width, box.height);

            // these aren't working right now:
            // https://github.com/ucisysarch/opencvjs/issues/30
//            var minAreaRect = cv.minAreaRect(contour);
//            var minAreaEllipse = cv.ellipse1(contour);
//            var fitEllipse = cv.fitEllipse(contour);
        }
    }
}
