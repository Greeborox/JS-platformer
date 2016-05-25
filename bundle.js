(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../entity":8}],2:[function(require,module,exports){
var helpers = require('../../Config/helpers');
var Entity = require('../entity')

var fireBomb = Entity.newEntity();
fireBomb.type = "fireBomb";
fireBomb.manaCost = 7;
fireBomb.speedX = 10;
fireBomb.speedY = 10;
fireBomb.width = 15;
fireBomb.height = 15;
fireBomb.x = 0;
fireBomb.y = 0;
fireBomb.power = 100;

module.exports = {
  newMissile: function(x,y,width,mx,my,direction){
    missile = Object.create(fireBomb);
    missile.x = x+(width/2);
    missile.y = y+10;
    missile.direction = direction;
    if(!missile.direction){
      missile.speedX = (mx-missile.x)/10;
    } else {
      missile.speedX = (missile.x-mx)/10;
    }
    if(missile.speedX > 10){
      missile.speedX = 10;
    }
    if(missile.speedX < 2){
      missile.speedX = 2;
    }
    missile.speedY = (missile.y-my)/4;

    if(missile.speedY > 15){
      missile.speedY = 15;
    }
    if(missile.speedY < 5){
      missile.speedY = 5;
    }
    return missile;
  },
  updateMissile: function(missile){
    if(!missile.direction){
      missile.x += missile.speedX;
    } else {
      missile.x -= missile.speedX;
    }
    missile.y -= missile.speedY;
    missile.y += 3;
    missile.speedY--;
    if(missile.speedY < 0){
      missile.speedY === 0;
    }
  }
}

},{"../../Config/helpers":18,"../entity":8}],3:[function(require,module,exports){
var Entity = require('../entity')

var gustOfWind = Entity.newEntity();
gustOfWind.type = "gustOfWind";
gustOfWind.speed = 5;
gustOfWind.manaCost = 1;
gustOfWind.width = 10;
gustOfWind.height = 55;
gustOfWind.x = 0;
gustOfWind.y = 0;

module.exports = {
  newMissile: function(x,y,width,mx,my,direction){
    missile = Object.create(gustOfWind);
    missile.inactive = false;
    missile.lifeSpan = 30;
    missile.activeFor = 0;
    missile.x = x+(width/2);
    missile.y = y-15;
    if(direction){
      missile.speed *= -1;
    }
    return missile;
  },
  updateMissile: function(missile){
    missile.x += missile.speed;
    if(missile.activeFor >= missile.lifeSpan){
      missile.inactive = true;
    } else {
      missile.activeFor++;
    }
  }
}

},{"../entity":8}],4:[function(require,module,exports){
var helpers = require('../../Config/helpers');
var Entity = require('../entity')

var magicMissile = Entity.newEntity();
magicMissile.type = "magicMissile";
magicMissile.speed = 10;
magicMissile.manaCost = 3;
magicMissile.width = 5;
magicMissile.height = 5;
magicMissile.x = 0;
magicMissile.y = 0;
magicMissile.angle = 0;
magicMissile.power = 50;

module.exports = {
  newMissile: function(x,y,width,mx,my,direction){
    missile = Object.create(magicMissile);
    missile.x = x+(width/2);
    missile.y = y+10;
    missile.angle = helpers.getRotation(mx-x,my-y);
    if(!direction){
      if(missile.angle < -1){
        missile.angle = -1;
      }
      if(missile.angle > 1) {
        missile.angle = 1;
      }
    } else {
      rot = missile.angle* 180 / Math.PI
      if(!(rot<-110&&rot>-180)&&rot<0){
        missile.angle = -2;
      }
      if(!(rot>110&&rot<180)&&rot>0){
        missile.angle = 2;
      }
    }
    return missile;
  },
  updateMissile: function(missile){
    missile.x += Math.cos(missile.angle) * missile.speed;
    missile.y += Math.sin(missile.angle) * missile.speed;
  }
}

},{"../../Config/helpers":18,"../entity":8}],5:[function(require,module,exports){
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

},{"../entity":8}],6:[function(require,module,exports){
var monster = require('./Monster');

var patroler = monster.newMonster(0,0,30,40);
patroler.update = function(grav){
  this.applyGravity();
  this.checkLife();
  if(!this.dead){
    if(!this.stagger){
      if(this.direction){
        this.x += this.speed;
        if(this.x >= this.range.x2-this.width){
          this.x = this.range.x2-this.width;
          this.direction = 0;
        }
      } else {
        this.x -= this.speed;
        if(this.x <= this.range.x1){
          this.x = this.range.x1;
          this.direction = 1;
        }
      }
    } else {
      this.stagger--;
    }
  }
}

module.exports = {
  newPatroler: function(platform){
    var newPat = Object.create(patroler);
    newPat.range = {x1:undefined,x2:undefined};
    newPat.hp = 100;
    newPat.direction = (Math.random() > 0.5) ? 0 : 1;
    newPat.x = Math.floor(Math.random() * ((platform.x+platform.width-newPat.width) - platform.x) + platform.x);
    newPat.y = platform.y - newPat.height - 10;
    newPat.range.x1 = platform.x;
    newPat.range.x2 = platform.x+platform.width;
    return newPat;
  },
  log: function(){
    console.log("test");
  }
}

},{"./Monster":5}],7:[function(require,module,exports){
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

},{"./entity":8}],8:[function(require,module,exports){
entity = {
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 48,
  sourceHeight: 64,
  x: 0,
  y: 0,
  width: 48,
  height: 64,
  centerY: function() {
    return this.y + this.height/2
  },
  centerX: function() {
    return this.x + this.width/2
  },
  draw: function(ctx) {
    if(this.color){
      ctx.fillStyle = this.color;
    }
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

module.exports = {
  newEntity: function(){
    var newEnt = Object.create(entity);
    return newEnt;
  }
}

},{}],9:[function(require,module,exports){
var entity = require('./entity');
var c = require('../Config/canvas');
var assets = require('../Config/assets');

ladder = entity.newEntity();
ladder.width = 30;
ladder.type = 'ladder';
ladder.draw = function(ctx) {
  segments = this.height/12;
  for (var i = 0; i < segments; i++) {
    ctx.drawImage(assets.getAsset('ladder'),this.x,this.y+(12*i),this.width,12);
  }
}

module.exports = {
  newLadder: function(x,y,height){
    var newLad = Object.create(ladder);
    newLad.x = x;
    newLad.y = y;
    newLad.height = height;
    return newLad;
  },
}

},{"../Config/assets":15,"../Config/canvas":16,"./entity":8}],10:[function(require,module,exports){
var entity = require('./entity');
var assets = require('../Config/assets');

message = entity.newEntity();
message.active = false;
message.x = 0;
message.y = 0;
message.width = 60;
message.height = 35;
message.image = undefined;
message.visibleFor = 0;
message.lifeSpan = 60;
message.setMsg = function(msgType){
  this.image = msgType;
};
message.reset = function(){
  this.image = undefined;
  this.visibleFor = 0;
  this.active = false;
}
message.update = function(x,y){
  this.x = x;
  this.y = y;
  if(this.visibleFor >= this.lifeSpan){
    this.active = false;
  } else {
    this.visibleFor++
  }
};
message.draw = function(ctx){
  ctx.drawImage(assets.getAsset(this.image),this.x,this.y,this.width,this.height);
};

module.exports = {
  getMessage: function() {
    return message;
  }
}

},{"../Config/assets":15,"./entity":8}],11:[function(require,module,exports){
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

},{"./entity":8}],12:[function(require,module,exports){
var entity = require('./entity');
var c = require('../Config/canvas');

platform = entity.newEntity();
platform.color = "gray";
platform.opacity = 1;

module.exports = {
  newPlatform: function(x,y,width,height,color){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.width = width;
    newPlat.height = height;
    if(color){
      newPlat.color = color;
    }
    return newPlat;
  },
  newMovingPlatform: function(x,y,width,height,color, maxY, minY, speed){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.maxY = maxY;
    newPlat.minY = minY;
    newPlat.width = width;
    newPlat.height = height;
    newPlat.goingDown = true;
    if(color){
      newPlat.color = color;
    }
    newPlat.speed = speed;
    newPlat.update = function(){
      if(this.y >= this.maxY) {
        this.y = this.maxY;
      }
      if(this.y <= this.minY) {
        this.y = this.minY;
      }
      if(this.y === this.maxY && this.goingDown === true) {
        this.goingDown = false;
      }
      if(this.y === this.minY && this.goingDown === false) {
        this.goingDown = true;
      }
      if(this.goingDown) {
        this.y += this.speed;
      } else {
        this.y -= this.speed;
      }
    }
    return newPlat;
  },
  newVanishingPlatform: function(x,y,width,height,color){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.opacity = Math.random();
    newPlat.width = width;
    newPlat.height = height;
    newPlat.vanishing = true;
    newPlat.invisible = false;
    newPlat.invisibleFor = 0;
    newPlat.invisibleTime = 100;
    if(color){
      newPlat.color = color;
    };
    newPlat.update = function(){
      if(this.vanishing){
        this.opacity -= 0.005;
        if(this.opacity < 0){
          this.opacity = 0;
          this.vanishing = false;
          this.invisible = true;
        }
      }

      if(this.invisible){
        if(this.invisibleFor < this.invisibleTime) {
          this.invisibleFor++;
        } else {
          this.invisibleFor = 0;
          this.invisible = false;
        }
      }

      if(!this.vanishing && !this.invisible){
        this.opacity += 0.005;
        if(this.opacity > 1){
          this.vanishing = true;
        }
      }
    };
    newPlat.draw = function(ctx){
      ctx.globalAlpha=this.opacity;
      ctx.fillRect(this.x,this.y,this.width,this.height);
      ctx.globalAlpha=1;
    }
    return newPlat;
  },
  newExplodingPlatform: function(x,y,width,height,color){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.backX = x;
    newPlat.backY = y;
    newPlat.width = width;
    newPlat.height = height;
    newPlat.touched = false;
    newPlat.offScreen = false;
    newPlat.inactive = 150;
    newPlat.tillExplosion = 50;
    if(color){
      newPlat.color = color;
    };
    newPlat.update = function(){
      if(this.touched){
        if(!this.tillExplosion){
          this.offScreen = true;
          this.touched = false;
          this.x = -500;
          this.y = -500;
          this.tillExplosion = 100;
        } else {
          this.tillExplosion--;
        }
      }
      if(this.offScreen){
        if(!this.inactive){
          this.offScreen = false;
          this.x = this.backX;
          this.y = this.backY;
          this.inactive = 150;
        } else {
          this.inactive--;
        }
      }
    }
    return newPlat;
  }
}

},{"../Config/canvas":16,"./entity":8}],13:[function(require,module,exports){
var entity = require('./entity');
var keys = require('../Config/keys');
var c = require('../Config/canvas');
var assets = require('../Config/assets');
var helpers = require('../Config/helpers');
var m = require('../Config/mouse');
var magicMissile = require('./Attacks/magicMissile');
var gustOfWind = require('./Attacks/gustOfWind');
var fireBomb = require('./Attacks/fireBomb');
var Message = require('./message');

var upPressed = false;
var downPressed = false;
var rClicked = false;
var mClicked = false;
var ePressed = false;

var attacks = {
  'magicMissile' : magicMissile,
  'gustOfWind' : gustOfWind,
  'fireBomb' : fireBomb,
}

var message = Message.getMessage();

player = entity.newEntity();
player.color = "blue";
player.alive = true;
player.leavingMap = false;
player.deadFor = 0;
player.jumping = false;
player.kneeling = false;
player.kneelingFor = 0;
player.touchingShrine = false;
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
player.mana = 20;
player.maxMana = 20;
player.lastManaTick = 0;
player.manaRegenTime = 60;
player.manaRegenActive = false;
player.energyShards = 0;
player.width = 24;
player.height = 54;
player.x = 30;
player.y = c.height - player.height - 50;
player.prevY;
player.attacks = ['magicMissile','gustOfWind','fireBomb']
player.currAttack = 0
player.missiles = [];
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
  if(player.missiles.length > 0) {
    for (var i = 0; i < player.missiles.length; i++) {
      player.missiles[i].draw(ctx);
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
  if(keys.isPressed('e') && !ePressed){
    ePressed = true;
    player.currAttack++;
    if(player.currAttack === player.attacks.length){
      player.currAttack = 0;
    }
  }
  if(!keys.isPressed('e')){
    ePressed = false;
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
  if(m.isClicked() && !mClicked && !player.onLadder && player.attacks.length > 0) {
    mClicked = true;
    var clickCoords = m.getClickedCoords()
    var missile = attacks[player.attacks[player.currAttack]];
    mx = clickCoords.x;
    my = clickCoords.y;
    var newMissile = missile.newMissile(player.x,player.y,player.width,mx,my,player.direction);
    if(newMissile.manaCost <= player.mana){
      if(message.active && message.image === 'noManaMsg'){
        message.reset();
      }
      player.mana -= newMissile.manaCost;
      player.missiles.push(newMissile);
    } else {
      message.reset();
      message.setMsg('noManaMsg');
      message.active = true;
    }
  }
  if(!m.isClicked()){
    mClicked = false;
  }
}

player.updateMissiles = function(){
  if(player.missiles.length > 0) {
    for (var i = 0; i < player.missiles.length; i++) {
      type = player.missiles[i].type;
      attacks[type].updateMissile(player.missiles[i]);
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

player.updateMana = function(){
  if(this.lastManaTick >= this.manaRegenTime){
    if(this.mana<this.maxMana){
      this.mana++;
    }
    this.lastManaTick = 0;
  } else {
    this.lastManaTick+=1;
  }
}

player.resetAttacks = function(){
  this.attacks = [];
}
player.addAttack = function(attack){
  this.attacks.push(attack)
}

player.update = function(grav){
  this.controlKeys();
  this.controlMouse();
  this.updateMissiles();
  player.stab.update(player.x,player.y,player.width,player.height,player.direction);
  this.handleKneeling();
  if(this.manaRegenActive){
    this.updateMana();
  }

  if(this.attacks.length === 1) {
    this.currAttack = 0;
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

},{"../Config/assets":15,"../Config/canvas":16,"../Config/helpers":18,"../Config/keys":19,"../Config/mouse":21,"./Attacks/fireBomb":2,"./Attacks/gustOfWind":3,"./Attacks/magicMissile":4,"./entity":8,"./message":10}],14:[function(require,module,exports){
var entity = require('./entity');

shrine = entity.newEntity();
shrine.width = 48;
shrine.height = 108;
shrine.type = 'shrine';
shrine.color = '#A3159A';

module.exports = {
  newShrine: function(x,y,spell){
    var newShr = Object.create(shrine);
    newShr.x = x;
    newShr.y = y;
    newShr.spell = spell;
    return newShr;
  },
}

},{"./entity":8}],15:[function(require,module,exports){
var assets = [];
var assetsNum = 0;

module.exports = {
  getAssetsNum : function(){
    return assetsNum;
  },
  getAssetsLength : function(){
    return assets.length;
  },
  addAsset : function(){
    assetsNum++;
  },
  newAsset : function(name,asset){
    assets.push({'name':name,'asset':asset});
  },
  getAsset : function(name) {
    for (var i = 0; i < assets.length; i++) {
      if(assets[i].name === name){
        assetObj = assets[i];
        return assetObj['asset'];
      }
    }
  }
}

},{}],16:[function(require,module,exports){
var canvas = document.getElementById('canvas');

module.exports = {
    canvas: canvas,
    ctx: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
};

},{}],17:[function(require,module,exports){
fps = 60;
gravity = 5;
currLevel = 1;

module.exports = {
  getFPS: function(){
    return fps;
  },
  getGravity: function(){
    return gravity;
  },
  getLevel: function(){
    return currLevel;
  },
  setLevel: function(lvl){
    currLevel = lvl;
  },
  addLevel: function(){
    currLevel++;
  }
}

},{}],18:[function(require,module,exports){
module.exports = {
  blockRect: function(r1,r2){
    if(r1&&r2){
      var vx = r1.centerX() - r2.centerX();
      var vy = r1.centerY() - r2.centerY();
      var combinedHalfWidths = r1.width/2 + r2.width/2;
      var combinedHalfHeights = r1.height/2 + r2.height/2;
      if(Math.abs(vx) < combinedHalfWidths){
        if(Math.abs(vy) < combinedHalfHeights){
          var overlapX = combinedHalfWidths - Math.abs(vx);
          var overlapY = combinedHalfHeights - Math.abs(vy);
          if(overlapX >= overlapY) {
            if(vy > 0) {
              if(!r1.onLadder){
                r1.y = r1.y + overlapY;
                r1.vector.y=0;
              }
            } else {
              if(!r1.onLadder){
                r1.y = r1.y - overlapY;
              }
              if(r1.hasOwnProperty('onGround')){
                r1.onGround = true;
              }
            }
          } else {
            if(vx > 0) {
              r1.x = r1.x + overlapX;
            } else {
              r1.x = r1.x - overlapX;
            }
          }
        }
      }
    }
  },
  blockLedge: function(r1,r2){
    if(r1&&r2){
      var vx = r1.centerX() - r2.centerX();
      var vy = r1.centerY() - r2.centerY();
      var combinedHalfWidths = r1.width/2 + r2.width/2;
      var combinedHalfHeights = r1.height/2 + r2.height/2;
      if(Math.abs(vx) < combinedHalfWidths){
        if(Math.abs(vy) < combinedHalfHeights){
          var overlapX = combinedHalfWidths - Math.abs(vx);
          var overlapY = combinedHalfHeights - Math.abs(vy);
          if(overlapX >= overlapY) {
            if(vy < 0) {
              if(!r1.onLadder){
                if(r1.kneelingFor < 29){
                  r1.y = r1.y - overlapY;
                } else {
                  r1.getsUpIn = 10;
                }
              }
              if(r1.hasOwnProperty('onGround')){
                r1.onGround = true;
              }
            }
          }
        }
      }
    }
  },
  getRotation: function(dx,dy){
    rotation = Math.atan2(dy, dx);
    return rotation;
  },
  checkCollision: function(obj1,obj2){
    if(obj1 && obj2) {
      return !(obj1.x + obj1.width < obj2.x ||
               obj2.x + obj2.width < obj1.x ||
               obj1.y + obj1.height < obj2.y ||
               obj2.y + obj2.height < obj1.y);
    }
  },
  drawButton: function(button,ctx){
    if(button.hover){
      ctx.fillStyle = 'gray';
    } else {
      ctx.fillStyle = button.color;
    }
    ctx.fillRect(button.x,button.y,button.width,button.height);
    ctx.font="20px Arial";
    ctx.fillStyle = '#000';
    ctx.textAlign = "center"
    ctx.fillText(button.text,button.x+button.width/2,button.y+button.height/2+6);
  },
  checkPointCollision: function(point,obj){
    if(point.x > obj.x && point.x < obj.x+obj.width){
      if(point.y > obj.y && point.y < obj.y+obj.height){
        return true;
      }
    }
    return false;
  },
}

},{}],19:[function(require,module,exports){
var pressedKeys = {};
var keys = {
  SPACE: 32,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  w: 87,
  s: 83,
  a: 65,
  d: 68,
  e: 69
}

module.exports = {
  init: function(){
    window.addEventListener("keydown", function keydown(e) {
      pressedKeys[e.keyCode] = true;
    },false)
    window.addEventListener("keyup", function keydown(e) {
      delete pressedKeys[e.keyCode];
    },false)
  },
  isPressed: function(key){
    if(pressedKeys[keys[key]]){
      return true;
    } else {
      return false;
    }
  },
  reset: function(){
    pressedKeys = {};
  }
}

},{}],20:[function(require,module,exports){
var levels = [
  //////////////////////// LEVEL 1 ///////////////////////////
  {
    "world": {
      "width": 640,
      "height": 480,
    },
    "platforms": [
      {
        "x": 0,
        "y": 468,
        "width": 640,
        "height": 12,
      },
      {
        "x": 150,
        "y": 318,
        "width": 250,
        "height": 12,
      }
    ],
    "ledges": [

    ],
    "expPlatforms": [

    ],
    "vanPlatforms": [

    ],
    "movPlatforms": [

    ],
    "lavas": [

    ],
    "monstersPatrolers": [
      {
        "platformIndex": 1,
      },
    ],
    "ladders": [
      {
        "x": 165,
        "y": 300,
        "height": 166
      },
    ],
    "spellShrines": [
      {
        "x": 296,
        "y": 210,
        "spell": "fireBomb"
      },
    ],
    "manaBalls": [
      {
        "x": 100,
        "y": 430,
      },
      {
        "x": 200,
        "y": 430,
      },
      {
        "x": 300,
        "y": 430,
      },
      {
        "x": 400,
        "y": 430,
      },
      {
        "x": 500,
        "y": 430,
      },
    ],
    "energyShards":[
      {
        "x": 220,
        "y": 285,
      },
      {
        "x": 280,
        "y": 285,
      },
    ],
    "player": {
      "x": 10,
      "y": 400,
    },
    "levelExit":{
      "x": 600,
      "y": 414,
      "height": 54,
      "width": 40,
      "color": "#000"
    }
  },
    //////////////////////// LEVEL 2 ///////////////////////////
  {
    "world": {
      "width": 1200,
      "height": 480,
    },
    "platforms": [
      {
        "x": 0,
        "y": 456,
        "width": 150,
        "height": 12,
      },
      {
        "x": 1050,
        "y": 456,
        "width": 150,
        "height": 12,
      }
    ],
    "ledges": [

    ],
    "expPlatforms": [
      {
        "x": 200,
        "y": 380,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
      {
        "x": 400,
        "y": 300,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
      {
        "x": 620,
        "y": 300,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
      {
        "x": 830,
        "y": 300,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
    ],
    "vanPlatforms": [

    ],
    "movPlatforms": [

    ],
    "lavas": [
      {
        "x": 0,
        "y": 468,
        "width": 1200,
        "height": 12,
        "color": "darkOrange",
      }
    ],
    "monstersPatrolers": [

    ],
    "ladders": [

    ],
    "spellShrines": [

    ],
    "manaBalls": [

    ],
    "energyShards":[
      {
        "x": 220,
        "y": 350,
      },
      {
        "x": 260,
        "y": 350,
      },
      {
        "x": 420,
        "y": 270,
      },
      {
        "x": 460,
        "y": 270,
      },
      {
        "x": 640,
        "y": 270,
      },
      {
        "x": 680,
        "y": 270,
      },
      {
        "x": 850,
        "y": 270,
      },
      {
        "x": 890,
        "y": 270,
      },
    ],
    "player": {
      "x": 10,
      "y": 400,
    },
    "levelExit":{
      "x": 1160,
      "y": 402,
      "height": 54,
      "width": 40,
      "color": "#000"
    }
  },
  //////////////////////// LEVEL 3 ///////////////////////////
  {
    "world": {
      "width": 2500,
      "height": 3000,
    },
    "platforms": [
      {
        "x": 270,
        "y": 2608,
        "width": 228,
        "height": 12,
      },
      {
        "x": 430,
        "y": 2738,
        "width": 128,
        "height": 12,
      },
      {
        "x": 40,
        "y": 2788,
        "width": 128,
        "height": 12,
      },
      {
        "x": 0,
        "y": 2976,
        "width": 200,
        "height": 12,
      },
      {
        "x": 1650,
        "y": 2976,
        "width": 300,
        "height": 12,
      },
      {
        "x": 2350,
        "y": 2976,
        "width": 1400,
        "height": 12,
      },
      {
        "x": 570,
        "y": 2508,
        "width": 268,
        "height": 12,
      },
      {
        "x": 1270,
        "y": 2508,
        "width": 68,
        "height": 12,
      },
      {
        "x": 1290,
        "y": 2808,
        "width": 264,
        "height": 12,
      },
      {
        "x": 1670,
        "y": 2738,
        "width": 164,
        "height": 12,
      },
    ],
    "ledges": [
      {
        "x": 100,
        "y": 2588,
        "width": 100,
        "height": 12,
        "color": "red",
      },
      {
        "x": 100,
        "y": 2488,
        "width": 100,
        "height": 12,
        "color": "red",
      },
    ],
    "expPlatforms": [
      {
        "x": 2000,
        "y": 2938,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
      {
        "x": 2200,
        "y": 2938,
        "width": 88,
        "height": 12,
        "color": "#8b0000",
      },
    ],
    "vanPlatforms": [
      {
        "x": 270,
        "y": 2838,
        "width": 88,
        "height": 12,
        "color": "magenta",
      },
      {
        "x": 990,
        "y": 2552,
        "width": 168,
        "height": 12,
        "color": "magenta",
      },
    ],
    "movPlatforms": [
      {
        "x": 400,
        "y": 2964,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000,
        "maxY": 2840,
        "speed": 0.5,
      },
      {
        "x": 570,
        "y": 2920,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000,
        "maxY": 2840,
        "speed": 1
      },
      {
        "x": 740,
        "y": 2988,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000,
        "maxY": 2840,
        "speed": 1.5
      },
      {
        "x": 910,
        "y": 2900,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000,
        "maxY": 2840,
        "speed": 0.5,
      },
      {
        "x": 1080,
        "y": 3000-40,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000,
        "maxY": 2840,
        "speed": 0.2
      },
      {
        "x": 1250,
        "y": 2980,
        "width": 70,
        "height": 12,
        "color": "darkGreen",
        "minY": 3000,
        "maxY": 2840,
        "speed": 0.7
      },
    ],
    "lavas": [
      {
        "x": 0,
        "y": 2988,
        "width": 4000,
        "height": 12,
        "color": "darkOrange",
      },
    ],
    "monstersPatrolers": [
      {
        "platformIndex": 2
      },
      {
        "platformIndex": 4
      },
      {
        "platformIndex": 1
      },
      {
        "platformIndex": 0
      },
    ],
    "ladders": [
      {
        "x": 45,
        "y": 2772,
        "height": 204
      },
      {
        "x": 450,
        "y": 2596,
        "height": 140
      },
      {
        "x": 1300,
        "y": 2496,
        "height": 312
      },
      {
        "x": 1700,
        "y": 2724,
        "height": 252
      },
    ],
    "spellShrines": [

    ],
    "manaBalls": [

    ],
    "energyShards":[

    ],
    "player": {
      "x": 30,
      "y": 2926,
    },
    "levelExit":{
      "x": 2460,
      "y": 2922,
      "height": 54,
      "width": 40,
      "color": "#000"
    }
  },
]

module.exports = {
  getLevelData: function(index){
    return levels[index-1];
  },
}

},{}],21:[function(require,module,exports){
c = require('./canvas');
Screen = require('./screen')

mouseClicked = false;
rMouseClicked = false;
mouseCoords = {x:undefined,y:undefined};
clickedCoords = {x:undefined,y:undefined};

module.exports = {
  isClicked: function() {
    return mouseClicked;
  },
  isRclicked: function() {
    return rMouseClicked;
  },
  getCoords: function(){
    return mouseCoords;
  },
  getClickedCoords: function(){
    return clickedCoords;
  },
  init: function() {
    c.canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    }, false);
    c.canvas.addEventListener('mousedown', function(e){
      if(e.button === 0) {
        rMouseClicked = true;
      }
      if(e.button === 2) {
        mouseClicked = true;
      }
      var screen = Screen.getScreen();
      var clickx = e.pageX;
      var clicky = e.pageY;
      clickx -= (c.canvas.offsetLeft-screen.x);
      clicky -= (c.canvas.offsetTop-screen.y);
      clickedCoords = {x:clickx,y:clicky};
    },false);
    c.canvas.addEventListener('mouseup', function(e){
      mouseClicked = false;
      rMouseClicked = false;
    },false);
    c.canvas.addEventListener('mousemove', function(e){
      var screen = Screen.getScreen();
      var movex = e.pageX;
      var movey = e.pageY;
      movex -= (c.canvas.offsetLeft-screen.x);
      movey -= (c.canvas.offsetTop-screen.y);;
      mouseCoords = {x:movex,y:movey};
    },false);
  }
}

},{"./canvas":16,"./screen":22}],22:[function(require,module,exports){
var c = require('./canvas');

var screen = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  width: c.width,
  height: c.height,
  speed: 15,
}

module.exports = {
  getScreen: function(){
    return screen;
  },
  updateScreen: function(playerX,playerY,playerW,playerH,playerF,worldW,worldH,my){
    // handling screen on the X axis
    if(playerF) {
      screen.targetX = playerX - (Math.floor(c.width/3))*2;
      if(screen.x > screen.targetX) {
        screen.x -= screen.speed;
      } else {
        screen.x += screen.speed;
      }
    }

    if(!playerF) {
      screen.targetX = playerX - (Math.floor(c.width/3)) + playerW;
      if(screen.x > screen.targetX) {
        screen.x -= screen.speed;
      } else {
        screen.x += screen.speed;
      }
    }

    if(Math.abs(screen.x - screen.targetX)<=screen.speed){
      screen.x = screen.targetX;
    }

    // handling the screen on the Y axis
    playerYC = playerY+playerW/2;
    if(my>playerYC-150) {
      screen.targetY = (Math.floor(playerY + (playerH / 2) - (screen.height / 2)))+50;
    }

    if(my<playerYC+150) {
      screen.targetY = (Math.floor(playerY + (playerH / 2) - (screen.height / 2)))-50;
    }

    if(my>playerYC-150 && my<playerYC+150){
      screen.targetY = Math.floor(playerY + (playerH / 2) - (screen.height / 2));
    }

    if(screen.y>screen.targetY) {
      screen.y -= Math.floor(screen.speed/4);
    } else {
      screen.y += Math.floor(screen.speed/4);
    }

    if(Math.abs(screen.y - screen.targetY)<=screen.speed){
      screen.y = screen.targetY;
    }


    //screen.y = Math.floor(playerY + (playerH / 2) - (screen.height / 2));

    // hodling screen within the world bounds

    if(screen.x < 0){
      screen.x = 0;
    };
    if(screen.y < 0){
      screen.y = 0;
    };
    if(screen.x + screen.width > worldW){
      screen.x = worldW - screen.width;
    };
    if(screen.y + screen.height > worldH){
      screen.y = worldH - screen.height;
    };
  },
  setScreen: function(x,y,targetY){
    screen.x = x;
    screen.y = y;
    if(targetY){
      screen.targetY = targetY;
    }
  },
  resetScreen: function(){
    screen.x = 0;
    screen.y = 0;
    screen.width = c.width;
    screen.height = c.height;
  }
}

},{"./canvas":16}],23:[function(require,module,exports){
var c = require('../Config/canvas');
var config = require('../Config/config');
var mouse = require('../Config/mouse');
var helpers = require('../Config/helpers');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;
var currLevel = 0;
var buttons = [
  {
    'x': c.width/2-100,
    'y': c.height/2-50,
    'width': 200,
    'height': 50,
    'color': 'red',
    'text': 'Start level',
    'hover': false
  },
  {
    'x': c.width/2-100,
    'y': c.height/2+25,
    'width': 200,
    'height': 50,
    'color': 'blue',
    'text': 'Upgrade',
    'hover': false
  },
  {
    'x': c.width/2-100,
    'y': c.height/2+100,
    'width': 200,
    'height': 50,
    'color': 'green',
    'text': 'Quit',
    'hover': false
  }
];

function updateState(){
  if(mouse.isClicked()||mouse.isRclicked()){
    if(helpers.checkPointCollision(mouse.getCoords(),buttons[0])){
      clearInterval(gameLoop);
      changeState = true;
      nextState = "gameState";
    }
    if(helpers.checkPointCollision(mouse.getCoords(),buttons[2])){
      clearInterval(gameLoop);
      changeState = true;
      config.setLevel(1);
      nextState = "menuState";
    }
  }
  for (var i = 0; i < buttons.length; i++) {
    if(helpers.checkPointCollision(mouse.getCoords(),buttons[i])){
      buttons[i].hover = true;
    } else {
      buttons[i].hover = false;
    }
  }
};

module.exports = {
  isInitialised: function(){
    return initialised;
  },
  isFinished: function(){
    return changeState;
  },
  getNextState: function(){
    return nextState;
  },
  setInitialised: function(bool){
    initialised = bool;
  },
  init: function() {
    console.log("announce state initialised");
    changeState = false;
    initialised = true;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].hover = false;
    }
    currLevel = config.getLevel();
    gameLoop = setInterval(function(){
      updateState();
    },1000/config.getFPS());
  },
  draw: function() {
    c.ctx.clearRect(0,0,c.width,c.height);
    for (var i = 0; i < buttons.length; i++) {
      helpers.drawButton(buttons[i], c.ctx);
    }
    c.ctx.font="20px Arial";
    c.ctx.fillStyle = '#000';
    c.ctx.textAlign = "left";
    c.ctx.fillText("get ready for Level: "+currLevel,20,30);
  },
}

},{"../Config/canvas":16,"../Config/config":17,"../Config/helpers":18,"../Config/mouse":21}],24:[function(require,module,exports){
var c = require('../Config/canvas');
var keys = require('../Config/keys');
var m = require('../Config/mouse');
var config = require('../Config/config');
var helpers = require('../Config/helpers');
var Screen = require('../Config/screen');
var Platform = require('../Actors/platform');
var Ladder = require('../Actors/ladder');
var Shrine = require('../Actors/spellShrine');
var Player = require('../Actors/player');
var Explosion = require('../Actors/Attacks/explosion');
var Patroler = require('../Actors/Monsters/patroler');
var Particle = require('../Actors/particles');
var levelList = require('../Config/levels');
var Message = require('../Actors/message');
var Collectibles = require('../Actors/collectibles');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;

var platforms = [];
var movPlatforms = [];
var ledges = [];
var vanPlatforms = [];
var expPlatforms = [];
var lavas = [];
var monsters = [];
var ladders = [];
var shrines = [];
var particles = [];
var smokeParts = [];
var explosions = [];
var manaBalls = [];
var energyShards = [];
var player = undefined;
var message = undefined;
var currLevel = undefined;
var exit = undefined;

function resetGame(){
  clearInterval(gameLoop);
  platforms = [];
  movPlatforms = [];
  ledges = [];
  vanPlatforms = [];
  expPlatforms = [];
  lavas = [];
  monsters = [];
  ladders = [];
  shrines = [];
  particles = [];
  manaBalls = [];
  energyShards = [];
  player.missiles = [];
  player.mana = player.maxMana;
  explosions = [];
  player = undefined;
  message = undefined;
  currLevel = undefined;
  exit = undefined;
  Screen.resetScreen();
}

function killPlayer(){
  if(player.alive){
    particles.push(Particle.makeBigParticle(player.centerX(),player.centerY()));
  }
  player.alive = false;
}

function updateState(){
  if(!player.alive){
    if(player.deadFor >= 50){
      player.alive = true;
      player.deadFor = 0;
      resetGame();
      config.setLevel(1);
      changeState = true;
      nextState = "menuState";
    } else {
      player.deadFor++
    }
  } else {
    if(!player.leavingMap){
      player.update(config.getGravity());
    }
  }

  if(message.active){
    message.update(player.x+player.width,player.y-30);
  }

  if(player && player.leavingMap){
    if(player.x < world.width){
      player.x++;
      player.y+=5;
    } else {
      player.leavingMap = false;
      config.addLevel();
      resetGame();
      changeState = true;
      nextState = "announceState";
    }
  }

  if(helpers.checkCollision(player,exit)){
    player.leavingMap = true;
  }
  if(player && !player.leavingMap){
    player.x = Math.max(0, Math.min(player.x, world.width - player.width));
    player.y = Math.max(0, Math.min(player.y, world.height - player.height));
  }

  mouseCoords = m.getCoords();
  Screen.updateScreen(player.x,player.y,player.width,player.height,player.direction,world.width,world.height,mouseCoords.y);

  for(var i = 0; i < particles.length; i++){
    if(particles[i].length === 0) {
       particles.splice(i,1);
    } else {
      for(var j = 0; j < particles[i].length; j++){
        particles[i][j].update();
        if(particles[i][j].dead){
          particles[i].splice(j,1);
        }
      }
    }
  }

  for(var i = 0; i < smokeParts.length; i++){
    if(smokeParts[i].length === 0) {
       smokeParts.splice(i,1);
    } else {
      for(var j = 0; j < smokeParts[i].length; j++){
        smokeParts[i][j].update();
        if(smokeParts[i][j].dead){
          smokeParts[i].splice(j,1);
        }
      }
    }
  }

  for(var i = 0; i<monsters.length;i++){
    monsters[i].update();
    if(monsters[i].remove){
      if(Math.random() > 0.5){
        manaBalls.push(Collectibles.newManaBall(monsters[i].x,monsters[i].y-50))
      }
      monsters.splice(i,1);
    }
    if(helpers.checkCollision(player,monsters[i])){
      if(!monsters[i].dead){
        killPlayer();
      }
    }
    if(player.stab.active && helpers.checkCollision(player.stab,monsters[i])){
      monsters[i].hp -= 5;
      if(monsters[i].stagger < 15) {
        monsters[i].stagger = 15;
      }
    }
  }

  for(var i = 0; i<platforms.length;i++){
    helpers.blockRect(player,platforms[i]);
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],platforms[i])){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
      }
    }
    for(var k = 0; k<monsters.length;k++){
      if(helpers.checkCollision(monsters[k],platforms[i]) && monsters[k].range.x1 != platforms[i].x){
        monsters[k].range.x1 = platforms[i].x;
        monsters[k].range.x2 = platforms[i].x+platforms[i].width;
      }
      helpers.blockRect(monsters[k],platforms[i]);
    }
  }
  for(var i = 0; i<ledges.length;i++){
    helpers.blockLedge(player,ledges[i]);
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],ledges[i])){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
      }
    }
  }
  for(var i = 0; i<vanPlatforms.length;i++){
    vanPlatforms[i].update();
    if(vanPlatforms[i].opacity > 0.3){
      helpers.blockRect(player,vanPlatforms[i]);
    }
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],vanPlatforms[i]) && vanPlatforms[i].opacity > 0.3){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
      }
    }
  }

  for(var i = 0; i<expPlatforms.length;i++){
    expPlatforms[i].update();
    if(expPlatforms[i].tillExplosion === 0 && expPlatforms[i].offScreen === false){
      particles.push(Particle.makeBigParticle(expPlatforms[i].centerX(),expPlatforms[i].centerY()));
    }
    helpers.blockRect(player,expPlatforms[i]);
    if(helpers.checkCollision(player,expPlatforms[i])){
      expPlatforms[i].touched = true;
    }
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],expPlatforms[i])){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        };
      }
    }
  }


  for(var i = 0; i<player.missiles.length;i++){
    var arrow = player.missiles[i]
    if(arrow.type === 'gustOfWind' && arrow.inactive){
      player.missiles.splice(i,1);
    }
    for(var j = 0; j<monsters.length;j++){
      if(helpers.checkCollision(arrow,monsters[j])){
        if(arrow.type === 'magicMissile'){
          player.missiles.splice(i,1);
          monsters[j].hp -= arrow.power;
          if(monsters[j].stagger < 10) {
            monsters[j].stagger = 10;
          }
        } else if(arrow.type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(arrow.centerX(),arrow.centerY()));
          player.missiles.splice(i,1);
        } else {
          helpers.blockRect(monsters[j],arrow)
        }
      }
    }
    if(arrow.x<screen.x || arrow.x>screen.x+screen.width || arrow.y<screen.y || arrow.y>screen.y+screen.height){
      player.missiles.splice(i,1);
    }
  }

  for(var i = 0; i<ladders.length;i++){
    if(helpers.checkCollision(player,ladders[i])){
      player.touchingLadder = true;
      player.whichLadder = ladders[i];
      break;
    }
    if(i==ladders.length-1){
      player.touchingLadder = false;
      player.onLadder = false;
      player.whichLadder = {};
    }
  }
  for(var i = 0; i<shrines.length;i++){
    if(helpers.checkCollision(player,shrines[i])){
      if(!player.touchingShrine && player.attacks.indexOf(shrines[i].spell) === -1){
        message.reset();
        message.setMsg('senseSpellMsg');
        message.active = true;
      }
      player.touchingShrine = true;
      if(player.kneelingFor >= 90){
        if(player.attacks.indexOf(shrines[i].spell) === -1){
          player.addAttack(shrines[i].spell);
          message.reset();
          message.setMsg('newSpellMsg');
          message.active = true;
        }
      }
    } else {
      player.touchingShrine = false;
    }
  }

  for(var i = 0; i<manaBalls.length;i++){
    manaBalls[i].update();
    if(helpers.checkCollision(player,manaBalls[i])){
      if(player.mana < player.maxMana){
        player.mana = Math.min(player.mana+10, player.maxMana);
        manaBalls.splice(i,1);
      }
    }
  }

  for(var i = 0; i<platforms.length;i++){
    if(helpers.checkCollision(player,platforms[i])){
      player.touchingPlatform = true;
      player.whichPlatform = platforms[i];
      break;
    }
    if(i==ladders.length-1){
      player.touchingPlatform = false;
      player.whichPlatform = {};
    }
  }

  for(var i = 0; i<movPlatforms.length;i++){
    movPlatforms[i].update();
    helpers.blockRect(player,movPlatforms[i]);
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],movPlatforms[i])){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
      }
    }
  }

  for(var i = 0; i<lavas.length;i++){
    if(helpers.checkCollision(player,lavas[i])){
      killPlayer();
    }
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],lavas[i])){
        smokeParts.push(Particle.makeSmoke(player.missiles[j].x,player.missiles[j].y));
        player.missiles.splice(j,1);
      }
    }
    for(var k = 0; k<monsters.length;k++){
      if(helpers.checkCollision(monsters[k],lavas[i])){
        monsters.splice(k,1);
      }
    }
  }

  for(var i = 0; i<energyShards.length;i++){
    energyShards[i].update();
    if(helpers.checkCollision(player,energyShards[i])){
      player.energyShards++;
      energyShards.splice(i,1);
    }
  }
  for(var i = 0; i<explosions.length;i++){
    explosions[i].update();
    if(helpers.checkCollision(explosions[i],player)){
      killPlayer();
    }
    for(var j = 0; j<monsters.length;j++){
      if(helpers.checkCollision(explosions[i],monsters[j])){
        monsters[j].dead = true;
      }
    }
    if(explosions[i].remove){
      explosions.splice(i,1);
    }
  }
};

