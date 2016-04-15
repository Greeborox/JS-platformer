var Entity = require('../entity')

var explosion = Entity.newEntity();
explosion.width = 50;
explosion.height = 50;
explosion.x = 0;
explosion.y = 0;

module.exports = {
  newExplosion: function(x,y){
    var newExplo = Object.create(explosion);

  }
}
