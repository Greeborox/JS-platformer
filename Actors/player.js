var entity = require('./entity');
var keys = require('../Config/keys');
var c = require('../Config/canvas');
var assets = require('../Config/assets');
var helpers = require('../Config/helpers');
var m = require('../Config/mouse');

var upPressed = false;
var downPressed = false;
var rClicked = false;
var mClicked = false;

player = entity.newEntity();
player.color = "blue";
player.jumping = false;
player.kneeling = false;
player.kneelingFor = 0;
player.getsUpIn = 0;
player.onGround = false;
player.touchingLadder = false;
player.whichLadder = {};
player.onLadder = false;
player.touchingPlatform = false;
player.whichPlatform = {};
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
player.stab.activeTime = 40;
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
  var mouseCoords = m.getCoords();
  var mx = mouseCoords.x;
  var my = mouseCoords.y;
  var dx = mx-player.x+12;
  var dy = my-player.y+12;
  var rotation = helpers.getRotation(dx,dy)
  if(!player.direction){
    if(rotation < -1){
      rotation = -1;
    }
    if(rotation > 1) {
      rotation = 1;
    }
  } else {
    rot = rotation* 180 / Math.PI
    if(!(rot<-110&&rot>-180)&&rot<0){
      rotation = -2;
    }
    if(!(rot>110&&rot<180)&&rot>0){
      rotation = 2;
    }
  }
  if(player.onLadder){
    rotation = -1.57;
  }
  ctx.rotate(rotation);
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

player.controlKeys = function(){
  if(keys.isPressed('w') && !this.jumping && this.onGround && !upPressed && !this.touchingLadder){
    upPressed = true;
    this.jumping = true;
    this.onGround = false;
    this.vector.y = -22;
  }
  if(keys.isPressed('w') && !keys.isPressed('a') && !keys.isPressed('d') &&
   this.touchingLadder && !upPressed){
    upPressed = true;
    this.onLadder = true;
  }
  if(keys.isPressed('w') && this.onLadder){
    this.x = (this.whichLadder.x+(this.whichLadder.width/2))-this.width/2
    this.vector.y = -2;
  }
  if(!keys.isPressed('w')){
    upPressed = false;
    this.jumping = false
    this.vector.y = 0;
  }
  if(keys.isPressed('s') && this.onGround && !keys.isPressed('d') && !keys.isPressed('a') && !this.touchingLadder){
    this.kneeling = true;
  }
  if(keys.isPressed('s') && !this.onLadder && this.touchingLadder){
    this.onLadder = true;
  }
  if(keys.isPressed('s') && this.onLadder){
    this.x = (this.whichLadder.x+(this.whichLadder.width/2))-this.width/2
    this.vector.y = 2;
  }
  if(!keys.isPressed('s')){
    this.kneeling = false;
  }
  if(keys.isPressed('a') && !keys.isPressed('d') && !this.kneeling && !(this.touchingPlatform && this.onLadder)){
    player.direction = 1;
    if(!this.jumping){
      this.vector.x = -3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = -1;
    } else {
      this.vector.x = -5;
    }
  }
  if(keys.isPressed('d') && !keys.isPressed('a') && !this.kneeling && !(this.touchingPlatform && this.onLadder)){
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
}

player.controlMouse = function() {
  if(m.isRclicked() && !rClicked && !player.onLadder){
    rClicked = true;
    if(!player.stab.active){
      player.stab.active = true;
    }
  }
  if(!m.isRclicked()) {
    rClicked = false;
  }
  if(m.isClicked() && !mClicked && !player.onLadder) {
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
    arrow.angle = helpers.getRotation(mx-player.x,my-player.y);
    if(!player.direction){
      if(arrow.angle < -1){
        arrow.angle = -1;
      }
      if(arrow.angle > 1) {
        arrow.angle = 1;
      }
    } else {
      rot = arrow.angle* 180 / Math.PI
      if(!(rot<-110&&rot>-180)&&rot<0){
        arrow.angle = -2;
      }
      if(!(rot>110&&rot<180)&&rot>0){
        arrow.angle = 2;
      }
    }
    player.arrows.push(arrow);
  }
  if(!m.isClicked()){
    mClicked = false;
  }
}

player.updateArrows = function(){
  if(player.arrows.length > 0) {
    for (var i = 0; i < player.arrows.length; i++) {
      var arrow = player.arrows[i]
      arrow.x += Math.cos(arrow.angle) * arrow.speed;
      arrow.y += Math.sin(arrow.angle) * arrow.speed;
    }
  }
}

player.handleKneeling = function(){
  if(this.kneeling){
    this.height = 27;
    if(this.kneelingFor === 0){
      this.y += 27;
    }
    this.kneelingFor++;
  } else {
    this.height = 54;
    if(this.kneelingFor != 0){
      this.y -= 27;
    }
    this.kneelingFor = 0;
  }
  if(this.getsUpIn > 0){
    this.getsUpIn--;
    if(this.getsUpIn === 0){
      this.kneeling = false;
      this.kneelingFor = 0;
    }
  }
}

player.update = function(grav){
  this.controlKeys();
  this.controlMouse();
  this.updateArrows();
  player.stab.update(player.x,player.y,player.width,player.height,player.direction);
  this.handleKneeling();

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

  if(!this.onGround){
    this.fallingVel += 0.2;
  } else {
    this.fallingVel = 0;
  }

  if(!this.onLadder){
    this.y += grav+this.fallingVel;
  }
  this.y += this.vector.y;

  this.x += this.vector.x;

  if(this.onLadder){
    if(this.y+this.height> this.whichLadder.y+this.whichLadder.height){
      this.onLadder = false;
    }
  }

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
