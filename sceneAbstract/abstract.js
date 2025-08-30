
function calcBeatValue() {
  const bpm = 135.0;
  const beat = getSceneTimeFromStart() * bpm / 60.0;
  window.demoBeatValue2 = Math.floor(beat);

  if (beat % 1.0 < 0.5) {
    const flooredBeat = Math.floor(beat*2.0);
    window.demoEvenBeatValue = Math.floor(beat/4.0);
    return flooredBeat;
  } else {
    window.demoEvenBeatValue = Math.floor(beat/4.0);
  }

  return beat*2.0;
};

function getEvenBeatValue() {
  return window.demoEvenBeatValue || 0;
}

function getBeatValue() {
  return window.demoBeatValue;
}

function getBeatValue2() {
  return window.demoBeatValue2 || 0;
}


Demo.prototype.addUnderlay = function () {
  this.loader.addAnimation({
    duration:182.5,
    image: 'esso_gettysburg_1.png',
    color:[{r:1,g:1,b:1,a:0},{duration:25, a:()=>Sync.get('Background:skyColor')/2.0}],
    position:{x:0, y:()=>Math.sin(0.345+getSceneTimeFromStart()*0.05)*0.25},
    additive:true,
    scale:{uniform2d:1.5}
  });
  this.loader.addAnimation({
    duration:182.5,
    image: 'esso_gettysburg_2.png',
    color:[{r:1,g:1,b:1,a:0},{duration:25, a:()=>Sync.get('Background:skyColor')/2.0}],
    position:{x:()=>Math.sin(getSceneTimeFromStart()*0.05)*0.25,y:0},
    additive:true,
    scale:{uniform2d:1.5}
  });
};

Demo.prototype.addEffectParticleShape = function ()
{
  const amountOfParticles = 200;
  const texture = 'multiSceneEffects/tex_darkParticle.png';
  const particleSize = 3.0;
  const x = 0;
  const y = 0;
  let z = 0;
  const speed = 1.0;
  const directionFlip = 0.0;
  const highlight = false;

  const radius = 5;

  const recalcThreshold = 0.1;

  let particles = new Array(amountOfParticles);
  for (let i = 0; i < particles.length; i++) {

    /*const color = [
      {r:1.0,g:0.0,b:0.0},
      {r:0.0,g:1.0,b:0.0},
      {r:0.0,g:0.0,b:1.0},
    ][Math.floor(Utils.random()*3)];
    const direction = [
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
    ];
    particles[i] = {
      x: direction[0],
      y: direction[1],
      z: direction[2],
      color: {
        r: color.r,
        g: color.g,
        b: color.b,
        a: 1.0//Utils.random()
      }
    };*/

    // Cube shape

    const direction = [
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
    ];
    const dir = Utils.getRandomArrayIndex(direction);
    direction[dir] = radius/2 * (Utils.random() < 0.5 ? -1 : 1);
    //direction[(dir+1)%3] = radius/2 * (Utils.random() < 0.5 ? -1 : 1);
    particles[i] = {
      x: direction[0],
      y: direction[1],
      z: direction[2],
      color: {
        r: dir===0?1:0,
        g: dir===1?1:0,
        b: dir===2?1:0,
        a: 1.0//Utils.random()
      }
    };

    // Sphere shape
    /*const theta = Utils.random() * Math.PI * 2;
    const phi = Utils.random() * Math.PI;
    const r = radius;// * Math.cbrt(Utils.random());

    particles[i] = {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      color: {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      }
    };*/

    // Disc shape

    /*const outerRadius = radius;
    const innerRadius = radius * 0.5;

    const angle = (Utils.random()) * Math.PI * 2;
    const deltaRadius = Utils.random() * (outerRadius - innerRadius) + innerRadius
    particles[i] = {
      x: Math.cos(angle) * deltaRadius,
      y: Math.sin(angle) * deltaRadius,
      z: 0,
      color: {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      }
    };*/

  }

  //z = -50;
  this.loader.addAnimation({
    "image": texture,
    //textureProperties: [{},{minFilter: 'NearestMipmapNearestFilter', magFilter: 'LinearFilter'}],
    //"parent":parentId,
    visible: () => Sync.get('Particle:vis', 0) < 1 ? false : true,
    "position":[{
      "x":x,
      "y":y,
      "z":z,
    }],
    "angle":[{"degreesY":180,degreesZ:()=>getSceneTimeFromStart()*500.0}],
    "perspective": "3d",
    "billboard": true,
    "additive": true,
    "material":{
      "blending": 'SubtractiveBlending',
      "transparent":true,
      "depthWrite":false,
    },
    "scale":[{"uniform3d":1}],
    "instancer": {
      "sort": false,
      "count": particles.length,
      "runInstanceFunction": (properties) => {

        const i = properties.index;
        const count = properties.count;
        const time = properties.time;
        let object = properties.object;
        let color = properties.color;

        let scale = particleSize;

        const particle = particles[i];

        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;

        object.position.x = particle.x;
        object.position.y = particle.y;
        object.position.z = particle.z;


        color.r = particle.color.r;
        color.g = particle.color.g;
        color.b = particle.color.b;
        color.a = particle.color.a;

        }
      }
    
  });
};

