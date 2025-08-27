in vec2 texCoord;
in vec3 rayDirection;

out vec4 fragColor;

uniform sampler2D texture0;
uniform sampler2D texture2;
uniform float time;

uniform vec4 objPos1Mul; // = vec4(1.5,5.0,1.0,1.925);
uniform vec4 objPos2Mul; // = vec4(1.5,5.0,1.0,1.925);
uniform vec4 objPos3Mul; // = vec4(2.0,5.0,3.0,1.925);
uniform vec4 objPos4Mul; // = vec4(0.0,4.0,3.0,1.925);
uniform vec3 objSmooth; // = vec3(1.05,1.45,1.475);

uniform float timeMultiplier;
uniform float invert;
uniform float rotation;
uniform float rotation2;
uniform float rotation3;
uniform float speed;
uniform float MAX_STEPS;


uniform vec3 inCamPos;
uniform float camFov;
uniform vec3 camDirection;
uniform float camNear;
uniform float camFar;
uniform float outro;
uniform float carrotPosZ;

uniform int effectType; // 0 = metaballs, 1 = mengerish tunnel
vec3 camPos;
vec3 surfacePos;

float mengerdivisor = 2.0;
uniform float MAX_DIST;

#define PI 3.14159265359
#define BOTTOMSCALE 0.25
#define SURFACESCALE 0.15
mat2 Rot(float angle) 
{
	float s = sin(angle);
	float c = cos(angle);
	return mat2(c, -s, s, c);
}

float Cross(vec3 point)
{
	point = abs(point);
	vec3 d = vec3(max(point.x, point.y),
				  max(point.y, point.z),
				  max(point.z, point.x));
	return min(d.x, min(d.y, d.z)) - (1.0/mengerdivisor);
}

float Sphere ( vec3 point, float size)
{
    return length(point)-size;
}

float CrossRep(vec3 point)
{
	vec3 p = mod(point + 1.0, 2.3) - 1.0;
	return Cross(p);
}
float CrossRepScale(vec3 point, float scale)
{    
	return CrossRep(point * scale) / scale;
}

float SphereRep(vec3 point)
{
	vec3 p = mod(point + 1.0, 2.3) - 1.0;
    return Sphere(p, 1.5);
}
float SphereRepScale(vec3 point, float scale)
{    
	return SphereRep(point * scale) / scale;
}

float Cone( vec3 pos, vec3 rot, vec2 c, float h )
{
  vec3 p = pos;
  float q = length(p.xz);
  return max(dot(c.xy,vec2(q,p.y)),-h-p.y);
}

float Capsule( vec3 pos, vec3 rot, float h, float r )
{
  pos.y -= clamp( pos.y, 0.0, h );
  return length( pos ) - r;
}


