import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyWindow } from "./MyWindow.js"; 
import { MyBuilding } from "./MyBuilding.js"; 
import { MyPanorama } from "./MyPanorama.js";
import { MyForest } from "./forest/MyForest.js";
import { MyHeli } from "./MyHeli.js";  
import { MyLake } from "./MyLake.js";
import { MyFire } from "./MyFire.js";
import { MyWaterDrop } from "./MyWaterDrop.js"; 

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(10);

    this.grass = new CGFtexture(this,'images/grass.jpg');
    this.sky = new CGFtexture(this,'images/sky.jpg');

    this.grassAppearance = new CGFappearance(this);
    this.grassAppearance.setTexture(this.grass);
    this.grassAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.axis = new CGFaxis(this, 200);
    this.plane = new MyPlane(this, 64,0,64,0,64);
    this.panorama = new MyPanorama(this,this.sky);

    this.displayAxis = false;
    this.displayBuilding = true;
    this.displayForest = true;
    this.displayHelicopter = true;
    this.displayLake = true;
    this.displayFire = true;
    
    this.speedFactor = 1.0; 
    
    this.cruisingAltitude = 25;

    this.selectedTexture = 0;
    this.window1 = new CGFtexture(this, 'images/window.png');
    this.window2 = new CGFtexture(this, 'images/window2.png');
    this.window3 = new CGFtexture(this, 'images/window3.png');
    this.window4 = new CGFtexture(this, 'images/window4.png');

    this.windows = [this.window1, this.window2, this.window3, this.window4];
    this.textureIds = { 'Window 1': 0, 'Window 2': 1, 'Window 3': 2, 'Window 4': 3 };
    this.genericWindow = new MyWindow(this, this.windows[this.selectedTexture]); 
    
    this.fireStation = new MyBuilding(
        this,          
        30,            
        15,            
        5,             
        2,             
        2,             
        this.genericWindow, 
        [0.8, 0.2, 0.2, 1.0], 
        'images/door.png',    
        'images/sign.png',    
        'images/helipad.png'  
    );
    
    this.forest = new MyForest(this, 115, -35, 5, -65, -25);

    this.waterTexture = new CGFtexture(this, "images/waterTex.jpg");
    this.waterMap = new CGFtexture(this, "images/waterMap.jpg");
    this.lake = new MyLake(this);

    this.fireTexture = new CGFtexture(this, "images/fire.jpg");
    this.fire = new MyFire(this, 180, 4, -25, 15, 5, 45, this.fireTexture);
    
    this.helicopter = new MyHeli(this);
    
    this.helicopter.x = 35; 
    this.helicopter.y = 16.8; 
    this.helicopter.z = -42.5; 
    
    this.helicopter.setLakePosition(this.lake.xStart, this.lake.xEnd, this.lake.zStart, this.lake.zEnd);
    this.helicopter.setCruisingAltitude(this.cruisingAltitude);
    
    this.waterTexture = new CGFtexture(this, "images/waterTex.jpg");
    this.waterDrop = new MyWaterDrop(this, 0, 0, 0, this.waterTexture);
  
    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fireShader.setUniformsValues({ uSampler: 0, timeFactor: 0});

    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.waterShader.setUniformsValues({ uSampler1: 0, uSampler2: 1, heightFactor: 0.06, timeFactor: 0});
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      0.8,
      0.1,
      1000,
      vec3.fromValues(20, 30, 100), 
      vec3.fromValues(35, 0, -42.5)
    );
  }

  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
      this.helicopter.accelerate(0.1 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
      this.helicopter.accelerate(-0.1 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyA")) {
      text += " A ";
      keysPressed = true;
      this.helicopter.turn(0.05 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyD")) {
      text += " D ";
      keysPressed = true;
      this.helicopter.turn(-0.05 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyR")) {
      text += " R ";
      keysPressed = true;
      this.helicopter.reset();
    }

    if (this.gui.isKeyPressed("KeyP")) {
      text += " P ";
      keysPressed = true;
      
      if (!this.helicopter.isFlying) {
        this.helicopter.takeOff();
      } else if (this.helicopter.isAutoFlying && this.helicopter.autoFlightType === "water") {
        if (this.helicopter.y <= this.helicopter.waterAltitude + 1) {
          this.helicopter.bucketFilled = true;
          this.helicopter.autoFlightType = "waterAscend";
        }
      }
    }

    if (this.gui.isKeyPressed("KeyL")) {
      text += " L ";
      keysPressed = true;
      
      if (this.helicopter.isFlying && !this.helicopter.bucketFilled) {
        if(this.helicopter.x >= this.lake.xStart && this.helicopter.x <= this.lake.xEnd && 
          this.helicopter.z >= this.lake.zStart && this.helicopter.z <= this.lake.zEnd){
            this.helicopter.goToWater();  
        } else {
          this.helicopter.land();
        }
      }
    }
    
    if (this.gui.isKeyPressed("KeyO")) {
      text += " O ";
      keysPressed = true;
      
      if(this.helicopter.bucketFilled){
        const heliPosX = this.helicopter.x;
        const heliPosZ = this.helicopter.z;

        for (let i=0; i<this.fire.flamesGroups.length; i++){
          const bounds = this.fire.flamesGroupBounds[i];
          if(heliPosX>=bounds.xStart && heliPosX < bounds.xEnd && heliPosZ >= bounds.zStart && heliPosZ < bounds.zEnd && this.fire.activeGroups[i]){
            if (this.helicopter.dropWater()) {
              this.waterDrop.start(
                this.lastUpdate,
                this.helicopter.x,
                this.helicopter.y - this.helicopter.cabinRadius * 3,
                this.helicopter.z
              );
              
              this.fire.extinguish(this.lastUpdate, i)
            }
          }
        }
      }
    }
    
    if (keysPressed) {
      console.log(text);
    }
  }

  updateAppliedTexture() {
    this.genericWindow = new MyWindow(this, this.windows[this.selectedTexture]);

    this.fireStation = new MyBuilding(
        this,
        30,
        15,
        5,
        2,
        2,
        this.genericWindow,
        [0.8, 0.2, 0.2, 1.0],
        'images/door.png',
        'images/sign.png',
        'images/helipad.png'
    );
  }

  update(t) {
    this.checkKeys();
    
    if (this.lastUpdate === undefined) {
        this.lastUpdate = t;
    }
    
    const deltaT = t - this.lastUpdate;
    this.lastUpdate = t;
    
    this.helicopter.update(t, deltaT);
    
    if (this.helicopter.isAutoFlying) {
        if (this.helicopter.autoFlightType === "takeoff") {
            this.fireStation.updateHelipadState(1);
        } else if (this.helicopter.autoFlightType === "landing") {
            this.fireStation.updateHelipadState(2);
        } else {
            this.fireStation.updateHelipadState(0);
        }
    } else {
        this.fireStation.updateHelipadState(0);
    }
    
    this.fireStation.update(t);
    this.waterDrop.update(t);
    this.fire.update(t);

    this.fireShader.setUniformsValues({ timeFactor: t / 100 % 100 });
    this.waterShader.setUniformsValues({ timeFactor: t / 100 % 1000 });
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  
  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();
    this.lights[0].update();

    if(this.displayAxis) 
        this.axis.display();

    this.setDefaultAppearance();

    this.pushMatrix();
    this.scale(600, 1, 600);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.grassAppearance.apply();
    this.plane.display();
    this.popMatrix();

    this.panorama.display();

    if(this.displayForest){
      this.pushMatrix();
      this.translate(10,0,70);
      this.forest.display();
      this.popMatrix();

      this.pushMatrix();
      this.translate(28,0,65);
      this.forest.display();
      this.popMatrix();

      this.pushMatrix();
      this.translate(118,0,70);
      this.forest.display();
      this.popMatrix();

      this.pushMatrix();
      this.translate(60,0,90);
      this.forest.display();
      this.popMatrix();

      this.pushMatrix();
      this.translate(100,0,85);
      this.forest.display();
      this.popMatrix();

      this.pushMatrix();
      this.translate(120,0,23);
      this.forest.display();
      this.popMatrix();
    }

    if(this.displayHelicopter) {
      this.pushMatrix();
      this.helicopter.display();
      this.popMatrix();
    }

    if(this.displayBuilding) {
      this.pushMatrix();
      this.translate(35, 0, -42.5); 
      this.fireStation.display();
      this.popMatrix();
    }

    if(this.displayLake){
      this.setActiveShader(this.waterShader);
      this.pushMatrix();
      this.waterMap.bind(0);
      this.waterTexture.bind(1);
      this.lake.display();
      this.popMatrix();
    }
    
    this.waterDrop.display();
    
    if(this.displayFire){
      this.setActiveShader(this.fireShader);
      this.pushMatrix();
      this.fireTexture.bind(0);
      this.fire.display();
      this.popMatrix();
    }
    this.setActiveShader(this.defaultShader);
  }
}
