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
              if(!r1.onLadder){
                r1.y = r1.y - overlapY;
              }
              if(r1.hasOwnProperty('onGround')){
                r1.onGround = true;
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
  blockLedge: function(r1,r2){
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
            if(vy < 0) {
              if(!r1.onLadder){
                if(r1.kneelingFor < 29){
                  r1.y = r1.y - overlapY;
                } else {
                  r1.getsUpIn = 10;
                }
              }
              if(r1.hasOwnProperty('onGround')){
                r1.onGround = true;
              }
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
  },
  drawButton: function(button,ctx){
    if(button.hover){
      ctx.fillStyle = 'gray';
    } else {
      ctx.fillStyle = button.color;
    }
    ctx.fillRect(button.x,button.y,button.width,button.height);
    ctx.font="20px Arial";
    ctx.fillStyle = '#000';
    ctx.textAlign = "center"
    ctx.fillText(button.text,button.x+button.width/2,button.y+button.height/2+6);
  },
  checkPointCollision: function(point,obj){
    if(point.x > obj.x && point.x < obj.x+obj.width){
      if(point.y > obj.y && point.y < obj.y+obj.height){
        return true;
      }
    }
    return false;
  },
}