Demo.prototype.addEffectColorParticleShape = function ()
{
  const amountOfParticles = 40;
  const texture = 'multiSceneEffects/tex_darkParticle.png';
  const particleSize = 3.0;
  const x = 0;
  const y = 0;
  let z = 0;
  const speed = 1.0;
  const directionFlip = 0.0;
  const highlight = false;

  const radius = 5;

  const recalcThreshold = 0.1;

  let particles = new Array(amountOfParticles);
  for (let i = 0; i < particles.length; i++) {

    /*const color = [
      {r:1.0,g:0.0,b:0.0},
      {r:0.0,g:1.0,b:0.0},
      {r:0.0,g:0.0,b:1.0},
    ][Math.floor(Utils.random()*3)];
    const direction = [
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
    ];
    particles[i] = {
      x: direction[0],
      y: direction[1],
      z: direction[2],
      color: {
        r: color.r,
        g: color.g,
        b: color.b,
        a: 1.0//Utils.random()
      }
    };*/

    // Cube shape

    const direction = [
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
    ];
    const dir = Utils.getRandomArrayIndex(direction);
    direction[dir] = radius/2 * (Utils.random() < 0.5 ? -1 : 1);
    //direction[(dir+1)%3] = radius/2 * (Utils.random() < 0.5 ? -1 : 1);
    particles[i] = {
      x: direction[0],
      y: direction[1],
      z: direction[2],
      color: {
        r: dir===0?1:0,
        g: dir===1?1:0,
        b: dir===2?1:0,
        a: 1.0//Utils.random()
      }
    };

    // Sphere shape
    /*const theta = Utils.random() * Math.PI * 2;
    const phi = Utils.random() * Math.PI;
    const r = radius;// * Math.cbrt(Utils.random());

    particles[i] = {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      color: {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      }
    };*/

    // Disc shape

    /*const outerRadius = radius;
    const innerRadius = radius * 0.5;

    const angle = (Utils.random()) * Math.PI * 2;
    const deltaRadius = Utils.random() * (outerRadius - innerRadius) + innerRadius
    particles[i] = {
      x: Math.cos(angle) * deltaRadius,
      y: Math.sin(angle) * deltaRadius,
      z: 0,
      color: {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      }
    };*/

  }

  //z = -50;
  this.loader.addAnimation({
    "image": texture,
    //textureProperties: [{},{minFilter: 'NearestMipmapNearestFilter', magFilter: 'LinearFilter'}],
    //"parent":parentId,
    visible: () => Sync.get('Particle:vis', 0) < 1 ? false : true,
    "position":[{
      "x":x,
      "y":y,
      "z":z,
    }],
    "angle":[{"degreesY":180,degreesZ:()=>getSceneTimeFromStart()*500.0}],
    "perspective": "3d",
    "billboard": true,
    "additive": true,
    "material":{
      "blending": 'SubtractiveBlending',
      "transparent":true,
      "depthWrite":false,
    },
    "scale":[{"uniform3d":1}],
    "instancer": {
      "sort": false,
      "count": particles.length,
      "runInstanceFunction": (properties) => {

        const i = properties.index;
        const count = properties.count;
        const time = properties.time;
        let object = properties.object;
        let color = properties.color;

        let scale = particleSize * Sync.get('Particle:scale', 1);

        const particle = particles[i];

        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;

        object.position.x = particle.x;
        object.position.y = particle.y;
        object.position.z = particle.z;


        color.r = particle.color.r;
        color.g = particle.color.g;
        color.b = particle.color.b;
        color.a = particle.color.a;

        }
      }
    
  });
};

