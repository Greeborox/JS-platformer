(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

module.exports = {
  newEntity: function(){
    var newEnt = Object.create(entity);
    return newEnt;
  }
}

},{}],2:[function(require,module,exports){
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

},{"../Config/assets":6,"../Config/canvas":7,"./entity":1}],3:[function(require,module,exports){
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

},{"./entity":1}],4:[function(require,module,exports){
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
}

},{"../Config/canvas":7,"./entity":1}],5:[function(require,module,exports){
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

},{"../Config/assets":6,"../Config/canvas":7,"../Config/helpers":9,"../Config/keys":10,"../Config/mouse":11,"./entity":1}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var canvas = document.getElementById('canvas');

module.exports = {
    canvas: canvas,
    ctx: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
};

},{}],8:[function(require,module,exports){
fps = 60;
gravity = 5;

module.exports = {
  getFPS: function(){
    return fps;
  },
  getGravity: function(){
    return gravity;
  }
}

},{}],9:[function(require,module,exports){
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
  }
}

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
c = require('./canvas');
helpers = require('./helpers');
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

},{"./canvas":7,"./helpers":9,"./screen":12}],12:[function(require,module,exports){
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

},{"./canvas":7}],13:[function(require,module,exports){
var c = require('../Config/canvas');
var keys = require('../Config/keys');
var m = require('../Config/mouse');
var config = require('../Config/config');
var helpers = require('../Config/helpers');
var Screen = require('../Config/screen');
var Platform = require('../Actors/platform');
var Ladder = require('../Actors/ladder');
var Player = require('../Actors/player');
var Particle = require('../Actors/particles');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;

var platforms = [];
var movPlatforms = [];
var ledges = [];
var vanPlatforms = [];
var lavas = [];
var ladders = [];
var particles = [];
var smokeParts = [];
var player = undefined;

function resetGame(){
  clearInterval(gameLoop);
  platforms = [];
  movPlatforms = [];
  ledges = [];
  vanPlatforms = [];
  lavas = [];
  ladders = [];
  player.arrows = [];
  player = undefined;
  changeState = true;
  nextState = "menuState";
}

function updateState(){
  player.update(config.getGravity());

  player.x = Math.max(0, Math.min(player.x, world.width - player.width));
  player.y = Math.max(0, Math.min(player.y, world.height - player.height));

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

  for(var i = 0; i<platforms.length;i++){
    helpers.blockRect(player,platforms[i]);
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],platforms[i])){
        particles.push(Particle.makeParticles(player.arrows[j].x,player.arrows[j].y));
        player.arrows.splice(j,1);
      }
    }
  }
  for(var i = 0; i<ledges.length;i++){
    helpers.blockLedge(player,ledges[i]);
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],ledges[i])){
        particles.push(Particle.makeParticles(player.arrows[j].x,player.arrows[j].y));
        player.arrows.splice(j,1);
      }
    }
  }
  for(var i = 0; i<vanPlatforms.length;i++){
    vanPlatforms[i].update();
    if(vanPlatforms[i].opacity > 0.3){
      helpers.blockRect(player,vanPlatforms[i]);
    }
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],vanPlatforms[i]) && vanPlatforms[i].opacity > 0.3){
        particles.push(Particle.makeParticles(player.arrows[j].x,player.arrows[j].y));
        player.arrows.splice(j,1);
      }
    }
  }
  for(var i = 0; i<player.arrows.length;i++){
    var arrow = player.arrows[i]
    if(arrow.x<screen.x || arrow.x>screen.x+screen.width || arrow.y<screen.y || arrow.y>screen.y+screen.height){
      player.arrows.splice(i,1);
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
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],movPlatforms[i])){
        particles.push(Particle.makeParticles(player.arrows[j].x,player.arrows[j].y));
        player.arrows.splice(j,1);
      }
    }
  }

  for(var i = 0; i<lavas.length;i++){
    if(helpers.checkCollision(player,lavas[i])){
      resetGame();
    }
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],lavas[i])){
        smokeParts.push(Particle.makeSmoke(player.arrows[j].x,player.arrows[j].y));
        player.arrows.splice(j,1);
      }
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

    world = {
      x: 0,
      y: 0,
      width: 4000,
      height: 3000,
    };

    platform1 = Platform.newPlatform(270,2608,228,12);
    platform2 = Platform.newPlatform(430,2738,128,12);
    platform3 = Platform.newPlatform(40,2788,128,12);
    platform4 = Platform.newPlatform(0,world.height-24,200,12);
    platform5 = Platform.newPlatform(1650,world.height-24,2500,12);
    platform6 = Platform.newPlatform(570,2508,268,12);
    platform7 = Platform.newPlatform(1270,2508,68,12);
    platform8 = Platform.newPlatform(1290,2808,264,12);
    platform9 = Platform.newPlatform(1670,2738,164,12);
    platforms.push(platform1,platform2,platform3,platform4,platform5, platform6, platform7, platform8, platform9);

    ledge1 = Platform.newPlatform(100,2588,100,12,'red');
    ledge2 = Platform.newPlatform(100,2488,100,12,'red');
    ledges.push(ledge1, ledge2);

    vanPlat1 = Platform.newVanishingPlatform(200,2838,168,12,'magenta');
    vanPlat2 = Platform.newVanishingPlatform(990,2552,168,12,'magenta');
    vanPlatforms.push(vanPlat1,vanPlat2);

    movPlat1 = Platform.newMovingPlatform(400,world.height-36,70,12,'darkGreen',world.height-12, world.height-160,0.5);
    movPlat2 = Platform.newMovingPlatform(570,world.height-80,70,12,'darkGreen',world.height-12, world.height-160,1);
    movPlat3 = Platform.newMovingPlatform(740,world.height-12,70,12,'darkGreen',world.height-12, world.height-160,1.5);
    movPlat4 = Platform.newMovingPlatform(910,world.height-100,70,12,'darkGreen',world.height-12, world.height-160,0.5);
    movPlat5 = Platform.newMovingPlatform(1080,world.height-40,70,12,'darkGreen',world.height-12, world.height-160,0.2);
    movPlat6 = Platform.newMovingPlatform(1250,world.height-20,70,12,'darkGreen',world.height-12, world.height-160,0.7);
    movPlatforms.push(movPlat1,movPlat2,movPlat3,movPlat4,movPlat5,movPlat6);

    lava1 = Platform.newPlatform(0,world.height-12,world.width,12,'darkOrange');
    lavas.push(lava1);

    ladder1 = Ladder.newLadder(100,2772,204);
    ladder2 = Ladder.newLadder(450,2596,140);
    ladder3 = Ladder.newLadder(1300,2496,312);
    ladder4 = Ladder.newLadder(1700,2724,252);
    ladders.push(ladder1,ladder2,ladder3,ladder4);

    player = Player.getPlayer();
    player.y = world.height - player.height - 20;
    player.arrows = [];
    player.x =30;

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
      for(var i = 0; i<lavas.length;i++){
        c.ctx.fillStyle = lavas[i].color;
        lavas[i].draw(c.ctx);
      }
      for(var i = 0; i<ladders.length;i++){
        ladders[i].draw(c.ctx);
      }
      c.ctx.fillStyle = player.color;
      player.draw(c.ctx);
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
      c.ctx.restore()
    }
  },
}

},{"../Actors/ladder":2,"../Actors/particles":3,"../Actors/platform":4,"../Actors/player":5,"../Config/canvas":7,"../Config/config":8,"../Config/helpers":9,"../Config/keys":10,"../Config/mouse":11,"../Config/screen":12}],14:[function(require,module,exports){
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

},{"../Config/assets":6,"../Config/canvas":7}],15:[function(require,module,exports){
var c = require('../Config/canvas');
var keys = require('../Config/keys');
var config = require('../Config/config');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;

function updateState(){
  if(keys.isPressed('SPACE')){
    clearInterval(gameLoop);
    changeState = true;
    nextState = "gameState";
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
    c.ctx.font="20px Arial";
    c.ctx.fillStyle = '#000';
    c.ctx.textAlign = "left";
    c.ctx.fillText("press space",20,c.height/2-20);
  },
}

},{"../Config/canvas":7,"../Config/config":8,"../Config/keys":10}],16:[function(require,module,exports){
var c = require('./Config/canvas');
var keys = require('./Config/keys');
var m = require('./Config/mouse');
var loadingState = require('./States/loadingState');
var menuState = require('./States/menuState');
var gameState = require('./States/gameState');

var states = {
  'loadingState' : loadingState,
  'menuState' : menuState,
  'gameState' : gameState
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

},{"./Config/canvas":7,"./Config/keys":10,"./Config/mouse":11,"./States/gameState":13,"./States/loadingState":14,"./States/menuState":15}],17:[function(require,module,exports){
var game = require('./game');

game.init();

},{"./game":16}]},{},[17]);
