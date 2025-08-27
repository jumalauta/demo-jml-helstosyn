in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;
uniform float time;
uniform float fakeTime;
uniform float sScrollScale;
uniform float tiling;
uniform float kolor;


void main()
{
    vec2 coord=texCoord;
    
    coord.s=coord.s+fakeTime;

    fragColor = color*texture2D(texture0, coord);


}