Demo.prototype.getDiscarderShader = function() {
  return `
uniform float beatSync;

float rand() {
  return fract(sin(time+dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float rand2(vec2 coord, float value) {
  return fract(sin(value+dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
}

void discarder() {
        vec2 normalizedFragCoord = gl_FragCoord.xy / vec2(1920.,1080.);


        float bpm = 135.0;
        float beat = time * bpm / 60.0;
        if (mod(beat, 1.0) < beatSync) {
          float flooredBeat = floor(beat*4.0);

          for (int i = 0; i < 10; i++) {
            float iter = float(i)/10.0;
            float randomX = rand2(vec2(0.1+iter,0.1+iter), flooredBeat);
            float randomXs = rand2(vec2(0.12+iter,0.12+iter), flooredBeat)*0.01;
            float randomY = rand2(vec2(0.2+iter,0.2+iter), flooredBeat);
            float randomYs = rand2(vec2(0.22+iter,0.22+iter), flooredBeat)*0.01;
            if (normalizedFragCoord.y > randomY-randomYs && normalizedFragCoord.y < randomY+randomYs) {
              discard;
            }

            if (normalizedFragCoord.x > randomX-randomXs && normalizedFragCoord.x < randomX+randomXs) {
              discard;
            }
          }


          //gl_FragColor.rgb *= 0.5*sin(time)*0.1;
          if (mod(normalizedFragCoord.y+time*0.2, 0.015) < 0.0075) {
            //discard;
            //gl_FragColor.rgb *= 0.5*sin(time)*0.1;
          }
        }

        vec2 gridCoord = floor(normalizedFragCoord * 3000.0 / 10.0);
        if (mod(gridCoord.x + gridCoord.y, 2.0) == 0.0) {
            gl_FragColor.rgb *= 0.8;
        }

        if (rand() < 0.02) {
          discard;
        }
}`;
};

Demo.prototype.addEffectOuterText = function (options) {

  const id = 'outerText';
  const sideLength = 3.2;
  this.loader.addAnimation({
    object:null,
    id: id,
    parent: 'cube',
    visible: () => Sync.get('OuterText:vis', 0) < 1 ? false : true,
    scale:{
      uniform3d: () => Sync.get('OuterText:scale', 1.0)
    },
    position: {
      x: () => Sync.get('OuterText:posX', 0.0),
      y: () => Sync.get('OuterText:posY', 0.0),
      z: () => Sync.get('OuterText:posZ', 0.0)
    },
    angle: {
      degreesX: () => Sync.get('OuterText:degX', getSceneTimeFromStart()*100.0),
      degreesY: () => Sync.get('OuterText:degY', getSceneTimeFromStart()*100.0),
      degreesZ: () => Sync.get('OuterText:degZ', getSceneTimeFromStart()*100.0)
    }
  })

  const randomWeather = (options) => {
    let baseString = 'X'.repeat(90);

    const showText = !options?.onlyX;

    if (showText) {
      const coastalWeatherStations = [
        'Haapasaari',
        'Rankki',
        'Orrengrund',
        'Emäsalo',
        'Kalbådagrund',
        'Itätoukki',
        'Harmaja',
        'Mäkiluoto',
        'Bågaskär',
        'Jussarö',
        'Tulliniemi',
        'Russarö',
        'Vänö',
        'Utö',
        'Bogskär',
        'Rajakari',
        'Fagerholm',
        'Nyhamn',
        'Märket',
      ];

      const weatherStation = Utils.getRandomArrayElement(coastalWeatherStations);
      const plusOrMinus = Utils.getRandomArrayElement(['-', '+', '+']);
      const degrees = plusOrMinus + Math.floor(Utils.random() * 100);
      const windDirection = Utils.getRandomArrayElement(['pohjoinen', 'itä', 'lounas', 'länsi', 'koillinen', 'kaakko']);
      const wind = Math.floor(Utils.random() * 100);
      const visibilityStatus = Utils.getRandomArrayElement(['selkeä', 'melko selkeä', 'puolipilvistä', 'pilvistä']);
      const visibility = Math.floor(Utils.random() * 100);

      const buffer = 3;
      let baseWeatherString = (weatherStation + 'X'.repeat(Math.floor(Utils.random()*buffer)) + degrees);
      baseWeatherString += 'X'.repeat(Math.floor(Utils.random()*buffer)) + (windDirection + 'X'.repeat(Math.floor(Utils.random()*buffer)) + wind);
      baseWeatherString += 'X'.repeat(Math.floor(Utils.random()*buffer)) + (visibilityStatus + 'X'.repeat(Math.floor(Utils.random()*buffer)) + visibility);

      const insertIndex = Math.floor(Utils.random() * (baseString.length - baseWeatherString.length));
      baseString = baseString.substring(0, insertIndex) + baseWeatherString + baseString.substring(insertIndex + baseWeatherString.length);
    }
 
    return baseString.replace(/(.{15})/g, '$1\n').toUpperCase();
  };

  const addText = (text, options) => { 

    const syncPrefix = `OuterText:${options.side}_`;

    if (options?.side) {
      // cube side rotation
      switch (options.side) {
        case 1:
          options.angle = {degreesX:0,degreesY:-90,degreesZ:0};
          options.position = {x:-sideLength/2,y:0,z:-sideLength/2};
          break;
        case 2:
          options.angle = {degreesX:0,degreesY:180,degreesZ:0};
          options.position = {x:0,y:0,z:-sideLength};
          break;
        case 3:
          options.angle = {degreesX:0,degreesY:90,degreesZ:0};
          options.position = {x:sideLength/2,y:0,z:-sideLength/2};
          break;
        case 4:
          options.angle = {degreesX:-90,degreesY:0,degreesZ:0};
          options.position = {x:0,y:sideLength/2,z:-sideLength/2};
          break;
        case 5:
          options.angle = {degreesX:90,degreesY:0,degreesZ:0};
          options.position = {x:0,y:-sideLength/2,z:-sideLength/2};
          break;
        case 0:
        default:
          options.angle = {degreesX:0,degreesY:0,degreesZ:0};
          options.position = {x:0,y:0,z:0};
          break;
      }
    }

    this.loader.addAnimation({
      parent: id,
      visible: () => Sync.get(syncPrefix + `${options.index}_vis`, 0) < 1 ? false : true,
      text:{
      string:text,
      name:'font/ShareTechMono-Regular.ttf',
      parameters: {size:20,depth:0.5,bevelEnabled:true,bevelThickness:0.01,bevelSize:0.01,bevelSegments:1}
      },
      perspective:'3d',
      position:{
        x:(options.position?.x||0),
        y:(options.position?.y||0),
        z:(options.position?.z||0) + sideLength/2
      },
      //color:[{r:0,g:0,b:0,a:0},{duration:fadeDuration,a:1},{duration:textDuration},{duration:fadeDuration,a:0}],
      scale:{x:() => Sync.get('OuterText:sideScaleX',0.45),y:() => Sync.get('OuterText:sideScaleY',0.735)},
      angle:{
        degreesX:() => Sync.get(syncPrefix + `degX`, 1) + (options.angle?.degreesX||0),
        degreesY:() => Sync.get(syncPrefix + `degY`, 1) + (options.angle?.degreesY||0),
        degreesZ:() => Sync.get(syncPrefix + `degZ`, 1) + (options.angle?.degreesZ||0),
      },
      shader:{
        fragmentShaderPrefix: `

uniform float time;

${this.getDiscarderShader()}
        `,
        fragmentShaderSuffix: `
          discarder();
        `,
        variable:[
          {name:'beatSync', value:[() => Sync.get('OuterText:beatSync', 0.0)]}
        ]
      }
      //...optionsShadow
    });
  };

  for (let i = 0; i < 6*3; i++) {
    const side = i % 6;
    const onlyX = i < 6 ? true : false;

    addText(randomWeather({onlyX: onlyX}), {side: side, index: i});
  }
};

