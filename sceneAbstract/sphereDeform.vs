uniform float time;


uniform vec3 deformFactor;
uniform vec3 deformScale;
uniform vec3 deformMove;

void deform() {
    vec3 pos = position;
    float dist = distance(vec3(0.), pos);

    dist = dist + sin(pos.x*deformFactor.x+deformMove.x)*deformScale.x + sin(pos.y*deformFactor.y+deformMove.y)*deformScale.y + sin(pos.z*deformFactor.z+deformMove.z)*deformScale.z;
    pos *= dist;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
