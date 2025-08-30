Demo.prototype.addEffectTunnel = function () {
  const length = 20.0;
  const thickness = 2.;

  const animationDefinition1 = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    material: {
      type: 'Standard',
      //side: 'DoubleSide',
      roughness: 0.1,
      metalness: 0.8,
      castShadow: false,
      receiveShadow: false,
      blending: 'AdditiveBlending',
      transparent:true,
      depthWrite:false,
      //envMap: 'cube1.cube.map'

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

  const animationDefinition2 = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    material: {
      type: 'Standard',
      //side: 'DoubleSide',
      roughness: 0.1,
      metalness: 0.8,
      castShadow: false,
      receiveShadow: false,
      //blending: 'AdditiveBlending',
      transparent:true,
      //depthWrite:false,
      envMap: 'cube1.cube.map'
    },
    shape: {
        type: 'PLANE',
        width: 1,
        height: 5,
    },
  };

  const animationDefinition = animationDefinition1;

  let id = 'tunnel';
  this.loader.addAnimation({
    object: null,
    visible:()=>Sync.get('Tunnel:vis', 0.0) < 1 ? false : true,
    id: id,
    position:{
      x:()=>Sync.get('Tunnel:posX', 0.0),
      y:()=>Sync.get('Tunnel:posY', 0.0),
      z:()=>Sync.get('Tunnel:posZ', 0.0)
    },
    angle:{
      degreesX:()=>Sync.get('Tunnel:degX', 0.0),
      degreesY:()=>Sync.get('Tunnel:degY', 0.0),
      degreesZ:()=>Sync.get('Tunnel:degZ', 0.0)
    },
    scale:{uniform3d:()=>Sync.get('Tunnel:scale', 1.0)}
  });

  // spike ball
  /*for(let i = 0; i < 10; i++) {
    const angle = {order: 'XZY', degreesX:Utils.random()*360,  degreesZ:Utils.random()*360};
    for (let side = 0; side < 2; side++) {
      this.loader.addAnimation({
        position:{x:0,y:0,z:0},
        //angle:[{degreesX:Utils.random()*360, degreesY:()=>getSceneTimeFromStart()*100.0, degreesZ:Utils.random()*360}],
        //position: [{x:x*cubeSize-cubesWidth/2,y:y*cubeSize-cubesHeight/2,z:z*cubeSize-cubesDepth/2}],
        angle:{...angle, degreesY:()=>getSceneTimeFromStart()*120*360.0+side*90},
        ...Utils.deepCopyJson(animationDefinition)
      });
    }
  }*/


  // circle
  /*const lines = 6;
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
  }*/


  // lines

  const circlePoints = 50;
  const particles = new Array(300*2);
  const lines = particles.length / 2;
  for(let i = 0, j = 0; i < particles.length; j++, i+=2) {
    const radius = 5+5*Utils.random();

    const randomPoint = Math.floor(Utils.random()*circlePoints);
    const percent1 = randomPoint / circlePoints;
    const percent2 = ((randomPoint + 1) % circlePoints) / circlePoints;

    const angle1 = (percent1) * Math.PI * 2;
    const angle2 = (percent2) * Math.PI * 2;
    const x1 = Math.cos(angle1) * radius;
    const y1 = Math.sin(angle1) * radius;
    const x2 = Math.cos(angle2) * radius;
    const y2 = Math.sin(angle2) * radius;
    const interpolatePercent = Utils.random();
    const x = Utils.interpolateLinear(interpolatePercent, x1, x2);
    const y = Utils.interpolateLinear(interpolatePercent, y1, y2);
    const z = Utils.random() * -100.0 + 20;

    const particle = {
      x: x,
      y: y,
      z: z,
      color: {
        r: Math.ceil(Utils.random()),
        g: Math.ceil(Utils.random()),
        b: Math.ceil(Utils.random()),
        a: 1.0
      },
      angle: {
        degreesX: 90,
        degreesY: percent1 * 360 + -45,
        degreesZ: 0
      }
    };
    particles[i] = particle;
    particles[i+1] = particle;
  }

  const runInstanceFunction = (properties) => {

          const i = properties.index;
          const particle = particles[i];

          const count = properties.count;
          const time = properties.time;
          let object = properties.object;
          let color = properties.color;
          color.r = particle.color.r;
          color.g = particle.color.g;
          color.b = particle.color.b;
          color.a = particle.color.a;

          const alpha = Sync.get('Tunnel:scale', 1.0);
          let scale = alpha;

          const side = i % 2;

          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;

          object.position.x = particle.x;
          object.position.y = particle.y;
          object.position.z = ((getSceneTimeFromStart()*40.0+particle.z)%80.0)+particle.z;

          const deg2rad = Math.PI / 180;
          properties.angle.degreesX = particle.angle.degreesX * deg2rad;
          properties.angle.degreesY = particle.angle.degreesY * deg2rad;
          //properties.angle.degreesY = (getSceneTimeFromStart()*120*360.0+side*90) * deg2rad;
          properties.angle.degreesZ = particle.angle.degreesZ * deg2rad;


          };

      this.loader.addAnimation({
        parent: id,
        visible:()=>Sync.get('Tunnel:t1vis', 0.0) < 1 ? false : true,
        ...Utils.deepCopyJson(animationDefinition),
        instancer: {
          count: particles.length,
          runInstanceFunction: runInstanceFunction
        }
      });



};

