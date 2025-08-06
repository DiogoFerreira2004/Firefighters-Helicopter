import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { MyCylinder } from './MyCylinder.js';
import { MyQuad } from './MyQuad.js';
import { MyPyramid } from './forest/MyPyramid.js';

/**
 * MyHeli
 * @constructor
 * @param scene 
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
        
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.orientation = 0; 
        this.velocity = [0, 0, 0]; 
        this.pitchAngle = 0;
        
        this.length = 10;        
        this.cabinRadius = 1.5;
        this.tailLength = 4;     
        this.mainRotorRadius = 4;
        this.tailRotorRadius = 1.0;
        
        this.cruisingAltitude = 25;  
        this.landingAltitude = 15;   
        this.waterAltitude = 2;      
        
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.rotationSpeed = 0;          
        this.maxRotationSpeed = 5;       
        this.verticalSpeed = 0;          
        this.maxVerticalSpeed = 0.2;     
        
        this.isFlying = false;           
        this.isAutoFlying = false;       
        this.targetX = 0;                
        this.targetZ = 0;                
        this.targetY = 0;                
        this.autoFlightType = "none";    
        
        this.bucketDeployed = false;
        this.bucketFilled = false;
        
        this.lakeXStart = 0;
        this.lakeXEnd = 0;
        this.lakeZStart = 0;
        this.lakeZEnd = 0;
        
        this.initMaterials();
    }
    
    initBuffers() {
        this.sphere = new MySphere(this.scene, 1, 20, 20, false);
        this.cylinder = new MyCylinder(this.scene, 20, 20);
        this.bucketCylinder = new MyCylinder(this.scene, 20, 20, false);
        this.quad = new MyQuad(this.scene);
        this.pyramid = new MyPyramid(this.scene, 4, 1);
    }
    
    initMaterials() {
        
        this.cabinMaterial = new CGFappearance(this.scene);
        this.cabinMaterial.setAmbient(0.05, 0.05, 0.05, 1.0);
        this.cabinMaterial.setDiffuse(0.1, 0.1, 0.1, 1.0);
        this.cabinMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.cabinMaterial.setShininess(80);
        
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.1, 0.1, 0.2, 0.8);
        this.glassMaterial.setDiffuse(0.2, 0.2, 0.3, 0.7);
        this.glassMaterial.setSpecular(0.8, 0.8, 0.9, 1.0);
        this.glassMaterial.setShininess(120);
        
        this.metalMaterial = new CGFappearance(this.scene);
        this.metalMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.metalMaterial.setDiffuse(0.7, 0.7, 0.7, 1.0);
        this.metalMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.metalMaterial.setShininess(100);
        
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(0.05, 0.05, 0.05, 1.0);
        this.tailMaterial.setDiffuse(0.1, 0.1, 0.1, 1.0);
        this.tailMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.tailMaterial.setShininess(80);
        
        this.rotorMaterial = new CGFappearance(this.scene);
        this.rotorMaterial.setAmbient(0.02, 0.02, 0.02, 1.0);
        this.rotorMaterial.setDiffuse(0.05, 0.05, 0.05, 1.0);
        this.rotorMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.rotorMaterial.setShininess(30);
        
        this.landingGearMaterial = new CGFappearance(this.scene);
        this.landingGearMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.landingGearMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.landingGearMaterial.setSpecular(0.7, 0.7, 0.7, 1.0);
        this.landingGearMaterial.setShininess(50);
        
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.2, 0.1, 0.0, 1.0);
        this.bucketMaterial.setDiffuse(0.7, 0.4, 0.0, 1.0);
        this.bucketMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bucketMaterial.setShininess(20);
        
        this.water = new CGFtexture(this.scene, "images/waterTex.jpg");
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setTexture(this.water);
    }
    
    update(t, deltaT) {
        const deltaTimeInSeconds = deltaT / 1000;
        
        if (this.isAutoFlying) {
            this.updateAutoFlight(deltaTimeInSeconds);
        }
        
        this.x += this.velocity[0] * deltaTimeInSeconds;
        this.y += this.velocity[1] * deltaTimeInSeconds;
        this.z += this.velocity[2] * deltaTimeInSeconds;
        
        if (this.isFlying && this.rotationSpeed < this.maxRotationSpeed) {
            this.rotationSpeed += 0.1;
        } else if (!this.isFlying && this.rotationSpeed > 0) {
            this.rotationSpeed -= 0.1;
            if (this.rotationSpeed < 0) this.rotationSpeed = 0;
        }
        
        this.mainRotorAngle += this.rotationSpeed * deltaTimeInSeconds;
        this.tailRotorAngle += this.rotationSpeed * 2 * deltaTimeInSeconds;
        
        this.mainRotorAngle %= (2 * Math.PI);
        this.tailRotorAngle %= (2 * Math.PI);
        
        if (this.isFlying && this.y > this.cruisingAltitude * 0.8 && !this.bucketDeployed) {
            this.bucketDeployed = true;
        }

        else if (this.y < this.landingAltitude * 1.1 && this.bucketDeployed && 
                 this.autoFlightType === "landing") {
            this.bucketDeployed = false;
            this.bucketFilled = false;
        }
        
        if (Math.abs(this.velocity[0]) < 0.01 && Math.abs(this.velocity[2]) < 0.01) {
            if (this.pitchAngle > 0.01) this.pitchAngle -= 0.01;
            else if (this.pitchAngle < -0.01) this.pitchAngle += 0.01;
            else this.pitchAngle = 0;
        }
    }
    
    updateAutoFlight(deltaTime) {
        switch (this.autoFlightType) {
            case "takeoff":
                this.updateTakeoff(deltaTime);
                break;
            case "landing":
                this.updateLanding(deltaTime);
                break;
            case "water":
                this.updateWaterOperation(deltaTime);
                break;
            case "waterAscend":
                this.updateWaterOperation(deltaTime);
        }
    }
    
    updateTakeoff(deltaTime) {
        if (this.verticalSpeed < this.maxVerticalSpeed) {
            this.verticalSpeed += 0.01;
        }
        
        this.y += this.verticalSpeed;
        
        if (this.y >= this.cruisingAltitude) {
            this.y = this.cruisingAltitude;
            this.isAutoFlying = false;
            this.autoFlightType = "none";
            this.verticalSpeed = 0;
            this.velocity = [0, 0, 0]; 
        }
    }
    
    updateLanding(deltaTime) {
        const distanceX = Math.abs(this.x - this.targetX);
        const distanceZ = Math.abs(this.z - this.targetZ);
        
        if (distanceX > 1 || distanceZ > 1) {
            const dirX = this.targetX - this.x;
            const dirZ = this.targetZ - this.z;
            const targetOrientation = Math.atan2(dirX, dirZ);

            if(this.orientation != targetOrientation){
                this.velocity = [0, 0, 0]; 
                let angleDiff = targetOrientation - this.orientation;
                
                angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                
                const rotationSpeed = 0.05; 
                
                if (Math.abs(angleDiff) > 0.05) {
                    this.orientation += Math.sign(angleDiff) * rotationSpeed;
                }
                else{
                    this.orientation = targetOrientation;
                }
            }
            else{
                const distance = Math.sqrt(dirX * dirX + dirZ * dirZ);
                
                const speed = 150 * deltaTime; 
                this.velocity[0] = dirX / distance * speed;
                this.velocity[2] = dirZ / distance * speed;
                
                if (this.y < this.cruisingAltitude) {
                    this.y += 0.1;
                } else if (this.y > this.cruisingAltitude) {
                    this.y -= 0.1;
                }

                this.orientation = targetOrientation;
            }
        } 
        else {
            this.velocity = [0, 0, 0]; 
            
            this.x = this.targetX;
            this.z = this.targetZ;

            if(this.orientation != 0){
                let angleDiff = - this.orientation;
                angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                
                const rotationSpeed = 0.05; 
                
                if (Math.abs(angleDiff) > 0.05) {
                    this.orientation += Math.sign(angleDiff) * rotationSpeed;
                }
                else{
                    this.orientation = 0;
                }
            }
            else{
                if (this.y > this.targetY + 0.01) {
                    const rate = Math.min(0.2, (this.y - this.targetY) * 0.1);
                    this.y -= rate;
                } else {
                    this.y = this.targetY;
                    this.isAutoFlying = false;
                    this.autoFlightType = "none";
                    this.isFlying = false;
                    this.reset();
                }
            }
        }
    }
    
    updateWaterOperation(deltaTime) {
        const distanceX = Math.abs(this.x - this.targetX);
        const distanceZ = Math.abs(this.z - this.targetZ);
        
        if (distanceX > 1 || distanceZ > 1) {
            const dirX = this.targetX - this.x;
            const dirZ = this.targetZ - this.z;
            const distance = Math.sqrt(dirX * dirX + dirZ * dirZ);
            
            const speed = 100 * deltaTime; 
            this.velocity[0] = dirX / distance * speed;
            this.velocity[2] = dirZ / distance * speed;
            
            this.orientation = Math.atan2(dirX, dirZ);
        } 

        else {
            this.velocity = [0, 0, 0]; 
            
            this.x = this.targetX;
            this.z = this.targetZ;
            
            if (this.autoFlightType === "water" && !this.bucketFilled) {
                
                if (this.y > this.waterAltitude) {
                    this.y -= 0.2;
                } else {
                    this.bucketFilled = true;
                    
                }
            } 
            else if (this.autoFlightType === "waterAscend") {
                if (this.y < this.cruisingAltitude) {
                    this.y += 0.25;
                } else {
                    this.y = this.cruisingAltitude;
                    this.isAutoFlying = false;
                    this.autoFlightType = "none";
                }
            }
        }
    }
    
    turn(v) {
        this.orientation += v;
        
        const speed = Math.sqrt(
            this.velocity[0] * this.velocity[0] + 
            this.velocity[2] * this.velocity[2]
        );
        
        if (speed > 0.001) {
            this.velocity[0] = speed * Math.sin(this.orientation);
            this.velocity[2] = speed * Math.cos(this.orientation);
        }
    }
    
    accelerate(v) {
        if (!this.isFlying || this.isAutoFlying) return;
        
        const currentSpeed = Math.sqrt(
            this.velocity[0] * this.velocity[0] + 
            this.velocity[2] * this.velocity[2]
        );
        
        let currentDirection = 0;
        if (currentSpeed > 0.001) {
            const forwardDot = this.velocity[0] * Math.sin(this.orientation) + 
                            this.velocity[2] * Math.cos(this.orientation);
            currentDirection = forwardDot >= 0 ? 1 : -1;
        }
        
        const signedSpeed = currentSpeed * currentDirection;
        const newSignedSpeed = signedSpeed + v;
        
        if (v > 0) {
            this.pitchAngle = Math.min(this.pitchAngle + 0.05, Math.PI/12); 
        } else if (v < 0) {
            this.pitchAngle = Math.max(this.pitchAngle - 0.05, -Math.PI/12); 
        }
        
        const newSpeed = Math.abs(newSignedSpeed);
        const direction = newSignedSpeed >= 0 ? 1 : -1;
        
        this.velocity[0] = direction * newSpeed * Math.sin(this.orientation);
        this.velocity[2] = direction * newSpeed * Math.cos(this.orientation);
    }

    
    
    takeOff() {
        if (!this.isFlying) {
            this.isFlying = true;
            this.isAutoFlying = true;
            this.autoFlightType = "takeoff";
            this.verticalSpeed = 0.05; 
        }
    }
    
    land() {
        if (this.isFlying) {
            this.isAutoFlying = true;
            this.autoFlightType = "landing";
            
            this.targetX = 35; 
            this.targetZ = -42.5;
            this.targetY = 16.8; 
        }
    }
    
    goToWater() {
        if (this.isFlying && !this.bucketFilled) {
            this.isAutoFlying = true;
            this.autoFlightType = "water";
            
            this.targetX = (this.lakeXStart + this.lakeXEnd) / 2;
            this.targetZ = (this.lakeZStart + this.lakeZEnd) / 2;            
            this.targetY = this.waterAltitude;
        }
    }
    
    dropWater() {
        if (this.bucketFilled) {
            this.bucketFilled = false;
            return true; 
        }
        return false; 
    }
    
    reset() {
        this.x = 35; 
        this.y = 16.8;
        this.z = -42.5;
        this.orientation = 0;
        this.pitchAngle = 0;
        this.velocity = [0, 0, 0];
        this.verticalSpeed = 0;
        this.bucketDeployed = false;
        this.bucketFilled = false;
        this.isFlying = false;
        this.isAutoFlying = false;
        this.autoFlightType = "none";
        this.rotationSpeed = 0;
    }
    
    setLakePosition(xStart,Xend, zStart, zEnd) {
        this.lakeXStart = xStart;
        this.lakeXEnd = Xend;
        this.lakeZStart = zStart;
        this.lakeZEnd = zEnd;
    }
    
    setCruisingAltitude(altitude) {
        this.cruisingAltitude = altitude;
    }
    
    display() {
        this.scene.pushMatrix();
        
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.rotate(this.pitchAngle, 1, 0, 0);
        
        this.scene.scale(0.8, 0.8, 0.8);
        
        this.cabinMaterial.apply();
        this.scene.pushMatrix();
        this.scene.scale(this.cabinRadius, this.cabinRadius, this.cabinRadius * 2.0);
        this.sphere.display();
        this.scene.popMatrix();
        
        this.glassMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, this.cabinRadius * 0.2, this.cabinRadius * 1.3);
        this.scene.rotate(Math.PI/12, 1, 0, 0); 
        this.scene.scale(this.cabinRadius * 0.8, this.cabinRadius * 0.7, this.cabinRadius * 0.8);
        this.sphere.display();
        this.scene.popMatrix();
        
        this.tailMaterial.apply();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.cabinRadius * 1.0 - 2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(this.cabinRadius * 0.3, this.tailLength, this.cabinRadius * 0.3); 
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.rotorMaterial.apply();
        
        this.scene.pushMatrix();
        this.scene.translate(this.cabinRadius * 0.3 - 0.7, this.cabinRadius * 0.5 - 0.6, -this.tailLength - this.cabinRadius * 0.5 - 2.5);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(this.cabinRadius * 0.18, this.cabinRadius * 0.18, this.cabinRadius * 0.35); 
        this.cylinder.display();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1.0); 
        this.scene.rotate(this.tailRotorAngle, 1, 0, 0); 
        
        this.scene.pushMatrix();
        this.scene.scale(0.6, 0.6, 0.6); 
        this.sphere.display();
        this.scene.popMatrix();
        
        
        for (let i = 0; i < 2; i++) {
            this.scene.pushMatrix();
            this.scene.rotate(i * Math.PI, 0, 1, 0); 
            this.scene.scale(0.08, this.tailRotorRadius * 3.5, 0.08); 
            this.cylinder.display(); 
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix(); 
        this.scene.popMatrix(); 
        
        this.metalMaterial.apply();
        
        this.scene.pushMatrix();
        this.scene.translate(0, this.cabinRadius * 1.0, 0);
        this.scene.scale(this.cabinRadius * 0.1, this.cabinRadius * 0.3, this.cabinRadius * 0.1);
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, this.cabinRadius * 1.2, 0);
        this.scene.scale(this.cabinRadius * 0.15, this.cabinRadius * 0.1, this.cabinRadius * 0.15);
        this.sphere.display();
        this.scene.popMatrix();
        
        this.rotorMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, this.cabinRadius * 1.25, 0);
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        
        for (let i = 0; i < 2; i++) {
            this.scene.pushMatrix();
            this.scene.rotate(i * Math.PI, 0, 1, 0);
            
            this.scene.rotate(Math.PI/2, 0, 0, 1); 
            this.scene.scale(0.045, this.mainRotorRadius * 1.5, 0.25); 
            this.cylinder.display();
            
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
        
        this.landingGearMaterial.apply();
        
        const skidOffset = this.cabinRadius * 0.9;  
        const skidHeight = -this.cabinRadius * 1.2;
        const skidLength = this.cabinRadius * 2.8;
        const skidRadius = this.cabinRadius * 0.06;
        
        this.scene.pushMatrix();
        this.scene.translate(-skidOffset + 0.3, skidHeight - 0.3, -2.3);
        this.scene.rotate(0, 0, 1, 0);
        this.scene.scale(skidRadius, skidRadius, skidLength);
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(skidOffset - 0.3, skidHeight - 0.3, -2.3);
        this.scene.rotate(0, 0, 1, 0);
        this.scene.scale(skidRadius, skidRadius, skidLength);
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-this.cabinRadius + 0.5, -this.cabinRadius * 0.8, this.cabinRadius - 0.3);
        this.scene.rotate(Math.PI/6, 1, 0, 0);
        this.scene.scale(0.1, this.cabinRadius * 0.8, 0.1);
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(this.cabinRadius - 0.5, -this.cabinRadius * 0.8, this.cabinRadius - 0.3);
        this.scene.rotate(Math.PI/6, 1, 0, 0);
        this.scene.scale(0.1, this.cabinRadius * 0.8, 0.1);
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-this.cabinRadius + 0.5, -this.cabinRadius * 0.8, -this.cabinRadius);
        this.scene.rotate(-Math.PI/6, 1, 0, 0);
        this.scene.scale(0.1, this.cabinRadius * 0.8, 0.1);
        this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(this.cabinRadius - 0.5, -this.cabinRadius * 0.8, -this.cabinRadius);
        this.scene.rotate(-Math.PI/6, 1, 0, 0);
        this.scene.scale(0.1, this.cabinRadius * 0.8, 0.1);
        this.cylinder.display();
        this.scene.popMatrix();
        
        if (this.bucketDeployed) {
            
            this.scene.pushMatrix();
            this.scene.translate(0, -this.cabinRadius * 1.0, 0);
            this.scene.scale(0.03, this.cabinRadius * 1.2, 0.03);
            this.bucketCylinder.display();
            this.scene.popMatrix();
            
            this.bucketMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(0, -this.cabinRadius * 2.3, 0);
            
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.cabinRadius * 0.4, this.cabinRadius * 0.5, this.cabinRadius * 0.3);
            this.bucketCylinder.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
            this.scene.translate(0, -this.cabinRadius * 0.3, 0);
            this.scene.scale(this.cabinRadius * 0.4, this.cabinRadius * 0.1, this.cabinRadius * 0.4);
            this.sphere.display();
            this.scene.popMatrix();
            
            if (this.bucketFilled) {
                this.waterMaterial.apply();
                this.scene.pushMatrix();
                this.scene.translate(0, -this.cabinRadius * 0.2, 0);
                this.scene.scale(this.cabinRadius * 0.35, this.cabinRadius * 0.2, this.cabinRadius * 0.35);
                this.sphere.display();
                this.scene.popMatrix();
            }
            
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }
}