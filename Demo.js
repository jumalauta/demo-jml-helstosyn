const deg2rad = 0.01745329251;
window.camPos = [0.0,0.0,0.0];
window.camPosLength = 1.0;
window.camFov = 0.0;
window.beat = 60/126;
window.tick = window.beat/8;
window.pattern = window.beat*8;
window.camNear = 0.0;
window.camFar = 0.0;
window.globalTime = 0.0;

includeFile('multiSceneEffects/PostProcess.js');
includeFile('multiSceneEffects/dof.js');
//includeFile('multiSceneEffects/EffectExplosion.js');
//includeFile('multiSceneEffects/particleStream.js');
//includeFile('multiSceneEffects/EffectStarfield.js');
//includeFile('multiSceneEffects/trailerText.js');

//includeFile('sceneIntro/intro.js');
//includeFile('sceneZeus/zeus.js');
//includeFile('sceneAgod/agod.js');
//includeFile('sceneOuroboros/ouroboros.js');
//includeFile('sceneCatBattle/catBattle.js');
//includeFile('sceneLargeBattle/largeBattle.js');
//includeFile('sceneMap/map.js');
//includeFile('sceneCar/car.js');
//includeFile('sceneChoice/choice.js');
//includeFile('sceneBossFight/bossfight.js');
//includeFile('sceneSuvanto/suvanto.js');
//includeFile('sceneDestruction/destruction.js');
//includeFile('sceneOutro/outro.js');

includeFile('sceneIntro/intro.js');
includeFile('sceneAbstract/abstract.js');
includeFile('sceneAbstract/background.js');
includeFile('sceneAbstract/tunnel.js');


Demo.prototype.cameraSetup = function (stopCamAt) {
  this.loader.addAnimation({
      "camera": "cam1"
      ,"position":[{"x":0,"y":0,"z":10}]
      ,"lookAt":[{"x":0.0,"y":0.0,"z":0.0}]
      ,"up":[{"x":0,"y":1,"z":0}]
      ,"perspective":[{"fov":75,"aspect":16/9,"near":.05,"far":1000}]
      ,"distYawPitch":[-5.0,1,2.0]
      ,"instableTimer":[0.0,0.0,0.0,0.0,0.0]
      ,"runPreFunction": (animation)=>{
          for(let i=0;i<animation.instableTimer.length;i++)
              {
                  animation.instableTimer[i]+=Math.random()*getDeltaTime();
              }
          let distance = .05*Sync.get('Cam:Instability')*Math.sin(2*animation.instableTimer[3])+Sync.get('Cam:Distance');
          let pitch = (Sync.get('Cam:Instability')*5*Math.cos(2*animation.instableTimer[1])+Sync.get('Cam:Yaw'))*deg2rad;
          let roll = (Sync.get('Cam:Instability')*5*Math.sin(2*animation.instableTimer[2])+Sync.get('Cam:Pitch'))*deg2rad;
          let yaw = 0.0;
          let target = [Sync.get('Cam:TargetX'),Sync.get('Cam:TargetY'),Sync.get('Cam:TargetZ')];
          let points = [0,0,distance];
          let cosa = Math.cos(yaw),
              sina = Math.sin(yaw);
          let cosb = Math.cos(pitch),
              sinb = Math.sin(pitch);
          let cosc = Math.cos(roll),
              sinc = Math.sin(roll);
          let Axx = cosa*cosb,
              Axy = cosa*sinb*sinc - sina*cosc,
              Axz = cosa*sinb*cosc + sina*sinc;
          let Ayx = sina*cosb,
              Ayy = sina*sinb*sinc + cosa*cosc,
              Ayz = sina*sinb*cosc - cosa*sinc;
          let Azx = -sinb,
              Azy = cosb*sinc,
              Azz = cosb*cosc;
          let px = points[0];
          let py = points[1];
          let pz = points[2];
          let newPoints = [
              (Axx*px + Axy*py + Axz*pz) + target[0],
              Ayx*px + Ayy*py + Ayz*pz + target[1],
              Azx*px + Azy*py + Azz*pz + target[2]
              ];
          window.camPos = newPoints;
          window.camPosLength = Math.sqrt(newPoints[0]*newPoints[0]+newPoints[1]*newPoints[1]+newPoints[2]*newPoints[2]);
          animation.position[0].x = newPoints[0];
          animation.position[0].y = newPoints[1];
          animation.position[0].z = newPoints[2];
          animation.lookAt[0].x = Sync.get('Cam:Instability')*.25*Math.sin(2*animation.instableTimer[3])+Sync.get('Cam:TargetX');
          animation.lookAt[0].y = Sync.get('Cam:Instability')*.25*Math.cos(2*animation.instableTimer[4])+Sync.get('Cam:TargetY');
          animation.lookAt[0].z = Sync.get('Cam:TargetZ');
          animation.perspective[0].fov = Sync.get('Cam:FOV');
          window.camNear = animation.perspective[0].near;
          window.camFar = animation.perspective[0].far;
          window.camFov = animation.perspective[0].fov*deg2rad;

        }
  });       

  /*this.loader.addAnimation({
      "light": {
          "type": "Directional",
          "properties": { "intensity": 1.0 },
          "castShadow": false,
          "shadowProperties": {
            "bias": ()=>Sync.get('Cam:ShadowBias'),
            "radius": ()=>Sync.get('Cam:ShadowRadius'),
            "normalBias": ()=>Sync.get('Cam:ShadowNormalBias')
          } 
      }
      ,position:[{x:()=>window.camPos[0],y:()=>window.camPos[1],z:()=>window.camPos[2]+2.0}]
      
      ,"color": [{
          "r": ()=>Sync.get('Light:R'), "g": ()=>Sync.get('Light:G'), "b": ()=>Sync.get('Light:B')
      }]
  });   */

};

