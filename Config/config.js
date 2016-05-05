fps = 60;
gravity = 5;
currLevel = 1;

module.exports = {
  getFPS: function(){
    return fps;
  },
  getGravity: function(){
    return gravity;
  },
  getLevel: function(){
    return currLevel;
  },
  setLevel: function(lvl){
    currLevel = lvl;
  },
  addLevel: function(){
    currLevel++;
  }
}
