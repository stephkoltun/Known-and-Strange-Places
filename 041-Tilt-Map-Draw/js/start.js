// built using this example from mozilla
// https://developer.mozilla.org/en-US/Apps/Fundamentals/gather_and_modify_data/responding_to_device_orientation_changes
// https://github.com/voronomari/rolling-ball

var startPoint;

function init() {
    console.log("start game");

    /* Create a new Game */
    window.mGame = new Game();

    window.mObstacles = new Obstacles();

    /* Create new Boundaries and Obstacles */
    window.mBoundaries = new Boundaries({
        margin: 10
    });

    /* Create the ball */
    window.mBall = new Ball({
        color: "#E7493D",
        trace: "#F05B53",
        size: 18,
        xPos: startPoint[0],
        yPos: startPoint[1]
    });

    /* Add devicemotion control */
    window.mDeviceMotionControl = new DeviceMotionControl();

    /* Start the game */
    window.mGame.start();
}

/* Call init() when the window is loaded */
// window.onload = init;
