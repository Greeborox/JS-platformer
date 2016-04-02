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
var movPlatforms = [];
var lavas = [];
var ladders = [];
var particles = [];
var player = undefined;

function resetGame(){
  clearInterval(gameLoop);
  platforms = [];
  movPlatforms = [];
  lavas = [];
  ladders = [];
  player = undefined;
  changeState = true;
  nextState = "menuState";
}

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

  for(var i = 0; i<movPlatforms.length;i++){
    movPlatforms[i].update();
    helpers.blockRect(player,movPlatforms[i]);
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],movPlatforms[i])){
        particles.push(Particle.makeParticles(player.arrows[j].x,player.arrows[j].y,config.getGravity()));
        player.arrows.splice(j,1);
      }
    }
    /*if(helpers.checkCollision(player,movPlatforms[i])){
      player.touchingPlatform = true;
    }*/
  }

  for(var i = 0; i<lavas.length;i++){
    if(helpers.checkCollision(player,lavas[i])){
      resetGame();
    }
    for(var j = 0; j<player.arrows.length;j++){
      if(helpers.checkCollision(player.arrows[j],lavas[i])){
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
    lavas = [];
    ladders = [];
    player = undefined;

    world = {
      x: 0,
      y: 0,
      width: 4000,
      height: 3000,
    };

    Screen.setScreen(0,world.height-c.height);
    gameScreen = Screen.getScreen();

    platform1 = Platform.newPlatform(270,2608,228,12);
    platform2 = Platform.newPlatform(200,2838,168,12);
    platform3 = Platform.newPlatform(430,2738,128,12);
    platform4 = Platform.newPlatform(40,2788,128,12);
    platform5 = Platform.newPlatform(0,world.height-24,200,12);
    platform6 = Platform.newPlatform(1650,world.height-24,2500,12);
    platform7 = Platform.newPlatform(570,2508,268,12);
    platform8 = Platform.newPlatform(990,2552,168,12);
    platform9 = Platform.newPlatform(1270,2508,68,12);
    platform10 = Platform.newPlatform(1290,2808,264,12);
    platform11 = Platform.newPlatform(1670,2738,164,12);
    platforms.push(platform1,platform2,platform3,platform4,platform5,platform6, platform7, platform8, platform9, platform10,platform11);

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
    player.x =30;

    gameLoop = setInterval(function(){
      updateState();
    },1000/config.getFPS());
  },
  draw: function() {
    if(!changeState){
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
      c.ctx.restore()
    }
  },
}