Demo.prototype.setScene = function (sceneName) {
    this.loader.setScene(sceneName);
    this.cameraSetup();
};

const settings = new Settings();


settings.engine.preload = true;
settings.demo.renderer.sortObjects = false;
settings.demo.renderer.logarithmicDepthBuffer = false;
settings.demo.sync.rocketFile = 'sync/demo.rocket';
settings.demo.sync.beatsPerMinute = 135;
settings.demo.sync.rowsPerBeat = 8;
settings.demo.camera.near = 0.1;
settings.demo.camera.far = 1000.0;
//settings.demo.clearColor = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
settings.demo.model.shape.material.type = 'Standard';
settings.demo.shadow.mapSize.width = 2048;
settings.demo.shadow.mapSize.height = settings.demo.shadow.mapSize.width;
settings.demo.image.texture.minFilter = 'NearestFilter';
settings.demo.image.texture.magFilter = 'NearestFilter';
//settings.demo.image.texture.wrapS = 'RepeatWrapping';
//settings.demo.image.texture.wrapT = 'RepeatWrapping';
settings.demo.fbo.color.texture.minFilter = 'NearestFilter';
settings.demo.fbo.color.texture.magFilter = 'NearestFilter';
//settings.demo.fbo.color.texture.wrapS = 'RepeatWrapping';
//settings.demo.fbo.color.texture.wrapT = 'RepeatWrapping';

