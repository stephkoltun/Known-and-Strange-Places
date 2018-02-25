import org.openkinect.freenect.*;
import org.openkinect.freenect2.*;
import org.openkinect.processing.*;
import java.util.Calendar;

Kinect2 kinect;

String timeForSave;
String saveName;
boolean save = false;

// Don't evaluate every pixel
int skip = 1;

void setup() 
{
  size(1536, 424, P2D);

  kinect = new Kinect2(this);
  kinect.initDepth();
  kinect.initVideo();
  kinect.initRegistered();
  kinect.initDevice();

  smooth(16);
  timeForSave = datestamp()+"_"+shortTimestamp();
}


int offset = 20;
int xMin = 256-offset;
int xMax = 256+offset;
int yMin = 212-offset;
int yMax = 212+offset;

void draw() 
{
  background(0);
  noFill();
  PImage depthImg = kinect.getDepthImage();
  image(depthImg, 0, 0);


  // draw the line at which the section is cut (MIDDLE)
  for (int x = xMin; x < xMin+1; x++) {
    strokeWeight(2);
    stroke(0, 155, 155);
    line(x, 0, x, height);
    strokeWeight(1);
    stroke(0, 255, 255);
    fill(0, 255, 255, 50);
    drawSection(x, "X");
  }

  for (int y = yMin; y < yMin+1; y++) {
    strokeWeight(2);
    stroke(100, 155, 50);
    line(0, y, 512, y);
    strokeWeight(1);
    stroke(150, 255, 150);
    fill(150, 255, 150, 50);
    drawSection(y, "Y");
  }

  if (save) {
    saveFrame("output/" + timeForSave + "/#####.png");
  }
}

void drawSection(int _v, String _mode) {
  // Get the raw depth as array of integers
  int[] depth = kinect.getRawDepth();

  beginShape();
  
  if ( _mode == "X") {
    vertex(511,0);
    for (int y = 0; y < kinect.depthHeight; y += skip) {
      int offset = _v + y * kinect.depthWidth;
      int depthVal = depth[offset];
      float xPos = map(depthVal, 0, 4500, 512, 0);
      if (depthVal != 0) {
        vertex(xPos+511, y);
      }
    }
    vertex(511,height);
    
  } else if ( _mode == "Y") {
    vertex(1023,0);
    for (int x = 0; x < kinect.depthWidth; x += skip) {
      int offset = x + _v * kinect.depthWidth;
      int depthVal = depth[offset];
      float yPos = map(depthVal, 0, 4500, 424, 0);
      if (depthVal != 0) {
        vertex(x+1023, yPos);
      }
    }
    vertex(width,0);
  }
  endShape(CLOSE);
}