$('img').hover(function(e) {

    $( this ).addClass( "hover" );
    if (e.target.id == "a4") {
    	var label = $('#row1').append("<h1 id='label'>x/y: 4m, z: 7m</h1>");
    	$('#label').css('top','-100px');
    } else if (e.target.id == "b3") {
    	var label = $('#row2').append("<h1 id='label'>x/y: 4m, z: 7m</h1>");
    	$('#label').css('top','-100px');
    } else if (e.target.id == "b4") {
    	var label = $('#row2').append("<h1 id='label'>x/y: 4m, z: 7m</h1>");
    	$('#label').css('top','-100px').css('left','200px');
    } else if (e.target.id == "c3") {
    	var label = $('#row3').append("<h1 id='label'>x/y: 4m, z: 7m</h1>");
    	$('#label').css('top','-100px');
    } else if (e.target.id == "c4") {
    	var label = $('#row3').append("<h1 id='label'>x/y: 4m, z: 4m</h1>");
    	$('#label').css('top','-100px').css('left','200px');
    } else if (e.target.id == "c5") {
    	var label = $('#row3').append("<h1 id='label'>x/y: 4m, z: 6m</h1>");
    	$('#label').css('top','-100px').css('left','400px');
    } else if (e.target.id == "d2") {
    	var label = $('#row4').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px');
    } else if (e.target.id == "d3") {
    	var label = $('#row4').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','200px');
    } else if (e.target.id == "d4") {
    	var label = $('#row4').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','400px');
    }  else if (e.target.id == "d5") {
    	var label = $('#row4').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','600px');
    } else if (e.target.id == "e2") {
    	var label = $('#row5').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px');
    } else if (e.target.id == "e3") {
    	var label = $('#row5').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','200px');
    } else if (e.target.id == "e4") {
    	var label = $('#row5').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','400px');
    } else if (e.target.id == "e5") {
    	var label = $('#row5').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','600px');
    } else if (e.target.id == "e6") {
    	var label = $('#row5').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','800px');
    } else if (e.target.id == "f1") {
    	var label = $('#row6').append("<h1 id='label'>x/y: 4m, z: 6m</h1>");
    	$('#label').css('top','-100px')
    } else if (e.target.id == "f2") {
    	var label = $('#row6').append("<h1 id='label'>x/y: 3m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','200px');
    } else if (e.target.id == "f3") {
    	var label = $('#row6').append("<h1 id='label'>x/y: 3m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','400px');
    } else if (e.target.id == "f4") {
    	var label = $('#row6').append("<h1 id='label'>x/y: 3m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','600px');
    } else if (e.target.id == "f5") {
    	var label = $('#row6').append("<h1 id='label'>x/y: 4m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','800px');
    } else if (e.target.id == "f6") {
    	var label = $('#row6').append("<h1 id='label'>x/y: 3m, z: 3m</h1>");
    	$('#label').css('top','-100px').css('left','1000px');
    }
  }, function() {
    $( this ).removeClass( "hover" );
    $('#label').remove();
  }
);