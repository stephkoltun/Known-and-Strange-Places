function Game() {
    this.status = 'stopped';
    this.level = 1;
    this.speed = 1;

    this.playground = document.getElementById("defaultCanvas0");
    this.playgroundContext = this.playground.getContext("2d");

    this.lastMotionX = 0;
    this.lastMotionY = 0;

    /* Initialize window.requestAnimationFrame taking into account vendor prefixes */
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

}

Game.prototype = {

    start: function() {
        /* Clear the playground */
        //this.clearPlayground();

        /* Draw toy pieces */
        window.mBoundaries.init();
        this.generateBall();

        /* Activate the device motion control */
        window.mDeviceMotionControl.handleMotionEvent();

        /* The game is running now */
        this.status = 'running';
    },

    step: function(motionX, motionY, motionZ, interval) {

        var self = this;

        /* Stop if ball is not rolling */
        if (window.mBall.status !== 'rolling') {
            return;
        }

        /* Calculate the next position of the ball */
        var nextPositionX = window.mBall.position.x - 0 + motionX;
        var nextPositionY = window.mBall.position.y - 0 + motionY;

        window.mBall.prevPositions.push({"x": nextPositionX, "y": nextPositionY});

        /* Check if the ball collides with a brick or boundaries  */
        var collision = CollisionManager.obstacles(nextPositionX, nextPositionY) || CollisionManager.boundaries(nextPositionX, nextPositionY);
        if (collision) {

            if (collision === 'left' || collision === 'right') {
                if ((motionX < 0 && this.lastMotionX < 0) || (motionX > 0 && this.lastMotionX > 0)) {
                    motionX = 0;
                }
            }
            else if (collision === 'top' || collision === 'bottom') {
                if ((motionY < 0 && this.lastMotionY < 0) || (motionY > 0 && this.lastMotionY > 0)) {
                    motionY = 0;
                }
            }

        }

        /* Make the ball roll at the right speed */
        if (this.speed >= 0) {
            this.speed--;
            window.requestAnimationFrame(function() {
                self.step(motionX, motionY, motionZ, interval);
            });
        }
        else {
            this.speed = interval / 100;
        }

        window.mBall.roll(motionX, motionY);

        /* Save last motion */
        if (motionX !== 0) {
            this.lastMotionX = motionX;
        }
        if (motionY !== 0) {
            this.lastMotionY = motionY;
        }

        $.ajax({
          url: "/add",
          type: 'POST',
          dataType: 'application/json',
          data: {
            'x': window.mBall.position.x,
            'y': window.mBall.position.y,
          },
        })
    },

    pause: function() {
        this.status = 'paused';
    },

    resume: function() {
        var self = this;
        setTimeout(function() {
            self.status = 'running';
        }, 1000);
    },

    stop: function() {
        this.status = 'stopped';
    },

    clearPlayground: function() {
        this.playgroundContext.clearRect(0, 0, this.playground.width, this.playground.height);
    },

    generateBall: function() {
        window.mBall.size = window.mBall.originalSize;

        var leftMax = window.mBoundaries.left - 0 + window.mBoundaries.width - window.mBall.size;
        var leftMin = window.mBoundaries.left - 0 + (window.mBoundaries.width / 2);

        var topMax = window.mBoundaries.top - 0 + window.mBoundaries.height - window.mBall.size;
        var topMin = window.mBoundaries.top - 0 + (window.mBoundaries.height / 2);

        window.mBall.position.x = startPoint[0];
        window.mBall.position.y = startPoint[1];
        window.mBall.draw();
    }
};
