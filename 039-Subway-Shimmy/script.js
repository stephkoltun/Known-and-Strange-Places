// generate random start point
var nodes = features.features;

var randomStart = Math.floor(Math.random()*nodes.length);
console.log("Starting at " + randomStart + " out of " + (nodes.length-1));

var firstpart = nodes.slice(randomStart);
var endpart = nodes.slice(0,randomStart-1);
var pointsAlongShore = firstpart.concat(endpart);

var startPoint = pointsAlongShore[0];
var bearingStart = bearing(startPoint.geometry.coordinates[1], startPoint.geometry.coordinates[0], pointsAlongShore[1].geometry.coordinates[1], pointsAlongShore[1].geometry.coordinates[0]);

var textFill = startPoint.geometry.coordinates[1] + ", " + startPoint.geometry.coordinates[0]
$("#startPt").text(textFill);
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/stephkoltun/cjc97oyqh0jmq2sp7yydxkggr?optimize=true',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [startPoint.geometry.coordinates[0], startPoint.geometry.coordinates[1]],    // this should be a random point
    // what scale
    zoom: 17,
    interactive: false,
    bearing: bearingStart
});

// fade out text
$("#desc").delay(5000).fadeOut(1000);


// parameters for animating
var animateTime = 5000;
var animateOptions = {
    duration: animateTime,
    easing: function (t) {
        return t;
    },
};

var i = 1;
var multiplier = 1;

var timer = window.setInterval(function() {
    if (i < pointsAlongShore.length) {

        var smoothBearing;
        // calculate averaged bearing direction
        if ((i+2) < (pointsAlongShore.length-1)) {
            // prev to current
            var bearingPrev = bearing(pointsAlongShore[i-1].geometry.coordinates[1], pointsAlongShore[i-1].geometry.coordinates[0], pointsAlongShore[i].geometry.coordinates[1], pointsAlongShore[i].geometry.coordinates[0]);

            // current to next
            var bearingNow = bearing(pointsAlongShore[i].geometry.coordinates[1], pointsAlongShore[i].geometry.coordinates[0], pointsAlongShore[i+1].geometry.coordinates[1], pointsAlongShore[i+1].geometry.coordinates[0]);

            // next to next-next
            var bearingNext = bearing(pointsAlongShore[i+1].geometry.coordinates[1], pointsAlongShore[i+1].geometry.coordinates[0], pointsAlongShore[i+2].geometry.coordinates[1], pointsAlongShore[i+2].geometry.coordinates[0]);

            smoothBearing = (bearingPrev+bearingNow+bearingNext)/3;
        } else if ((i+1) < (pointsAlongShore.length-1)) {
            var bearingPrev = bearing(pointsAlongShore[i-1].geometry.coordinates[1], pointsAlongShore[i-1].geometry.coordinates[0], pointsAlongShore[i].geometry.coordinates[1], pointsAlongShore[i].geometry.coordinates[0]);

            // current to next
            var bearingNow = bearing(pointsAlongShore[i].geometry.coordinates[1], pointsAlongShore[i].geometry.coordinates[0], pointsAlongShore[i+1].geometry.coordinates[1], pointsAlongShore[i+1].geometry.coordinates[0]);

            smoothBearing = (bearingPrev+bearingNow)/2;
        } else {
            smoothBearing = bearing(pointsAlongShore[i].geometry.coordinates[1], pointsAlongShore[i].geometry.coordinates[0], pointsAlongShore[i+1].geometry.coordinates[1], pointsAlongShore[i+1].geometry.coordinates[0]);
        }

        animateOptions.bearing = smoothBearing;

        // pan to text point
        var nextPoint = pointsAlongShore[i];
        var nextPointCoords = [nextPoint.geometry.coordinates[0], nextPoint.geometry.coordinates[1]];
        map.panTo(nextPointCoords,animateOptions);
        if (i % 10 == 0) {
            console.log(i + " pan to " + nextPointCoords);
        }

        // loop back to beginning of coordinates
        // if (i < pointsAlongShore.length-1) {
        //     i++;
        // } else {
        //     i = 0;
        // }

        if (i == 1) {
          multiplier = 1;
        } else if (i == pointsAlongShore.length-1) {
          multiplier = -1
        }

        i = i+multiplier;
    } else {
        window.clearInterval(timer);
    }
}, animateTime);




function bearing(lat1,lng1,lat2,lng2) {
    var dLon = (lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = this._toDeg(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
};
function _toDeg(rad) {
    return rad * 180 / Math.PI;
};
