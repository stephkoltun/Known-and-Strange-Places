var buildingSizeArray = [];

for (var i = 0; i < 1000; i++) {
	var thisBuilding = buildingsObj.features[i].properties.SHAPE_AREA

	buildingSizeArray.push(buildingSize);
}

var threshold = 14;

var clusters = clusterfck.hcluster(buildingSizeArray, clusterfck.EUCLIDEAN_DISTANCE,
	clusterfck.COMPLETE_LINKAGE);