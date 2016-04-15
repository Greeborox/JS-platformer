var monster = require('./Monster');

var patroler = monster.newMonster(0,0,30,40);
patroler.update = function(grav){
  this.applyGravity();
  if(this.direction){
    this.x += this.speed;
    if(this.x >= this.range.x2-this.width){
      this.x = this.range.x2-this.width;
      this.direction = 0;
    }
  } else {
    this.x -= this.speed;
    if(this.x <= this.range.x1){
      this.x = this.range.x1;
      this.direction = 1;
    }
  }
}

module.exports = {
  newPatroler: function(platform){
    var newPat = Object.create(patroler);
    newPat.range = {x1:undefined,x2:undefined};
    newPat.direction = (Math.random() > 0.5) ? 0 : 1;
    newPat.x = Math.floor(Math.random() * ((platform.x+platform.width-newPat.width) - platform.x) + platform.x);
    newPat.y = platform.y - newPat.height - 10;
    newPat.range.x1 = platform.x;
    newPat.range.x2 = platform.x+platform.width;
    return newPat;
  },
  log: function(){
    console.log("test");
  }
}
