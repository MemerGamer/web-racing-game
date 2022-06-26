// Global Constants

// Screen Size
const SCREEN_W= 1920;
const SCREEN_H = 1080;

// Coordinates of the screen center
const SCREEN_CX = SCREEN_W/2;
const SCREEN_CY = SCREEN_H/2;

// Main Scene
class MainScene extends Phaser.Scene{
    constructor(){
        super({key: 'SceneMain'});
    }
}

// Pause Scene
class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'ScenePause'});
    }
}

// Initializing Phaser Game

// Game Configuration
let config = {
    type: Phaser.AUTO,
    width: SCREEN_W,
    height: SCREEN_H,

    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MainScene,PauseScene]
};

// Game Instance
let game = new Phaser.Game(config);