module.exports = {
  isInitialised: function(){
    return initialised;
  },
  isFinished: function(){
    return changeState;
  },
  getNextState: function(){
    return nextState;
  },
  setInitialised: function(bool){
    initialised = bool;
  },
  init: function() {
    console.log("game state initialised");
    changeState = false;
    initialised = true;
    platforms = [];
    movPlatforms = [];
    ledges = [];
    vanPlatforms = [];
    lavas = [];
    ladders = [];
    player = undefined;
    message = undefined;
    currLevel = levelList.getLevelData(config.getLevel());

    world = {
      x: 0,
      y: 0,
      width: currLevel.world.width,
      height: currLevel.world.height,
    };

    for (var i = 0; i < currLevel.platforms.length; i++) {
      currPlat = currLevel.platforms[i];
      platforms.push(Platform.newPlatform(currPlat.x,currPlat.y,currPlat.width,currPlat.height));
    }

    for (var i = 0; i < currLevel.ledges.length; i++) {
      currLedge = currLevel.ledges[i];
      ledges.push(Platform.newPlatform(currLedge.x,currLedge.y,currLedge.width,currLedge.height,currLedge.color));
    }

    for (var i = 0; i < currLevel.expPlatforms.length; i++) {
      currExp = currLevel.expPlatforms[i];
      expPlatforms.push(Platform.newExplodingPlatform(currExp.x,currExp.y,currExp.width,currExp.height,currExp.color));
    }

    for (var i = 0; i < currLevel.vanPlatforms.length; i++) {
      currVan = currLevel.vanPlatforms[i];
      vanPlatforms.push(Platform.newVanishingPlatform(currVan.x,currVan.y,currVan.width,currVan.height,currVan.color));
    }

    for (var i = 0; i < currLevel.movPlatforms.length; i++) {
      currMov = currLevel.movPlatforms[i];
      movPlatforms.push(Platform.newMovingPlatform(currMov.x,currMov.y,currMov.width,currMov.height,currMov.color,currMov.minY,currMov.maxY,currMov.speed));
    }

    for (var i = 0; i < currLevel.lavas.length; i++) {
      currLav = currLevel.lavas[i];
      lavas.push(Platform.newPlatform(currLav.x,currLav.y,currLav.width,currLav.height,currLav.color));
    }

    for (var i = 0; i < currLevel.monstersPatrolers.length; i++) {
      currPat = currLevel.monstersPatrolers[i];
      monsters.push(Patroler.newPatroler(platforms[currPat.platformIndex]));
    }

    for (var i = 0; i < currLevel.ladders.length; i++) {
      currLad = currLevel.ladders[i];
      ladders.push(Ladder.newLadder(currLad.x,currLad.y,currLad.height));
    }
    for (var i = 0; i < currLevel.spellShrines.length; i++) {
      currShrine = currLevel.spellShrines[i];
      shrines.push(Shrine.newShrine(currShrine.x,currShrine.y,currShrine.spell));
    }

    for (var i = 0; i < currLevel.manaBalls.length; i++) {
      manaBall = currLevel.manaBalls[i];
      manaBalls.push(Collectibles.newManaBall(manaBall.x,manaBall.y));
    }

    for (var i = 0; i < currLevel.energyShards.length; i++) {
      shard = currLevel.energyShards[i];
      energyShards.push(Collectibles.newEnergyShard(shard.x,shard.y));
    }

    exit = {};
    exit.x = currLevel.levelExit.x;
    exit.y = currLevel.levelExit.y;
    exit.width = currLevel.levelExit.width;
    exit.height = currLevel.levelExit.height;
    exit.color = currLevel.levelExit.color;

    player = Player.getPlayer();
    player.x = currLevel.player.x;
    player.y = currLevel.player.y;
    if(config.getLevel()===1){
      player.resetAttacks();
      player.energyShards = 0;
    }
    player.missiles = [];

    message = Message.getMessage();

    Screen.setScreen(0,world.height-c.height,player.y+(player.height/2)-(screen.height/2));

    gameLoop = setInterval(function(){
      updateState();
    },1000/config.getFPS());
  },
  draw: function() {
    if(!changeState){
      gameScreen = Screen.getScreen();
      c.ctx.clearRect(0,0,c.width,c.height);
      c.ctx.save();
      c.ctx.translate(-gameScreen.x, -gameScreen.y);
      // exit draw for test
      c.ctx.fillStyle = exit.color;
      c.ctx.fillRect(exit.x,exit.y,exit.width,exit.height);
      // end exit draw
      for(var i = 0; i<platforms.length;i++){
        c.ctx.fillStyle = platforms[i].color;
        platforms[i].draw(c.ctx);
      }
      for(var i = 0; i<movPlatforms.length;i++){
        c.ctx.fillStyle = movPlatforms[i].color;
        movPlatforms[i].draw(c.ctx);
      }
      for(var i = 0; i<ledges.length;i++){
        c.ctx.fillStyle = ledges[i].color;
        ledges[i].draw(c.ctx);
      }
      for(var i = 0; i<vanPlatforms.length;i++){
        c.ctx.fillStyle = vanPlatforms[i].color;
        vanPlatforms[i].draw(c.ctx);
      }
      for(var i = 0; i<expPlatforms.length;i++){
        c.ctx.fillStyle = expPlatforms[i].color;
        expPlatforms[i].draw(c.ctx);
      }
      for(var i = 0; i<lavas.length;i++){
        c.ctx.fillStyle = lavas[i].color;
        lavas[i].draw(c.ctx);
      }
      for(var i = 0; i<shrines.length;i++){
        shrines[i].draw(c.ctx);
      }
      for(var i = 0; i<monsters.length;i++){
        monsters[i].draw(c.ctx);
      }
      for(var i = 0; i<ladders.length;i++){
        ladders[i].draw(c.ctx);
      }
      for(var i = 0; i < manaBalls.length; i++){
        manaBalls[i].draw(c.ctx);
      }
      for(var i = 0; i < energyShards.length; i++){
        energyShards[i].draw(c.ctx);
      }
      c.ctx.fillStyle = player.color;
      if(player.alive){
        player.draw(c.ctx);
      }
      c.ctx.fillStyle = '#8b0000';
      for(var i = 0; i < particles.length; i++){
        for(var j = 0; j < particles[i].length; j++){
          if(!particles[i][j].dead){
            particles[i][j].draw(c.ctx);
          }
        }
      }
      c.ctx.fillStyle = '#333';
      for(var i = 0; i < smokeParts.length; i++){
        for(var j = 0; j < smokeParts[i].length; j++){
          if(!smokeParts[i][j].dead){
            smokeParts[i][j].draw(c.ctx);
          }
        }
      }
      for(var i = 0; i < explosions.length; i++){
        explosions[i].draw(c.ctx);
      }

      if(message.active){
        message.draw(c.ctx)
      }
      c.ctx.restore()
      c.ctx.font="14px Arial";
      if(player.attacks.length > 0) {
        c.ctx.fillText("Current spell: "+player.attacks[player.currAttack],3,15);
      } else {
        c.ctx.fillText("No Spells",3,15);
      }
      c.ctx.fillText("Mana: "+player.mana+"/"+player.maxMana,3,30);
      c.ctx.fillText("Shards: "+player.energyShards,3,45);
    }
  },
}

},{"../Actors/Attacks/explosion":1,"../Actors/Monsters/patroler":6,"../Actors/collectibles":7,"../Actors/ladder":9,"../Actors/message":10,"../Actors/particles":11,"../Actors/platform":12,"../Actors/player":13,"../Actors/spellShrine":14,"../Config/canvas":16,"../Config/config":17,"../Config/helpers":18,"../Config/keys":19,"../Config/levels":20,"../Config/mouse":21,"../Config/screen":22}],25:[function(require,module,exports){
var assets = require('../Config/assets');
var c = require('../Config/canvas');

var initialised = false;
var counter = 0;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;
var text = "Loading";
var arrow;

function loadAssets(){
  arrowPic = new Image();
  arrowPic.src = "./GFX/arrow.png";
  arrowPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("arrow",arrowPic);
  ladderPic = new Image();
  ladderPic.src = "./GFX/ladder.png";
  ladderPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("ladder",ladderPic);
  senseSpellMsgPic = new Image();
  senseSpellMsgPic.src = "./GFX/SenseNewSpellMsg.png";
  senseSpellMsgPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("senseSpellMsg",senseSpellMsgPic);
  newSpellMsgPic = new Image();
  newSpellMsgPic.src = "./GFX/newSpellMsg.png";
  newSpellMsgPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("newSpellMsg",newSpellMsgPic);
  noManaMsgPic = new Image();
  noManaMsgPic.src = "./GFX/notEnoughManaMsg.png";
  noManaMsgPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("noManaMsg",noManaMsgPic);
}

function updateState(){
  if(counter < 3){
    text += '.';
    counter++;
  } else {
    counter = 0;
    text = "Loading";
  }
  if(assets.getAssetsNum() === assets.getAssetsLength() && assets.getAssetsLength() > 0){
    console.log('assets loaded');
    clearInterval(gameLoop);
    changeState = true;
    nextState = "menuState";
  }
};

module.exports = {
  isInitialised: function(){
    return initialised;
  },
  isFinished: function(){
    return changeState;
  },
  getNextState: function(){
    return nextState;
  },
  setInitialised: function(bool){
    initialised = bool;
  },
  init: function() {
    console.log("loading state initialised");
    changeState = false;
    initialised = true;
    loadAssets();
    gameLoop = setInterval(function(){
      updateState();
    },200)
  },
  draw: function() {
    c.ctx.clearRect(0,0,c.width,c.height);
    c.ctx.font="20px Arial";
    c.ctx.fillStyle = '#000';
    c.ctx.textAlign = "left";
    c.ctx.fillText(text,20,c.height/2-20);
  },
}

},{"../Config/assets":15,"../Config/canvas":16}],26:[function(require,module,exports){
var c = require('../Config/canvas');
var keys = require('../Config/keys');
var config = require('../Config/config');
var mouse = require('../Config/mouse');
var helpers = require('../Config/helpers');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;
var buttons = [
  {
    'x': c.width/2-100,
    'y': c.height/2+25,
    'width': 200,
    'height': 50,
    'color': 'green',
    'text': 'Start Game',
    'hover': false
  },
]

function updateState(){
  for (var i = 0; i < buttons.length; i++) {
    if(helpers.checkPointCollision(mouse.getCoords(),buttons[i])){
      buttons[i].hover = true;
    } else {
      buttons[i].hover = false;
    }
  }
  if(mouse.isClicked()||mouse.isRclicked()){
    if(helpers.checkPointCollision(mouse.getCoords(),buttons[0])){
      clearInterval(gameLoop);
      changeState = true;
      nextState = "gameState";
    }
  }
};

module.exports = {
  isInitialised: function(){
    return initialised;
  },
  isFinished: function(){
    return changeState;
  },
  getNextState: function(){
    return nextState;
  },
  setInitialised: function(bool){
    initialised = bool;
  },
  init: function() {
    console.log("menu state initialised");
    changeState = false;
    initialised = true;
    gameLoop = setInterval(function(){
      updateState();
    },1000/config.getFPS());
  },
  draw: function() {
    c.ctx.clearRect(0,0,c.width,c.height);
    for (var i = 0; i < buttons.length; i++) {
      helpers.drawButton(buttons[i], c.ctx);
    }
    c.ctx.font="20px Arial";
    c.ctx.fillStyle = '#000';
    c.ctx.textAlign = "left";
    c.ctx.fillText("Welcome to JS Platformer Alpha Build",20,30);
    c.ctx.fillText("Use the WASD keys to move around",20,60);
    c.ctx.fillText("You can look around with the mouse",20,90);
    c.ctx.fillText("Left Click = melee Attack; Right Click = spell",20,120);
    c.ctx.fillText("Toogle the spells with 'e' key",20,150);
  },
}

},{"../Config/canvas":16,"../Config/config":17,"../Config/helpers":18,"../Config/keys":19,"../Config/mouse":21}],27:[function(require,module,exports){
var c = require('./Config/canvas');
var keys = require('./Config/keys');
var m = require('./Config/mouse');
var loadingState = require('./States/loadingState');
var menuState = require('./States/menuState');
var gameState = require('./States/gameState');
var announceState = require('./States/announceState');

var states = {
  'loadingState' : loadingState,
  'menuState' : menuState,
  'gameState' : gameState,
  'announceState': announceState,
}

var currState = states['loadingState'];

function gameLoop(){
  window.requestAnimationFrame(gameLoop,c.canvas);
  if(currState.init){
    if(!currState.isInitialised()){
      currState.init();
    }
  }
  if(currState.draw){
    currState.draw();
  }
  if(currState.isFinished()){
    var nextState = currState.getNextState();
    currState.setInitialised(false);
    currState = states[nextState];
    keys.reset();
  }
}

module.exports = {
  init: function() {
    keys.init();
    m.init();
    gameLoop();
  }
}

},{"./Config/canvas":16,"./Config/keys":19,"./Config/mouse":21,"./States/announceState":23,"./States/gameState":24,"./States/loadingState":25,"./States/menuState":26}],28:[function(require,module,exports){
var game = require('./game');

game.init();

},{"./game":27}]},{},[28]);
