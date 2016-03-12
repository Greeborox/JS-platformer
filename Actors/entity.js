entity = {
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 48,
  sourceHeight: 64,
  x: 0,
  y: 0,
  width: 48,
  height: 64,
  centerY: function() {
    return this.y + this.height/2
  },
  centerX: function() {
    return this.x + this.width/2
  },
  draw: function(ctx) {
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

module.exports = {
  newEntity: function(){
    var newEnt = Object.create(entity);
    return newEnt;
  }
}