float rand(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noiseTex(vec2 p, float scale) {

	vec2 n = floor(p*(scale));
	vec2 f = fract(p*(scale));
    f = vec2(smoothstep(0.,1.,f.x),smoothstep(0.,1.,f.y));
	float c1 = rand(n), c2 = rand(n+vec2(1.,0.)), c3 = rand(n+vec2(0.,1.)), c4 = rand(n+vec2(1.,1.));
    return mix(mix(c1,c2,f.x), mix(c3,c4,f.x), f.y);
}

vec4 sand(vec3 p) {
    vec3 sandColor = vec3(1.0,.45,.1);
	float sandPos = p.y - 1.6*noiseTex(p.zx, BOTTOMSCALE) + noiseTex(p.xz*vec2(2.5,1.),BOTTOMSCALE)/(100.+25.0*sin(time)) - noiseTex(p.xz*150.,BOTTOMSCALE)/350.;

    return vec4(sandPos, sandColor);
}




vec4 Sphere(vec3 point, vec3 pos, float scale, vec3 sphereColor)
{ 
	return vec4(length(point - pos)-scale, sphereColor);
}

vec4 Union(vec4 a, vec4 b)
{
    return a.x < b.x ? a : b; 
}
/*
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}
*/
vec4 smin(vec4 a, vec4 b, float k) {
    float h = clamp(0.5 + 0.5*(a.x-b.x)/k, 0.0, 1.0);
    float blend = k*h*(1.0-h);
 
    return mix(a, b, h) - vec4(blend, -blend*1.0,-blend*1.0,-blend*1.0);
}


vec4 GetDist(vec3 point)
{
    vec4 distObjects;

    if(effectType == 0)
    {
        vec3 objPos1 = vec3(0.5+(sin(time*3.))*objPos1Mul.x,sin(cos(time*1.5))*objPos1Mul.y,-15.0+sin(sin(time*3.))*objPos1Mul.z);
        vec3 objPos2 = vec3(0.5+(-sin(time*1.5))*objPos2Mul.x,sin(cos(-time*3.))*objPos2Mul.y,-15.0+sin(sin(time*3.))*objPos2Mul.z);
        vec3 objPos3 = vec3(0.5+sin(cos(-time*3.))*objPos3Mul.x,sin(cos(-time*2.))*objPos3Mul.y,-15.0+sin(sin(time*1.5))*objPos3Mul.z);
        vec3 objPos4 = vec3(0.5+objPos4Mul.x,(-sin(time*2.5435))*objPos4Mul.y,-15.0+sin(sin(time*1.5))*objPos4Mul.z);
        surfacePos = vec3(0.0,18.0,0.0);
        vec4 sphereObj1 = Sphere(point, objPos1, objPos1Mul.w, vec3(0.0,0.0,0.0));
        vec4 sphereObj2 = Sphere(point, objPos2, objPos2Mul.w, vec3(0.2,.2,.2));
        vec4 sphereObj3 = Sphere(point, objPos3, objPos3Mul.w, vec3(1.0,0.6,1.2));
        vec4 sphereObj4 = Sphere(point, objPos4, objPos4Mul.w, vec3(0.6,1.1,0.4));
        distObjects = smin(sphereObj1, sphereObj2, objSmooth.x);
        vec4 distObjects2 = smin(sphereObj3, sphereObj4, objSmooth.y);
        distObjects = smin(distObjects,distObjects2, objSmooth.z);
    }
    if(effectType == 1)
    {
        float objects;
        float scale = 1.0;
        for(int i=0;i<4;i++)
        {
            objects = max(objects, -CrossRepScale(point+vec3(.0,.0,-2.*time), scale));
            scale *=1.55;
        }
        vec3 color = vec3(0.0,1.0-(objects*objects)* 5.,0.5);
        if(objects<.026)
             color = vec3(0);

        distObjects = vec4(objects, color);
    }
    
    if(effectType == 2)
    {
        float objects;
        float scale = 1.6;
        for(int i=0;i<2;i++)
        {
            objects = max(objects, -SphereRepScale(point+vec3(.0,-.1,-2.), scale));
            scale *=1.55;
        }

        vec3 color = vec3(0.0,.65,.75);
        distObjects = vec4(objects, color);
    }
    return distObjects;
}


vec4 RayMarch(vec3 rayOrigin, vec3 rayDir)
{
    float distOrigin = camNear;
    vec3 distColor = vec3(.0,.0,.0);
	float SURFACE_DIST = .025; // this should be uniform calculated using camera fov
    vec3 bgColor = vec3(0.0,0.0,0.0);

    for(float i=0.; i<MAX_STEPS;i++)
    {
        vec3 pointOnRay = rayOrigin+rayDir*distOrigin;        
        vec4 distScene = GetDist(pointOnRay);
        distOrigin += distScene.x;
        if(distOrigin>=MAX_DIST) discard;
        if(distScene.x<SURFACE_DIST) break;

        distColor = mix (distScene.yzw, bgColor, distOrigin/MAX_DIST );

    }
    
    return vec4(distOrigin, distColor);
}

vec3 GetNormal(vec3 point)
{
    vec4 distColor = GetDist(point);
    float dist = distColor.x;
    vec2 e = vec2(.05,0.);
    vec3 normal = dist - vec3(
        GetDist(point-e.xyy).x, //e.xyy = 0.1,0,0
        GetDist(point-e.yxy).x,
        GetDist(point-e.yyx).x); 
        
    return normalize(normal);
}

float GetLight(vec3 point)
{
    
    vec3 lightPos = camPos+vec3(0.0,0.,.0);
    //lightPos.xz-=vec2(sin(time),cos(time))*11.;
    vec3 light = normalize(lightPos-point);

    vec3 normal = GetNormal(point);
    float diffuse = clamp(dot(normal, light),0.0,1.0);
    diffuse +=0.5;
    

    return diffuse;
}




 
void main()
{
    camPos = inCamPos;
    vec3 rayDir = rayDirection;
    
    if(effectType==2)
    {
        rayDir.xy *= Rot(time*.4);  
        camPos.z = time;
    }
     if(effectType==1)
    {
        rayDir.xy *= Rot(-time*.6);  
    }       


    vec4 dist = RayMarch(camPos, rayDir); 
    vec3 point = camPos + rayDir * dist.r;
    
    float diffuse = GetLight(point);
    vec3 col = vec3(dist.y*diffuse, dist.z*diffuse, dist.w*diffuse);

  //  float z =  (dist.x * dot(camDirection, rayDirection));
   // float ndcDepth = -((camFar + camNear) / (camNear - camFar)) + ((2.0 * (camFar) * camNear) / (camNear - camFar)) / z;
    //gl_FragDepth = ((gl_DepthRange.diff * ndcDepth) + gl_DepthRange.near + gl_DepthRange.far) / 2.;
    
    vec3 bgCol = vec3(0.0,0.0,0.0);

      //  col = mix(col, bgCol, (dist.x)/(MAX_DIST));

    fragColor = vec4(col,1.0);
} 