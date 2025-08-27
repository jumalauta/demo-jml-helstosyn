Demo.prototype.addEffectBackground = function () {
  const addPlasmaSkysphere = () => {
  const angle = 0.0;
  const skyColor = 0.02;
  this.loader.addAnimation({
    object: 'multiSceneEffects/tex_milky_way.png',
    shape: { type: 'SKYSPHERE' },
    color: [{ r: skyColor, g: skyColor, b: skyColor }],
    "angle":[{
      "degreesX":angle, degreesZ:0
      }],
    shader:{
      vertexShaderPrefix:`
        uniform float time;
      `,
      vertexShaderSuffix:`
        vMapUv.x = vMapUv.x - time * 0.002;
      `,
      fragmentShaderPrefix:`
        uniform float time;
        //uniform vec4 color;
void drawSphereEffect()
{
  vec2 uv = vMapUv.xy;

  vec2 uvWavy = uv;
  uvWavy.x += sin(uv.y * 10.0 + time * 0.1) * 0.05;
  uvWavy.y += cos(uv.x * 10.0 + time * 0.1) * 0.05;
  vec4 originalTexture = texture(map,uvWavy);

  vec2 uvWavy2 = uv*0.8;
  uvWavy2.x += sin(uv.x * 10.0 + time * 0.09) * 0.05;
  uvWavy2.y += cos(uv.y * 10.0 + time * 0.12) * 0.05;
  vec4 originalTexture2 = texture(map,uvWavy2);

  vec2 uvWavy3 = uv*0.6;
  uvWavy3.x += sin(uv.x * 10.0 + time * 0.08) * 0.05;
  uvWavy3.y += cos(uv.y * 10.0 + time * 0.13) * 0.05;
  vec4 originalTexture3 = texture(map,uvWavy3);

  vec3 textureBlend = min(originalTexture.rgb + originalTexture2.rgb + originalTexture3.rgb, vec3(1.0));

  uv *= 20.0;
  float plasma1 = sin(uv.x + time * 0.3);
  float plasma2 = sin(uv.y + time * 0.2);
  float plasma3 = sin((uv.x + uv.y) * 0.5 + time * 0.4);
  float plasma4 = sin(sqrt(uv.x * uv.x + uv.y * uv.y) + time * 0.5);
  float plasma = (plasma1 + plasma2 + plasma3 + plasma4) * 0.25;
  vec3 color1 = vec3(1.0, 0.2, 0.1);
  vec3 color2 = vec3(0.1, 0.3, 1.0);
  vec3 color3 = vec3(1.0, 0.8, 0.1);
  
  vec3 finalColor = mix(color1, color2, sin(plasma * 3.14159) * 0.5 + 0.5);
  finalColor = mix(finalColor, color3, cos(plasma * 2.0 + time * 0.001) * 0.3 + 0.3);
  float brightness = sin(plasma * 2.0 + time * 0.002) * 0.3 + 0.7;
  finalColor *= brightness;

  gl_FragColor = vec4(min(finalColor * (textureBlend*2.0), vec3(1.0)), 1.0);
  gl_FragColor.rgb *= ${skyColor};
  gl_FragColor.rbg *= 0.2;
}
      `,
      fragmentShaderSuffix:`

      //drawSphereEffect();
      `
    }
  });
  };
  
  addPlasmaSkysphere();

  this.addEffectSurrounding();
};

