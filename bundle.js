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

},{"./entity":1}],3:[function(require,module,exports){
var entity = require('./entity');
var c = require('../Config/canvas');

platform = entity.newEntity();
platform.color = "gray";

module.exports = {
  newPlatform: function(x,y,width,height){
    var newPlat = Object.create(platform);
    newPlat.x = x;
    newPlat.y = y;
    newPlat.width = width;
    newPlat.height = height;
    return newPlat;
  }
}

},{"../Config/canvas":6,"./entity":1}],4:[function(require,module,exports){
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
  var moueCoords = mouseCoords = m.getCoords();
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
}

player.controlMouse = function() {
  if(m.isRclicked() && !rClicked){
    rClicked = true;
    if(!player.stab.active){
      player.stab.active = true;
    }
  }
  if(!m.isRclicked()) {
    rClicked = false;
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

      if(arrow.x<0 || arrow.x>c.width || arrow.y<0 || arrow.y>c.height){
        player.arrows.splice(i,1);
      }
    }
  }
}

player.handleKneeling = function(){
  if(this.kneeling){
    this.height = 27;
  } else {
    this.height = 54;
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

},{"../Config/assets":5,"../Config/canvas":6,"../Config/helpers":8,"../Config/keys":9,"../Config/mouse":10,"./entity":1}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
var canvas = document.getElementById('canvas');

module.exports = {
    canvas: canvas,
    ctx: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
              r1.y = r1.y + overlapY;
              r1.vector.y=0;
            } else {
              if(r1.hasOwnProperty('onGround')){
                r1.onGround = true;
              }
              r1.y = r1.y - overlapY;
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
c = require('./canvas');
helpers = require('./helpers');

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
      var clickx = e.pageX;
      var clicky = e.pageY;
      clickx -= c.canvas.offsetLeft;
      clicky -= c.canvas.offsetTop;
      clickedCoords = {x:clickx,y:clicky};
    },false);
    c.canvas.addEventListener('mouseup', function(e){
      mouseClicked = false;
      rMouseClicked = false;
    },false);
    c.canvas.addEventListener('mousemove', function(e){
      var movex = e.pageX;
      var movey = e.pageY;
      movex -= c.canvas.offsetLeft;
      movey -= c.canvas.offsetTop;
      mouseCoords = {x:movex,y:movey};
    },false);
  }
}

},{"./canvas":6,"./helpers":8}],11:[function(require,module,exports){
var c = require('../Config/canvas');
var keys = require('../Config/keys');
var config = require('../Config/config');
var helpers = require('../Config/helpers');
var Platform = require('../Actors/platform');
var Player = require('../Actors/player');
var Particle = require('../Actors/particles');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;

var platforms = [];
var particles = [];
var player = undefined;

function updateState(){
  player.update(config.getGravity());
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

  for(var i = 0; i<platforms.length;i++){
    helpers.blockRect(player,platforms[i]);
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],platforms[i])){
        particles.push(Particle.makeParticles(player.arrows[j].x,player.arrows[j].y,config.getGravity()));
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
    player = undefined;

    platform1 = Platform.newPlatform(270,120,228,12);
    platform2 = Platform.newPlatform(200,300,168,12);
    platform3 = Platform.newPlatform(430,380,128,12);
    platform4 = Platform.newPlatform(40,200,128,12);
    platform5 = Platform.newPlatform(0,c.height-12,c.width,12);
    platforms.push(platform1,platform2,platform3,platform4,platform5);

    player = Player.getPlayer();

    gameLoop = setInterval(function(){
      updateState();
    },1000/config.getFPS());
  },
  draw: function() {
    c.ctx.clearRect(0,0,c.width,c.height);
    for(var i = 0; i<platforms.length;i++){
      c.ctx.fillStyle = platforms[i].color;
      platforms[i].draw(c.ctx);
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
  },
}

},{"../Actors/particles":2,"../Actors/platform":3,"../Actors/player":4,"../Config/canvas":6,"../Config/config":7,"../Config/helpers":8,"../Config/keys":9}],12:[function(require,module,exports){
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
  arrow = new Image();
  arrow.src = "./GFX/arrow.png";
  arrow.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("arrow",arrow);
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

},{"../Config/assets":5,"../Config/canvas":6}],13:[function(require,module,exports){
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

},{"../Config/canvas":6,"../Config/config":7,"../Config/keys":9}],14:[function(require,module,exports){
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

},{"./Config/canvas":6,"./Config/keys":9,"./Config/mouse":10,"./States/gameState":11,"./States/loadingState":12,"./States/menuState":13}],15:[function(require,module,exports){
var game = require('./game');

game.init();

},{"./game":14}]},{},[15]);
