import { Scene, GameObjects } from 'phaser';

export class PlaceholderAssets {
    private scene: Scene;
    private textures: Phaser.Textures.TextureManager;

    constructor(scene: Scene) {
        this.scene = scene;
        this.textures = scene.textures;
    }

    generatePlaceholders(): void {
        this.createShipPlaceholder('ship_player', 0x00ff00);
        this.createShipPlaceholder('ship_enemy', 0xff0000);
        this.createCirclePlaceholder('powerup_speed', 0x00ffff);
        this.createCirclePlaceholder('powerup_health', 0xff00ff);
        this.createMinePlaceholder('mine');
        this.createDebrisPlaceholder('debris_small', 20);
        this.createDebrisPlaceholder('debris_medium', 35);
        this.createDebrisPlaceholder('debris_large', 50);
        this.createProjectilePlaceholder('projectile');
    }

    private createShipPlaceholder(key: string, tint: number): void {
        const graphics = this.scene.add.graphics();
        
        // Draw ship shape
        graphics.lineStyle(2, 0xffffff);
        graphics.fillStyle(tint, 1);
        
        // Triangle ship
        graphics.beginPath();
        graphics.moveTo(0, -20);
        graphics.lineTo(15, 20);
        graphics.lineTo(-15, 20);
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        // Add engine
        graphics.fillStyle(0x0000ff);
        graphics.fillRect(-5, 15, 10, 10);

        graphics.generateTexture(key, 40, 40);
        graphics.destroy();
    }

    private createCirclePlaceholder(key: string, tint: number): void {
        const graphics = this.scene.add.graphics();
        
        // Draw powerup circle
        graphics.lineStyle(2, 0xffffff);
        graphics.fillStyle(tint, 1);
        graphics.fillCircle(15, 15, 15);
        graphics.strokeCircle(15, 15, 15);

        // Add inner glow
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillCircle(15, 15, 8);

        graphics.generateTexture(key, 30, 30);
        graphics.destroy();
    }

    private createMinePlaceholder(key: string): void {
        const graphics = this.scene.add.graphics();
        
        // Draw mine shape
        graphics.lineStyle(2, 0xffffff);
        graphics.fillStyle(0x666666, 1);

        // Main body
        graphics.fillCircle(20, 20, 15);
        graphics.strokeCircle(20, 20, 15);

        // Spikes
        const spikes = 8;
        for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2;
            const x = 20 + Math.cos(angle) * 20;
            const y = 20 + Math.sin(angle) * 20;
            graphics.lineBetween(
                20 + Math.cos(angle) * 15,
                20 + Math.sin(angle) * 15,
                x,
                y
            );
        }

        graphics.generateTexture(key, 40, 40);
        graphics.destroy();
    }

    private createDebrisPlaceholder(key: string, size: number): void {
        const graphics = this.scene.add.graphics();
        
        // Draw irregular polygon
        graphics.lineStyle(2, 0xffffff);
        graphics.fillStyle(0x888888, 1);

        const points = [];
        const segments = 6;
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radius = size * (0.8 + Math.random() * 0.4);
            points.push({
                x: size + Math.cos(angle) * radius,
                y: size + Math.sin(angle) * radius
            });
        }

        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        graphics.generateTexture(key, size * 2, size * 2);
        graphics.destroy();
    }

    private createProjectilePlaceholder(key: string): void {
        const graphics = this.scene.add.graphics();
        
        // Draw projectile
        graphics.lineStyle(2, 0xffffff);
        graphics.fillStyle(0xffff00, 1);

        // Bullet shape
        graphics.fillRect(0, 0, 8, 3);
        graphics.strokeRect(0, 0, 8, 3);

        graphics.generateTexture(key, 8, 3);
        graphics.destroy();
    }
} 