Demo.prototype.addEffectOuterPlanes = function () {
  const id = 'outerPlane';
  this.loader.addAnimation({
    object:null,
    id: id,
    scale:{uniform3d:()=>Sync.get('OuterPlane:scale', 1.0)},
    position: {
      x:Sync.get('OuterPlane:posX', 0.0),
      y:Sync.get('OuterPlane:posY', 0.0),
      z:Sync.get('OuterPlane:posZ', 0.0)
    },
    angle: {
      degreesX: ()=>Sync.get('OuterPlane:degX', 0.0),
      degreesY: ()=>Sync.get('OuterPlane:degY', 0.0),
      degreesZ: ()=>Sync.get('OuterPlane:degZ', 0.0)
    }
  });

  // 1 = triangle
  // 4 = square
  // 5 = pentagon
  // 6 = hexagon
  // 100 = round circle
  let shapes = [
    {
      thetaSegments: 1
    },
    {
      thetaSegments: 4
    },
    {
      thetaSegments: 6
    },
    {
      thetaSegments: 100
    }
  ];


  for(let j = 0; j < shapes.length; j++) {
    const shape = shapes[j];
    for (let i = 0; i < 6; i++) {

      const degXFinal = Utils.random() * 360 * 5;
      const degYFinal = Utils.random() * 360 * 5;
      const degZFinal = Utils.random() * 360 * 5;
      const rotRingFn = (coord)  => {
        const percent = getSceneTimeFromStart() / 100.0;
        const eventBeat = getEvenBeatValue() * 25;

        if (coord == 'x') {
          return percent * degXFinal + eventBeat;
        } else if (coord == 'y') {
          return percent * degYFinal + eventBeat;
        } else {
          return percent * degZFinal + eventBeat;
        }
      };

      const syncPrefix = `OuterPlane:${j}_${i}_`;
      this.loader.addAnimation({
        parent: id,
        visible: () => Sync.get(syncPrefix + 'vis', 0.0) > 0.0 ? true : false,
        shape: {
          type: 'RING',
          innerRadius: 4.7,
          outerRadius: 5.0,
          phiSegments: 1,
          thetaStart: Math.PI * 2 * 0.0,
          thetaLength: Math.PI * 2 * 1.0,
          ...shape
        },
        material: {
          type: 'Standard',
          side: 'DoubleSide',
          roughness: 0.5,
          metalness: 0.3,
          transparent: true,
          depthWrite: false,
          //blending: 'AdditiveBlending',
          bumpMap: 'sceneAbstract/bumpmap.png',
          bumpScale: 8.0
        },
        scale: {
          uniform3d: () => Sync.get(syncPrefix + 'scale', 1.0) + Math.sin((i+j)/10.0+getBeatValue2())*0.02
        },
        position: {
          x:Sync.get(syncPrefix + 'posX', -0.0),
          y:Sync.get(syncPrefix + 'posY', -0.0),
          z:Sync.get(syncPrefix + 'posZ', -0.0)
        },
        angle: {
          degreesX: () => rotRingFn('x'),
          degreesY: () => rotRingFn('y'),
          degreesZ: () => rotRingFn('z')
        }
      });
    }

  }
};

