var imgSize = $(window).height()/6;
var topOffset = imgSize/2 * -1;
var leftOffset = imgSize * -1;

setSizes();

$( window ).resize(setSizes);

function setSizes() {
  imgSize = $(window).height()/6;
  topOffset = imgSize/2 * -1;
  leftOffset = imgSize * -1;

  $('img').css("width", imgSize + "px");
  $('img').css("height", imgSize + "px");

  $("div#images").css("width", imgSize*6 + "px");

  $('#label').css("width", imgSize + "px");

  $("#row1").css("margin-left", imgSize*3 + "px");
  $("#row2, #row3").css("margin-left", imgSize*2 + "px");
  $("#row4, #row5").css("margin-left", imgSize + "px");
}

$('img').hover(function(e) {

    $( this ).addClass( "hover" );

    var leftOffsetFactor = 1;

    if (e.target.id == "a4") {
    	var label = $('#row1').append("<div id='label'><p>x/y: 4m</p><p>z: 7m</p></div>");
      $('#row1').css('height', imgSize + 'px');
    } else if (e.target.id == "b3") {
    	var label = $('#row2').append("<div id='label'><p>x/y: 4m</p><p>z: 7m</p></div>");
      leftOffsetFactor = 1.5;
      $('#row2').css('height', imgSize + 'px');
    } else if (e.target.id == "b4") {
    	var label = $('#row2').append("<div id='label'><p>x/y: 4m</p><p>z: 7m</p></div>");
      leftOffsetFactor = 0.5;
      $('#row2').css('height', imgSize + 'px');
    } else if (e.target.id == "c3") {
    	var label = $('#row3').append("<div id='label'><p>x/y: 4m</p><p>z: 7m</p></div>");
      leftOffsetFactor = 1.5;
      $('#row3').css('height', imgSize + 'px');
    } else if (e.target.id == "c4") {
    	var label = $('#row3').append("<div id='label'><p>x/y: 4m</p><p>z: 4m</p></div>");
      $('#row3').css('height', imgSize + 'px');
      leftOffsetFactor = 0.5;
    } else if (e.target.id == "c5") {
    	var label = $('#row3').append("<div id='label'><p>x/y: 4m</p><p>z: 6m</p></div>");
      $('#row3').css('height', imgSize + 'px');
      leftOffsetFactor = -0.5;
    } else if (e.target.id == "d2") {
    	var label = $('#row4').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row4').css('height', imgSize + 'px');
      leftOffsetFactor = 2;
    } else if (e.target.id == "d3") {
    	var label = $('#row4').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row4').css('height', imgSize + 'px');
    } else if (e.target.id == "d4") {
    	var label = $('#row4').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row4').css('height', imgSize + 'px');
      leftOffsetFactor = 0;
    }  else if (e.target.id == "d5") {
    	var label = $('#row4').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row4').css('height', imgSize + 'px');
      leftOffsetFactor = -1;
    } else if (e.target.id == "e2") {
    	var label = $('#row5').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row5').css('height', imgSize + 'px');
      leftOffsetFactor = 2;
    } else if (e.target.id == "e3") {
    	var label = $('#row5').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row5').css('height', imgSize + 'px');
    } else if (e.target.id == "e4") {
    	var label = $('#row5').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row5').css('height', imgSize + 'px');
      leftOffsetFactor = 0;
    } else if (e.target.id == "e5") {
    	var label = $('#row5').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row5').css('height', imgSize + 'px');
      leftOffsetFactor = -1;
    } else if (e.target.id == "e6") {
    	var label = $('#row5').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row5').css('height', imgSize + 'px');
      leftOffsetFactor = -2;
    } else if (e.target.id == "f1") {
    	var label = $('#row6').append("<div id='label'><p>x/y: 4m</p><p>z: 6m</p></div>");
      $('#row6').css('height', imgSize + 'px');
      leftOffsetFactor = 2.5;
    } else if (e.target.id == "f2") {
    	var label = $('#row6').append("<div id='label'><p>x/y: 3m</p><p>z: 3m</p></div>");
      $('#row6').css('height', imgSize + 'px');
      leftOffsetFactor = 1.5;
    } else if (e.target.id == "f3") {
    	var label = $('#row6').append("<div id='label'><p>x/y: 3m</p><p>z: 3m</p></div>");
      $('#row6').css('height', imgSize + 'px');
      leftOffsetFactor = 0.5;
    } else if (e.target.id == "f4") {
    	var label = $('#row6').append("<div id='label'><p>x/y: 3m</p><p>z: 3m</p></div>");
      $('#row6').css('height', imgSize + 'px');
      leftOffsetFactor = -0.5;
    } else if (e.target.id == "f5") {
    	var label = $('#row6').append("<div id='label'><p>x/y: 4m</p><p>z: 3m</p></div>");
      $('#row6').css('height', imgSize + 'px');
      leftOffsetFactor = -1.5;
    } else if (e.target.id == "f6") {
    	var label = $('#row6').append("<div id='label'><p>x/y: 3m</p><p>z: 3m</p></div>");
      $('#row6').css('height', imgSize + 'px');
      leftOffsetFactor = -2.5;
    }

    $('#label').css('top', topOffset-16 + 'px');
    $('#label').css('left', leftOffset*leftOffsetFactor + 'px');
  }, function() {
    $( this ).removeClass( "hover" );
    $('#label').remove();
  }
);
