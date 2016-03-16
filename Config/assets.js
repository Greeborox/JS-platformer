var assets = [];
var assetsNum = 0;

module.exports = {
  getAssetsNum : function(){
    return assetsNum;
  },
  getAssetsLength : function(){
    return assets.length;
  },
  addAsset : function(){
    assetsNum++;
  },
  newAsset : function(name,asset){
    assets.push({'name':name,'asset':asset});
  },
  getAsset : function(name) {
    for (var i = 0; i < assets.length; i++) {
      if(assets[i].name === name){
        assetObj = assets[i];
        return assetObj['asset'];
      }
    }
  }
}
