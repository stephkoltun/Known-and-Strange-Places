/*
*
* Device Orientation API
* http://www.w3.org/TR/orientation-event/
*/

function DeviceMotionControl() {
}

DeviceMotionControl.prototype = {
  /*
  * handleMotionEvent
  * Listen to the devicemotion event and invoke the callback function every time the event is fired
  * @param {Function} callback
  */
  handleMotionEvent: function(callback) {

    /* In Safari for iOS the direction are reversed on axes x and y */
    var implementationFix = 1;
    if (window.navigator.userAgent.match(/^.*(iPhone|iPad).*(OS\s[0-9]).*(CriOS|Version)\/[.0-9]*\sMobile.*$/i)) { // is Mobile Safari
      implementationFix = -1;
    }

    /* Add a listener for the devicemotion event */
    window.addEventListener('devicemotion', function(deviceMotionEvent) {
      /* Get acceleration on x, y and z axis */
      var x = deviceMotionEvent.accelerationIncludingGravity.x * implementationFix;
      var y = deviceMotionEvent.accelerationIncludingGravity.y * implementationFix;
      var z = deviceMotionEvent.accelerationIncludingGravity.z;

      /* Get the interval (ms) at which data is obtained from the underlying hardware */
      var interval = deviceMotionEvent.interval;

      // move the ball a step
      window.mGame.step(-x, y, z, interval);
    })
  }
};
