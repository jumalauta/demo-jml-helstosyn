in vec2 texCoord;
out vec4 fragColor;

void main()
{
    float fadeStart = 0.1;
    float fadeEnd = 1.0;

    float fade = smoothstep(fadeStart, fadeEnd, distance(texCoord,vec2(0.5, 0.5)));
    fragColor = vec4(0.,0.,0.,fade); 
}
