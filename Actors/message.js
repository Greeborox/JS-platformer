var entity = require('./entity');
var assets = require('../Config/assets');

message = entity.newEntity();
message.active = false;
message.x = 0;
message.y = 0;
message.width = 60;
message.height = 35;
message.image = undefined;
message.visibleFor = 0;
message.lifeSpan = 60;
message.setMsg = function(msgType){
  this.image = msgType;
};
message.reset = function(){
  this.image = undefined;
  this.visibleFor = 0;
  this.active = false;
}
message.update = function(x,y){
  this.x = x;
  this.y = y;
  if(this.visibleFor >= this.lifeSpan){
    this.active = false;
  } else {
    this.visibleFor++
  }
};
message.draw = function(ctx){
  ctx.drawImage(assets.getAsset(this.image),this.x,this.y,this.width,this.height);
};

module.exports = {
  getMessage: function() {
    return message;
  }
}
