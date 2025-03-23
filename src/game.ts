import 'phaser';
import { GAME_CONSTANTS } from './constants';
import { MenuScene } from './scenes/menu/MenuScene';
import { SpaceScene } from './scenes/space/SpaceScene';
import { CardBattleScene } from './scenes/card-battle/CardBattleScene';
import { GameOverScene } from './scenes/game-over/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,  // Set initial width
    height: 600, // Set initial height
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    backgroundColor: GAME_CONSTANTS.WINDOW.BACKGROUND_COLOR,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
            fps: 60,
            timeScale: 1,
            fixedStep: true
        }
    },
    scene: [MenuScene, SpaceScene, CardBattleScene, GameOverScene],
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false
    },
    audio: {
        disableWebAudio: false,
        noAudio: false
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        transparent: false,
        clearBeforeRender: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'high-performance',
        batchSize: 2000
    },
    fps: {
        min: 30,
        target: 60,
        forceSetTimeOut: false,
        deltaHistory: 10
    },
    callbacks: {
        preBoot: () => {
            console.log('Phaser pre-boot');
        },
        postBoot: () => {
            console.log('Phaser post-boot');
        }
    },
    disableContextMenu: true
};

new Phaser.Game(config); 