import {CGFobject, CGFtexture, CGFappearance} from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyWaterDrop 
 * @constructor
 * @param {CGFscene} scene 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {CGFtexture} waterTexture 
 */
export class MyWaterDrop extends CGFobject {
    constructor(scene, x, y, z, waterTexture) {
        super(scene);
        
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.groundY = 0.1;
        
        this.active = false;
        this.animationProgress = 0; 
        this.animationDuration = 2000; 
        this.startTime = 0;
        
        this.waterTexture = waterTexture;
        this.waterAppearance = new CGFappearance(this.scene);
        this.waterAppearance.setTexture(this.waterTexture);
        this.waterAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.waterAppearance.setAmbient(0.3, 0.3, 0.9, 0.7);
        this.waterAppearance.setDiffuse(0.3, 0.3, 0.9, 0.7);
        this.waterAppearance.setSpecular(0.9, 0.9, 1.0, 0.9);
        this.waterAppearance.setShininess(50);
        
        this.splashStartTime = 0;
        this.splashDuration = 1500; 
        this.splashActive = false;
        this.splashRadius = 0;
        this.maxSplashRadius = 10; 
        
        this.quad = new MyQuad(this.scene);
        this.triangle = new MyTriangle(this.scene,1);
        
        this.numDroplets = 30;
        this.droplets = [];
        this.initDroplets();
    }
    
    initDroplets() {
        for (let i = 0; i < this.numDroplets; i++) {
           
            this.droplets.push({
                offsetX: (Math.random() - 0.5) * 4,
                offsetZ: (Math.random() - 0.5) * 4,
                speed: 0.5 + Math.random() * 1.5, 
                size: 0.5 + Math.random() * 1.5, 
                rotationY: Math.random() * Math.PI * 2,
                delay: Math.random() * 300 
            });
        }
    }
    
    start(currentTime, x, y, z) {
        this.active = true;
        this.animationProgress = 0;
        this.startTime = currentTime;
        this.splashActive = false;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    update(currentTime) {
        if (!this.active) return;
        
        const elapsed = currentTime - this.startTime;
        this.animationProgress = Math.min(elapsed / this.animationDuration, 1);
        
        if (this.animationProgress >= 0.7 && !this.splashActive) {
            this.splashActive = true;
            this.splashStartTime = currentTime;
            this.splashRadius = 0;
        }
        
        if (this.splashActive) {
            const splashElapsed = currentTime - this.splashStartTime;
            this.splashRadius = Math.min(splashElapsed / this.splashDuration, 1) * this.maxSplashRadius;
        }
        
        if (this.animationProgress >= 1 && this.splashRadius >= this.maxSplashRadius) {
            this.active = false;
        }
    }
    
    display() {
        if (!this.active) return;
        
        this.waterAppearance.apply();
        
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        
        for (let i = 0; i < this.numDroplets; i++) {
            const droplet = this.droplets[i];
            
            const adjustedProgress = Math.max(0, Math.min(1, (this.animationProgress * this.animationDuration - droplet.delay) / this.animationDuration));
            
            if (adjustedProgress <= 0) continue;
            
            const currentY = this.y - (this.y - this.groundY) * adjustedProgress;
            
            const scale = 1 + adjustedProgress * 0.5;
            
            const opacity = 0.9 - adjustedProgress * 0.6;
            this.waterAppearance.setDiffuse(0.3, 0.3, 0.9, opacity);
            
            this.scene.pushMatrix();
            this.scene.translate(
                this.x + droplet.offsetX * adjustedProgress * 2, 
                currentY, 
                this.z + droplet.offsetZ * adjustedProgress * 2
            );
            this.scene.rotate(droplet.rotationY, 0, 1, 0);
            this.scene.scale(droplet.size * scale, droplet.size, droplet.size * scale);
            this.quad.display();
            this.scene.popMatrix();
        }
        
        if (this.splashActive) {
            const splashOpacity = 0.7 * (1 - (this.splashRadius / this.maxSplashRadius));
            this.waterAppearance.setDiffuse(0.3, 0.6, 0.9, splashOpacity);
            
            this.scene.pushMatrix();
            this.scene.translate(this.x, this.groundY + 0.05, this.z);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0); 
            this.scene.scale(this.splashRadius, this.splashRadius, 1);
            this.quad.display();
            this.scene.popMatrix();
        }
        
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}