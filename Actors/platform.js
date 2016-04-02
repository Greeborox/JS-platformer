var entity = require('./entity');
var c = require('../Config/canvas');

platform = entity.newEntity();
platform.color = "gray";

module.exports = {
  newPlatform: function(x,y,width,height,color){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.width = width;
    newPlat.height = height;
    if(color){
      newPlat.color = color;
    }
    return newPlat;
  },
  newMovingPlatform: function(x,y,width,height,color, maxY, minY, speed){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.maxY = maxY;
    newPlat.minY = minY;
    newPlat.width = width;
    newPlat.height = height;
    newPlat.goingDown = true;
    if(color){
      newPlat.color = color;
    }
    newPlat.speed = speed;
    newPlat.update = function(){
      if(this.y >= this.maxY) {
        this.y = this.maxY;
      }
      if(this.y <= this.minY) {
        this.y = this.minY;
      }
      if(this.y === this.maxY && this.goingDown === true) {
        this.goingDown = false;
      }
      if(this.y === this.minY && this.goingDown === false) {
        this.goingDown = true;
      }
      if(this.goingDown) {
        this.y += this.speed;
      } else {
        this.y -= this.speed;
      }
    }
    return newPlat;
  },
}
