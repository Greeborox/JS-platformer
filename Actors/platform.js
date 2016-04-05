var entity = require('./entity');
var c = require('../Config/canvas');

platform = entity.newEntity();
platform.color = "gray";
platform.opacity = 1;

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
  newVanishingPlatform: function(x,y,width,height,color){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.opacity = Math.random();
    newPlat.width = width;
    newPlat.height = height;
    newPlat.vanishing = true;
    newPlat.invisible = false;
    newPlat.invisibleFor = 0;
    newPlat.invisibleTime = 100;
    if(color){
      newPlat.color = color;
    };
    newPlat.update = function(){
      if(this.vanishing){
        this.opacity -= 0.005;
        if(this.opacity < 0){
          this.opacity = 0;
          this.vanishing = false;
          this.invisible = true;
        }
      }

      if(this.invisible){
        if(this.invisibleFor < this.invisibleTime) {
          this.invisibleFor++;
        } else {
          this.invisibleFor = 0;
          this.invisible = false;
        }
      }

      if(!this.vanishing && !this.invisible){
        this.opacity += 0.005;
        if(this.opacity > 1){
          this.vanishing = true;
        }
      }
    };
    newPlat.draw = function(ctx){
      ctx.globalAlpha=this.opacity;
      ctx.fillRect(this.x,this.y,this.width,this.height);
      ctx.globalAlpha=1;
    }
    return newPlat;
  },
}
