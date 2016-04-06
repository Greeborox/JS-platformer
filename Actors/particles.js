var Entity = require('./entity');

particle = Entity.newEntity();
particle.dead = false;
particle.screenTime = 5;
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
  if(this.onScreen >= this.screenTime) {
    this.dead = true;
  }
}

smokeParticle = Object.create(particle);
smokeParticle.screenTime = 20;
smokeParticle.update = function(){
  if(Math.random()>0.5){
    this.vx *= -1;
  }
  this.x += this.vx;
  this.y += this.vy;
  this.onScreen++;
  if(this.onScreen >= this.screenTime) {
    this.dead = true;
  }
}

bigParticle = Object.create(particle);
bigParticle.width = 15;
bigParticle.height = 15;
bigParticle.screenTime = 20;

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
  makeBigParticle: function(x,y){
    var bigParts = [];
    partNum = Math.floor(Math.random() * (8 - 4) + 4)
    for (var i = 0; i < partNum; i++) {
      bigParts[i] = Object.create(bigParticle)
      bigParts[i].x = x;
      bigParts[i].y = y;
      bigParts[i].vx = Math.random() * 5 - 2;
      bigParts[i].vy = Math.random() * 5 - 10;
    }
    return bigParts
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
