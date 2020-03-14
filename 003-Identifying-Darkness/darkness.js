var curScale = 0;
var curMode = 0;
var curLocation = 0;
var modes = ["blob", "edge", "pixel"];
var scales = ["1000", "2000", "5000"];
var locations = ["ConeyIsland", "CoopCity", "WashingtonCemetery"];

var body = document.getElementsByTagName("body")[0];

body.addEventListener("touchstart", showAnalysis);
body.addEventListener("touchend", showAerial);

$(document).keypress(function(e) {
	if(e.keyCode == 32) {
		changeScale()
	}
});

$("body").mousedown(function() {
	showAnalysis();
});

$("body").mouseup(function() {
	showAerial();
});

function showAnalysis() {
	// show brightness mode
	var imgSrc = `img/${locations[curLocation]}/${modes[curMode]}/${locations[curLocation]}-${scales[curScale]}-${modes[curMode]}.png`;
	$("#img").attr("src",imgSrc);
}


function showAerial() {
	// hide brightness mode
	var imgSrc = `img/${locations[curLocation]}/base/${locations[curLocation]}-${scales[curScale]}.jpeg`;
	$("#img").attr("src",imgSrc);

	if (curMode < modes.length-1) {
		curMode++;
	} else {
		curMode = 0
	}
}

function changeScale() {
	// hide current aerial
	if (curScale < scales.length-1) {
		curScale++;
	} else {
		curScale = 0;
		if (curLocation < locations.length-1) {
			curLocation++;
		} else {
			curLocation = 0;
		}
	}

	var imgSrc = `img/${locations[curLocation]}/base/${locations[curLocation]}-${scales[curScale]}.jpeg`;
	$("#img").attr("src",imgSrc);

}