Demo.prototype.addEffectCube = function () {
  const id = 'cube';

  this.loader.addAnimation({
    object:null,
    id: id,
    visible: () => Sync.get('Cube:vis', 0) < 1 ? false : true,
    scale:{
      uniform3d: () => Sync.get('Cube:scale', 1.0)
    },
    position: {
      x: () => Sync.get('Cube:posX', 0.0),
      y: () => Sync.get('Cube:posY', 0.0),
      z: () => Sync.get('Cube:posZ', 0.0)
    },
    angle: {
      degreesX: () => Sync.get('Cube:degX', getSceneTimeFromStart()*100.0),
      degreesY: () => Sync.get('Cube:degY', getSceneTimeFromStart()*100.0),
      degreesZ: () => Sync.get('Cube:degZ', getSceneTimeFromStart()*100.0)
    }
  })

  const baseCubesX = 3;
  const baseCubesY = 3;
  const baseCubesZ = 3;
  const cubeSize = 1.0;
  const cubesWidth = baseCubesX * cubeSize;
  const cubesHeight = baseCubesY * cubeSize;
  const cubesDepth = baseCubesZ * cubeSize;

  for (let x = 0; x < baseCubesX; x++) {
    for (let y = 0; y < baseCubesY; y++) {
      for (let z = 0; z < baseCubesZ; z++) {
        const syncPrefix = `Cube:${x}_${y}_${z}_`;
        this.loader.addAnimation({
          visible: () => Sync.get(syncPrefix + 'vis', 0) < 1 ? false : true,
          object: null,
          parent: id,
          scale:{
            uniform3d: () => Sync.get(syncPrefix + 'scale', 0.99)
          },
          position: {
            x:()=>Sync.get(syncPrefix + 'posX', 0)+x*cubeSize-(cubeSize),
            y:()=>Sync.get(syncPrefix + 'posY', 0)+y*cubeSize-(cubeSize),
            z:()=>Sync.get(syncPrefix + 'posZ', 0)+z*cubeSize-(cubeSize)
          },
          angle:{
            degreesX:()=>Sync.get(syncPrefix + 'degX', 0.0),
            degreesY:()=>Sync.get(syncPrefix + 'degY', 0.0),
            degreesZ:()=>Sync.get(syncPrefix + 'degZ', 0.0)
          },
          material: {
          type: 'Standard',
          roughness: 0.1,
          metalness: 0.9,
          envMap: 'cube1.cube.map',
        },
        shape: {
            type: 'CUBE',
            size: cubeSize
        },
      shader:{
        fragmentShaderPrefix: `

uniform float time;

${this.getDiscarderShader()}
        `,
        fragmentShaderSuffix: `
          discarder();
        `,
        variable:[
          {name:'beatSync', value:[() => Sync.get(syncPrefix + 'beatSync', 0.5)]}
        ]
      }
      });
    }
    }
  }
};

