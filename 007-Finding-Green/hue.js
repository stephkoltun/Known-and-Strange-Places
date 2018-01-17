$("#desc").delay(3000).fadeOut(1000);

var curImg = 'aer';

$("body").mousemove(function(event) {
    var windowWidth = $(window).width();
    if (curImg == 'aer') {
        if (event.pageX < windowWidth/2) {
            // change to hue
            curImg = 'hue';
            $('#hue').addClass("vis").removeClass("hid");
            $('#aer').addClass("hid").removeClass("vis");
        }
    } else if (curImg == 'hue') {
        if (event.pageX > windowWidth/2) {
            // change to aerial
            curImg = 'aer';
            $('#aer').addClass("vis").removeClass("hid");
            $('#hue').addClass("hid").removeClass("vis");
        }
    }
    
})
