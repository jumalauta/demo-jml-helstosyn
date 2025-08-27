Demo.prototype.addTrailerText = function (textData) {
  let font = "multiSceneEffects/trailertext1.ttf";
  if(textData.monoSpace == true)
    font = "multiSceneEffects/monoSpace.ttf";
  let alpha = 1.0;
  if(textData.alpha != undefined)
    alpha = textData.alpha;
  let r = 1;
  let g = 1;
  let b = 1;
  if(textData.gray == true)
  {
    r = .7;
    g = .7;
    b = .7;
  }
  if(textData.blinkable == true)
  {
    r = textData.blinkCol;
    g = textData.blinkCol;
    b = textData.blinkCol;
  }
  this.loader.addAnimation([{
      text:{string:textData.text,name:font},
      perspective:"2d", 
      visible: textData.visible != undefined ? textData.visible : true,
      color:[{"r":0.0,"g":0.0,"b":0.0,"a":alpha}],
      position:[{x:textData.x-.0025, y:textData.y-.0025}],
      scale: [{ uniform3d: textData.scale }],
      material:{
      depthWrite:true}
    }]);    
  this.loader.addAnimation([{
      text:{string:textData.text,name:font},
      perspective:"2d", 
      visible: textData.visible != undefined ? textData.visible : true,
      color:[{"r":r,"g":g,"b":b,"a":alpha}],
      position:[{x:textData.x, y:textData.y}],
      scale: [{ uniform3d: textData.scale }],
      material:{
      depthWrite:true},
    runFunction:(animation)=>
    {
    if(textData.cycle == true) {
      const interval = 0.1;
      if (animation.nextTime == undefined) {
        animation.nextTime = getSceneTimeFromStart() + interval;
      }
      if(Math.abs(getSceneTimeFromStart()-animation.nextTime) > interval)
      {
        animation.color[0].r = Math.abs(Math.random());
        animation.color[0].g = Math.abs(Math.random());
        animation.color[0].b = Math.abs(Math.random());
        animation.nextTime = getSceneTimeFromStart()  + interval;
      }
    } }
    }]);    
};
