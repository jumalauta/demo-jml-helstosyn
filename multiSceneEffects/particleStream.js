Demo.prototype.addEffectParticleStream = function (startTime, durationTime, amountOfParticles, particleSize, texture, xPos,yPos,zPos, xSpread = 1.0, ySpread = 1.0 ,interval = 0.,angle)
{
  const deg2rad = 0.01745329251;
  let particles = new Array(amountOfParticles);
  for (let i = 0; i < particles.length; i++) {
    particles[i] = {
      "x0": ()=>Sync.get('Sub:X')+xPos*Math.cos(Sync.get('Sub:Rot')*deg2rad),
      "y0": ()=>Sync.get('Sub:Y')+Utils.random()*.1-.05+yPos+xPos*Math.sin(Sync.get('Sub:Rot')*deg2rad),
      "z0": ()=>Sync.get('Sub:Z')+zPos,
      "x1": 10*-1.5,
      "y1": 2*(Utils.random()*ySpread*2-ySpread),
      "z1": 2*(Utils.random()*xSpread*2-xSpread),
      "enabled": false
    };
  }
  let prevTime = 10000;
  let prevIntervalTime = 0;
  let particleIndex = 0;
  this.loader.addAnimation({
    "start":startTime, "duration":durationTime,
    "image": texture,
    textureProperties: [{},{minFilter: 'NearestMipmapNearestFilter', magFilter: 'LinearFilter'}],
    //"angle":[{"degreesY":180*directionFlip}],
    "perspective": "3d",
    "billboard": true,
    "additive": true,
    "material":{
      "blending": 'AdditiveBlending',
      "transparent":true,
      "depthWrite":false,

    },
    "scale":[{"uniform3d":.1}],
    "angle":[{degreesZ:angle}],
    "runPreFunction": (animation)=>{

      if(prevTime>getSceneTimeFromStart())
      {
        prevIntervalTime=getSceneTimeFromStart();
      }
      if(getSceneTimeFromStart() > prevIntervalTime + interval)
      {
        prevIntervalTime = getSceneTimeFromStart();
        particleIndex++;
        if(particleIndex >= particles.length) 
          particleIndex = 0;

        particles[particleIndex].enabled = true;
      }
      prevTime=getSceneTimeFromStart();
    },
    "instancer": {
      "count": particles.length,
      "runInstanceFunction": (properties) => {

        const i = properties.index;

        if (i == particleIndex)
        {
          particles[i].x0 = 10*(Sync.get('Sub:X')+xPos*Math.cos(Sync.get('Sub:Rot')*deg2rad));
          particles[i].y0 = 10*(Sync.get('Sub:Y')+Utils.random()*.1-.05+yPos+xPos*Math.sin(-Sync.get('Sub:Rot')*deg2rad));
          particles[i].z0 = 10*(Sync.get('Sub:Z')+zPos);
        }

        if(particles[i].enabled == false)
        {
          let object = properties.object;
          object.scale.x = 0;
          object.scale.y = 0;
          object.scale.z = 0;   
          return;
        }

        const time = properties.time;
        let object = properties.object;
        let color = properties.color;
        
        const scale = particleSize;
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;   

        particles[i].x0+=particles[i].x1*getDeltaTime();
        particles[i].y0+=particles[i].y1*getDeltaTime();
        particles[i].z0+=particles[i].z1*getDeltaTime();

        object.position.x = particles[i].x0;        
        object.position.y = particles[i].y0;
        object.position.z = particles[i].z0;


      }
  }
  });
};