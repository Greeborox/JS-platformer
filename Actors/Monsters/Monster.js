var Entity = require('../entity')

var monster = Entity.newEntity();
monster.color = '#408';
monster.speed = 1.2;
monster.direction = 0;
monster.state = 'default';
monster.applyGravity = function(grav){
  this.y += 5;
}

module.exports = {
  newMonster: function(x,y,width,height){
    newMon = Object.create(monster)
    newMon.x = x;
    newMon.y = y;
    newMon.width = width;
    newMon.height = height;
    return newMon;
  }
}
