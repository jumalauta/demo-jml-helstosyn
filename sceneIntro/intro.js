Demo.prototype.sceneIntro = function () {
  //this.setScene('abstract');
  this.setScene('intro');
//return;
  /*this.loader.addAnimation({
    "light": {
        "type": "Ambient",
        "properties": { "intensity": 1.0 },
    }
  });
*/
  this.loader.addAnimation({
    "light": {
        "type": "Directional",
        "properties": { "intensity": 10.0 },
        "castShadow": false
    }
    ,position:[{x:-3,y:5,z:3}]
  });

    const addText = (text, options) => {
        this.loader.addAnimation({
        visible:()=>Sync.get(options.syncPrefix + 'vis', 1.0) < 1.0 ? false : true,
        text:{
            string:text,
            name:'font/ShareTechMono-Regular.ttf',
            parameters: {size:30,depth:0.5,bevelEnabled:true,bevelThickness:0.01,bevelSize:0.01,bevelSegments:1}
        },
        perspective:'3d',
        position:{
            x:(options.position?.x||0),
            y:(options.position?.y||0),
            z:(options.position?.z||0)
        },
        color:{
            r: (options?.red ? ()=>{
                const fn = options.red2 ? Math.sin : Math.sin;
                return 0.3 + 0.7*((fn(getSceneTimeFromStart()*(135/60*3.14159*1.0) + (options.red2 ? Math.PI : 0))+1)/2.0);
            } : 1),
            g: (options?.red ? 0 : 1),
            b: (options?.red ? 0 : 1),
            a: 1
        }
        //color:[{r:0,g:0,b:0,a:0},{duration:fadeDuration,a:1},{duration:textDuration},{duration:fadeDuration,a:0}],
        //scale:{x:() => Sync.get('OuterText:sideScaleX',0.45),y:() => Sync.get('OuterText:sideScaleY',0.735)},
        //angle:{
        //  degreesX:() => Sync.get(syncPrefix + `degX`, 1) + (options.angle?.degreesX||0),
        //  degreesY:() => Sync.get(syncPrefix + `degY`, 1) + (options.angle?.degreesY||0),
        //  degreesZ:() => Sync.get(syncPrefix + `degZ`, 1) + (options.angle?.degreesZ||0),
        //},
        });
    };

    const rows = 20;
    const cols = 40;
    const particles = new Array(rows*cols);
    for (let i = 0; i < particles.length; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        particles[i] = {
            x: (col - (cols/2))*22.5,
            y: (row - (rows/2))*30.0,
            z: 0,
            row: row,
            col: col
        };
    }

    this.loader.addAnimation({
        visible:()=>Sync.get('Intro:xWallVis', 1.0) < 1.0 ? false : true,
        text:{
            string:'X',
            name:'font/ShareTechMono-Regular.ttf',
            parameters: {size:30,depth:0.5,bevelEnabled:true,bevelThickness:0.01,bevelSize:0.01,bevelSegments:1}
        },
        perspective:'3d',
        position:{
            x:6,
            y:0,
            z:-1,
        },
        color:{
            r: 1,
            g: 1,
            b: 1,
            a: 1
        },
        instancer: {
        sort: false,
        count: particles.length,
        runInstanceFunction: (properties) => {
  
          const i = properties.index;
          const count = properties.count;
          const time = properties.time;
          let object = properties.object;
          let color = properties.color;
  
          let scale = 0.0;

          const particle = particles[i];

          const bpm = 135.0;
          const beat = time * bpm / 60.0;
          if (beat % 1.0 < 0.5) {
            const pulse = Math.floor(time*4.0);
            Utils.setSeed(Math.floor(i + pulse ^ Math.floor((particle.x - particle.y)*100.0)));
            scale = Utils.random() < 0.25*(Math.min(pulse/50.0, 1.0)) ? 1.0 : 0.0;
          }

          if (particle.row >= 9 && particle.row <= 11 && time > 2.0) {
            scale = 0.0;
          }

          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;
  
          object.position.x = particle.x;
          object.position.y = particle.y;
          object.position.z = particle.z;
          }
        }
    });

    
    addText('He s   fors'.toUpperCase(), {
        position: { x: -0.2, y: 0.75, z: -1 },
        syncPrefix:'Intro:t1_'
    });
    addText('l i'.toUpperCase(), {
        position: { x: -1.325, y: 0.75, z: -1 },
        red: true,
        red2: true,
        syncPrefix:'Intro:t2_'
    });
    addText('ng'.toUpperCase(), {
        position: { x: 0.0835, y: 0.75, z: -1 },
        red: true,
        syncPrefix:'Intro:t3_'
    });
    addText('Stockholm'.toUpperCase(), {
        position: { x: 0.4, y: 0, z: -1 },
        syncPrefix:'Intro:t4_'
    });
    addText('Syndrome'.toUpperCase(), {
        position: { x: 0.65, y: -0.75, z: -1 },
        syncPrefix:'Intro:t5_'
    });

  this.loader.addAnimation({
    object: '_embedded/defaultWhite.png',
    visible:()=>Sync.get('Intro:flowPlaneVis', 1.0) < 1.0 ? false : true,
    shape: {
        type:'PLANE',
        width: 22.0,
        height: 14.8
    },
    // inverted color
    material:{
        transparent:true,
        blending:'CustomBlending',
        blendSrc:'OneMinusDstColorFactor',
        blendDst:'ZeroFactor',
        blendEquation:'AddEquation'
    },
    color:{
        r:1,g:1,b:1,a:1
    },
    position:{
        x:5.65,
        y:-0.37,
        z:-0.9
    },
    shader:{
        name: 'sceneIntro/randomFlow.fs'
    }
    //scale:{y:0.1},
  });

  const addFadePlane = (options) => {
    this.loader.addAnimation({
        object: '_embedded/defaultWhite.png',
        visible:()=>Sync.get('Intro:slidePlaneVis', 1.0) < 1.0 ? false : true,
        shape: {
            type:'PLANE',
            width: 10.0,
            height: 0.75
        },
        position:{
            z:-0.85,
            x:options.x,
            y:(options.row-1) * 0.71
        },
        // inverted color
        material:{
            type:'Basic',
            transparent:true,
            blending:'CustomBlending',
            blendSrc:'OneMinusDstColorFactor',
            blendDst:'ZeroFactor',
            blendEquation:'AddEquation'
        },
        color:{
            r:0,g:0,b:0,a:1
        }
        //scale:{y:0.1},

    });
  };

  addFadePlane({row: 0, x: () => Sync.get('Intro:slidePlane1',getSceneTimeFromStart()/1.0)});
  addFadePlane({row: 1, x: () => Sync.get('Intro:slidePlane2',getSceneTimeFromStart()/1.0-0.5)});
  addFadePlane({row: 2, x: () => Sync.get('Intro:slidePlane3',getSceneTimeFromStart()/1.0-1.0)});
};
