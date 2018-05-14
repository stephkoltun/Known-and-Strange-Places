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

    // $( this ).addClass( "hover" );
    if (e.target.id == "a4") {
        $('#a4').attr("src",'sky/a4-IMG_0073.jpg');
    } else if (e.target.id == "b3") {
        $('#b3').attr("src",'sky/b3-IMG_0085.jpg');
    } else if (e.target.id == "b4") {
        $('#b4').attr("src",'sky/b4-IMG_0078.jpg');
    } else if (e.target.id == "c3") {
        $('#c3').attr("src",'sky/c3-IMG_0092.jpg');
    } else if (e.target.id == "c4") {
        $('#c4').attr("src",'sky/c4-IMG_0102.jpg');
    } else if (e.target.id == "c5") {
    	$('#c5').attr("src",'sky/c5-IMG_0110.jpg');
    } else if (e.target.id == "d2") {
    	$('#d2').attr("src",'sky/d2-IMG_0140.jpg');
    } else if (e.target.id == "d3") {
    	$('#d3').attr("src",'sky/d3-IMG_0133.jpg');
    } else if (e.target.id == "d4") {
    	$('#d4').attr("src",'sky/d4-IMG_0124.jpg');
    } else if (e.target.id == "d5") {
    	$('#d5').attr("src",'sky/d5-IMG_0117.jpg');
    } else if (e.target.id == "e2") {
    	$('#e2').attr("src",'sky/e2-IMG_0148.jpg');
    } else if (e.target.id == "e3") {
    	$('#e3').attr("src",'sky/e3-IMG_0155.jpg');
    } else if (e.target.id == "e4") {
    	$('#e4').attr("src",'sky/e4-IMG_0163.jpg');
    } else if (e.target.id == "e5") {
    	$('#e5').attr("src",'sky/e5-IMG_0169.jpg');
    } else if (e.target.id == "f1") {
    	$('#f1').attr("src",'sky/f1-IMG_0220.jpg');
    } else if (e.target.id == "f2") {
    	$('#f2').attr("src",'sky/f2-IMG_0214.jpg');
    } else if (e.target.id == "f3") {
    	$('#f3').attr("src",'sky/f3-IMG_0207.jpg');
    } else if (e.target.id == "f4") {
    	$('#f4').attr("src",'sky/f4-IMG_0201.jpg');
    } else if (e.target.id == "f5") {
    	$('#f5').attr("src",'sky/f5-IMG_0193.jpg');
    } else if (e.target.id == "f6") {
    	$('#f6').attr("src",'sky/f6-IMG_0185.jpg');
    }
  }, function(e) {
    if (e.target.id == "a4") {
        $('#a4').attr("src",'img/a1.png');
    } else if (e.target.id == "b3") {
        $('#b3').attr("src",'img/b1.png');
    } else if (e.target.id == "b4") {
        $('#b4').attr("src",'img/b2.png');
    } else if (e.target.id == "c3") {
        $('#c3').attr("src",'img/c1.png');
    } else if (e.target.id == "c4") {
        $('#c4').attr("src",'img/c2.png');
    } else if (e.target.id == "c5") {
        $('#c5').attr("src",'img/c3.png');
    } else if (e.target.id == "d2") {
        $('#d2').attr("src",'img/d1.png');
    } else if (e.target.id == "d3") {
        $('#d3').attr("src",'img/d2.png');
    } else if (e.target.id == "d4") {
        $('#d4').attr("src",'img/d3.png');
    } else if (e.target.id == "d5") {
        $('#d5').attr("src",'img/d4.png');
    }  else if (e.target.id == "e2") {
        $('#e2').attr("src",'img/e1.png');
    } else if (e.target.id == "e3") {
        $('#e3').attr("src",'img/e2.png');
    } else if (e.target.id == "e4") {
        $('#e4').attr("src",'img/e3.png');
    } else if (e.target.id == "e5") {
        $('#e5').attr("src",'img/e4.png');
    } else if (e.target.id == "f1") {
        $('#f1').attr("src",'img/f1.png');
    } else if (e.target.id == "f2") {
        $('#f2').attr("src",'img/f2.png');
    } else if (e.target.id == "f3") {
        $('#f3').attr("src",'img/f3.png');
    } else if (e.target.id == "f4") {
        $('#f4').attr("src",'img/f4.png');
    } else if (e.target.id == "f5") {
        $('#f5').attr("src",'img/f5.png');
    } else if (e.target.id == "f6") {
        $('#f6').attr("src",'img/f6.png');
    }
  }
);
