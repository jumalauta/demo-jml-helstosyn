uniform float time;

float rand() {
  return fract(sin(time+dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void drawLaser() ////
{ 
    vec4 color1 = vec4(1.,0.4,0.4,1.);
    gl_FragColor.rgba = color1; return; 
    vec2 coord= vec2(1.0);  //vMapUv; 

    // sin wavy  
    coord.s = coord.s + sin(time*40.0 + coord.t * 150.0) * 0.04;

    float y = coord.t * 2.0;
    if (y > 1.0) {
      y = 2.0 - y;
    }

    float x = coord.s * 2.0;
    if (x > 1.0) {
      x = 2.0 - x;
    }
    gl_FragColor.rgb = vec3(x*y);
    gl_FragColor.a = 0.2 + 0.8*rand();

    // moire pattern
    vec2 gridCoord = floor(coord * 1500.0 / 10.0);
    if (mod(gridCoord.x + gridCoord.y, 2.0) == 0.0) {
        gl_FragColor.rgb *= 0.6;
    }

    gl_FragColor.rgba *= color1;
}
