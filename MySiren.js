
import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MySphere } from './MySphere.js';

/**
 * MySiren 
 * @constructor
 * @param scene 
 */
export class MySiren extends CGFobject {
    constructor(scene) {
        super(scene);
        this.dome = new MySphere(scene, 1, 20, 20, false);
    }
    
    
    display() {        
        this.scene.pushMatrix();
        this.scene.scale(0.5, 0.5, 0.5);
        this.scene.scale(1, 0.5, 1);
        this.dome.display();
        this.scene.popMatrix();       
    }
}