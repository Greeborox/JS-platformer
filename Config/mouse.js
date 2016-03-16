c = require('./canvas');
helpers = require('./helpers');

mouseClicked = false;
rMouseClicked = false;
mouseCoords = {x:undefined,y:undefined};
clickedCoords = {x:undefined,y:undefined};

module.exports = {
  isClicked: function() {
    return mouseClicked;
  },
  isRclicked: function() {
    return rMouseClicked;
  },
  getCoords: function(){
    return mouseCoords;
  },
  getClickedCoords: function(){
    return clickedCoords;
  },
  init: function() {
    c.canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    }, false);
    c.canvas.addEventListener('mousedown', function(e){
      if(e.button === 0) {
        rMouseClicked = true;
      }
      if(e.button === 2) {
        mouseClicked = true;
      }
      var clickx = e.pageX;
      var clicky = e.pageY;
      clickx -= c.canvas.offsetLeft;
      clicky -= c.canvas.offsetTop;
      clickedCoords = {x:clickx,y:clicky};
    },false);
    c.canvas.addEventListener('mouseup', function(e){
      mouseClicked = false;
      rMouseClicked = false;
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
