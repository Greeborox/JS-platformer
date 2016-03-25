var c = require('../Config/canvas');
var keys = require('../Config/keys');
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
var ladders = [];
var particles = [];
var player = undefined;

function updateState(){
  player.update(config.getGravity());

  player.x = Math.max(0, Math.min(player.x, world.width - player.width));
  player.y = Math.max(0, Math.min(player.y, world.height - player.height));

  gameScreen.x = Math.floor(player.x + (player.width / 2) - (gameScreen.width / 2));
  gameScreen.y = Math.floor(player.y + (player.height / 2) - (gameScreen.height / 2));

  if(gameScreen.x < world.x){
    gameScreen.x = world.x;
  };
  if(gameScreen.y < world.y){
    gameScreen.y = world.y;
  };
  if(gameScreen.x + gameScreen.width > world.x + world.width){
    gameScreen.x = world.x + world.width - gameScreen.width;
  };
  if(gameScreen.y + gameScreen.height > world.height){
    gameScreen.y = world.height - gameScreen.height;
  };

  Screen.setScreen(gameScreen.x,gameScreen.y);

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

    world = {
      x: 0,
      y: 0,
      width: 4000,
      height: 3000,
    };

    Screen.setScreen(0,world.height-c.height);
    gameScreen = Screen.getScreen();

    platform1 = Platform.newPlatform(270,2620,228,12);
    platform2 = Platform.newPlatform(200,2850,168,12);
    platform3 = Platform.newPlatform(430,2750,128,12);
    platform4 = Platform.newPlatform(40,2800,128,12);
    platform5 = Platform.newPlatform(0,world.height-12,world.width,12);
    platform6 = Platform.newPlatform(570,2520,268,12);
    platform7 = Platform.newPlatform(990,2570,168,12);
    platform8 = Platform.newPlatform(1270,2520,68,12);
    platform9 = Platform.newPlatform(1290,2820,264,12);
    platform10 = Platform.newPlatform(1670,2750,164,12);
    platforms.push(platform1,platform2,platform3,platform4,platform5,platform6, platform7, platform8, platform9, platform10);

    ladder1 = Ladder.newLadder(100,2784,204);
    ladder2 = Ladder.newLadder(450,2608,140);
    ladder3 = Ladder.newLadder(1300,2508,312);
    ladder4 = Ladder.newLadder(1700,2736,252);
    ladders.push(ladder1,ladder2,ladder3,ladder4);

    player = Player.getPlayer();
    player.y = world.height - player.height - 20;

    gameLoop = setInterval(function(){
      updateState();
    },1000/config.getFPS());
  },
  draw: function() {
    c.ctx.clearRect(0,0,c.width,c.height);
    c.ctx.save();
    c.ctx.translate(-gameScreen.x, -gameScreen.y);
    for(var i = 0; i<platforms.length;i++){
      c.ctx.fillStyle = platforms[i].color;
      platforms[i].draw(c.ctx);
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
    c.ctx.restore()
  },
}