Demo.prototype.addEffectDeformSphere = function () {

  const defFacFn = (coord)  => {
    return 20.0 + (Math.sin(getBeatValue()) + 1.0)*0.5;
  };
  const defScaFn = (coord)  => {
    return 0.0 + (Math.sin(getBeatValue()) + 1.0)*0.2;
  };
  const defMovFn = (coord)  => {
    return getBeatValue();
  };

  this.loader.addAnimation({
    object: null,
    visible: () => Sync.get('Sphere:vis', 0) < 1 ? false : true,
    scale: {uniform3d:()=>Sync.get('Sphere:scale', 1.0)},
    position: {
      x:Sync.get('Sphere:posX', 0.0),
      y:Sync.get('Sphere:posY', 0.0),
      z:Sync.get('Sphere:posZ', 0.0)
    },
    angle: {
      degreesX: () => Sync.get('Sphere:degX', 0.0),
      degreesY: () => Sync.get('Sphere:degY', 0.0),
      degreesZ: () => Sync.get('Sphere:degZ', 0.0)
    },
    cubeMap: {name:'cube1'},
    material: {
      type: 'Standard',
      envMap: 'cube1.cube.map',
      roughness: 0.1,
      metalness: 0.8
    },
    shape: {
        type: 'SPHERE',
        radius: 1.0,
        widthSegments: 512,
        heightSegments: 512
    },
    shader:{
      name:'sceneAbstract/sphereDeform.vs',
      vertexShaderSuffix:`
        deform();
      `,
        fragmentShaderPrefix: `

uniform float time;

${this.getDiscarderShader()}
        `,
        fragmentShaderSuffix: `
          discarder();
        `,
        variable:[
          {name:'beatSync', value:[() => Sync.get('Sphere:beatSync', 0.1)]},
          {name:'deformFactor', value:[
            () => Sync.get('Sphere:defFacX', 0.0) * defFacFn(),
            () => Sync.get('Sphere:defFacY', 0.0) * defFacFn(),
            () => Sync.get('Sphere:defFacZ', 0.0) * defFacFn()
          ]},
          {name:'deformScale', value:[
            () => Sync.get('Sphere:defScaX', 0.0) * defScaFn(),
            () => Sync.get('Sphere:defScaX', 0.0) * defScaFn(),
            () => Sync.get('Sphere:defScaX', 0.0) * defScaFn()
          ]},
          {name:'deformMove', value:[
            () => Sync.get('Sphere:defMovX', 0.0) + defMovFn(),
            () => Sync.get('Sphere:defMovY', 0.0) + defMovFn(),
            () => Sync.get('Sphere:defMovZ', 0.0) + defMovFn()
          ]}
        ]
    },
  });
};

Demo.prototype.addEffectLaser = function () {
  const length = 20.0;
  const thickness = 2.;

  const animationDefinition = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    material: {
      type: 'Standard',
      side: 'DoubleSide',
      roughness: 0.1,
      metalness: 0.8,
      castShadow: false,
      receiveShadow: false,
      blending: 'AdditiveBlending',
      transparent:true,
      depthWrite:false,
    },
    shader: {
      name: ['sceneAbstract/laser.fs'],//, 'sceneAbstract/laser.vs'],
      //vertexShaderSuffix:`billboard();`,
      fragmentShaderSuffix:`drawLaser();`
    },
    shape: {
        type: 'PLANE',
        width: thickness,
        height: length,
    },
  };


  let id = 'laser';
  this.loader.addAnimation({
    object: null,
    visible:()=>Sync.get('Laser:vis', 0.0) < 1 ? false : true,
    id: id,
    position:{
      x:()=>Sync.get('Laser:posX', 0.0),
      y:()=>Sync.get('Laser:posY', 0.0),
      z:()=>Sync.get('Laser:posZ', 0.0)
    },
    angle:{
      degreesX:()=>Sync.get('Laser:degX', 0.0),
      degreesY:()=>Sync.get('Laser:degY', 0.0),
      degreesZ:()=>Sync.get('Laser:degZ', 0.0)
    },
    scale:{uniform3d:()=>Sync.get('Laser:scale', 1.0)}
  });

  // spike ball
  for(let i = 0; i < 10; i++) {
    const angle = {order: 'XZY', degreesX:Utils.random()*360,  degreesZ:Utils.random()*360};
    for (let side = 0; side < 2; side++) {
      this.loader.addAnimation({
        position:{x:0,y:0,z:0},
        visible:()=>Sync.get('Laser:vis', 0.0) < 1 ? false : true,
        //angle:[{degreesX:Utils.random()*360, degreesY:()=>getSceneTimeFromStart()*100.0, degreesZ:Utils.random()*360}],
        //position: [{x:x*cubeSize-cubesWidth/2,y:y*cubeSize-cubesHeight/2,z:z*cubeSize-cubesDepth/2}],
        angle:{...angle, degreesY:()=>getSceneTimeFromStart()*120*360.0+side*90},
        ...Utils.deepCopyJson(animationDefinition)
      });
    }
  }

