import {CGFobject, CGFtexture, CGFappearance} from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';

/**
 * MyFire
 * @constructor
 * @param scene 
 * @param numFlames 
 * @param numFlameGroups 
 * @param placementStartX 
 * @param placementEndX 
 * @param placementStartZ 
 * @param placementEndZ 
 * @param texture 
 */
export class MyFire extends CGFobject {
    constructor(scene, numFlames, numFlameGroups, placementStartX, placementEndX, placementStartZ, placementEndZ, texture) {
        super(scene);
        this.numFlames = numFlames;
        this.numFlameGroups = numFlameGroups;
        this.placementStartX = placementStartX;
        this.placementEndX = placementEndX;
        this.placementStartZ = placementStartZ;
        this.placementEndZ = placementEndZ;
        this.flamesGroups = [];
        this.flamesGroupBounds = [];
        this.activeGroups = [];
        this.extinguishPhase = [];
        this.flameTime = [];
        this.texture = texture;
        this.init();
    }
    randomNumber(min, max) {
        const num = Math.random() * (max - min) + min;
        return Math.round(num * 10) / 10;
    }

    init() {    
        const groupSizeX = (this.placementEndX - this.placementStartX) / 2;
        const groupSizeZ = (this.placementEndZ - this.placementStartZ) / (this.numFlameGroups/2);
        for(var i = 0; i<this.numFlameGroups/2;i++){
            let flames1 = [];
            let flames2 = [];
            for (var j=0; j<this.numFlames/this.numFlameGroups;j++){
                const flame = new MyTriangle(this.scene,10);
                const rand = Math.random();
                flames1.push({
                    obj: flame,
                    x: this.randomNumber(this.placementStartX ,this.placementStartX+groupSizeX),
                    z: this.randomNumber(this.placementStartZ+i*groupSizeZ,this.placementStartZ+(i+1)*groupSizeZ),
                    randomness: rand
                });
                flames2.push({
                    obj: flame,
                    x: this.randomNumber(this.placementStartX+groupSizeX,this.placementEndX),
                    z: this.randomNumber(this.placementStartZ+i*groupSizeZ,this.placementStartZ+(i+1)*groupSizeZ),
                    randomness: rand
                });
            }

            this.flamesGroups.push(flames1);
            this.flamesGroupBounds.push({
                xStart: this.placementStartX,
                xEnd: this.placementStartX + groupSizeX,
                zStart: this.placementStartZ + i * groupSizeZ,
                zEnd: this.placementStartZ + (i + 1) * groupSizeZ
            });

            this.flamesGroups.push(flames2);
            this.flamesGroupBounds.push({
                xStart: this.placementStartX + groupSizeX,
                xEnd: this.placementEndX,
                zStart: this.placementStartZ + i * groupSizeZ,
                zEnd: this.placementStartZ + (i + 1) * groupSizeZ
            });
            this.activeGroups.push(true); 
            this.extinguishPhase.push(false);
            this.activeGroups.push(true);
            this.extinguishPhase.push(false);
        } 
    }

    extinguish(t, groupidx){
        this.flameTime[groupidx] = t;
        this.extinguishPhase[groupidx] = true;
    }

    update(t){
        for (let idx = 0; idx < this.flamesGroups.length; idx++) {
            if (!this.extinguishPhase[idx]){
                continue;
            }else{
                if(this.activeGroups[idx]){
                    const elapsed = t - this.flameTime[idx];
                    if(elapsed >= 2000){
                        this.activeGroups[idx] = false;
                    }
                }
            }
       }
    }

    display(){

        for (let idx = 0; idx < this.flamesGroups.length; idx++) {
            if (!this.activeGroups[idx]) continue;

            const group = this.flamesGroups[idx];

            for (let flame of group) {
                this.scene.pushMatrix();
                this.scene.translate(flame.x, 0, flame.z);
                this.scene.scale(1.2, this.randomNumber(1.5, 2.5), this.randomNumber(1, 1.5));
                flame.obj.display();
                this.scene.popMatrix();
            }
        }
    }

}


