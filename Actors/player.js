var entity = require('./entity');
var keys = require('../Config/keys');
var c = require('../Config/canvas');

var upPressed = false;

player = entity.newEntity();
player.color = "blue";
player.jumping = false;
player.kneeling = false;
player.onGround = false;
player.vector = {x:0,y:0};
player.fallingVel = 0;
player.width = 24;
player.height = 54;
player.x = 30;
player.y = c.height - player.height - 50;
player.prevY;

player.update = function(grav){

  if(keys.isPressed('UP') && !this.jumping && this.onGround && !upPressed){
    upPressed = true;
    this.jumping = true;
    this.onGround = false;
    this.vector.y = -22;
  }
  if(!keys.isPressed('UP')){
    upPressed = false;
    this.jumping = false
    this.vector.y = 0;
  }
  if(keys.isPressed('DOWN') && this.onGround && !keys.isPressed('RIGHT') && !keys.isPressed('LEFT')){
    this.kneeling = true;
  }
  if(!keys.isPressed('DOWN')){
    this.kneeling = false;
  }
  if(keys.isPressed('LEFT') && !keys.isPressed('RIGHT') && !this.kneeling){
    if(!this.jumping){
      this.vector.x = -3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = -1;
    } else {
      this.vector.x = -5;
    }
  }
  if(keys.isPressed('RIGHT') && !keys.isPressed('LEFT') && !this.kneeling){
    if(!this.jumping){
      this.vector.x = 3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = 1;
    } else {
      this.vector.x = 5;
    }
  }
  if(!keys.isPressed('LEFT') && !keys.isPressed('RIGHT')){
    this.vector.x = 0;
  }
  if(this.y===0){
    this.vector.y = 0;
  }
  if(this.jumping){
    this.vector.y++;
    if(this.vector.y >= 0) {
      this.vector.y = 0;
      this.jumping = false;
    }
  }

  if(this.kneeling){
    this.height = 27;
  } else {
    this.height = 54;
  }

  if(!this.onGround){
    this.fallingVel += 0.2;
  } else {
    this.fallingVel = 0;
  }

  this.y += grav+this.fallingVel;
  this.y += this.vector.y;
  this.x += this.vector.x;


  this.x = Math.max(0, Math.min(this.x, c.width - this.width));
  this.y = Math.max(0, Math.min(this.y, c.height - this.height));

  if(this.prevY<this.y){
    this.onGround = false;
  }
  this.prevY = this.y;
}

module.exports = {
  getPlayer: function() {
    return player;
  }
}
