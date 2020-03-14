var curImg = '2';

// frontpix, midpix, backpix
// imgsize = 2204; fixed pixel array size

// <img src="img/foreground.png" class="hid" id="1">
// <img src="img/middleground.png" class="vis" id="2">
// <img src="img/background.png" class="hid" id="3">

$("body").mousemove(function(event) {

  var pixPos = event.pageX + event.pageY*2204;

  if (frontpix[pixPos] === 1 && curImg != '1') {
    if (curImg == '2') {
      $('#2').addClass("hid").removeClass("vis");
    } else if (curImg == '3') {
      $('#3').addClass("hid").removeClass("vis");
    }

    curImg = '1';
    $('#1').addClass("vis").removeClass("hid");
  } else if (midpix[pixPos] === 1 && (curImg != '2')) {
    // change img
    if (curImg == '1') {
      $('#1').addClass("hid").removeClass("vis");
    } else if (curImg == '3') {
      $('#3').addClass("hid").removeClass("vis");
    }
    curImg = '2';
    $('#2').addClass("vis").removeClass("hid");
  } else if (backpix[pixPos] === 1 && (curImg != '3')) {
    // change img
    if (curImg == '1') {
      $('#1').addClass("hid").removeClass("vis");
    } else if (curImg == '2') {
      $('#2').addClass("hid").removeClass("vis");
    }
    curImg = '3';
    $('#3').addClass("vis").removeClass("hid");
  }
});