Demo.prototype.addEffectTunnel2 = function () {
  const length = 20.0;
  const thickness = 2.;

  const animationDefinition1 = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    material: {
      type: 'Standard',
      //side: 'DoubleSide',
      roughness: 0.1,
      metalness: 0.8,
      castShadow: false,
      receiveShadow: false,
      blending: 'AdditiveBlending',
      transparent:true,
      depthWrite:false,
      //envMap: 'cube1.cube.map'

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

  const animationDefinition2 = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    material: {
      type: 'Standard',
      //side: 'DoubleSide',
      roughness: 0.1,
      metalness: 0.8,
      castShadow: false,
      receiveShadow: false,
      //blending: 'AdditiveBlending',
      transparent:true,
      depthWrite:false,
      //envMap: 'cube1.cube.map'
            //type:'Basic',
            //transparent:false,
            //blending:'CustomBlending',
            //blendSrc:'OneMinusDstColorFactor',
            //blendDst:'ZeroFactor',
            //blendEquation:'AddEquation'
    },
    shape: {
        type: 'PLANE',
        width: 1.5,
        height: 8,
    },
  };

  const animationDefinition = animationDefinition2;

  let id = 'tunnel2';
  this.loader.addAnimation({
    object: null,
    visible:()=>Sync.get('Tunnel2:vis', 0.0) < 1 ? false : true,
    id: id,
    position:{
      x:()=>Sync.get('Tunnel2:posX', 0.0),
      y:()=>Sync.get('Tunnel2:posY', 0.0),
      z:()=>Sync.get('Tunnel2:posZ', 0.0)
    },
    angle:{
      degreesX:()=>Sync.get('Tunnel2:degX', 0.0),
      degreesY:()=>Sync.get('Tunnel2:degY', 0.0),
      degreesZ:()=>Sync.get('Tunnel2:degZ', 0.0)
    },
    scale:{uniform3d:()=>Sync.get('Tunnel2:scale', 1.0)}
  });

  // spike ball
  /*for(let i = 0; i < 10; i++) {
    const angle = {order: 'XZY', degreesX:Utils.random()*360,  degreesZ:Utils.random()*360};
    for (let side = 0; side < 2; side++) {
      this.loader.addAnimation({
        position:{x:0,y:0,z:0},
        //angle:[{degreesX:Utils.random()*360, degreesY:()=>getSceneTimeFromStart()*100.0, degreesZ:Utils.random()*360}],
        //position: [{x:x*cubeSize-cubesWidth/2,y:y*cubeSize-cubesHeight/2,z:z*cubeSize-cubesDepth/2}],
        angle:{...angle, degreesY:()=>getSceneTimeFromStart()*120*360.0+side*90},
        ...Utils.deepCopyJson(animationDefinition)
      });
    }
  }*/


  // circle
  /*const lines = 6;
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
  }*/


  // lines

  const circlePoints = 3;
  const particles = new Array(60);
  const lines = particles.length / 2;
  for(let i = 0, j = 0; i < particles.length; j++, i++) {
    const radius = 5+4.5+0.5*Utils.random();

    const randomPoint = Math.floor(Utils.random()*circlePoints);
    const percent1 = randomPoint / circlePoints;
    const percent2 = ((randomPoint + 1) % circlePoints) / circlePoints;

    const angle1 = (percent1) * Math.PI * 2;
    const angle2 = (percent2) * Math.PI * 2;
    const x1 = Math.cos(angle1) * radius;
    const y1 = Math.sin(angle1) * radius;
    const x2 = Math.cos(angle2) * radius;
    const y2 = Math.sin(angle2) * radius;
    const interpolatePercent = Utils.random();
    const x = Utils.interpolateLinear(interpolatePercent, x1, x2);
    const y = Utils.interpolateLinear(interpolatePercent, y1, y2);
    const z = Utils.random() * -100.0 + 20;

    const particle = {
      x: x,
      y: y,
      z: z,
      color: {
        r: Math.ceil(Utils.random()),
        g: Math.ceil(Utils.random()),
        b: Math.ceil(Utils.random()),
        a: 1.0
      },
      angle: {
        degreesX: 90,
        degreesY: percent1 * 360 + -45,
        degreesZ: 0
      }
    };
    particles[i] = particle;
    //particles[i+1] = particle;
  }

  const runInstanceFunction = (properties) => {

          const i = properties.index;
          const particle = particles[i];

          const count = properties.count;
          const time = properties.time;
          let object = properties.object;
          let color = properties.color;
          color.r = particle.color.r;
          color.g = particle.color.g;
          color.b = particle.color.b;
          color.a = particle.color.a;

          const alpha = Sync.get('Tunnel2:scale', 1.0);
          let scale = alpha;

          const side = i % 2;

          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;

          object.position.x = particle.x;
          object.position.y = particle.y;
          object.position.z = ((getSceneTimeFromStart()*5.0+particle.z)%80.0)+particle.z;

          const deg2rad = Math.PI / 180;
          properties.angle.degreesX = particle.angle.degreesX * deg2rad;
          properties.angle.degreesY = particle.angle.degreesY * deg2rad;
          //properties.angle.degreesY = (getSceneTimeFromStart()*120*360.0+side*90) * deg2rad;
          properties.angle.degreesZ = particle.angle.degreesZ * deg2rad;


          };

      this.loader.addAnimation({
        parent: id,
        visible:()=>Sync.get('Tunnel3:t1vis', 0.0) < 1 ? false : true,
        ...Utils.deepCopyJson(animationDefinition),
        instancer: {
          count: particles.length,
          runInstanceFunction: runInstanceFunction
        }
      });



};

