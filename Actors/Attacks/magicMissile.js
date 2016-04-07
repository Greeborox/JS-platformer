var helpers = require('../../Config/helpers');
var Entity = require('../entity')

var magicMissile = Entity.newEntity();
magicMissile.speed = 10;
magicMissile.width = 5;
magicMissile.height = 5;
magicMissile.x = 0;
magicMissile.y = 0;
magicMissile.angle = 0;

module.exports = {
  newMissile: function(x,y,width,mx,my,direction){
    missile = Object.create(magicMissile);
    missile.x = x+(width/2);
    missile.y = y+10;
    missile.angle = helpers.getRotation(mx-x,my-y);
    if(!direction){
      if(missile.angle < -1){
        missile.angle = -1;
      }
      if(missile.angle > 1) {
        missile.angle = 1;
      }
    } else {
      rot = missile.angle* 180 / Math.PI
      if(!(rot<-110&&rot>-180)&&rot<0){
        missile.angle = -2;
      }
      if(!(rot>110&&rot<180)&&rot>0){
        missile.angle = 2;
      }
    }
    return missile;
  },
  updateMissile: function(missile){
    missile.x += Math.cos(missile.angle) * missile.speed;
    missile.y += Math.sin(missile.angle) * missile.speed;
  }
}
