var helpers = require('../../Config/helpers');
var Entity = require('../entity')

var fireBomb = Entity.newEntity();
fireBomb.type = "fireBomb";
fireBomb.speedX = 10;
fireBomb.speedY = 10;
fireBomb.width = 15;
fireBomb.height = 15;
fireBomb.x = 0;
fireBomb.y = 0;
fireBomb.power = 100;

module.exports = {
  newMissile: function(x,y,width,mx,my,direction){
    missile = Object.create(fireBomb);
    missile.x = x+(width/2);
    missile.y = y+10;
    missile.direction = direction;
    if(!missile.direction){
      missile.speedX = (mx-missile.x)/10;
    } else {
      missile.speedX = (missile.x-mx)/10;
    }
    if(missile.speedX > 10){
      missile.speedX = 10;
    }
    if(missile.speedX < 2){
      missile.speedX = 2;
    }
    missile.speedY = (missile.y-my)/4;

    if(missile.speedY > 15){
      missile.speedY = 15;
    }
    if(missile.speedY < 5){
      missile.speedY = 5;
    }
    return missile;
  },
  updateMissile: function(missile){
    if(!missile.direction){
      missile.x += missile.speedX;
    } else {
      missile.x -= missile.speedX;
    }
    missile.y -= missile.speedY;
    missile.y += 3;
    missile.speedY--;
    if(missile.speedY < 0){
      missile.speedY === 0;
    }
  }
}
