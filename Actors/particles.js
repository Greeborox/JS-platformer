var Entity = require('./entity');

screenTime = 5;
smokeScreenTime = 20;

particle = Entity.newEntity();
particle.dead = false;
particle.x = 0;
particle.y = 0;
particle.width = 3;
particle.height = 3;
particle.vx = 0;
particle.vy = 0;
particle.onScreen = 0;
particle.update = function(){
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 1;
  this.onScreen++;
  if(this.onScreen >= screenTime) {
    this.dead = true;
  }
}

smokeParticle = Object.create(particle);
smokeParticle.update = function(){
  if(Math.random()>0.5){
    this.vx *= -1;
  }
  this.x += this.vx;
  this.y += this.vy;
  this.onScreen++;
  if(this.onScreen >= smokeScreenTime) {
    this.dead = true;
  }
}

module.exports = {
  makeParticles: function(x,y){
    var particles = [];
    partNum = Math.floor(Math.random() * (5 - 3) + 3)
    for (var i = 0; i < partNum; i++) {
      particles[i] = Object.create(particle)
      particles[i].x = x;
      particles[i].y = y;
      particles[i].vx = Math.random() * 10 - 5;
      particles[i].vy = Math.random() * 15 - 5;
    }
    return particles
  },
  makeSmoke: function(x,y){
    var smokeParts = [];
    partNum = Math.floor(Math.random() * (5 - 3) + 3)
    for (var i = 0; i < partNum; i++) {
      smokeParts[i] = Object.create(smokeParticle)
      smokeParts[i].x = x;
      smokeParts[i].y = y;
      smokeParts[i].vx = Math.random() * 5 - 2;
      smokeParts[i].vy = Math.random() * (-2);
    }
    return smokeParts
  }
}
