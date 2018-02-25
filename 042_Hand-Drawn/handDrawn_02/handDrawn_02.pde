/*
Thomas Sanchez Lengeling.
 http://codigogenerativo.com/
 
 KinectPV2, Kinect for Windows v2 library for processing
 
 3D Skeleton.
 Some features a not implemented, such as orientation
 */

import KinectPV2.KJoint;
import KinectPV2.*;

KinectPV2 kinect;
FloatList prevPositions;

void setup() {
  size(1920, 1080);

  prevPositions = new FloatList();

  kinect = new KinectPV2(this);
  kinect.enableColorImg(true);
  //enable 3d  with (x,y,z) position
  kinect.enableSkeleton3DMap(true);

  kinect.init();
  background(0);
}


PImage img;

void draw() {
  image(kinect.getColorImage(), 0, 0, 1920, 1080);
  filter(GRAY);

  ArrayList<KSkeleton> skeletonArray =  kinect.getSkeleton3d();

if (frameCount >= 30) {
  //individual JOINTS
  for (int i = 0; i < skeletonArray.size(); i++) {
    KSkeleton skeleton = (KSkeleton) skeletonArray.get(i);
    if (skeleton.isTracked()) {
      KJoint[] joints = skeleton.getJoints();
      
      drawJoint(joints, KinectPV2.JointType_HandRight);
    }
  }
}

}


void drawPath() {
  if (prevPositions.size() > 2) {
    stroke(0,255,255,10);
    strokeWeight(32);
    beginShape();
    for (int v = 0; v < prevPositions.size(); v+=2) {
      vertex(prevPositions.get(v), prevPositions.get(v+1));
    }
    endShape();
    
    stroke(0,255,255,30);
    strokeWeight(22);
    beginShape();
    for (int v = 0; v < prevPositions.size(); v+=2) {
      vertex(prevPositions.get(v), prevPositions.get(v+1));
    }
    endShape();
    
    stroke(0,255,255,50);
    strokeWeight(14);
    beginShape();
    for (int v = 0; v < prevPositions.size(); v+=2) {
      vertex(prevPositions.get(v), prevPositions.get(v+1));
    }
    endShape();
    
    stroke(0,255,255,150);
    strokeWeight(5);
    beginShape();
    for (int v = 0; v < prevPositions.size(); v+=2) {
      vertex(prevPositions.get(v), prevPositions.get(v+1));
    }
    endShape();
  }
}

void drawJoint(KJoint[] joints, int jointType) {
  float xPos = joints[jointType].getX();
  float yPos = joints[jointType].getY();
  float xMap = map(xPos,-1,1,0,1920);
  float yMap = map(yPos,1,-1,0,1080);
  
  prevPositions.append(xMap);
  prevPositions.append(yMap);
  
  
  noFill();
  strokeJoin(ROUND);
  strokeCap(ROUND);
  drawPath();

  
  noStroke();
  fill(color(0,255,255,100));
  ellipse(xMap,yMap,10,10);
  
}