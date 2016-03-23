var entity = require('./entity');
var c = require('../Config/canvas');
var assets = require('../Config/assets');

ladder = entity.newEntity();
ladder.width = 30;
ladder.draw = function(ctx) {
  segments = this.height/12;
  for (var i = 0; i < segments; i++) {
    ctx.drawImage(assets.getAsset('ladder'),this.x,this.y+(12*i),this.width,12);
  }
}

module.exports = {
  newLadder: function(x,y,height){
    var newLad = Object.create(ladder);
    newLad.x = x;
    newLad.y = y;
    newLad.height = height;
    return newLad;
  },
}
