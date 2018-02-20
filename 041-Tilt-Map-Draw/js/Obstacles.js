var blocks = [];

function Obstacles() {
    this.items = blocks;
}

Obstacles.prototype = {
    /*
     * draw
     * Draw the obstacles
     */
    draw: function() {

      for (var i = 0; i < this.items.length; i++) {
        var shape = this.items[i];
        fill("#28788E");

        noStroke();
        beginShape();
        for (var v = 0; v < shape.vertices.length; v++) {
          shape.poly[v] = createVector(shape.vertices[v].x,shape.vertices[v].y);
          vertex(shape.vertices[v].x,shape.vertices[v].y);
        }
        endShape(CLOSE);
      }
    }
};
