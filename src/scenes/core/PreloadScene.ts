import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    private loadingBar!: Phaser.GameObjects.Graphics;
    private progressBar!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(): void {
        this.createLoadingBar();

        // Register loading progress events
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

        // Load game assets
        this.loadGameAssets();
    }

    create(): void {
        // Clean up loading bars
        this.progressBar.destroy();
        this.loadingBar.destroy();

        // Move to StartScene
        this.scene.start('StartScene');
    }

    private createLoadingBar(): void {
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x222222, 0.8);
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            36
        );
        this.progressBar = this.add.graphics();
    }

    private loadGameAssets(): void {
        // Load all game assets here
        // this.load.image('player', 'assets/sprites/player.png');
        // this.load.image('enemy', 'assets/sprites/enemy.png');
        // ... more assets will be added as needed
    }
} 