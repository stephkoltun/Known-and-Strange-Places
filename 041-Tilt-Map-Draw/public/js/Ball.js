function Ball(settings) {
    this.originalSize = settings.size;
    this.size = settings.size;
    this.color = settings.color;
    this.trace = settings.trace;
    this.status = 'rolling'; // rolling, jumping, crashing, onabrick, falling
    this.position = {
        x: settings.xPos,
        y: settings.yPos
    };

    this.prevPositions = [];

    /* Draw the ball */
    //this.draw();
}



Ball.prototype = {
    /*
     * draw
     * Draw the ball
     */
    draw: function() {
        // the trace
        if (this.prevPositions.length > 1) {
          for (var i = 1; i < this.prevPositions.length; i++) {
            window.mGame.playgroundContext.strokeStyle = this.trace;
            window.mGame.playgroundContext.lineWidth=7;
            window.mGame.playgroundContext.beginPath();
            window.mGame.playgroundContext.moveTo(this.prevPositions[i].x, this.prevPositions[i].y);
            window.mGame.playgroundContext.lineTo(this.prevPositions[i-1].x, this.prevPositions[i-1].y);
            window.mGame.playgroundContext.stroke();
          }
        }

        window.mGame.playgroundContext.fillStyle = this.color;
        window.mGame.playgroundContext.beginPath();
        window.mGame.playgroundContext.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
        window.mGame.playgroundContext.closePath();
        window.mGame.playgroundContext.fill();
    },
    /*
     * roll
     * Make the ball roll
     */
    roll: function(motionX, motionY) {

        this.position.y += motionY*2;
        this.position.x += motionX*2;

        window.mGame.clearPlayground();
        window.mBoundaries.draw();
        window.mObstacles.draw();
        this.draw();
    },
    /*
     * crash
     * Make the ball crash against boundaries
     */
    crash: function(outofboundaries) {
        this.status = 'crashing';

        if (outofboundaries === 'left') {
            this.position.x = window.mBoundaries.left - 0 + (this.originalSize / 2);
        }
        else if (outofboundaries === 'top') {
            this.position.y = window.mBoundaries.top - 0 + (this.originalSize / 2);
        }
        else if (outofboundaries === 'right') {
            this.position.x = window.mBoundaries.top - 0 + window.mBoundaries.width - (this.originalSize / 2);
        }
        else if (outofboundaries === 'bottom') {
            this.position.y = window.mBoundaries.left - 0 + window.mBoundaries.height - (this.originalSize / 2);
        }

        this.draw();
    },
};
