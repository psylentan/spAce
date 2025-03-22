import 'phaser';

export class ParallaxBackground {
    private scene: Phaser.Scene;
    private starLayers: Phaser.GameObjects.TileSprite[];
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.starLayers = [];
        this.createStarLayers();
    }

    private createStarLayers(): void {
        // Create three layers of stars with different speeds
        const colors = ['#465677', '#6b8bbd', '#ffffff'];
        const scales = [1, 1.5, 2];
        const speeds = [0.5, 1, 2];

        for (let i = 0; i < 3; i++) {
            const texture = this.generateStarTexture(`stars${i}`, colors[i]);
            const layer = this.scene.add.tileSprite(
                0,
                0,
                this.scene.scale.width,
                this.scene.scale.height,
                `stars${i}`
            );
            layer.setOrigin(0, 0);
            layer.setScale(scales[i]);
            layer.setScrollFactor(0);
            layer.setDepth(-100 + i);
            layer.alpha = 0.5 + (i * 0.2);
            
            this.starLayers.push(layer);
        }
    }

    private generateStarTexture(key: string, color: string): void {
        const graphics = this.scene.add.graphics();
        const size = 128;
        const stars = 20;

        graphics.clear();
        for (let i = 0; i < stars; i++) {
            const x = Phaser.Math.Between(0, size);
            const y = Phaser.Math.Between(0, size);
            const radius = Phaser.Math.Between(1, 2);
            
            graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color);
            graphics.fillCircle(x, y, radius);
        }

        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    update(): void {
        // Update each star layer with different speeds
        this.starLayers.forEach((layer, index) => {
            layer.tilePositionY -= (index + 1) * 0.5;
        });
    }

    resize(width: number, height: number): void {
        this.starLayers.forEach(layer => {
            layer.setSize(width, height);
        });
    }
} 