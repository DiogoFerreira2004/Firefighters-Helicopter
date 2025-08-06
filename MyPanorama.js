import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
/**
* MyPanorama
* @constructor
 * @param scene 
 * @param texture 

*/
export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;
        this.sphere = new MySphere(this.scene, 300, 30, 30, true);

        this.panoramaAppearance = new CGFappearance(this.scene);
        this.panoramaAppearance.setTexture(this.texture);
        this.panoramaAppearance.setAmbient(0, 0, 0, 1);
        this.panoramaAppearance.setDiffuse(0, 0, 0, 1);
        this.panoramaAppearance.setSpecular(0, 0, 0, 1);
        this.panoramaAppearance.setEmission(0.9,0.9, 0.9, 1);
    }

    display(){
        const position = this.scene.camera.position;
        this.scene.pushMatrix();
        this.scene.translate(position[0], position[1]-12, position[2]);
            this.panoramaAppearance.apply();
            this.sphere.display();
        this.scene.popMatrix();
    }

}


