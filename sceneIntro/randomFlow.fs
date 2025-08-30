in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;
uniform float time;

float rand(vec2 coord)
{
    float seed = 2.0;
    return fract(sin(dot(coord.st,vec2(12.9898,78.233)+seed)) * 43758.5453);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, rand(100.+p*.000001)+rand(p.xx)*0.5 );
}

void main() {
    vec2 iResolution = vec2(1920.0, 1080.0);
    vec2 parameters = vec2(300.5,100.5);

    vec2 fragCoord = texCoord * iResolution;

    vec2 st = fragCoord/iResolution.xy;
    st.x *= iResolution.x/iResolution.y;

    vec2 grid = vec2(5.0,30.);
    st *= grid;
    st = st.xy;
 
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    float bpm = 135.0;
    float currentBeat = time*60.0/bpm;
    float timeInBeat = floor(currentBeat*40.0)/40.0+floor(currentBeat*4.0);

    vec2 vel = vec2(timeInBeat*2.*max(grid.x,grid.y));
    vel *= vec2(-1.,-1.0) * rand(vec2(1.0+ipos.y));

    vec2 offset = vec2(0.1,0.);

    vec3 color1 = vec3(0.);
    color1 = vec3(pattern(st+offset,vel,0.5+parameters.x/iResolution.x));

    // Margins
    //color1 *= step(0.2,fpos.y);

    fragColor = vec4(1.0-color1,1.0);
    if (fragColor.r <= 0.1) {
        discard;
    }
    fragColor = texture(texture0, texCoord);
    fragColor *= color;
}
