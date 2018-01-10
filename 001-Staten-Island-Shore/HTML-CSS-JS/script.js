// generate random start point
            var randomStart = Math.floor(Math.random()*nodes.length);
            console.log("Starting at " + randomStart + " out of " + (nodes.length-1));

            var firstpart = nodes.slice(randomStart);
            var endpart = nodes.slice(0,randomStart-1);
            var pointsAlongShore = firstpart.concat(endpart);

            var startPoint = pointsAlongShore[0];
            var bearingStart = bearing(startPoint.y, startPoint.x, pointsAlongShore[1].y, pointsAlongShore[1].x);

            var textFill = startPoint.x + ", " + startPoint.y
            $("#startPt").text(textFill);
            // initialize map
            mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

            var map = new mapboxgl.Map({
                container: 'map',
                // satellite imagery styling
                style: 'mapbox://styles/stephkoltun/cjc97oyqh0jmq2sp7yydxkggr?optimize=true',
                // set the start point of the map - needs to be long-lat (not lat-long)
                center: [startPoint.x, startPoint.y],    // this should be a random point
                // what scale
                zoom: 17,
                interactive: false,
                bearing: bearingStart
            });

            // fade out text
            $("#desc").delay(5000).fadeOut(1000);


            // parameters for animating
            var animateTime = 6800;
            var animateOptions = {
                duration: animateTime,
                easing: function (t) {
                    return t;
                },
            };

            var i = 1;            
            var timer = window.setInterval(function() {
                if (i < pointsAlongShore.length) {

                    var smoothBearing;

                    // calculate averaged bearing direction
                    if ((i+2) < (pointsAlongShore.length-1)) {
                        // prev to current
                        var bearingPrev = bearing(pointsAlongShore[i-1].y, pointsAlongShore[i-1].x, pointsAlongShore[i].y, pointsAlongShore[i].x);

                        // current to next
                        var bearingNow = bearing(pointsAlongShore[i].y, pointsAlongShore[i].x, pointsAlongShore[i+1].y, pointsAlongShore[i+1].x);

                        // next to next-next
                        var bearingNext = bearing(pointsAlongShore[i+1].y, pointsAlongShore[i+1].x, pointsAlongShore[i+2].y, pointsAlongShore[i+2].x);

                        smoothBearing = (bearingPrev+bearingNow+bearingNext)/3;
                    } else if ((i+1) < (pointsAlongShore.length-1)) {
                        var bearingPrev = bearing(pointsAlongShore[i-1].y, pointsAlongShore[i-1].x, pointsAlongShore[i].y, pointsAlongShore[i].x);

                        // current to next
                        var bearingNow = bearing(pointsAlongShore[i].y, pointsAlongShore[i].x, pointsAlongShore[i+1].y, pointsAlongShore[i+1].x);

                        smoothBearing = (bearingPrev+bearingNow)/2;
                    } else {
                        smoothBearing = bearing(pointsAlongShore[i].y, pointsAlongShore[i].x, pointsAlongShore[i+1].y, pointsAlongShore[i+1].x);
                    }
                    
                    animateOptions.bearing = smoothBearing;

                    // pan to text point
                    var nextPoint = pointsAlongShore[i];
                    var nextPointCoords = [nextPoint.x, nextPoint.y];
                    map.panTo(nextPointCoords,animateOptions);
                    if (i % 10 == 0) {
                        console.log(i + " pan to " + nextPointCoords);
                    }

                    // loop back to beginning of coordinates
                    if (i < pointsAlongShore.length-1) {
                        i++; 
                    } else {
                        i = 0;
                    }
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