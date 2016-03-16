var Entity = require('./entity');

screenTime = 5;

module.exports = {
  makeParticles: function(x,y,grav){
    var particles = [];
    partNum = Math.floor(Math.random() * (5 - 3) + 3)
    for (var i = 0; i < partNum; i++) {
      part = Entity.newEntity();
      part.dead = false;
      part.x = x,
      part.y = y,
      part.width = 3,
      part.height = 3,
      part.vx = Math.random() * 10 - 5;
      part.vy = Math.random() * 15 - 5;
      part.onScreen = 0;
      part.update = function(){
        this.x += this.vx;
        this.y += this.vy;
        this.vy += grav/4;
        this.onScreen++;
        if (this.onScreen >= screenTime) {
          this.dead = true;
        }
      }
      particles.push(part);
    }
    return particles
  }
}
