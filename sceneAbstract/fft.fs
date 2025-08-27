in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0; // fft
uniform float timePercent;
uniform vec4 color;// = vec4(1);

void main()
{

    float intensity = 1.0;
    float zoom = 20.0;
    vec3 iResolution = vec3(1920.0,1080.0,16./9.);
    float fftHistory = 16.0;
    float threshold = 1.0;
//fragColor = texture2D(texture0, vec2(timePercent, texCoord.t));
    // Horizontal bars

    float mval = 0.0;
    float mvalDecay = 0.0;
    float mavg = 0.0;
    float mcur = texture2D(texture0, vec2(texCoord.x, 1.0)).r;

    /*for (int i = 0; i < fftHistory; i++) {
        float percent = i/fftHistory;
        vec2 coordHistory = vec2(texCoord.x, percent);

        mavg += texture2D(texture0, coordHistory).r;

        mval = max(texture2D(texture0, coordHistory).r, mval);
        mvalDecay = max(texture2D(texture0, coordHistory).r*smoothstep(0.0,1.0,percent), mvalDecay);
    }
    mavg /= fftHistory;

    if (texCoord.y <= mval) {
        fragColor = vec4(vec3(mvalDecay),1.0);
    }*/

    float prec = 0.003;
/*
    if (texCoord.y > mvalDecay-prec && texCoord.y < mvalDecay+prec) {
        fragColor = vec4(1,1,0,1);
    }

    if (texCoord.y > mval-prec && texCoord.y < mval+prec) {
        fragColor = vec4(1,0,0,1);
    }

    if (texCoord.y > mavg-prec && texCoord.y < mavg+prec) {
        fragColor = vec4(1,0,1,1);
    }

    if (texCoord.y > mcur-prec && texCoord.y < mcur+prec) {
        fragColor = vec4(0.5,1,1,1);
    }

    if (1.0-texCoord.y > 1.0-mcur-prec && 1.0-texCoord.y < 1.0-mcur+prec) {
        fragColor = vec4(0.5,1,1,1);
    }
*/
    if (fragColor.r <= threshold) {
        //circle visualization

        //vec2 coord = (texCoord.yx-vec2(.5,.5))/vec2(iResolution.z,1.0)/zoom;
        vec2 coord = (texCoord.yx-vec2(.5,.5))/zoom;

        //float tcur = texture2D(texture0, texCoord).r;

        float r = length(coord);


        float c = 0.0;
        for (float i = 0.0; i < fftHistory; i++) {
            float percent = i/fftHistory;
            c = mix(0.0, 1.0, (texture2D(texture0, vec2(percent, r)).r)*intensity*(percent));
        }

//fragColor = texture2D(texture0, vec2(timePercent, texCoord.t));
fragColor = texture2D(texture0, vec2(timePercent, r));
//grayscale
fragColor.rgb = vec3((fragColor.r+fragColor.g+fragColor.b)/3.0);
    float fadeStart = 0.0;
    float fadeEnd = 0.3;
    float fade = smoothstep(fadeStart, fadeEnd, distance(texCoord,vec2(0.5, 0.5)));
    fragColor.a = 1.0-fade;


        //fragColor = mix(vec4(0),vec4(1.0),vec4(vec3(c-r),c*1.0))*color;
    } else {
    discard;
    }
}
