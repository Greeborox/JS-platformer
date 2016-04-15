var Entity = require('../entity')

var gustOfWind = Entity.newEntity();
gustOfWind.type = "gustOfWind";
gustOfWind.speed = 5;
gustOfWind.width = 10;
gustOfWind.height = 55;
gustOfWind.x = 0;
gustOfWind.y = 0;

module.exports = {
  newMissile: function(x,y,width,mx,my,direction){
    missile = Object.create(gustOfWind);
    missile.inactive = false;
    missile.lifeSpan = 30;
    missile.activeFor = 0;
    missile.x = x+(width/2);
    missile.y = y-15;
    if(direction){
      missile.speed *= -1;
    }
    return missile;
  },
  updateMissile: function(missile){
    missile.x += missile.speed;
    if(missile.activeFor >= missile.lifeSpan){
      missile.inactive = true;
    } else {
      missile.activeFor++;
    }
  }
}
