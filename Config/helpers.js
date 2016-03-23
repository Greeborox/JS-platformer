module.exports = {
  blockRect: function(r1,r2){
    if(r1&&r2){
      var vx = r1.centerX() - r2.centerX();
      var vy = r1.centerY() - r2.centerY();
      var combinedHalfWidths = r1.width/2 + r2.width/2;
      var combinedHalfHeights = r1.height/2 + r2.height/2;
      if(Math.abs(vx) < combinedHalfWidths){
        if(Math.abs(vy) < combinedHalfHeights){
          var overlapX = combinedHalfWidths - Math.abs(vx);
          var overlapY = combinedHalfHeights - Math.abs(vy);
          if(overlapX >= overlapY) {
            if(vy > 0) {
              if(!r1.onLadder){
                r1.y = r1.y + overlapY;
                r1.vector.y=0;
              }
            } else {
              if(r1.hasOwnProperty('onGround')){
                r1.onGround = true;
              }
              if(r1.hasOwnProperty('onLadder') && r1.y+r1.height> r2.height){
                r1.onLadder = false;
              }
              if(!r1.onLadder){
                r1.y = r1.y - overlapY;
              }
            }
          } else {
            if(vx > 0) {
              r1.x = r1.x + overlapX;
            } else {
              r1.x = r1.x - overlapX;
            }
          }
        }
      }
    }
  },
  getRotation: function(dx,dy){
    rotation = Math.atan2(dy, dx);
    return rotation;
  },
  checkCollision: function(obj1,obj2){
    if(obj1 && obj2) {
      return !(obj1.x + obj1.width < obj2.x ||
               obj2.x + obj2.width < obj1.x ||
               obj1.y + obj1.height < obj2.y ||
               obj2.y + obj2.height < obj1.y);
    }
  }
}
