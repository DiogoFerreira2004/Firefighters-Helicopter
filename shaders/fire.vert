attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
varying vec4 vTransformedPos;

void main() {
    
    float intensity = pow(2.0, 4.0 * aVertexPosition.y / 10.0) - 1.0;

    vec3 offset = vec3(1.5,0.0,1.5) * intensity * sin(timeFactor + aVertexPosition.y * 2.0);

    vec3 animatedPosition = aVertexPosition + offset;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(animatedPosition, 1.0);

    vTextureCoord = aTextureCoord;  
}
