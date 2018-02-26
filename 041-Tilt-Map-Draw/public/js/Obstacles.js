var blocks = [];

function Obstacles() {
    this.items = blocks;
    this.draw();
}

Obstacles.prototype = {
    /*
     * draw
     * Draw the obstacles
     */
    draw: function() {

      for (var i = 0; i < this.items.length; i++) {
        var shape = this.items[i];
        fill("#3385B7");
        stroke("#234994");
        strokeWeight(10);
        beginShape();
        for (var v = 0; v < shape.vertices.length; v++) {
          shape.poly[v] = createVector(shape.vertices[v].x,shape.vertices[v].y);
          vertex(shape.vertices[v].x,shape.vertices[v].y);
        }
        endShape(CLOSE);
      }
    }
};
