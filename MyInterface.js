import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();
        
        const displaysFolder = this.gui.addFolder('Display Options');
        displaysFolder.add(this.scene, 'displayAxis').name('Display Axis');
        displaysFolder.add(this.scene, 'displayBuilding').name('Display Building');
        displaysFolder.add(this.scene, 'displayForest').name('Display Forest');
        displaysFolder.add(this.scene, 'displayLake').name('Display Lake');
        displaysFolder.add(this.scene, 'displayFire').name('Display Fire');
        displaysFolder.add(this.scene, 'displayHelicopter').name('Display Heli');
        displaysFolder.open();

        this.gui.add(this.scene, 'selectedTexture', this.scene.textureIds)
            .name('Window Texture')
            .onChange(this.scene.updateAppliedTexture.bind(this.scene));
        
        const helicopterFolder = this.gui.addFolder('Helicopter Controls');
        
        helicopterFolder.add(this.scene, 'speedFactor', 0.1, 3.0)
            .name('Speed Factor')
            .onChange((value) => {
                this.scene.speedFactor = value;
            });
            
        const controlsInfo = helicopterFolder.add(this, 'displayControlsInfo').name('Show Controls');
        
        helicopterFolder.open();
        
        this.initKeys();

        return true;
    }
    
    displayControlsInfo() {
        alert(
            "Helicopter Controls:\n\n" +
            "W: Move Forward\n" +
            "S: Move Backward\n" +
            "A: Turn Left\n" +
            "D: Turn Right\n" +
            "R: Reset Position\n" +
            "P: Take Off / Rise / Collect Water\n" +
            "L: Land / Descend to Water\n" +
            "O: Drop Water (for fire)\n\n" +
            "Speed Factor adjusts the sensitivity of all movement controls."
        );
    }

    initKeys() {
        this.scene.gui = this;

        this.processKeyboard = function () { };

        this.activeKeys = {};
    }
    
    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}