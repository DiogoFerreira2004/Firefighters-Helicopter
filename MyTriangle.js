import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene 
 */
export class MyTriangle extends CGFobject {
    constructor(scene, nDivs) {
        super(scene);
        this.nDivs = nDivs;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
             0, 1, 0   
        ];

        this.normals = [
            0, 0, 1
        ];

        this.texCoords = [
            0,5, 1
        ];


        for(let i = 1; i <= this.nDivs; i++){
            const x = 1 / this.nDivs * i;
            const y = 1-(1/this.nDivs*i);
            
            this.vertices.push(-x,y,0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 - x / 2, y);

            this.vertices.push(x,y,0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 + x / 2, y);    
        }

        this.indices = [
            0, 1, 2
        ];

        let index = 1; 
        for (let i = 1; i < this.nDivs; i++) {
            const currentLeft = index;       
            const currentRight = index + 1;  
            const nextLeft = index + 2;   
            const nextRight = index + 3;  

            this.indices.push(currentLeft, nextLeft, nextRight);
            this.indices.push(currentLeft, nextRight, currentRight);

            this.indices.push(nextRight, nextLeft, currentLeft);
            this.indices.push(currentRight, nextRight, currentLeft);

            index += 2;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

