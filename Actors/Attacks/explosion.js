var Entity = require('../entity')

var explosion = Entity.newEntity();
explosion.width = 100;
explosion.height = 100;
explosion.x = 0;
explosion.y = 0;
explosion.lifeSpan = 20;
explosion.liveFor = 0;
explosion.remove = false;
explosion.color = '#D64413'

explosion.update = function(){
  if(this.liveFor < this.lifeSpan){
    this.liveFor++;
  } else {
    this.remove = true;
  }
}

module.exports = {
  newExplosion: function(x,y){
    var newExplo = Object.create(explosion);
    newExplo.x = x-newExplo.width/2;
    newExplo.y = y-newExplo.height/2;
    newExplo.liveFor = 0;
    newExplo.remove = false;
    return newExplo;
  }
}