Demo.prototype.addEffectTunnel3 = function () {
  const length = 20.0;
  const thickness = 2.;

  const animationDefinition1 = {
    object: '_embedded/defaultWhite.png',
    //billboard: true,
    //color:{r:1,g:1,b:1,a:1},
    material: {
      type: 'Standard',
      //side: 'DoubleSide',
      roughness: 0.1,
      metalness: 0.8,
      castShadow: false,
      receiveShadow: false,
      blending: 'SubtractiveBlending',
      transparent:true,
      depthWrite:false,
      //envMap: 'cube1.cube.map'

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

  const animationDefinition = animationDefinition1;

  let id = 'tunnel3';
  this.loader.addAnimation({
    object: null,
    visible:()=>Sync.get('Tunnel3:vis', 0.0) < 1 ? false : true,
    id: id,
    position:{
      x:()=>Sync.get('Tunnel3:posX', 0.0),
      y:()=>Sync.get('Tunnel3:posY', 0.0),
      z:()=>Sync.get('Tunnel3:posZ', 0.0)
    },
    angle:{
      degreesX:()=>Sync.get('Tunnel3:degX', 0.0),
      degreesY:()=>Sync.get('Tunnel3:degY', 0.0),
      degreesZ:()=>Sync.get('Tunnel3:degZ', 0.0)+getSceneTimeFromStart()*0.1
    },
    scale:{uniform3d:()=>Sync.get('Tunnel3:scale', 1.0)}
  });


  // lines

  const circlePoints = 3;
  const particles = new Array(200*2);
  const lines = particles.length / 2;
  for(let i = 0, j = 0; i < particles.length; j++, i+=2) {
    const radius = 5+5*Utils.random();

    const randomPoint = Math.floor(Utils.random()*circlePoints);
    const percent1 = randomPoint / circlePoints;
    const percent2 = ((randomPoint + 1) % circlePoints) / circlePoints;

    const angle1 = (percent1) * Math.PI * 2;
    const angle2 = (percent2) * Math.PI * 2;
    const x1 = Math.cos(angle1) * radius;
    const y1 = Math.sin(angle1) * radius;
    const x2 = Math.cos(angle2) * radius;
    const y2 = Math.sin(angle2) * radius;
    const interpolatePercent = Utils.random();
    const x = Utils.interpolateLinear(interpolatePercent, x1, x2);
    const y = Utils.interpolateLinear(interpolatePercent, y1, y2);
    const z = Utils.random() * -100.0 + 20;

    const particle = {
      x: x,
      y: y,
      z: z,
      color: {
        r: Math.ceil(Utils.random()),
        g: Math.ceil(Utils.random()),
        b: Math.ceil(Utils.random()),
        a: 1.0
      },
      angle: {
        degreesX: 90,
        degreesY: percent1 * 360 + -45,
        degreesZ: 0
      }
    };
    particles[i] = particle;
    particles[i+1] = particle;
  }

  const runInstanceFunction = (properties) => {

          const i = properties.index;
          const particle = particles[i];

          const count = properties.count;
          const time = properties.time;
          let object = properties.object;
          let color = properties.color;
          color.r = particle.color.r;
          color.g = particle.color.g;
          color.b = particle.color.b;
          color.a = particle.color.a;

          const alpha = Sync.get('Tunnel3:scale', 1.0);
          let scale = alpha;

          const side = i % 2;

          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;

          object.position.x = particle.x;
          object.position.y = particle.y;
          object.position.z = ((getSceneTimeFromStart()*40.0+particle.z)%80.0)+particle.z;

          const deg2rad = Math.PI / 180;
          properties.angle.degreesX = particle.angle.degreesX * deg2rad;
          properties.angle.degreesY = particle.angle.degreesY * deg2rad;
          //properties.angle.degreesY = (getSceneTimeFromStart()*120*360.0+side*90) * deg2rad;
          properties.angle.degreesZ = particle.angle.degreesZ * deg2rad;


          };

      this.loader.addAnimation({
        parent: id,
        visible:()=>Sync.get('Tunnel3:t1vis', 0.0) < 1 ? false : true,
        ...Utils.deepCopyJson(animationDefinition),
        instancer: {
          count: particles.length,
          runInstanceFunction: runInstanceFunction
        }
      });



};