/*
  // circle
  let lines = 6;
  for(let i = 0; i < lines; i++) {
    const percent = i / lines;

    const radius = 10;
    const angle = (percent) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    for (let side = 0; side < 2; side++) {
      this.loader.addAnimation({
        position:{x:x,y:y,z:0},
        parent: id,
        angle:{order: 'XZY', degreesZ:percent*360, degreesY:()=>getSceneTimeFromStart()*120*360.0+side*90},
        ...Utils.deepCopyJson(animationDefinition)
      });
    }
  }return;
*/

return;
  // lines

  const particles = new Array(200*2);
  lines = particles.length / 2;
  for(let i = 0, j = 0; i < particles.length; j++, i+=2) {
    const percent = j / lines;

    const radius = 5+5*Utils.random();
    const angle = (Utils.random()) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = Utils.random() * -100.0 + 20;

    const particle = {
      x: x,
      y: y,
      z: z,
      color: {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      },
    };
    particles[i] = particle;
    particles[i+1] = particle;

    /*for (let side = 0; side < 2; side++) {
      this.loader.addAnimation({
        position:{x:x,y:y,z:()=>((getSceneTimeFromStart()*40.0+z)%80.0)+z},
        parent: id,
        angle:{order: 'XZY', degreesX:90, degreesY:()=>getSceneTimeFromStart()*120*360.0+side*90},
        ...Utils.deepCopyJson(animationDefinition)
      });
    }*/
  }

      this.loader.addAnimation({
        //position:{x:x,y:y,z:()=>((getSceneTimeFromStart()*40.0+z)%80.0)+z},
        parent: id,
        visible:()=>Sync.get('Laser:vis', 1.0) < 1 ? false : true,
        //angle:{order: 'XZY', degreesX:90, degreesY:()=>getSceneTimeFromStart()*120*360.0+side*90},
        ...Utils.deepCopyJson(animationDefinition),
        instancer: {
        sort: false,
        count: particles.length,
        runInstanceFunction: (properties) => {

          const i = properties.index;
          const count = properties.count;
          const time = properties.time;
          let object = properties.object;
          let color = properties.color;

          const alpha = Sync.get('Laser:alpha', 1.0);

          let scale = 1 * alpha;

          const side = i % 2;

          const particle = particles[i];

          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;

          object.position.x = particle.x;
          object.position.y = particle.y;
          object.position.z = ((getSceneTimeFromStart()*40.0+particle.z)%80.0)+particle.z;

          const deg2rad = Math.PI / 180;
          properties.angle.degreesX = 90 * deg2rad;
          properties.angle.degreesY = (getSceneTimeFromStart()*120*360.0+side*90) * deg2rad;
          properties.angle.degreesZ = 0;

          color.r = particle.color.r;
          color.g = particle.color.g;
          color.b = particle.color.b;
          color.a = particle.color.a * alpha * 1.0;

          }
        }
      });



};

