var entity = require('./entity');
var keys = require('../Config/keys');
var c = require('../Config/canvas');
var assets = require('../Config/assets');
var helpers = require('../Config/helpers');
var m = require('../Config/mouse');

var upPressed = false;
var spacePressed = false;
var mClicked = false;

player = entity.newEntity();
player.color = "blue";
player.jumping = false;
player.kneeling = false;
player.onGround = false;
player.vector = {x:0,y:0};
player.fallingVel = 0;
player.direction = 0;
player.width = 24;
player.height = 54;
player.x = 30;
player.y = c.height - player.height - 50;
player.prevY;
player.arrows = [];
player.stab = entity.newEntity();
player.stab.height = 7;
player.stab.width = 45;
player.stab.active = false;
player.stab.activeTime = 25;
player.stab.activeFor = 0;
player.stab.update = function(x,y,width,height,direction){
  if(this.activeFor === this.activeTime){
    this.active = false;
    this.activeFor = 0;
  } else {
    if(!direction){
      this.x = x+width/2;
      this.y = y+(height/2-this.height/2);
    } else {
      this.x = x-(this.width-width/2);
      this.y = y+(height/2-this.height/2);
    }
    this.activeFor++
  }
}

player.draw = function(ctx) {
  ctx.fillRect(this.x,this.y,this.width,this.height);
  ctx.save();
  ctx.translate(player.x+12, player.y+12);
  var moueCoords = mouseCoords = m.getCoords();
  var mx = mouseCoords.x;
  var my = mouseCoords.y;
  var dx = mx-player.x+12;
  var dy = my-player.y+12;
  ctx.rotate(helpers.getRotation(dx,dy));
  ctx.drawImage(assets.getAsset('arrow'),-10,-10,20,20);
  ctx.restore();
  if(player.stab.active){
    player.stab.draw(ctx);
  }
  if(player.arrows.length > 0) {
    for (var i = 0; i < player.arrows.length; i++) {
      player.arrows[i].draw(ctx);
    }
  }
}

player.update = function(grav){
  if(keys.isPressed('w') && !this.jumping && this.onGround && !upPressed){
    upPressed = true;
    this.jumping = true;
    this.onGround = false;
    this.vector.y = -22;
  }
  if(!keys.isPressed('w')){
    upPressed = false;
    this.jumping = false
    this.vector.y = 0;
  }
  if(keys.isPressed('s') && this.onGround && !keys.isPressed('d') && !keys.isPressed('a')){
    this.kneeling = true;
  }
  if(!keys.isPressed('s')){
    this.kneeling = false;
  }
  if(keys.isPressed('a') && !keys.isPressed('d') && !this.kneeling){
    player.direction = 1;
    if(!this.jumping){
      this.vector.x = -3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = -1;
    } else {
      this.vector.x = -5;
    }
  }
  if(keys.isPressed('d') && !keys.isPressed('a') && !this.kneeling){
    player.direction = 0;
    if(!this.jumping){
      this.vector.x = 3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = 1;
    } else {
      this.vector.x = 5;
    }
  }
  if(!keys.isPressed('a') && !keys.isPressed('d')){
    this.vector.x = 0;
  }
  if(keys.isPressed('SPACE') && !spacePressed && player.onGround){
    spacePressed = true;
    if(!player.stab.active){
      player.stab.active = true;
    }
  }
  if(!keys.isPressed('SPACE')) {
    spacePressed = false;
  }
  if(m.isClicked() && !mClicked) {
    mClicked = true;
    var clickCoords = m.getClickedCoords()
    mx = clickCoords.x;
    my = clickCoords.y;
    var arrow = entity.newEntity();
    arrow.speed = 10;
    arrow.width = 5;
    arrow.height = 5;
    arrow.x = player.x+(player.width/2);
    arrow.y = player.y+10;
    arrow.angle = Math.atan2(my-player.y,mx-player.x);
    player.arrows.push(arrow);
    console.log('pew pew');
  }
  if(!m.isClicked()){
    mClicked = false;
  }

  if(player.arrows.length > 0) {
    for (var i = 0; i < player.arrows.length; i++) {
      var arrow = player.arrows[i]
      arrow.x += Math.cos(arrow.angle) * arrow.speed;
      arrow.y += Math.sin(arrow.angle) * arrow.speed;

      if(arrow.x<0 || arrow.x>c.width || arrow.y<0 || arrow.y>c.height){
        player.arrows.splice(i,1);
      }
      console.log(player.arrows.length);
    }
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

  player.stab.update(player.x,player.y,player.width,player.height,player.direction);

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
