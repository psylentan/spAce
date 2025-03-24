import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Load loading bar assets
        this.load.image('loading-bar-bg', 'assets/ui/loading-bar-bg.png');
        this.load.image('loading-bar-fill', 'assets/ui/loading-bar-fill.png');
    }

    create(): void {
        // Configure physics world
        this.physics.world.setBounds(0, 0, 1280, 720);
        this.physics.world.setBoundsCollision(true);

        // Initialize any global game systems here
        // ... (will be added as needed)

        // Move to PreloadScene
        this.scene.start('PreloadScene');
    }
} 