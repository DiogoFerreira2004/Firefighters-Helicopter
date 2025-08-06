import { CGFappearance, CGFtexture } from '../lib/CGF.js';

export class MyWindow {
    /**
     * @constructor
     * @param {CGFscene} scene
     * @param {CGFtexture} textureObject 
     */
    constructor(scene, textureObject) { 
        this.scene = scene;
        this.texture = textureObject; 

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setShininess(10.0);

        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT'); 
    }

    apply() {
        this.appearance.apply();
    }
}