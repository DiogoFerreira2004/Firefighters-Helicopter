#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler1; 
uniform sampler2D uSampler2; 
uniform sampler2D uSampler3; 
uniform float timeFactor;
uniform int helipadState;    // 0 normal, 1 descolar, 2 aterrar

uniform float blinkInterval; 

void main() {
    vec4 colorH = texture2D(uSampler1, vTextureCoord);
    vec4 colorTarget;
    float blendFactor = 0.0;
    
    if (helipadState == 0) {
        gl_FragColor = colorH;
        return;
    } 
    else if (helipadState == 1) {
        colorTarget = texture2D(uSampler2, vTextureCoord); 
    }
    else if (helipadState == 2) {
        colorTarget = texture2D(uSampler3, vTextureCoord);
    }
    else {
        gl_FragColor = colorH;
        return;
    }

    float blinkCycle = mod(timeFactor, blinkInterval * 2.0);
    float phase = blinkCycle / (blinkInterval * 2.0); 
    blendFactor = 0.5 * (1.0 - cos(2.0 * 3.14 * phase)); 
    
    gl_FragColor = mix(colorH, colorTarget, blendFactor);
}