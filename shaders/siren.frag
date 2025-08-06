#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform int sirenActive;     // 0 inativo, 1 ativo 
 


void main() {
    float intensity = 0.25;

    if (sirenActive == 1) {
        intensity = 0.3 + 0.7 * abs(sin(timeFactor * 5.0));
    }

    vec3 finalColor = vec3(1.0,0.0,0.0) * intensity;
    gl_FragColor = vec4(finalColor, 1.0);
}