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

},{"../Config/canvas":5,"./entity":1}],3:[function(require,module,exports){
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

},{"../Config/assets":4,"../Config/canvas":5,"../Config/helpers":7,"../Config/keys":8,"../Config/mouse":9,"./entity":1}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var canvas = document.getElementById('canvas');

module.exports = {
    canvas: canvas,
    ctx: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
};

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
              r1.onGround = true;
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
  }
}

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
c = require('./canvas');

mouseClicked = false;
mouseCoords = {x:undefined,y:undefined};
clickedCoords = {x:undefined,y:undefined};

module.exports = {
  isClicked: function() {
    return mouseClicked;
  },
  getCoords: function(){
    return mouseCoords;
  },
  getClickedCoords: function(){
    return clickedCoords;
  },
  init: function() {
    c.canvas.addEventListener('mousedown', function(e){
      mouseClicked = true;
      var clickx = e.pageX;
      var clicky = e.pageY;
      clickx -= c.canvas.offsetLeft;
      clicky -= c.canvas.offsetTop;
      clickedCoords = {x:clickx,y:clicky};
      console.log(clickedCoords.x,clickedCoords.y);
    },false);
    c.canvas.addEventListener('mouseup', function(e){
      mouseClicked = false;
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

},{"./canvas":5}],10:[function(require,module,exports){
var c = require('../Config/canvas');
var keys = require('../Config/keys');
var config = require('../Config/config');
var helpers = require('../Config/helpers');
var Platform = require('../Actors/platform');
var Player = require('../Actors/player');

var initialised = false;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;

var platforms = [];
var player = undefined;

function updateState(){
  player.update(config.getGravity());

  for(var i = 0; i<platforms.length;i++){
    helpers.blockRect(player,platforms[i]);
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
  },
}

},{"../Actors/platform":2,"../Actors/player":3,"../Config/canvas":5,"../Config/config":6,"../Config/helpers":7,"../Config/keys":8}],11:[function(require,module,exports){
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

},{"../Config/assets":4,"../Config/canvas":5}],12:[function(require,module,exports){
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

},{"../Config/canvas":5,"../Config/config":6,"../Config/keys":8}],13:[function(require,module,exports){
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

},{"./Config/canvas":5,"./Config/keys":8,"./Config/mouse":9,"./States/gameState":10,"./States/loadingState":11,"./States/menuState":12}],14:[function(require,module,exports){
var game = require('./game');

game.init();

},{"./game":13}]},{},[14]);
