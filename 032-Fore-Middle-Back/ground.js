
$("#desc").delay(3000).fadeOut(1000);

var curImg = '2';

$("body").mousemove(function(event) {
    var windowWidth = $(window).width();
    if (event.pageX < windowWidth/3 && curImg != '1') {
        // change img
				if (curImg == '2') {
					$('#2').addClass("hid").removeClass("vis");
				} else if (curImg == '3') {
					$('#3').addClass("hid").removeClass("vis");
				}

				curImg = '1';
        $('#1').addClass("vis").removeClass("hid");
    }

    if ((event.pageX > windowWidth/3) && (event.pageX < (windowWidth/3)*2) && (curImg != '2')) {
			// change img
			if (curImg == '1') {
				$('#1').addClass("hid").removeClass("vis");
			} else if (curImg == '3') {
				$('#3').addClass("hid").removeClass("vis");
			}
			curImg = '2';
			$('#2').addClass("vis").removeClass("hid");
    }

		if ((event.pageX > (windowWidth/3)*2) && (curImg != '3')) {
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
