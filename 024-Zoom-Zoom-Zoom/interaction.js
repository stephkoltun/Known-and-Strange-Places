function changeZoom(dir) {
  switch(dir) {
    case("up"):
      if (zoomLevel < maxZoomLevels) {
        zoomLevel ++;
      } else {
        zoomLevel = 1;
      }
      break;
    case("down"):
      if (zoomLevel > 1) {
        zoomLevel --;
      } else {
        zoomLevel = 6;
      }
      break;
  }

  replaceImgs();
  sampleColor();
};
