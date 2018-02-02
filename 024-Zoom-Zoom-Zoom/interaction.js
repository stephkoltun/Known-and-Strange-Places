$(document).keypress(function(e) {
  if(e.keyCode == 32) {
    if (zoomLevel < maxZoomLevels) {
      zoomLevel ++;
      replaceImgs();
      sampleColor();

    } else {
      zoomLevel = 1;
      replaceImgs();
      sampleColor();
    }
  }
});
