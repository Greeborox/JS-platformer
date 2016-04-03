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
