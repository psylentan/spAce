import { Scene, GameObjects, Math as PhaserMath } from 'phaser';

interface StarFieldConfig {
    depth: number;           // Rendering layer depth
    count: number;          // Number of stars
    minSpeed: number;       // Minimum star movement speed
    maxSpeed: number;       // Maximum star movement speed
    minSize: number;        // Minimum star size
    maxSize: number;        // Maximum star size
    minAlpha: number;       // Minimum star opacity
    maxAlpha: number;       // Maximum star opacity
    colors: number[];       // Array of star colors in hex format
    followCamera: boolean;  // Whether stars should move with camera
    parallaxFactor: number; // How much stars move relative to camera (0-1)
}

const DEFAULT_CONFIG: StarFieldConfig = {
    depth: -1,              // Behind most game objects
    count: 200,             // Default star count
    minSpeed: 10,
    maxSpeed: 50,
    minSize: 1,
    maxSize: 3,
    minAlpha: 0.3,
    maxAlpha: 1,
    colors: [0xFFFFFF, 0xFFD700, 0x87CEEB, 0xFFB6C1], // White, Gold, Sky Blue, Pink
    followCamera: true,
    parallaxFactor: 0.5
};

export class StarField {
    private scene: Scene;
    private config: StarFieldConfig;
    private emitter!: GameObjects.Particles.ParticleEmitter;
    private particleManager!: GameObjects.Particles.ParticleEmitterManager;

    constructor(scene: Scene, config: Partial<StarFieldConfig> = {}) {
        this.scene = scene;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.createStarField();
    }

    private createStarField(): void {
        // Create a small star texture programmatically
        const starTexture = this.createStarTexture();
        
        // Create particle manager
        this.particleManager = this.scene.add.particles(starTexture.key);
        this.particleManager.setDepth(this.config.depth);

        // Create emitter for the main star field
        this.emitter = this.particleManager.createEmitter({
            x: { min: 0, max: this.scene.scale.width },
            y: { min: 0, max: this.scene.scale.height },
            scale: { 
                min: this.config.minSize / 16, // Divide by texture size
                max: this.config.maxSize / 16 
            },
            alpha: {
                min: this.config.minAlpha,
                max: this.config.maxAlpha
            },
            tint: { 
                random: this.config.colors 
            },
            speed: {
                min: this.config.minSpeed,
                max: this.config.maxSpeed
            },
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            lifespan: { min: 2000, max: 5000 },
            frequency: 500 / this.config.count, // Spawn rate based on desired count
            blendMode: 'ADD',
            follow: this.config.followCamera ? this.scene.cameras.main : null,
            followOffset: {
                x: this.scene.scale.width / 2,
                y: this.scene.scale.height / 2
            },
            quantity: 1,
            maxParticles: this.config.count
        });

        // If following camera, adjust particle positions based on parallax
        if (this.config.followCamera) {
            this.scene.cameras.main.on('scroll', (camera: any) => {
                const parallaxX = camera.scrollX * (1 - this.config.parallaxFactor);
                const parallaxY = camera.scrollY * (1 - this.config.parallaxFactor);
                this.particleManager.x = parallaxX;
                this.particleManager.y = parallaxY;
            });
        }

        // Add some random rotation and twinkle effects
        this.scene.time.addEvent({
            delay: 100,
            callback: () => this.updateStars(),
            callbackScope: this,
            loop: true
        });
    }

    private createStarTexture(): Phaser.Textures.Texture {
        const textureKey = 'starParticle';
        
        // Only create if it doesn't exist
        if (!this.scene.textures.exists(textureKey)) {
            // Create a 16x16 canvas for the star
            const graphics = this.scene.add.graphics();
            
            // Draw a soft circular gradient
            graphics.clear();
            const radius = 8;
            const center = radius;
            
            // Create gradient circle
            for (let i = radius; i > 0; i--) {
                const alpha = i / radius;
                graphics.lineStyle(1, 0xFFFFFF, alpha);
                graphics.beginPath();
                graphics.arc(center, center, i, 0, Math.PI * 2, false);
                graphics.strokePath();
            }
            
            // Generate texture from graphics
            graphics.generateTexture(textureKey, 16, 16);
            graphics.destroy();
        }
        
        return this.scene.textures.get(textureKey);
    }

    private updateStars(): void {
        this.emitter.forEachAlive((particle: any) => {
            // Random twinkle effect
            if (PhaserMath.Between(0, 100) < 5) {
                particle.alpha = PhaserMath.Between(
                    this.config.minAlpha * 100,
                    this.config.maxAlpha * 100
                ) / 100;
            }
            
            // Subtle size variation
            if (PhaserMath.Between(0, 100) < 2) {
                particle.scaleX = particle.scaleY = PhaserMath.Between(
                    this.config.minSize,
                    this.config.maxSize
                ) / 16;
            }
        });
    }

    public setDepth(depth: number): void {
        this.particleManager.setDepth(depth);
    }

    public setAlpha(alpha: number): void {
        this.emitter.setAlpha(alpha);
    }

    public setVisible(visible: boolean): void {
        this.particleManager.setVisible(visible);
    }

    public destroy(): void {
        if (this.config.followCamera) {
            this.scene.cameras.main.off('scroll');
        }
        this.particleManager.destroy();
    }
} 