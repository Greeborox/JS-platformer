var screen = {
  x: 0,
  y: 0,
  width: c.width,
  height: c.height
}

module.exports = {
  getScreen: function(){
    return screen;
  },
  setScreen: function(x,y){
    screen.x = x;
    screen.y = y;
  }
}
