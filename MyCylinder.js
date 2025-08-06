import { CGFobject } from '../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 * @param scene 
 * @param slices 
 * @param stacks 
 * @param caps 
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks, caps = true) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.caps = caps;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var alphaAng = 2*Math.PI/this.slices;

        for (var stack = 0; stack <= this.stacks; stack++) {
            var z = stack / this.stacks
            
            for(var slice = 0; slice < this.slices; slice++){
                var ang = slice * alphaAng;

                var sa=Math.sin(ang);
                var ca=Math.cos(ang);

                this.vertices.push(ca, sa, z);
                
                var normal= [	
                    ca,	
                    sa,
                    0
                ];

                this.normals.push(...normal);
                this.texCoords.push(slice/this.slices, z);

                if (stack < this.stacks) {
                    const baseIndex = stack * this.slices + slice;
                    const nextStackIndex = (stack + 1) * this.slices + slice;
                    
                    const nextSlice = (slice + 1) % this.slices;
                
                    const baseNext = stack * this.slices + nextSlice;
                    const nextStackNext = (stack + 1) * this.slices + nextSlice;
                
                    this.indices.push(baseIndex, nextStackIndex, baseNext);
                    this.indices.push(baseNext, nextStackIndex, nextStackNext);
                    this.indices.push(baseNext, nextStackIndex, baseIndex);
                    this.indices.push(nextStackNext, nextStackIndex, baseNext);
                }
                
            }
        }

        if (this.caps) {
            var topCenterIndex = this.vertices.length / 3;
            this.vertices.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5, 0.5);

            for (var slice = 0; slice < this.slices; slice++) {
                var ang = slice * alphaAng;
                var sa = Math.sin(ang);
                var ca = Math.cos(ang);
                
                this.vertices.push(ca, sa, 1);
                this.normals.push(0, 0, 1);
                this.texCoords.push(0.5 + 0.5 * ca, 0.5 + 0.5 * sa);
            }

            for (var slice = 0; slice < this.slices; slice++) {
                var nextSlice = (slice + 1) % this.slices;
                this.indices.push(
                    topCenterIndex,
                    topCenterIndex + 1 + slice,
                    topCenterIndex + 1 + nextSlice
                );
            }

            var bottomCenterIndex = this.vertices.length / 3;
            this.vertices.push(0, 0, 0); 
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5, 0.5);

            for (var slice = 0; slice < this.slices; slice++) {
                var ang = slice * alphaAng;
                var sa = Math.sin(ang);
                var ca = Math.cos(ang);
                
                this.vertices.push(ca, sa, 0);
                this.normals.push(0, 0, -1);
                this.texCoords.push(0.5 + 0.5 * ca, 0.5 + 0.5 * sa);
            }

            for (var slice = 0; slice < this.slices; slice++) {
                var nextSlice = (slice + 1) % this.slices;
                this.indices.push(
                    bottomCenterIndex,
                    bottomCenterIndex + 1 + nextSlice,
                    bottomCenterIndex + 1 + slice
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); 
        this.initBuffers();
        this.initNormalVizBuffers();
    }
    
    }