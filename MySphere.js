import {CGFobject} from '../lib/CGF.js';
/**
* MySphere
* @constructor
 * @param scene 
 * @param radius 
 * @param stacks 
 * @param slices 
 * @param inverted 

*/
export class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks, inverted) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.inverted = inverted;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        var slicesAng = 2*Math.PI/this.slices;
        var stacksAng = Math.PI / this.stacks; 

        for (var stack = 0; stack <= this.stacks; stack++) {
            var alphaAng = Math.PI / 2 -  stack * stacksAng;
            var y = this.radius * Math.sin(alphaAng);       
            var v = stack / this.stacks;  
            
            for(var slice = 0; slice <= this.slices; slice++){
                var thetaAng = slice * slicesAng;
                let x = this.radius * Math.cos(alphaAng) * Math.cos(thetaAng);
                let z = this.radius * Math.cos(alphaAng) * Math.sin(thetaAng);
                var u = slice / this.slices;
                
                this.vertices.push(x, y, z);
                
                if (this.radius == 1) {
                    if (this.inverted) {
                        this.normals.push(-x, -y, -z);
                    } 
                    else 
                    {
                        this.normals.push(x, y, z);
                    }
                }
                else 
                {   
                    let len = Math.sqrt(x*x + y*y + z*z);
                    if (this.inverted) {
                        this.normals.push(-x / len, -y / len, -z / len);
                    }
                    else
                    {
                        this.normals.push(x / len, y / len, z / len);
                    }
                }

                this.texCoords.push(1-u, v);
            }
        }
        
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let current = stack * (this.slices + 1) + slice;
                let next = current + this.slices + 1;
        
                if (stack !== 0) {
                    if (this.inverted) {
                        this.indices.push(current, next, current + 1);
                    }
                    else {
                        this.indices.push(current + 1, next, current);
                    }
                }
                if (stack !== this.stacks - 1) {
                    if (this.inverted) {
                        this.indices.push(current + 1, next, next+1);
                    }
                    else {
                        this.indices.push(next + 1, next, current + 1);
                    }
                }
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}


