attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler1;
uniform float heightFactor;
uniform float timeFactor;


void main() {	

	vTextureCoord = aTextureCoord;

	vec4 waterMap = texture2D(uSampler1, aTextureCoord + vec2(0.005*timeFactor, 0.005*timeFactor));

	vec3 offset = waterMap.r * heightFactor * aVertexNormal;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);

}

