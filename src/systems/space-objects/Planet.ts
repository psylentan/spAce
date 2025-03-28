import { Scene } from 'phaser';

export interface PlanetConfig {
    name: string;
    type: 'ice' | 'desert' | 'gas' | 'earth';
    position: { x: number; y: number };
    scale: number;
    gravityRadius: number;
    gravityStrength: number;
    sprite: {
        key: string;
        frame?: string | number;
    };
}

export class Planet extends Phaser.GameObjects.Container {
    private sprite: Phaser.GameObjects.Sprite;
    private gravityField!: Phaser.GameObjects.Arc; // Using ! to assert initialization
    private config: PlanetConfig;
    private debugGraphics?: Phaser.GameObjects.Graphics;
    private physicsBody: Phaser.Physics.Arcade.Body;

    constructor(scene: Scene, config: PlanetConfig) {
        super(scene, config.position.x, config.position.y);
        this.config = config;

        // Create the planet sprite
        this.sprite = scene.add.sprite(0, 0, config.sprite.key, config.sprite.frame);
        this.sprite.setScale(config.scale);
        this.add(this.sprite);

        // Add physics body
        scene.physics.add.existing(this, true);
        this.physicsBody = this.body as Phaser.Physics.Arcade.Body;
        this.physicsBody.setCircle(this.sprite.width * config.scale / 2);

        // Create gravity field visualization (debug)
        this.createGravityFieldVisualization();

        // Add to scene's display list
        scene.add.existing(this);
    }

    private createGravityFieldVisualization(): void {
        // Create a semi-transparent circle to show gravity field
        this.gravityField = this.scene.add.circle(
            0,
            0,
            this.config.gravityRadius,
            0x00ff00,
            0.1
        );
        this.add(this.gravityField);

        // Add debug graphics if needed
        if (this.scene.game.config.physics?.arcade?.debug) {
            this.debugGraphics = this.scene.add.graphics();
            this.add(this.debugGraphics);
        }
    }

    public applyGravityToObject(object: Phaser.Physics.Arcade.Sprite): void {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add minimum distance threshold to prevent getting stuck
        const minDistance = this.sprite.width * this.config.scale * 0.75;
        
        if (distance < this.config.gravityRadius && distance > minDistance && object.body) {
            // Calculate gravity force (stronger when closer, but with reduced overall strength)
            const force = (1 - distance / this.config.gravityRadius) * (this.config.gravityStrength * 0.3);
            const angle = Math.atan2(dy, dx);

            // Apply force to object's velocity with dampening
            const dampening = 0.98; // Reduces cumulative gravity effect
            object.body.velocity.x = (object.body.velocity.x + Math.cos(angle) * force) * dampening;
            object.body.velocity.y = (object.body.velocity.y + Math.sin(angle) * force) * dampening;

            // Update debug visualization if enabled
            this.updateDebugVisualization(object, force);
        }
    }

    private updateDebugVisualization(object: Phaser.Physics.Arcade.Sprite, force: number): void {
        if (this.debugGraphics && this.scene.game.config.physics?.arcade?.debug) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(2, 0xff0000);
            this.debugGraphics.lineBetween(0, 0, object.x - this.x, object.y - this.y);
            
            // Show force magnitude
            const text = this.scene.add.text(
                object.x - this.x,
                object.y - this.y,
                `Force: ${force.toFixed(2)}`,
                { fontSize: '16px', color: '#ff0000' }
            );
            text.setOrigin(0.5);
            // Remove previous text before adding new one
            if (this.debugGraphics.getData('forceText')) {
                (this.debugGraphics.getData('forceText') as Phaser.GameObjects.Text).destroy();
            }
            this.debugGraphics.setData('forceText', text);
        }
    }

    public update(): void {
        // Add any continuous updates here (rotation, effects, etc.)
        this.sprite.rotation += 0.001; // Slow rotation
    }
} 