Demo.prototype.addEffectSurrounding = function () {
  const radius = 30;

    const cubeSize = 4;
    const roughness = 0.4;
    const metalness = 0.8;
  const animationDefinition2 = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    material: {
      type: 'Standard',
      //side: 'DoubleSide',
      roughness: roughness,
      metalness: metalness,
      castShadow:    false,
      receiveShadow: false,
      //blending: 'AdditiveBlending',
      transparent:false,
      //depthWrite:false,
      envMap: 'cube1.cube.map',
      bumpMap: 'sceneAbstract/bumpmap2.png',
      bumpScale: 5.0
    },
    shape: {
        type: 'CUBE',
        size: cubeSize,
    },
  };

  const animationDefinition = animationDefinition2;

  let id = 'backgroundCube';
  this.loader.addAnimation({
    object: null,
    //visible:false,
    visible: () => Sync.get('Background:cubeVisible', 0.0) > 0.0 ? true : false,
    id: id,
    position:{
      x:()=>Sync.get('Background:posX', 0),
      y:()=>Sync.get('Background:posY', 0),
      z:()=>Sync.get('Background:posZ', 0)
    },
    angle:{
      degreesX:()=>Sync.get('Background:degX', 0),
      degreesY:()=>Sync.get('Background:degY', 0),
      degreesZ:()=>Sync.get('Background:degZ', 0)
    },
    scale:{
      uniform3d: ()=>Sync.get('Background:scale', 1.0)
    }

  });

  const particles = new Array(600);
  for(let i = 0; i < particles.length; i++) {

    const direction = [
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
      Utils.random()*radius-radius/2,
    ];
    const dir = Utils.getRandomArrayIndex(direction);
    const dirRand = Utils.random();
    const dirOffset = dirRand * 0.03;
    direction[dir] = radius/2 * (dirRand < 0.5 ? -1 + dirOffset : 1 - dirOffset);
    direction[(dir+3)%direction.length] = direction[dir];
    //direction[(dir+1)%3] = radius/2 * (Utils.random() < 0.5 ? -1 : 1);
    particles[i] = {
      x: direction[0],
      y: direction[1],
      z: direction[2],
      x2: direction[3],
      y2: direction[4],
      z2: direction[5],
      color: {
        r: dir===0?1:0,
        g: dir===1?1:0,
        b: dir===2?1:0,
        a: 1.0//Utils.random()
      }
    };
  }


   const runInstanceFunction = (properties) => {

    const i = properties.index;
    const particle = particles[i];

    const count = properties.count;
    const time = properties.time;
    let object = properties.object;
    //let color = properties.color;
    //color.r = particle.color.r;
    //color.g = particle.color.g;
    //color.b = particle.color.b;
    //color.a = particle.color.a;

    let scale = Sync.get('Background:cubeScale', 1.0);

    // const side = i % 2;

    object.scale.x = scale;
    object.scale.y = scale;
    object.scale.z = scale;

    object.position.x = Utils.interpolateLinear(Sync.get('Background:interpolateX', 0.0), particle.x, particle.x2);
    object.position.y = Utils.interpolateLinear(Sync.get('Background:interpolateY', 0.0), particle.y, particle.y2);
    object.position.z = Utils.interpolateLinear(Sync.get('Background:interpolateZ', 0.0), particle.z, particle.z2); //((getSceneTimeFromStart()*40.0+particle.z)%80.0)+particle.z;

    // const deg2rad = Math.PI / 180;
    // properties.angle.degreesX = particle.angle.degreesX * deg2rad;
    // //properties.angle.degreesY = (getSceneTimeFromStart()*120*360.0+side*90) * deg2rad;
    // properties.angle.degreesY = particle.angle.degreesY * deg2rad;
    // properties.angle.degreesZ = particle.angle.degreesZ * deg2rad;


    };

      this.loader.addAnimation({
        parent: id,
        object: '_embedded/defaultWhite.png',
        visible: () => Sync.get('Background:cubeVisible', 1.0) > 0.0 ? true : false,
        //billboard: true,
        material: {
            type: 'Standard',
            side: 'BackSide',
            roughness: roughness,
            metalness: metalness,
            castShadow:    false,
            receiveShadow: false,
            //blending: 'AdditiveBlending',
            transparent:true,
            //depthWrite:false,
            envMap: 'cube1.cube.map',
            bumpMap: 'sceneAbstract/bumpmap.png',
            bumpScale: 6.0
        },
        shape: {
            type: 'CUBE',
            size: radius-cubeSize-0.1,
        },
        scale:{
          uniform3d: ()=>Sync.get('Background:scale', 1.0)
        },
        color: {r:.95,g:.95,b:.95,a:0.98}
      });

      this.loader.addAnimation({
        parent: id,
        visible: () => Sync.get('Background:cubeVisible', 1.0) > 0.0 ? true : false,
        ...Utils.deepCopyJson(animationDefinition),
        instancer: {
          count: particles.length,
          runInstanceFunction: runInstanceFunction
        },
        color: {r:1,g:1,b:1,a:1}
      });



};

