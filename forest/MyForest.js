import {CGFobject, CGFtexture} from '../../lib/CGF.js';
import {MyTree} from './MyTree.js';
/**
* MyForest
* @constructor
 * @param scene 
 * @param numTrees 
 * @param placementStartX 
 * @param placementEndX 
 * @param placementStartZ 
 * @param placementEndZ
*/
export class MyForest extends CGFobject {
    constructor(scene, numTrees, placementStartX, placementEndX, placementStartZ, placementEndZ) {
        super(scene);
        this.numTrees = numTrees;
        this.placementStartX = placementStartX;
        this.placementEndX = placementEndX;
        this.placementStartZ = placementStartZ;
        this.placementEndZ = placementEndZ;
        this.trees = [];
        this.init();       
    }

    randomNumber(min, max) {
        const num = Math.random() * (max - min) + min;
        return Math.round(num * 10) / 10;
    }
    
    init() {    
        const copaTexture = new CGFtexture(this.scene,'images/copa.jpg');
        const troncoTexture = new CGFtexture(this.scene,'images/tronco.jpg');   
        
        for (var i=0; i<this.numTrees;i++){
            const axis = Math.random() < 0.5 ? 'X' : 'Z';
            const tree = new MyTree(this.scene, this.randomNumber(0,10), axis, this.randomNumber(0.8,1.5), this.randomNumber(6,12), troncoTexture, copaTexture);
            this.trees.push({
                obj: tree,
                x: this.randomNumber(this.placementStartX,this.placementEndX),
                z: this.randomNumber(this.placementStartZ,this.placementEndZ)
            });
        }
            
    }
      

    display()
    {       
        
        for (var i=0; i<this.numTrees;i++){
            this.scene.pushMatrix();
            this.scene.translate(this.trees[i].x, 0, this.trees[i].z);
            this.trees[i].obj.display();
            this.scene.popMatrix();
        }
            
    }

}


