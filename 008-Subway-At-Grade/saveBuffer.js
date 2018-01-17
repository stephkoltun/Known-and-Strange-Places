var tempBufferObj = {
        "type": "FeatureCollection",
        "features": [],
    }

var allEntrances = entrancesObj.features;
for (var i = 0; i < allEntrances.length; i++) {
    var coords = allEntrances[i].geometry.coordinates;
    var entrance = turf.polygon(coords);
    var buffer = turf.buffer(entrance, .03, {units: 'kilometers'})

    var bbox = turf.bbox(buffer);
    var bboxPoly = turf.bboxPolygon(bbox);

    var x1 = coords[0][0][0];
    var x2 = coords[0][1][0];
    var y1 = coords[0][0][1];
    var y2 = coords[0][1][1];
    
    var run = Math.abs(x1-x2);
    var rise = Math.abs(y1-y2);
    var angle = Math.atan(run/rise) * 180/Math.PI;

    var rotatedPoly = turf.transformRotate(bboxPoly, angle)
    // add properties to this rotated poly feature
    rotatedPoly.properties = allEntrances[i].properties;

    tempBufferObj.features.push(rotatedPoly);

    // var sourceName = thisLayer.dataName + 'Buffer' + i;
    // var layerName = thisLayer.layerId + 'Buffer' + i;
    // map.addSource(sourceName, {
    //     "type": "geojson",
    //     "data": rotatedPoly,
    // });
    // map.addLayer({
    //     "id": layerName,
    //     "type": "line",
    //     "source": sourceName,
    //     'paint': {
    //         "line-color": '#000000',
    //         "line-width": 1
    //     }
    // })
    if (tempBufferObj.features.length == allEntrances.length) {
        console.log(tempBufferObj);
        $('body').text(JSON.stringify(tempBufferObj))  
    }
}


