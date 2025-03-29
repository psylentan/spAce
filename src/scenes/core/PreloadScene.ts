import { Scene } from 'phaser';
import { ResourceType } from '../../systems/loot/LootSystem';

export class PreloadScene extends Scene {
    private loadingBar!: Phaser.GameObjects.Graphics;
    private progressBar!: Phaser.GameObjects.Graphics;

    // Define required textures as a static property
    private static readonly REQUIRED_TEXTURES = [
        'asteroid',
        'asteroid_particle',
        'asteroid_field',
        'minerals',
        'elements',
        'crystals',
        'shield_parts',
        'weapon_parts',
        'loot_glow'
    ];

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
        this.loadLootAssets();

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
            const missingTextures = PreloadScene.REQUIRED_TEXTURES.filter(key => !this.textures.exists(key));
            
            if (missingTextures.length > 0) {
                console.error('Missing required textures:', missingTextures);
            } else {
                console.log('All required textures verified:', PreloadScene.REQUIRED_TEXTURES);
            }
        });
    }

    create(): void {
        console.log('PreloadScene: create started');
        // Verify textures one more time before transitioning
        const missingTextures = PreloadScene.REQUIRED_TEXTURES.filter(key => !this.textures.exists(key));
        
        if (missingTextures.length > 0) {
            console.error('Critical textures missing before scene transition:', missingTextures);
            // Try to load them again
            this.loadGameAssets();
            this.loadLootAssets();
            // Wait a moment and check again
            this.time.delayedCall(100, () => {
                if (PreloadScene.REQUIRED_TEXTURES.every(key => this.textures.exists(key))) {
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

    private loadLootAssets(): void {
        console.log('PreloadScene: creating placeholder loot assets');
        
        // Create placeholder textures for resources
        this.createPlaceholderTexture('minerals', 0x66ff66, 'hexagon');     // Green mineral
        this.createPlaceholderTexture('elements', 0x66ffff, 'diamond');     // Cyan element
        this.createPlaceholderTexture('crystals', 0xff66ff, 'star');        // Purple crystal
        this.createPlaceholderTexture('shield_parts', 0x6666ff, 'shield');  // Blue shield
        this.createPlaceholderTexture('weapon_parts', 0xff6666, 'gear');    // Red weapon
        
        // Create glow effect texture
        this.createGlowTexture();
        
        console.log('PreloadScene: placeholder loot assets created');
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
        
        // Try to load optional assets with error handling
        try {
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
        } catch (error) {
            console.warn('Optional flares atlas not loaded:', error);
        }

        try {
            this.load.audio('layer_shift', 'assets/audio/layer_shift.mp3');
        } catch (error) {
            console.warn('Optional audio not loaded:', error);
        }
        
        // Add error handlers for asset loading
        this.load.on('loaderror', (fileObj: any) => {
            console.warn('Error loading asset:', fileObj.key);
            // Mark this asset as non-required
            const index = PreloadScene.REQUIRED_TEXTURES.indexOf(fileObj.key);
            if (index > -1) {
                PreloadScene.REQUIRED_TEXTURES.splice(index, 1);
            }
        });
        
        console.log('PreloadScene: game assets queued for loading');
    }

    private createPlaceholderTexture(key: string, color: number, shape: string): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.fillStyle(color);

        const size = 32;
        const halfSize = size / 2;

        switch (shape) {
            case 'hexagon':
                this.drawHexagon(graphics, size, size, halfSize);
                break;
            case 'diamond':
                this.drawDiamond(graphics, size, size, halfSize);
                break;
            case 'star':
                this.drawStar(graphics, size, size, halfSize);
                break;
            case 'shield':
                this.drawShield(graphics, size, size, halfSize);
                break;
            case 'gear':
                this.drawGear(graphics, size, size, halfSize);
                break;
        }

        graphics.generateTexture(key, size * 2, size * 2);
        graphics.destroy();
    }

    private createGlowTexture(): void {
        const graphics = this.add.graphics();
        const size = 64;
        const halfSize = size / 2;

        // Create a soft glow effect using concentric circles
        const steps = 8;
        for (let i = steps; i >= 0; i--) {
            const alpha = (i / steps) * 0.5;
            const radius = (halfSize * i) / steps;
            graphics.fillStyle(0xffffff, alpha);
            graphics.fillCircle(halfSize, halfSize, radius);
        }

        graphics.generateTexture('loot_glow', size, size);
        graphics.destroy();
    }

    private drawHexagon(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            points.push({
                x: x + radius * Math.cos(angle),
                y: y + radius * Math.sin(angle)
            });
        }
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fill();
        graphics.stroke();
    }

    private drawDiamond(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
        graphics.beginPath();
        graphics.moveTo(x, y - radius);
        graphics.lineTo(x + radius, y);
        graphics.lineTo(x, y + radius);
        graphics.lineTo(x - radius, y);
        graphics.closePath();
        graphics.fill();
        graphics.stroke();
    }

    private drawStar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
        const points = 5;
        const innerRadius = radius * 0.4;
        const outerPoints = [];
        const innerPoints = [];

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const r = i % 2 === 0 ? radius : innerRadius;
            const point = {
                x: x + Math.cos(angle) * r,
                y: y + Math.sin(angle) * r
            };
            if (i % 2 === 0) outerPoints.push(point);
            else innerPoints.push(point);
        }

        graphics.beginPath();
        graphics.moveTo(outerPoints[0].x, outerPoints[0].y);
        for (let i = 0; i < points; i++) {
            graphics.lineTo(innerPoints[i].x, innerPoints[i].y);
            graphics.lineTo(outerPoints[(i + 1) % points].x, outerPoints[(i + 1) % points].y);
        }
        graphics.closePath();
        graphics.fill();
        graphics.stroke();
    }

    private drawShield(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
        graphics.beginPath();
        graphics.moveTo(x, y - radius);
        graphics.lineTo(x + radius, y - radius * 0.3);
        graphics.lineTo(x + radius * 0.8, y + radius);
        graphics.lineTo(x, y + radius * 0.7);
        graphics.lineTo(x - radius * 0.8, y + radius);
        graphics.lineTo(x - radius, y - radius * 0.3);
        graphics.closePath();
        graphics.fill();
        graphics.stroke();
    }

    private drawGear(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
        const teeth = 8;
        const innerRadius = radius * 0.6;
        const toothLength = radius * 0.3;

        for (let i = 0; i < teeth; i++) {
            const angle = (i * Math.PI * 2) / teeth;
            const nextAngle = ((i + 1) * Math.PI * 2) / teeth;
            const midAngle = (angle + nextAngle) / 2;

            graphics.beginPath();
            graphics.moveTo(
                x + Math.cos(angle) * innerRadius,
                y + Math.sin(angle) * innerRadius
            );
            graphics.lineTo(
                x + Math.cos(midAngle) * (radius + toothLength),
                y + Math.sin(midAngle) * (radius + toothLength)
            );
            graphics.lineTo(
                x + Math.cos(nextAngle) * innerRadius,
                y + Math.sin(nextAngle) * innerRadius
            );
            graphics.closePath();
            graphics.fill();
            graphics.stroke();
        }

        graphics.beginPath();
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeCircle(x, y, innerRadius * 0.6);
    }
} 