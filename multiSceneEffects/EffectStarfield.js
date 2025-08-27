Demo.prototype.addEffectStarfield = function (startTime, durationTime, amountOfParticles, texture, areaSizeX,areaSizeY,areaSizeZ, particleSize, parentId,x,y,z, speed = 1.0, directionFlip = 0.0, highlight = false)
{
  const recalcThreshold = 0.1;

  let stars = new Array(amountOfParticles);
  const sizeX = areaSizeX;
  const sizeY = areaSizeY;
  const sizeZ = areaSizeZ;
  for (let i = 0; i < stars.length; i++) {
    let z1 = Utils.random();
    stars[i] = {
      "x0": Utils.random()*sizeX*2-sizeX,
      "y0": Utils.random()*sizeY*2-sizeY,
      "x1": Utils.random()*sizeX*2-sizeX,
      "y1": Utils.random()*sizeY*2-sizeY,
      "z1": Utils.random()*sizeZ*2-sizeZ,
      "z2": 0
    };
  }

  z = -50;
  this.loader.addAnimation({
    "start":startTime, "duration":durationTime,
    "image": texture,
    textureProperties: [{},{minFilter: 'NearestMipmapNearestFilter', magFilter: 'LinearFilter'}],
    "parent":parentId,
    "position":[{
      "x":x,
      "y":y,
      "z":z,
    }],
    "angle":[{"degreesY":180,degreesZ:()=>getSceneTimeFromStart()*5.0}],
    "perspective": "3d",
    "billboard": true,
    "additive": true,
    "material":{
      "blending": 'AdditiveBlending',
      "transparent":true,
      "depthWrite":false,

    },
    "scale":[{"uniform3d":.1}],
    "instancer": {
      "count": stars.length,
      "runInstanceFunction": (properties) => {

        const i = properties.index;
        const count = properties.count;
        const time = properties.time;
        let object = properties.object;
        let color = properties.color;

        let scale = particleSize;

        if (highlight) {
          color.r = 1.0;
          color.g = 0.0;
          color.b = 0.0;
          scale *= 1.3;
        }

        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;

        const percent = -(.15*getSceneTimeFromStart()*speed)%1.0;
        stars[i].z2 = (percent*sizeZ*2+stars[i].z1);
        if(stars[i].z2<-sizeZ)
          stars[i].z2+=sizeZ*2;

        object.position.z = stars[i].z2;
        object.position.x = stars[i].x1;
        object.position.y = stars[i].y1;
        if (highlight) {
          object.position.x += Math.sin(time*speed*1000.0)*1.0;
          object.position.y += Math.cos(time*speed*1000.0)*1.0;
        }

        }
      }
    
  });
};

Demo.prototype.addEffectMeshStarfield = function ()
{
  const startTime = data.startTime;
  const durationTime = data.dutationTime;
  const amountOfParticles = data.amount;
  const object = data.object;
  const areaX = data.areaX;
  const areaY = data.areaY;
  const areaZ = data.areaZ;
  const xOffset = data.xOffset;
  const yOffset = data.yOffset;
  const particleSize = data.particleSize;
  const colorR = 1.0;
  const colorG = 1.0;
  const colorB = 1.0;
  //speed = 15 units second
  const speed = 5.0;
  const percentageMultiplier = 1.0/((areaZ*2)/speed);

  const recalcThreshold = 0.1;

  let meshStars = new Array(amountOfParticles);
  const sizeX = areaX;
  const sizeY = areaY;
  const sizeZ = areaZ;
  
  for (let i = 0; i < meshStars.length; i++) {
    let angleY = 0;
    let angleX = 0;

    let z1 = Utils.random();
    let r = Utils.random();
    let g = Utils.random();
    let b = Utils.random();
    meshStars[i] = {
      "x1": Utils.random()*sizeX*2-sizeX + xOffset,
      "y1": Utils.random()*sizeY*2-sizeY + yOffset,
      "z1": Utils.random()*sizeZ*2-sizeZ,
      "z2": 0.0,
      "r": r,
      "g": g,
      "b": b,
      "scale":Utils.random()*.5*particleSize+particleSize*.5,
      "enabled": 0,
      "snapPrev": false,
      "angleY": angleY,
      "angleX": angleX,
      "ruin": ruin
    };
  }

  this.loader.addAnimation({
    "start":startTime, "duration":durationTime,
    "object":{
      "name":object
    },
    "perspective": "3d",
    "color":[{
      "r":colorR,
      "g":colorG,
      "b":colorB
    }],
    "scale":[{"uniform3d":.1}],
    "instancer": {
      "count": meshStars.length,
      "runInstanceFunction": (properties) =>
        {

        const i = properties.index;
        const count = properties.count;
        const time = properties.time;
        let angle = properties.angle;
        let object = properties.object;




        const percent = -(percentageMultiplier*10*getSceneTimeFromStart())%1.0;
        meshStars[i].z2 = (percent*sizeZ*2+meshStars[i].z1);
        if(meshStars[i].z2<-sizeZ)
        {

          meshStars[i].z2+=sizeZ*2;
          if(!meshStars[i].snapPrev)
          {
              meshStars[i].enabled=0.0;
          }
          meshStars[i].snapPrev = true;
        }
        else
          meshStars[i].snapPrev = false;
        
        object.scale.x = meshStars[i].scale*meshStars[i].enabled;
        object.scale.y = meshStars[i].scale*meshStars[i].enabled;
        object.scale.z = meshStars[i].scale*meshStars[i].enabled;
        //object.position.x = meshStars[i].z1;
        object.position.z = meshStars[i].x1;
        object.position.x = meshStars[i].z2;

  
        if(kala)
          object.position.y = meshStars[i].y1+5*Math.sin(i+3*getSceneTimeFromStart());
        else
          object.position.y = meshStars[i].y1;
        
        //object.position.z = stars[i].z1*size*2-size;
        
        ///15 units per second
        //1 block = (sizeZ*2)/15
       
        //meshStars[i].z1-=150*getDeltaTime();

        if(ruin)
        {
          angle.degreesY = meshStars[i].angleY;
          angle.degreesX = meshStars[i].angleX;
        }
        else
        {
          angle.degreesY = meshStars[i].angleY;
        }

        } 
      }
  });
};