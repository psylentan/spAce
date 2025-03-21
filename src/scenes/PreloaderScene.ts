import Phaser from 'phaser';
import { createPlaceholder } from '../utils/assetPreloader';

export class PreloaderScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    constructor() {
        super('PreloaderScene');
    }

    preload(): void {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Create loading bar
        this.createLoadingBar();
        
        // Register the loading progress event
        this.load.on('progress', (value: number) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(
                this.cameras.main.width / 4, 
                this.cameras.main.height / 2 - 16, 
                (this.cameras.main.width / 2) * value, 
                32
            );
        });

        // Add error handling for asset loading
        this.load.on('loaderror', (fileObj: any) => {
            console.warn(`Error loading asset: ${fileObj.key}`);
            if (fileObj.type === 'image') {
                createPlaceholder(this, fileObj.key);
            }
        });
        
        // Load assets for the game
        this.loadAssets();
    }

    create(): void {
        // Create explosion animation
        this.anims.create({
            key: 'explode',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `explosion-${i}`, frame: 0 })),
            frameRate: 10,
            repeat: 0
        });
        
        // Transition to the main menu scene once everything is loaded
        this.scene.start('MainMenuScene');
    }

    private createLoadingBar(): void {
        // Background for the loading bar
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x222222, 0.8);
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2, 
            this.cameras.main.height / 2 - 18, 
            this.cameras.main.width / 2 + 4, 
            36
        );
        
        // The progress bar itself
        this.progressBar = this.add.graphics();
    }

    private loadAssets(): void {
        // Load all game assets
        
        // UI assets
        this.load.image('title', 'assets/ui/title.png');
        this.load.image('button', 'assets/ui/button.png');
        
        // Ship assets
        this.load.image('player-ship', 'assets/ships/player-ship.png');
        this.load.image('enemy-ship', 'assets/ships/enemy-ship.png');
        
        // Environment assets
        this.load.image('background', 'assets/environment/background.jpg');
        this.load.image('stars-small', 'assets/environment/stars-small.png');
        this.load.image('stars-medium', 'assets/environment/stars-medium.png');
        this.load.image('stars-large', 'assets/environment/stars-large.png');
        this.load.image('asteroid', 'assets/environment/asteroid.png');
        this.load.image('loot-crate', 'assets/environment/loot-crate.png');
        this.load.image('mining-station', 'assets/environment/mining-station.png');
        this.load.image('encounter-trigger', 'assets/environment/encounter-trigger.png');
        
        // Card assets
        this.load.image('card-back', 'assets/cards/card-back.png');
        this.load.image('card-frame', 'assets/cards/card-frame.png');
        
        // Sound effects
        this.load.audio('shoot', 'assets/sounds/shoot.wav');
        this.load.audio('explosion', 'assets/sounds/explosion.wav');
        this.load.audio('collect', 'assets/sounds/collect.wav');
        this.load.audio('card-play', 'assets/sounds/card-play.wav');
        
        // Game music and engine sounds from WIP-media folder
        this.load.audio('background-music', 'sounds/space-arcade.mp3');
        this.load.audio('engine-loop1', 'sounds/engine-loop1.mp3');
        this.load.audio('engine-loop2', 'sounds/engine-loop2.mp3');
        this.load.audio('engine-start1', 'sounds/engine-start1.mp3');
        this.load.audio('engine-start2', 'sounds/engine-start2.mp3');
        this.load.audio('engine-start3', 'sounds/engine-start3.mp3');
        this.load.audio('engine-start4', 'sounds/engine-start4.mp3');
        
        // Projectiles
        this.load.image('projectile', 'assets/ships/projectile.png');
        this.load.image('enemy-projectile', 'assets/ships/enemy-projectile.png');
    }
} 