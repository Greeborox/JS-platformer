var c = require('../Config/canvas');
var keys = require('../Config/keys');
var m = require('../Config/mouse');
var config = require('../Config/config');
var helpers = require('../Config/helpers');
var Screen = require('../Config/screen');
var Platform = require('../Actors/platform');
var Ladder = require('../Actors/ladder');
var Shrine = require('../Actors/spellShrine');
var Player = require('../Actors/player');
var Explosion = require('../Actors/Attacks/explosion');
var Patroler = require('../Actors/Monsters/patroler');
var Particle = require('../Actors/particles');
var levelList = require('../Config/levels');
var Message = require('../Actors/message');

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
var monsters = [];
var ladders = [];
var shrines = [];
var particles = [];
var smokeParts = [];
var explosions = [];
var player = undefined;
var message = undefined;
var currLevel = undefined;
var exit = undefined;

function resetGame(){
  clearInterval(gameLoop);
  platforms = [];
  movPlatforms = [];
  ledges = [];
  vanPlatforms = [];
  expPlatforms = [];
  lavas = [];
  monsters = [];
  ladders = [];
  shrines = [];
  particles = [];
  player.missiles = [];
  player.mana = player.maxMana;
  explosions = [];
  player = undefined;
  message = undefined;
  currLevel = undefined;
  exit = undefined;
  Screen.resetScreen();
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
      config.setLevel(1);
      changeState = true;
      nextState = "menuState";
    } else {
      player.deadFor++
    }
  } else {
    if(!player.leavingMap){
      player.update(config.getGravity());
    }
  }

  if(message.active){
    message.update(player.x+player.width,player.y-30);
  }

  if(player && player.leavingMap){
    if(player.x < world.width){
      player.x++;
      player.y+=5;
    } else {
      player.leavingMap = false;
      config.addLevel();
      resetGame();
      changeState = true;
      nextState = "announceState";
    }
  }

  if(helpers.checkCollision(player,exit)){
    player.leavingMap = true;
  }
  if(player && !player.leavingMap){
    player.x = Math.max(0, Math.min(player.x, world.width - player.width));
    player.y = Math.max(0, Math.min(player.y, world.height - player.height));
  }

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

  for(var i = 0; i<monsters.length;i++){
    monsters[i].update();
    if(monsters[i].remove){
      monsters.splice(i,1);
    }
    if(helpers.checkCollision(player,monsters[i])){
      if(!monsters[i].dead){
        killPlayer();
      }
    }
    if(player.stab.active && helpers.checkCollision(player.stab,monsters[i])){
      monsters[i].hp -= 5;
      if(monsters[i].stagger < 15) {
        monsters[i].stagger = 15;
      }
    }
  }

  for(var i = 0; i<platforms.length;i++){
    helpers.blockRect(player,platforms[i]);
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],platforms[i])){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
      }
    }
    for(var k = 0; k<monsters.length;k++){
      if(helpers.checkCollision(monsters[k],platforms[i]) && monsters[k].range.x1 != platforms[i].x){
        monsters[k].range.x1 = platforms[i].x;
        monsters[k].range.x2 = platforms[i].x+platforms[i].width;
      }
      helpers.blockRect(monsters[k],platforms[i]);
    }
  }
  for(var i = 0; i<ledges.length;i++){
    helpers.blockLedge(player,ledges[i]);
    for(var j = 0; j<player.missiles.length;j++){
      if(helpers.checkCollision(player.missiles[j],ledges[i])){
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
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
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
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
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        };
      }
    }
  }


  for(var i = 0; i<player.missiles.length;i++){
    var arrow = player.missiles[i]
    if(arrow.type === 'gustOfWind' && arrow.inactive){
      player.missiles.splice(i,1);
    }
    for(var j = 0; j<monsters.length;j++){
      if(helpers.checkCollision(arrow,monsters[j])){
        if(arrow.type === 'magicMissile'){
          player.missiles.splice(i,1);
          monsters[j].hp -= arrow.power;
          if(monsters[j].stagger < 10) {
            monsters[j].stagger = 10;
          }
        } else if(arrow.type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(arrow.centerX(),arrow.centerY()));
          player.missiles.splice(i,1);
        } else {
          helpers.blockRect(monsters[j],arrow)
        }
      }
    }
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
  for(var i = 0; i<shrines.length;i++){
    if(helpers.checkCollision(player,shrines[i])){
      if(!player.touchingShrine && player.attacks.indexOf(shrines[i].spell) === -1){
        message.reset();
        message.setMsg('senseSpellMsg');
        message.active = true;
      }
      player.touchingShrine = true;
      if(player.kneelingFor >= 90){
        if(player.attacks.indexOf(shrines[i].spell) === -1){
          player.addAttack(shrines[i].spell);
          message.reset();
          message.setMsg('newSpellMsg');
          message.active = true;
        }
      }
    } else {
      player.touchingShrine = false;
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
        if(player.missiles[j].type === 'fireBomb'){
          explosions.push(Explosion.newExplosion(player.missiles[j].centerX(),player.missiles[j].centerY()));
          player.missiles.splice(j,1);
        } else {
          particles.push(Particle.makeParticles(player.missiles[j].x,player.missiles[j].y));
          player.missiles.splice(j,1);
        }
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
    for(var k = 0; k<monsters.length;k++){
      if(helpers.checkCollision(monsters[k],lavas[i])){
        monsters.splice(k,1);
      }
    }
  }
  for(var i = 0; i<explosions.length;i++){
    explosions[i].update();
    if(helpers.checkCollision(explosions[i],player)){
      killPlayer();
    }
    for(var j = 0; j<monsters.length;j++){
      if(helpers.checkCollision(explosions[i],monsters[j])){
        monsters[j].dead = true;
      }
    }
    if(explosions[i].remove){
      explosions.splice(i,1);
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
    message = undefined;
    currLevel = levelList.getLevelData(config.getLevel());

    world = {
      x: 0,
      y: 0,
      width: currLevel.world.width,
      height: currLevel.world.height,
    };

    for (var i = 0; i < currLevel.platforms.length; i++) {
      currPlat = currLevel.platforms[i];
      platforms.push(Platform.newPlatform(currPlat.x,currPlat.y,currPlat.width,currPlat.height));
    }

    for (var i = 0; i < currLevel.ledges.length; i++) {
      currLedge = currLevel.ledges[i];
      ledges.push(Platform.newPlatform(currLedge.x,currLedge.y,currLedge.width,currLedge.height,currLedge.color));
    }

    for (var i = 0; i < currLevel.expPlatforms.length; i++) {
      currExp = currLevel.expPlatforms[i];
      expPlatforms.push(Platform.newExplodingPlatform(currExp.x,currExp.y,currExp.width,currExp.height,currExp.color));
    }

    for (var i = 0; i < currLevel.vanPlatforms.length; i++) {
      currVan = currLevel.vanPlatforms[i];
      vanPlatforms.push(Platform.newVanishingPlatform(currVan.x,currVan.y,currVan.width,currVan.height,currVan.color));
    }

    for (var i = 0; i < currLevel.movPlatforms.length; i++) {
      currMov = currLevel.movPlatforms[i];
      movPlatforms.push(Platform.newMovingPlatform(currMov.x,currMov.y,currMov.width,currMov.height,currMov.color,currMov.minY,currMov.maxY,currMov.speed));
    }

    for (var i = 0; i < currLevel.lavas.length; i++) {
      currLav = currLevel.lavas[i];
      lavas.push(Platform.newPlatform(currLav.x,currLav.y,currLav.width,currLav.height,currLav.color));
    }

    for (var i = 0; i < currLevel.monstersPatrolers.length; i++) {
      currPat = currLevel.monstersPatrolers[i];
      monsters.push(Patroler.newPatroler(platforms[currPat.platformIndex]));
    }

    for (var i = 0; i < currLevel.ladders.length; i++) {
      currLad = currLevel.ladders[i];
      ladders.push(Ladder.newLadder(currLad.x,currLad.y,currLad.height));
    }
    for (var i = 0; i < currLevel.spellShrines.length; i++) {
      currShrine = currLevel.spellShrines[i];
      shrines.push(Shrine.newShrine(currShrine.x,currShrine.y,currShrine.spell));
    }
    exit = {};
    exit.x = currLevel.levelExit.x;
    exit.y = currLevel.levelExit.y;
    exit.width = currLevel.levelExit.width;
    exit.height = currLevel.levelExit.height;
    exit.color = currLevel.levelExit.color;

    player = Player.getPlayer();
    player.x = currLevel.player.x;
    player.y = currLevel.player.y;
    if(config.getLevel()===1){
      player.resetAttacks();
    }
    player.missiles = [];

    message = Message.getMessage();

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
      // exit draw for test
      c.ctx.fillStyle = exit.color;
      c.ctx.fillRect(exit.x,exit.y,exit.width,exit.height);
      // end exit draw
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
      for(var i = 0; i<monsters.length;i++){
        monsters[i].draw(c.ctx);
      }
      for(var i = 0; i<ladders.length;i++){
        ladders[i].draw(c.ctx);
      }
      for(var i = 0; i<shrines.length;i++){
        shrines[i].draw(c.ctx);
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
      for(var i = 0; i < explosions.length; i++){
        explosions[i].draw(c.ctx);
      }
      if(message.active){
        message.draw(c.ctx)
      }
      c.ctx.restore()
      c.ctx.font="14px Arial";
      if(player.attacks.length > 0) {
        c.ctx.fillText("Current spell: "+player.attacks[player.currAttack],3,15);
      } else {
        c.ctx.fillText("No Spells",3,15);
      }
      c.ctx.fillText("Mana: "+player.mana+"/"+player.maxMana,3,30);
    }
  },
}
