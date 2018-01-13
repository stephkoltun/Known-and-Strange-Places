var curScale = 1;
var curMode = 0;
var modes = ["blob", "edge", "pixel"];
var timer;

$("#desc").delay(3000).fadeOut(1000);

$("body").dblclick(function() {
	console.log("--- change scale");
	// hide current aerial
	var curAerial = "#aer" + curScale;
	console.log("hide " + curAerial);
	$(curAerial).addClass("hid").removeClass("vis");

	if (curScale < 4) {
		curScale++;
	} else {
		curScale = 1;
	}

	// show new aerial
	var nextAerial = "#aer" + (curScale);
	// set new aerial
	console.log("show " + nextAerial);
	$(nextAerial).addClass("vis").removeClass("hid");

	console.log("--- scale: " + curScale);

});

$("body").mousedown(function() {
	console.log("show things");

	// show brightness mode
	var targetImg = "#" + modes[curMode] + curScale;
	console.log("show " + targetImg);
	$(targetImg).addClass("vis").removeClass("hid");
});


$("body").mouseup(function() {
	// hide brightness mode
	var prevImg = "#" + modes[curMode] + curScale;
	console.log("hide " + prevImg);
	$(prevImg).addClass("hid").removeClass("vis");

	if (curMode < 2) {
		curMode++;
	} else {
		curMode = 0
	}
});