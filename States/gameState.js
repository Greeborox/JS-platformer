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
var expPlatforms = [];
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
  expPlatforms = [];
  lavas = [];
  ladders = [];
  player.missiles = [];
  player = undefined;
  changeState = true;
  nextState = "menuState";
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
    } else {
      player.deadFor++
    }
  } else {
    player.update(config.getGravity());
  }

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
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],platforms[i])){
        particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
        player.missiles.splice(j,1);
      }
    }
  }
  for(var i = 0; i<ledges.length;i++){
    helpers.blockLedge(player,ledges[i]);
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],ledges[i])){
        particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
        player.missiles.splice(j,1);
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
        particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
        player.missiles.splice(j,1);
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
        particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
        player.missiles.splice(j,1);
      }
    }
  }


  for(var i = 0; i<player.missiles.length;i++){
    var arrow = player.missiles[i]
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
        particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
        player.missiles.splice(j,1);
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
    platform5 = Platform.newPlatform(1650,world.height-24,300,12);
    platform6 = Platform.newPlatform(2350,world.height-24,1400,12);
    platform7 = Platform.newPlatform(570,2508,268,12);
    platform8 = Platform.newPlatform(1270,2508,68,12);
    platform9 = Platform.newPlatform(1290,2808,264,12);
    platform10 = Platform.newPlatform(1670,2738,164,12);
    platforms.push(platform1,platform2,platform3,platform4,platform5, platform6, platform7, platform8, platform9,platform10);

    ledge1 = Platform.newPlatform(100,2588,100,12,'red');
    ledge2 = Platform.newPlatform(100,2488,100,12,'red');
    ledges.push(ledge1, ledge2);

    expPlat1 = Platform.newExplodingPlatform(2000,2938,88,12,'#8b0000');
    expPlat2 = Platform.newExplodingPlatform(2200,2938,88,12,'#8b0000');
    expPlatforms.push(expPlat1,expPlat2);

    vanPlat1 = Platform.newVanishingPlatform(270,2838,88,12,'magenta');
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
    player.missiles = [];
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
      for(var i = 0; i<expPlatforms.length;i++){
        c.ctx.fillStyle = expPlatforms[i].color;
        expPlatforms[i].draw(c.ctx);
      }
      for(var i = 0; i<lavas.length;i++){
        c.ctx.fillStyle = lavas[i].color;
        lavas[i].draw(c.ctx);
      }
      for(var i = 0; i<ladders.length;i++){
        ladders[i].draw(c.ctx);
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
      c.ctx.restore()
    }
  },
}
