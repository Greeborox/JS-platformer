var Entity = require('../entity')

var monster = Entity.newEntity();
monster.color = '#408';
monster.speed = 1.2;
monster.hp = 100;
monster.direction = 0;
monster.stagger = 0;
monster.state = 'default';
monster.dead = false;
monster.remove = false;
monster.applyGravity = function(grav){
  this.y += 8;
}

monster.checkLife = function(){
  if(this.hp <= 0 && !this.dead) {
    this.dead = true;
  }
  if(this.dead) {
    this.hp = 100;
    this.height -= 1;
    if(this.height === 0) {
      this.remove = true;
    }
  }
}

monster.draw = function(ctx) {
  if(this.color){
    ctx.fillStyle = this.color;
  }
  ctx.globalAlpha=this.hp/100;
  ctx.fillRect(this.x,this.y,this.width,this.height);
  ctx.globalAlpha=1;
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
