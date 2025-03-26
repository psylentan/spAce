import { Scene, GameObjects } from 'phaser';

interface StarFieldConfig {
    depth: number;           // Base rendering layer depth
    layerCount: number;      // Number of parallax layers
    starsPerLayer: number;   // Number of stars per layer
    minSpeed: number;        // Minimum parallax speed multiplier
    maxSpeed: number;        // Maximum parallax speed multiplier
    minStarSize: number;     // Minimum star size
    maxStarSize: number;     // Maximum star size
    colors: number[];        // Array of star colors in hex format
    backgroundColor: number; // Background color (usually black)
    width: number;          // Width of the star field
    height: number;         // Height of the star field
}

const DEFAULT_CONFIG: StarFieldConfig = {
    depth: -1000,
    layerCount: 3,
    starsPerLayer: 100,
    minSpeed: 0.1,
    maxSpeed: 1.0,
    minStarSize: 1,
    maxStarSize: 3,
    colors: [0xFFFFFF, 0xFFD700, 0x87CEEB, 0xFFB6C1, 0x98FB98], // White, Gold, Sky Blue, Pink, Light Green
    backgroundColor: 0x000000,
    width: 800,
    height: 600
};

export class StarField {
    private scene: Scene;
    private config: StarFieldConfig;
    private layers: GameObjects.RenderTexture[] = [];
    private layerSpeeds: number[] = [];

    constructor(scene: Scene, config: Partial<StarFieldConfig> = {}) {
        this.scene = scene;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.createStarField();
    }

    private createStarField(): void {
        // Calculate layer speeds
        for (let i = 0; i < this.config.layerCount; i++) {
            const speedFactor = this.config.minSpeed + 
                (i / (this.config.layerCount - 1)) * (this.config.maxSpeed - this.config.minSpeed);
            this.layerSpeeds.push(speedFactor);
        }

        // Create layers
        for (let layer = 0; layer < this.config.layerCount; layer++) {
            // Create a render texture for this layer
            const renderTexture = this.scene.add.renderTexture(0, 0, this.config.width * 2, this.config.height * 2);
            renderTexture.setDepth(this.config.depth + layer);
            
            // Fill with stars
            for (let i = 0; i < this.config.starsPerLayer; i++) {
                const x = Math.random() * this.config.width * 2;
                const y = Math.random() * this.config.height * 2;
                const size = this.config.minStarSize + 
                    Math.random() * (this.config.maxStarSize - this.config.minStarSize);
                const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
                
                // Draw star
                const star = this.createStarGraphics(size, color);
                renderTexture.draw(star, x, y);
                star.destroy();
            }

            // Set initial position
            renderTexture.setScrollFactor(this.layerSpeeds[layer]);
            this.layers.push(renderTexture);
        }

        // Update camera movement
        this.scene.cameras.main.on('scroll', this.updateParallax, this);
    }

    private createStarGraphics(size: number, color: number): GameObjects.Graphics {
        const graphics = this.scene.add.graphics();
        
        // Draw star with soft edges
        graphics.lineStyle(size, color, 0.1);
        graphics.fillStyle(color, 1);
        
        // Center point
        graphics.fillCircle(0, 0, size * 0.5);
        
        // Glow effect
        graphics.lineStyle(size * 0.8, color, 0.3);
        graphics.strokeCircle(0, 0, size * 0.8);
        
        return graphics;
    }

    private updateParallax(camera: Phaser.Cameras.Scene2D.Camera): void {
        this.layers.forEach((layer, index) => {
            const speed = this.layerSpeeds[index];
            const offsetX = -(camera.scrollX * speed) % (this.config.width * 2);
            const offsetY = -(camera.scrollY * speed) % (this.config.height * 2);
            
            layer.setPosition(
                camera.scrollX + offsetX,
                camera.scrollY + offsetY
            );
        });
    }

    public setDepth(depth: number): void {
        this.config.depth = depth;
        this.layers.forEach((layer, index) => {
            layer.setDepth(depth + index);
        });
    }

    public setAlpha(alpha: number): void {
        this.layers.forEach(layer => {
            layer.setAlpha(alpha);
        });
    }

    public setVisible(visible: boolean): void {
        this.layers.forEach(layer => {
            layer.setVisible(visible);
        });
    }

    public destroy(): void {
        this.scene.cameras.main.off('scroll', this.updateParallax, this);
        this.layers.forEach(layer => {
            layer.destroy();
        });
        this.layers = [];
    }
} 