Demo.prototype.init = function () {
  const start = 0;
  const duration = 380;
  const bpm = 135;
  const beat = 60/bpm;
  const pattern = beat*8;

  //this.loader.addAnimation({image:'_embedded/defaultWhite.png'});
  //return;
  this.sceneAbstract();
  this.sceneIntro();
  this.sceneOverlay();

  //this.addSongTitle();
  //this.addSmileys();

  /*this.loader.addAnimation({
    image: '_embedded/defaultTransparent.png',
    shader:{name:'vignette.fs'}
  });*/

  //return;

  /*this.sceneIntro();
  this.sceneAgod();
  this.sceneZeus();
  this.sceneCatBattle();
  this.sceneMap();
  this.sceneCar();
  this.sceneChoice();
  this.sceneBossFight();
  this.sceneSuvanto();
  this.sceneDestruction();
  this.sceneOuroboros();
  this.sceneLargeBattle();
  this.sceneOutro();*/

  this.loader.setScene('main');

  const scenes = [ 
    {start: 4*window.pattern, duration: 51*window.pattern, name: 'abstract', dof:false, polaroid:false},
    {start: 0*window.pattern, duration: 5*window.pattern, name: 'intro', dof:false, polaroid:false},
    {start: 52.0*window.pattern, duration: 4*window.pattern, name: 'intro', dof:false, polaroid:false},
    {start: 4*window.pattern, duration: 51*window.pattern, name: 'overlay', dof:false, polaroid:false},
    //{start: 0*window.pattern, duration: 9.25*window.pattern, name: 'intro', dof:true, polaroid:false},
    //{start: 9.25*window.pattern, duration: 4*window.pattern, name: 'angered', dof:true, polaroid:false},
    //{start: 13.25*window.pattern, duration: 2*window.pattern, name: 'agod', dof:true, polaroid:false},
    //{start: 15.25*window.pattern, duration: 2*window.pattern, name: 'zeus', dof:true, polaroid:false},
    //{start: 17.25*window.pattern, duration: 2*window.pattern, name: 'ouroboros', dof:true, polaroid:false},
    //{start: 19.25*window.pattern, duration: 1*window.pattern, name: 'catBattle', dof:true, polaroid:false},
    //{start: 20.25*window.pattern, duration: 1*window.pattern, name: 'map', dof:true, polaroid:false}, 
    //{start: 21.25*window.pattern, duration: 1*window.pattern, name: 'car', dof:true, polaroid:false},
    //{start: 22.25*window.pattern, duration: 1*window.pattern, name: 'choice', dof:true, polaroid:false},
    //{start: 23.25*window.pattern, duration: 1*window.pattern, name: 'bossFight', dof:true, polaroid:false},
    //{start: 24.25*window.pattern, duration: 1*window.pattern, name: 'largeBattle', dof:true, polaroid:false},
    //{start: 25.25*window.pattern, duration: 2*window.pattern, name: 'suvanto', dof:true, polaroid:false},
    //{start: 27.25*window.pattern, duration: 4*window.pattern, name: 'destruction', dof:true, polaroid:false},
    //{start: 31.25*window.pattern+window.beat, duration: 16, name: 'outro', dof:false, polaroid:false},

    /*Cat & ak scene:
Non-stop action

Map scene:
Make strategical choices

Car chase:
1000% adrenalin

Choice scene (Kill people / save people):
Meaningful choices

All seeing eye + army:
Epic battles*/

  ];

  scenes.forEach((scene) => {
    this.loader.addAnimation({start: scene.start, duration: scene.duration, scene:{name:scene.name, fbo:{name:scene.name + 'Fbo'}}, ...(scene.parameters||{})});
  });

    scenes.forEach((scene) => {
        if (!scene.polaroid || !scene.prePostProcessing) {
            this.loader.addAnimation({start: scene.start, duration: scene.duration, color:scene.color, image: scene.name + 'Fbo.color.fbo'});
        }
    });

  this.loader.addAnimation({fbo:{name:'screenDof',action:'begin',storeDepth:false}});
    scenes.forEach((scene) => {
        if (scene.dof) {
            this.loader.addAnimation({start: scene.start, duration: scene.duration, color:scene.color, image: [scene.name + 'Fbo.depth.fbo',scene.name + 'Fbo.color.fbo'],
            material:{blending:'CustomBlending', blendEquation:'MaxEquation', blendSrc:'SrcColorFactor', blendDst:'SrcColorFactor'},
            shader: {name: 'multiSceneEffects/depthToColor.fs'}
            });
        }
    });



  this.loader.addAnimation({fbo:{name:'screenDof',action:'unbind'}});

  this.loader.addAnimation({fbo:{name:'screenFbo',action:'begin',storeDepth:false}});
    scenes.forEach((scene) => {
        if (!scene.polaroid || !scene.prePostProcessing) {
            this.loader.addAnimation({start: scene.start, duration: scene.duration, color:scene.color, image: scene.name + 'Fbo.color.fbo'});
        }
    });
  this.loader.addAnimation({fbo:{name:'screenFbo',action:'unbind'}});
  
  this.loader.addAnimation({fbo:{name:'blur',action:'begin',storeDepth:false}});
    this.loader.addAnimation({image: 'screenFbo.color.fbo',
        shader: { name: 'multiSceneEffects/gaussianBlur.fs',
            variable: [
            {"name":"directions", "value":[32.0]},
            {"name":"quality", "value":[2.0]}, // 4
            {"name":"size", "value":[1.0]} // 16
            ]}
    });
  this.loader.addAnimation({fbo:{name:'blur',action:'unbind'}});

  this.loader.addAnimation({fbo:{name:'postProcessableFbo',action:'begin',storeDepth:false}});
    this.loader.addAnimation({
        image: ['screenFbo.color.fbo', 'blur.color.fbo', 'screenDof.color.fbo'],
        shader: { name: 'multiSceneEffects/dof.fs',
            variable: [
                {"name":"dofCenter", "value":[()=>Sync.get('General:dofCenter')]},
                {"name":"dofWidth", "value":[()=>Sync.get('General:dofWidth')]}
                ]}
    });

  this.loader.addAnimation({fbo:{name:'postProcessableFbo',action:'unbind'}});

  this.addPostProcess('postProcessableFbo.color.fbo');

  this.loader.addAnimation({
    image: '_embedded/defaultTransparent.png',
    shader:{name:'vignette.fs'}
  });
};
