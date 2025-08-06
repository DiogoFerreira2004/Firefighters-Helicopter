import {CGFobject, CGFtexture, CGFappearance} from '../../lib/CGF.js';
import {MyCone} from './MyCone.js';
import {MyPyramid} from './MyPyramid.js';
/**
* MyTree
* @constructor
 * @param scene 
 * @param rotAng 
 * @param rotAxis 
 * @param radius 
 * @param height 
 * @param troncoTexture
 * @param copaTexture
*/
export class MyTree extends CGFobject {
    constructor(scene, rotAng, rotAxis, radius, height, troncoTexture, copaTexture) {
        super(scene);
        this.rotAng = rotAng;   
        this.rotAxis = rotAxis;
        this.radius = radius;
        this.height = height;
        this.troncoTexture = troncoTexture;
        this.copaTexture = copaTexture;

        this.tronco = new MyCone(scene, 15, 1);
        this.pyramids = [];
        this.setupCopa();
        const pyramidHeight = 0;

  
        this.copaAppearance = new CGFappearance(scene);
        this.copaAppearance.setTexture(this.copaTexture);
        this.copaAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.troncoAppearance = new CGFappearance(scene);
        this.troncoAppearance.setTexture(this.troncoTexture);
        this.troncoAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    setupCopa(){
        const copaHeight = 0.8 * this.height
        const numPyramids = Math.min(Math.max(1,Math.ceil(copaHeight/2)),6)
        this.pyramidHeight = copaHeight / numPyramids

        for(var i = 0; i < numPyramids; i++){
            const pyramid = new MyPyramid(this.scene,8,1)
            this.pyramids.push({
                obj: pyramid,
                scale: this.radius * 1.6 - i * (0.8/ numPyramids),
                yOffset: copaHeight * 0.2 + i
              });
        }
    }

    display(){
        this.scene.pushMatrix();

        if (this.rotAxis === 'X') {
            this.scene.rotate(this.rotAng * Math.PI / 180, 1, 0, 0);
          } else if (this.rotAxis === 'Z') {
            this.scene.rotate(this.rotAng * Math.PI / 180, 0, 0, 1);
          }

        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.height * 0.5, this.radius);
        this.troncoAppearance.apply();
        this.tronco.display();
        this.scene.popMatrix();

        for (const pyramid of this.pyramids){
            this.scene.pushMatrix();
            this.scene.translate(0, pyramid.yOffset, 0);
            this.scene.scale(pyramid.scale, this.pyramidHeight, pyramid.scale);
            this.copaAppearance.apply();
            pyramid.obj.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();

    }

}


