var curScale = 1;
var curMode = 0;
var modes = ["blob", "edge", "pixel"];
var timer;

$("#desc").delay(5000).fadeOut(1000);

var body = document.getElementsByTagName("body")[0];

body.addEventListener("touchstart", showAnalysis);
body.addEventListener("touchend", showAerial);

$(document).keypress(function(e) {
	if(e.keyCode == 32) {
		changeScale()
	}
});

$("body").on("swipe", function() {
	changeScale()
});

$("body").mousedown(function() {
	showAnalysis();
});

$("body").mouseup(function() {
	showAerial();
});

function showAnalysis() {
	// show brightness mode
	var targetImg = "#" + modes[curMode] + curScale;
	console.log("show " + targetImg);
	$(targetImg).addClass("vis").removeClass("hid");
}


function showAerial() {
	// hide brightness mode
	var prevImg = "#" + modes[curMode] + curScale;
	console.log("hide " + prevImg);
	$(prevImg).addClass("hid").removeClass("vis");

	if (curMode < 2) {
		curMode++;
	} else {
		curMode = 0
	}
}

function changeScale() {
	// hide current aerial
	var curAerial = "#aer" + curScale;
	$(curAerial).addClass("hid").removeClass("vis");

	if (curScale < 4) {
		curScale++;
	} else {
		curScale = 1;
	}

	// show new aerial
	var nextAerial = "#aer" + (curScale);
	// set new aerial
	$(nextAerial).addClass("vis").removeClass("hid");

	console.log("--- scale: " + curScale);
}
