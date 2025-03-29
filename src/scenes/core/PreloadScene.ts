import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    private loadingBar!: Phaser.GameObjects.Graphics;
    private progressBar!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(): void {
        console.log('PreloadScene: preload started');
        this.createLoadingBar();

        // Register loading progress events
        this.load.on('progress', (value: number) => {
            console.log('Loading progress:', Math.round(value * 100) + '%');
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
        this.load.on('loaderror', (file: any) => {
            console.error('Error loading asset:', file.key, file.url);
            // Continue loading other assets
            this.load.on('complete', () => this.cleanupAndTransition());
        });

        // Add success logging for asset loading
        this.load.on('filecomplete', (key: string) => {
            console.log('Successfully loaded asset:', key);
        });

        // Load game assets first
        this.loadGameAssets();

        // Try to load optional assets, but don't fail if they're missing
        try {
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
            this.load.audio('layer_shift', ['assets/audio/layer_shift.mp3']);
        } catch (error) {
            console.warn('Optional assets not found:', error);
        }

        // Add complete handler to verify all assets
        this.load.on('complete', () => {
            console.log('All assets loaded. Verifying textures...');
            // Verify critical textures are loaded
            const requiredTextures = ['asteroid', 'asteroid_particle', 'asteroid_field'];
            const missingTextures = requiredTextures.filter(key => !this.textures.exists(key));
            
            if (missingTextures.length > 0) {
                console.error('Missing required textures:', missingTextures);
            } else {
                console.log('All required textures verified:', requiredTextures);
            }
        });
    }

    create(): void {
        console.log('PreloadScene: create started');
        // Verify textures one more time before transitioning
        const requiredTextures = ['asteroid', 'asteroid_particle', 'asteroid_field'];
        const missingTextures = requiredTextures.filter(key => !this.textures.exists(key));
        
        if (missingTextures.length > 0) {
            console.error('Critical textures missing before scene transition:', missingTextures);
            // Try to load them again
            this.loadGameAssets();
            // Wait a moment and check again
            this.time.delayedCall(100, () => {
                if (requiredTextures.every(key => this.textures.exists(key))) {
                    console.log('Textures loaded successfully after retry');
                    this.cleanupAndTransition();
                } else {
                    console.error('Failed to load textures after retry');
                    this.cleanupAndTransition(); // Continue anyway but log the error
                }
            });
        } else {
            console.log('All textures verified, transitioning to StartScene');
            this.cleanupAndTransition();
        }
    }

    private cleanupAndTransition(): void {
        console.log('PreloadScene: cleaning up and transitioning');
        // Clean up loading bars
        if (this.progressBar) this.progressBar.destroy();
        if (this.loadingBar) this.loadingBar.destroy();

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
        console.log('PreloadScene: loading game assets');
        
        // Load asteroid assets
        this.load.image('asteroid', 'assets/sprites/asteroids/asteroid.png');
        this.load.image('asteroid_field', 'assets/sprites/asteroids/asteroid_field.png');
        this.load.image('asteroid_particle', 'assets/sprites/asteroids/asteroid_particle.png');
        
        console.log('PreloadScene: game assets queued for loading');
    }
} 