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
