var CollisionManager = {
  /*
  * boundaries
  * Check whether the ball should crash against a boundary
  * @param {Double} x
  * @param {Double} y
  * @returns {String} collision direction
  */
  boundaries: function(x, y) {
    var ret = '';

    /* Boundaries */
    if (y <= (window.mBoundaries.top - 0 + (window.mBall.size / 2))) {
      ret += 'top';
    }
    else if (y >= (window.mBoundaries.height - 0 + window.mBoundaries.margin - (window.mBall.size / 2))) {
      ret += 'bottom';
    }

    if (x <= (window.mBoundaries.left + (window.mBall.size / 2))) {
      ret += 'left';
    }
    else if (x >= (window.mBoundaries.width - 0 + window.mBoundaries.margin - (window.mBall.size / 2))) {
      ret += 'right';
    }

    if (ret !== '') {
      return ret;
    }

    return false;
  },
  /*
  * obstacles
  * Check whether the ball should crash against a brick
  * @param {Double} x
  * @param {Double} y
  * @returns {String} collision direction
  */
  obstacles: function(x, y) {

    var obstacles = window.mObstacles.items;
    var buffer = (window.mBall.size+2)/2;

    var leftEdge = {
      x: window.mBall.position.x - buffer,
      y: window.mBall.position.y
    };

    var leftTop = {
      x: window.mBall.position.x - buffer,
      y: window.mBall.position.y - buffer
    }

    var leftBottom = {
      x: window.mBall.position.x - buffer,
      y: window.mBall.position.y + buffer
    }

    var rightEdge = {
      x: window.mBall.position.x + buffer,
      y: window.mBall.position.y
    };

    var rightTop = {
      x: window.mBall.position.x + buffer,
      y: window.mBall.position.y - buffer
    }

    var rightBottom = {
      x: window.mBall.position.x + buffer,
      y: window.mBall.position.y + buffer
    }

    var topEdge = {
      x: window.mBall.position.x,
      y: window.mBall.position.y - buffer
    };

    var bottomEdge = {
      x: window.mBall.position.x,
      y: window.mBall.position.y + buffer
    };


    for (var i = 0; i < obstacles.length; i++) {
      var poly = obstacles[i].poly;
      var hitLeft = collidePointPoly(leftEdge.x,leftEdge.y,poly);
      var hitLeftTop = collidePointPoly(leftTop.x,leftTop.y,poly);
      var hitLeftBottom = collidePointPoly(leftBottom.x,leftBottom.y,poly);

      var hitRight = collidePointPoly(rightEdge.x,rightEdge.y,poly);
      var hitRightTop = collidePointPoly(rightTop.x,rightTop.y,poly);
      var hitRightBottom = collidePointPoly(rightBottom.x,rightBottom.y,poly);

      var hitTop = collidePointPoly(topEdge.x,topEdge.y,poly);
      var hitBottom = collidePointPoly(bottomEdge.x,bottomEdge.y,poly);

      if (hitLeft) {
        return 'left';
      } else if (hitRight) {
        return 'right';
      } else if (hitTop || hitLeftTop || hitRightTop) {
        return 'top';
      } else if (hitBottom || hitLeftBottom || hitRightBottom) {
        return 'bottom';
      }
    }

    return false;
  }
};
