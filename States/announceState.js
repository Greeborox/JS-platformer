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
