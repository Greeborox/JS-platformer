c = require('./canvas');

mouseClicked = false;
mouseCoords = {x:undefined,y:undefined};
clickedCoords = {x:undefined,y:undefined};

module.exports = {
  isClicked: function() {
    return mouseClicked;
  },
  getCoords: function(){
    return mouseCoords;
  },
  getClickedCoords: function(){
    return clickedCoords;
  },
  init: function() {
    c.canvas.addEventListener('mousedown', function(e){
      mouseClicked = true;
      var clickx = e.pageX;
      var clicky = e.pageY;
      clickx -= c.canvas.offsetLeft;
      clicky -= c.canvas.offsetTop;
      clickedCoords = {x:clickx,y:clicky};
      console.log(clickedCoords.x,clickedCoords.y);
    },false);
    c.canvas.addEventListener('mouseup', function(e){
      mouseClicked = false;
    },false);
    c.canvas.addEventListener('mousemove', function(e){
      var movex = e.pageX;
      var movey = e.pageY;
      movex -= c.canvas.offsetLeft;
      movey -= c.canvas.offsetTop;
      mouseCoords = {x:movex,y:movey};
    },false);
  }
}
