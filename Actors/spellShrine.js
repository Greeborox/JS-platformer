var entity = require('./entity');

shrine = entity.newEntity();
shrine.width = 48;
shrine.height = 108;
shrine.type = 'shrine';
shrine.color = '#A3159A';

module.exports = {
  newShrine: function(x,y,spell){
    var newShr = Object.create(shrine);
    newShr.x = x;
    newShr.y = y;
    newShr.spell = spell;
    return newShr;
  },
}
