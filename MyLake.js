import {CGFobject, CGFtexture, CGFappearance} from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';
/**
 * MyLake
 * @constructor
 * @param scene 
 */
export class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);
        this.plane = new MyPlane(scene,10);

        this.xStart = 40;
        this.xEnd = 80;
        this.zStart = -10;
        this.zEnd = 15;
    }

    display(){

        const scaleX = this.xEnd-this.xStart;
        const scaleZ = this.zEnd-this.zStart

        const translateX = this.xStart + scaleX*0.5;
        const translateZ = this.zStart + scaleZ*0.5;

        this.scene.pushMatrix();
        this.scene.translate(translateX, 0.04, translateZ);
        this.scene.scale(scaleX,1,scaleZ);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.plane.display();
        this.scene.popMatrix();
    }

}


