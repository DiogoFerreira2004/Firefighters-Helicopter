import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MySiren } from './MySiren.js';
export class MyBuilding extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene
     * @param {number} totalWidth 
     * @param {number} depth 
     * @param {number} floorHeight 
     * @param {number} sideFloors 
     * @param {number} windowsPerFloor 
     * @param {MyWindow} windowInstance 
     * @param {Array} buildingColor 
     * @param {string} doorTexturePath 
     * @param {string} signTexturePath 
     * @param {string} helipadTexturePath 
     */
    constructor(scene, totalWidth, depth, floorHeight, sideFloors, windowsPerFloor, windowInstance, buildingColor, doorTexturePath, signTexturePath, helipadTexturePath) {
        super(scene);

        this.totalWidth = totalWidth;
        this.depth = depth;
        this.floorHeight = floorHeight;
        this.sideFloors = sideFloors;
        this.windowsPerFloor = windowsPerFloor;
        this.windowInstance = windowInstance;
        this.buildingColor = buildingColor;

        this.centerFloors = this.sideFloors + 1;

        this.centerWidth = this.totalWidth * 0.4;
        this.sideWidth = this.totalWidth * 0.3;
        this.centerDepth = this.depth;
        this.sideDepth = this.depth;

        this.doorWidth = this.centerWidth * 0.4;
        this.doorHeight = this.floorHeight * 0.8;
        this.signWidth = this.centerWidth * 0.5;
        this.signHeight = this.floorHeight * 0.2;
        this.helipadSize = Math.min(this.centerWidth, this.centerDepth) * 0.8;

        this.quad = new MyQuad(this.scene);

        this.buildingAppearance = new CGFappearance(this.scene);
        this.buildingAppearance.setAmbient(buildingColor[0] * 0.3, buildingColor[1] * 0.3, buildingColor[2] * 0.3, buildingColor[3]);
        this.buildingAppearance.setDiffuse(buildingColor[0] * 0.7, buildingColor[1] * 0.7, buildingColor[2] * 0.7, buildingColor[3]);
        this.buildingAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.buildingAppearance.setShininess(10.0);

        this.doorAppearance = new CGFappearance(this.scene);
        this.doorTexture = new CGFtexture(this.scene, doorTexturePath);
        this.doorAppearance.setTexture(this.doorTexture);
        this.doorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.doorAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.doorAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1);

        this.signAppearance = new CGFappearance(this.scene);
        this.signTexture = new CGFtexture(this.scene, signTexturePath);
        this.signAppearance.setTexture(this.signTexture);
        this.signAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.signAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.signAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.signAppearance.setSpecular(0.1, 0.1, 0.1, 1);

        this.helipadTexture = new CGFtexture(this.scene, helipadTexturePath);
        this.helipadUpTexture = new CGFtexture(this.scene, 'images/helipad_up.png');
        this.helipadDownTexture = new CGFtexture(this.scene, 'images/helipad_down.png');

        this.helipadShader = new CGFshader(this.scene.gl, "shaders/helipad.vert", "shaders/helipad.frag");
        this.helipadShader.setUniformsValues({ uSampler1: 0, uSampler2: 1, uSampler3: 2, timeFactor: 0, helipadState: 0, blinkInterval: 0.5});
        
        this.helipadState = 0; 
        
        this.initSirens();

        this.sirenShader = new CGFshader(this.scene.gl, "shaders/siren.vert", "shaders/siren.frag");
        this.sirenShader.setUniformsValues({timeFactor: 0, sirenActive: 0});

        this.roofAppearance = this.buildingAppearance; 

        this.initBuffers();
    }
    
    initSirens() {
        this.sirens = [];
        for (let i = 0; i < 4; i++) {
            this.sirens.push(new MySiren(this.scene));
        }
    }

    drawCube(width, height, depth) {
        this.scene.pushMatrix();

        // Face Frontal
        this.scene.pushMatrix();
        this.scene.translate(0, 0, depth / 2);
        this.scene.scale(width, height, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Face Traseira
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -depth / 2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(width, height, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Telhado (Face Superior)
        this.scene.pushMatrix();
        this.scene.translate(0, height / 2, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(width, depth, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Chão (Face Inferior)
        this.scene.pushMatrix();
        this.scene.translate(0, -height / 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(width, depth, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Face Direita
        this.scene.pushMatrix();
        this.scene.translate(width / 2, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(depth, height, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Face Esquerda
        this.scene.pushMatrix();
        this.scene.translate(-width / 2, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(depth, height, 1);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    updateHelipadState(state) {
        this.helipadState = state;
    }
    
    update(t) {      
        if(this.helipadState == 1){
            this.helipadShader.setUniformsValues({ timeFactor: t / 1200 % 100, helipadState: 1});
            this.sirenShader.setUniformsValues({timeFactor: t / 1200 % 100, sirenActive: 1});
        }

        else if(this.helipadState == 2){
            this.helipadShader.setUniformsValues({ timeFactor: t / 1200 % 100, helipadState: 2});
            this.sirenShader.setUniformsValues({timeFactor: t / 1200 % 100, sirenActive: 1});
        }
        else{
            this.helipadShader.setUniformsValues({ timeFactor: t / 1200 % 100, helipadState: 0});
            this.sirenShader.setUniformsValues({timeFactor: t / 1200 % 100, sirenActive: 0, });
        }
        
    }

    display() {
        const Z_OFFSET = 0.1;
        const Y_OFFSET = 0.1;

        this.buildingAppearance.apply();
        const totalSideHeight = this.sideFloors * this.floorHeight;
        const totalCenterHeight = this.centerFloors * this.floorHeight;
        const centerModuleX = 0;
        const leftModuleX = -this.sideWidth / 2 - this.centerWidth / 2;
        const rightModuleX = this.sideWidth / 2 + this.centerWidth / 2;

        // Bloco esquerdo
        this.scene.pushMatrix();
        this.scene.translate(leftModuleX, totalSideHeight / 2, 0);
        this.drawCube(this.sideWidth, totalSideHeight, this.sideDepth);
        this.scene.popMatrix();
        // Bloco direito
        this.scene.pushMatrix();
        this.scene.translate(rightModuleX, totalSideHeight / 2, 0);
        this.drawCube(this.sideWidth, totalSideHeight, this.sideDepth);
        this.scene.popMatrix();
        // Bloco central
        this.scene.pushMatrix();
        this.scene.translate(centerModuleX, totalCenterHeight / 2, 0);
        this.drawCube(this.centerWidth, totalCenterHeight, this.centerDepth);
        this.scene.popMatrix();

        this.windowInstance.apply();

        const windowWidth = this.sideWidth / (this.windowsPerFloor + 1) * 0.8;
        const windowHeight = this.floorHeight * 0.6;
        const windowSpacingX = this.sideWidth / (this.windowsPerFloor + 1);
        const windowSpacingY = this.floorHeight;

        // Janelas - Bloco Esquerdo
        for (let floor = 0; floor < this.sideFloors; floor++) {
            for (let i = 0; i < this.windowsPerFloor; i++) {
                const winX = leftModuleX - this.sideWidth / 2 + windowSpacingX * (i + 1);
                const winY = floor * windowSpacingY + windowSpacingY / 2;
                const winZ = this.sideDepth / 2 + Z_OFFSET;

                this.scene.pushMatrix();
                this.scene.translate(winX, winY, winZ);
                this.scene.scale(windowWidth, windowHeight, 1);
                this.quad.display();
                this.scene.popMatrix();
            }
        }

        // Janelas - Bloco Direito
         for (let floor = 0; floor < this.sideFloors; floor++) {
            for (let i = 0; i < this.windowsPerFloor; i++) {
                const winX = rightModuleX - this.sideWidth / 2 + windowSpacingX * (i + 1);
                const winY = floor * windowSpacingY + windowSpacingY / 2;
                const winZ = this.sideDepth / 2 + Z_OFFSET;

                this.scene.pushMatrix();
                this.scene.translate(winX, winY, winZ);
                this.scene.scale(windowWidth, windowHeight, 1);
                this.quad.display();
                this.scene.popMatrix();
            }
        }

        // Janelas - Bloco Central
        const centerWindowWidth = this.centerWidth / (this.windowsPerFloor + 1) * 0.8;
        const centerWindowSpacingX = this.centerWidth / (this.windowsPerFloor + 1);
        for (let floor = 1; floor < this.centerFloors; floor++) {
             for (let i = 0; i < this.windowsPerFloor; i++) {
                const winX = centerModuleX - this.centerWidth / 2 + centerWindowSpacingX * (i + 1);
                const winY = floor * windowSpacingY + windowSpacingY / 2;
                const winZ = this.centerDepth / 2 + Z_OFFSET;

                this.scene.pushMatrix();
                this.scene.translate(winX, winY, winZ);
                this.scene.scale(centerWindowWidth, windowHeight, 1);
                this.quad.display();
                this.scene.popMatrix();
            }
        }

        this.doorAppearance.apply();
        const doorX = centerModuleX;
        const doorY = this.doorHeight / 2;
        const doorZ = this.centerDepth / 2 + Z_OFFSET;

        this.scene.pushMatrix();
        this.scene.translate(doorX, doorY, doorZ);
        this.scene.scale(this.doorWidth, this.doorHeight, 1);
        this.quad.display();
        this.scene.popMatrix();

        this.signAppearance.apply();
        const signX = centerModuleX;
        const signY = this.doorHeight + this.signHeight / 2;
        const signZ = this.centerDepth / 2 + Z_OFFSET + 0.01; 

        this.scene.pushMatrix();
        this.scene.translate(signX, signY, signZ);
        this.scene.scale(this.signWidth, this.signHeight, 1);
        this.quad.display();
        this.scene.popMatrix();

        const helipadX = centerModuleX;
        const helipadY = totalCenterHeight + Y_OFFSET;
        const helipadZ = 0;
        
        // Sirenes
        const cornerOffset = this.helipadSize * 0.45;
        
        const cornerPositions = [
            { x: -cornerOffset, z: -cornerOffset }, 
            { x: cornerOffset, z: -cornerOffset },  
            { x: cornerOffset, z: cornerOffset },   
            { x: -cornerOffset, z: cornerOffset }  
        ];
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.sirenShader);
        for (let i = 0; i < 4; i++) {
            this.scene.pushMatrix();
            this.scene.translate(
                helipadX + cornerPositions[i].x,
                helipadY + 0.2,
                helipadZ + cornerPositions[i].z
            );
            const rotationAngle = Math.atan2(cornerPositions[i].x, cornerPositions[i].z);
            this.scene.rotate(rotationAngle, 0, 1, 0);
            this.sirens[i].display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();

        // Heliporto
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.helipadShader);
        this.scene.translate(helipadX, helipadY, helipadZ);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.helipadSize, this.helipadSize, 1);
        this.helipadTexture.bind(0);
        this.helipadUpTexture.bind(1);
        this.helipadDownTexture.bind(2);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}