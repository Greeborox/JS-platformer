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
    c.ctx.fillText("Welcome to JS Platformer Alpha Build",20,30);
    c.ctx.fillText("Use the WASD keys to move around",20,60);
    c.ctx.fillText("You can look around with the mouse",20,90);
    c.ctx.fillText("Left Click = melee Attack; Right Click = spell",20,120);
    c.ctx.fillText("Toogle the spells with 'e' key",20,150);
    c.ctx.fillText("PRESS SPACE",20,c.height/2+40);
  },
}
