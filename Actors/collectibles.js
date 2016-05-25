var entity = require('./entity');

collectible = entity.newEntity();
collectible.active = false;
collectible.x = 0;
collectible.y = 0;
collectible.width = 10;
collectible.height = 10;
collectible.color = '#006688';
collectible.angle = 0;

collectible.update = function(){
  this.y = this.y + Math.sin(this.angle);
  this.angle += 0.01;
  if(this.angle > 0.5){
    this.angle = -0.5;
  }
}

module.exports = {
  newManaBall: function(x,y) {
    var newBall = Object.create(collectible);
    newBall.angle = Math.random() * 0.5;
    newBall.x = x;
    newBall.y = y;
    return newBall;
  },
  newEnergyShard: function(x,y) {
    var newShard = Object.create(collectible);
    newShard.angle = Math.random() * 0.5;
    newShard.x = x;
    newShard.y = y;
    newShard.color = '#D9BC18';
    return newShard;
  }
}