Demo.prototype.sceneAbstract = function () {
  this.setScene('abstract');
  //this.setScene('main');
//return;
  this.loader.addAnimation({
    "light": {
        "type": "Ambient",
        "properties": { "intensity": 1.0 },
    }
  });

  this.loader.addAnimation({
    "light": {
        "type": "Directional",
        "properties": { "intensity": 1.0 },
        "castShadow": false
    }
    ,position:[{x:-3,y:5,z:3}]
  });
//return;
  /*this.loader.addAnimation({
    "light": {
        "type": "RectArea",
        "properties": { "intensity": 10.0 },
        "castShadow": false
    }
    ,position:[{x:0,y:0,z:-2.5}]
    ,color:[{r:1,g:0,b:0}]
  });*/


  const boardShader = {
    // extend generated material shader
    fragmentShaderPrefix:`
uniform float bloodTime;
uniform float bloodRadius;
//uniform vec4 color;// = vec4(1);

float drawBlood()
{
  

  vec2 uv = vMapUv.xy;
  vec2 position = vec2(0.5,-0.5);
  float radius = bloodRadius;

	if (radius <= 0.)
	{
		return 0.;
	}

  float t = (sin(bloodTime*0.3)+1.)/2.*10.+35.;

  vec2 circleDeform = vec2(0.005,0.005);
	vec2 deformUv = uv;
	deformUv.x += sin(uv.y*t+t*4.)*circleDeform.x+sin(uv.x*t+t*3.)*circleDeform.x;
	deformUv.y += cos(uv.x*t+t*4.)*circleDeform.y;

	float distance = length(position - deformUv);
	float circleDistance = distance - radius;
	if (circleDistance < radius)
	{
    return 1.0-min(distance/1.0,1.0);
	}

	return 0.;
}

void drawBoard()
{
    vec2 coord=vMapUv;
    //fragColor = texture(map, vMapUv);
    //coord = mod(coord + vec2(time), vec2(1.0));

    float blood = drawBlood();
    if (blood > 0.0) {
        gl_FragColor.rgb *= vec3(0.3, 0.1, 0.1);
    } else {
      gl_FragColor.rgba *= vec4(0.9);
    }
    vec2 gridCoord = floor(coord * 1600.0 / 10.0);
    if (mod(gridCoord.x + gridCoord.y, 2.0) == 0.0) {
        gl_FragColor.rgb *= 0.3;
        //discard;
    }
}
    `,
    fragmentShaderSuffix:`
      drawBoard();
    `
  };
  /*
  const s = 1.0;
  const w = s*64;
  const h = s*16;

  this.loader.addAnimation({
    object: '_embedded/defaultWhite.png',
    shape: { type: 'PLANE', width: w, height: h },
    position: [
      {
        x: 0,
        y: 2,
        z: -5,
      }
    ],
    angle: [{degreesX:0}],
  });

  this.loader.addAnimation({
    object: '_embedded/defaultWhite.png',
    shape: { type: 'PLANE', width: w, height: h },
    position: [
      {
        x: w/2,
        y: 2,
        z: -5+w/2,
      }
    ],
    angle: [{degreesY:-90}],
  });

  this.loader.addAnimation({
    object: '_embedded/defaultWhite.png',
    //object: 'spectogram.png',
    shape: { type: 'PLANE', width: w, height: w },
    shader:{...boardShader,
      variable:
      [
        {name:"bloodRadius","value":[()=>0.0]},
        {name:"bloodTime","value":[()=>0.0]},
      ]
    },
    position: [
      {
        x: 0,
        y: 2-h/2,
        z: -5+w/2,
      }
    ],
    angle: [{degreesX:-90}],
  });*/

  const s = 1.0;
  const w = s*1280;
  const h = s*16;

  /*this.loader.addAnimation({
    object: '_embedded/defaultWhite.png',
    //object: 'spectogram.png',
    shape: { type: 'PLANE', width: w, height: w, widthSegments: 20, heightSegments: 20 },
    shader:{...boardShader,
      variable:
      [
        {name:"bloodRadius","value":[()=>0.0]},
        {name:"bloodTime","value":[()=>0.0]},
      ]
    },
    position: [
      {
        x: 0,
        y: 2-h/2,
        z: 0,
      }
    ],
    angle: [{degreesX:-90}],
  });*/


  this.loader.addAnimation({
    object: null,
    //visible:false,
        cubeMap: {name:'cube1'},
    position:{x:0,y:0,z:0},
    runFunction: () => {
      window.demoBeatValue = calcBeatValue();
    }
  });

  this.addEffectBackground();
  this.addUnderlay();

  this.addEffectDeformSphere();
  this.addEffectCube();
  this.addEffectOuterPlanes();
  this.addEffectOuterText();

  //this.addEffectLaser();
  this.addEffectTunnel();
  //this.addEffectParticleShape();
  this.addEffectColorParticleShape();


  return;

  this.loader.addAnimation({
    object: null,
    material: {
        type: 'Line',
        linewidth: 40,
        dashed: true,
        gapSize:0.1,
          castShadow: false,
          receiveShadow: false,
          blending: 'AdditiveBlending',
          transparent:true,
          depthWrite:false,
    },
    shape: {
      type: 'LINE',
      precision: 1,
      points: [
        { x: -1, y: 0, z: 0 },
        { x: 10, y: 3, z: 0 },
      ] 
    },
    position: {
      x:0,y:0,z:0
    },
    shader: {
      fragmentShaderPrefix: `

uniform float time;

float rand() {
  return fract(sin(time+dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void drawLaser() ////
{ 
    vec4 color1 = vec4(1.,0.4,0.4,1.);
    vec2 coord=vUv;

    // sin wavy
    coord.s = coord.s + sin(time*400.0 + coord.t * 150.0) * 0.4;

    float y = coord.t + 1.0;
    if (y > 1.0) {
      y = 2.0 - y;
    }
    //y = 1.0;

    float x = coord.s + 1.0;
    if (x > 1.0) {
      x = 2.0 - x;
    }
    gl_FragColor.rgb = vec3(x*y);
    gl_FragColor.g = mod(time, 1.0);
    gl_FragColor.a = 0.2 + 0.8*rand();

    // moire pattern
    vec2 gridCoord = floor(coord * 1500.0 / 10.0);
    if (mod(gridCoord.x + gridCoord.y, 2.0) == 0.0) {
        gl_FragColor.rgb *= 0.6;
    }

    gl_FragColor.rgba *= color1;
}
      `,
      fragmentShaderSuffix:`drawLaser();`
    },
  });
};