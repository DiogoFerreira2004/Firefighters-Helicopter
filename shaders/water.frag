#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler2;
uniform float timeFactor;


void main() {

	vec4 water = texture2D(uSampler2, vTextureCoord + vec2(0.003*timeFactor, 0.004*timeFactor));
	
	gl_FragColor = water;
}