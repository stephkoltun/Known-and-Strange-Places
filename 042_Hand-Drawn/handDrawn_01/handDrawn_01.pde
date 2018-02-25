import KinectPV2.*;
KinectV2 kinect;

void setup() {
  size(900,768);
  kinect = new KinectV2(this);
  kinect.enableColorImg(true);
  kinect.enableSkeleton(true); 
  kinect.init();
}