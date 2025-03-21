import Phaser from 'phaser';
import { GameConfig } from './config/game-config';
import { BootScene } from './scenes/BootScene';
import { PreloaderScene } from './scenes/PreloaderScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { SpaceFlightScene } from './scenes/SpaceFlightScene';
import { CardBattleScene } from './scenes/CardBattleScene';
import { GameOverScene } from './scenes/GameOverScene';

class Game extends Phaser.Game {
    constructor() {
        super(GameConfig);
        
        // Register scenes
        this.scene.add('BootScene', BootScene);
        this.scene.add('PreloaderScene', PreloaderScene);
        this.scene.add('MainMenuScene', MainMenuScene);
        this.scene.add('SpaceFlightScene', SpaceFlightScene);
        this.scene.add('CardBattleScene', CardBattleScene);
        this.scene.add('GameOverScene', GameOverScene);
        
        // Start with the boot scene
        this.scene.start('BootScene');
    }
}

// Wait for the DOM to be ready
window.addEventListener('load', () => {
    new Game();
}); 