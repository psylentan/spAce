import { Scene } from 'phaser';

export interface AsteroidConfig {
    position: { x: number; y: number };
    scale?: number;
    health?: number;
    resourceType?: string;
    resourceAmount?: number;
    sprite?: {
        key: string;
        frame?: string | number;
    };
}

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
    private maxHealth: number;
    private currentHealth: number;
    private resourceType: string;
    private resourceAmount: number;
    private isDestroyed: boolean = false;
    public destroyed: boolean = false;  // Public property for external checks

    constructor(scene: Scene, config: AsteroidConfig) {
        super(
            scene,
            config.position.x,
            config.position.y,
            config.sprite?.key || 'asteroid',
            config.sprite?.frame
        );

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set properties
        this.maxHealth = config.health || 100;
        this.currentHealth = this.maxHealth;
        this.resourceType = config.resourceType || 'iron';
        this.resourceAmount = config.resourceAmount || 10;
        this.scale = config.scale || 1;

        // Set visibility and depth
        this.setDepth(50);  // Above background, below ship
        this.setVisible(true);
        this.setActive(true);

        // Set up physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(this.width / 2);
        body.setImmovable(false);  // Allow asteroids to move on collision
        body.enable = true;  // Ensure physics body is enabled
        body.setBounce(0.5);  // Add some bounce for realistic collision
        body.setDrag(50);  // Add drag to prevent infinite sliding
        body.setAngularDrag(50);  // Add angular drag for rotation
        
        // Enable collision
        this.setPushable(true);  // Allow it to be pushed by other objects
        body.setCollideWorldBounds(false);  // Don't collide with world bounds
        
        // Debug physics body
        console.log('Asteroid physics body:', {
            width: body.width,
            height: body.height,
            radius: this.width / 2,
            enabled: body.enable,
            immovable: body.immovable
        });

        // Add random rotation
        this.setAngularVelocity(Phaser.Math.Between(-20, 20));

        // Debug log
        console.log('Created asteroid:', {
            position: { x: this.x, y: this.y },
            scale: this.scale,
            visible: this.visible,
            active: this.active,
            texture: this.texture.key
        });
    }

    public damage(amount: number): void {
        if (this.isDestroyed) return;

        this.currentHealth -= amount;
        
        // Visual feedback
        this.scene.tweens.add({
            targets: this,
            alpha: 0.6,
            duration: 50,
            yoyo: true,
            onComplete: () => {
                // Create hit particles
                const particles = this.scene.add.particles(this.x, this.y, 'asteroid_particle', {
                    speed: { min: 30, max: 60 },
                    scale: { start: 0.2, end: 0 },
                    alpha: { start: 0.6, end: 0 },
                    lifespan: 300,
                    quantity: 5,
                    blendMode: 'ADD'
                });

                // Auto-destroy particles
                this.scene.time.delayedCall(300, () => {
                    particles.destroy();
                });
            }
        });

        // Scale effect based on damage
        const damageRatio = amount / this.maxHealth;
        this.scene.tweens.add({
            targets: this,
            scale: this.scale * (1 - damageRatio * 0.1),  // Shrink slightly based on damage
            duration: 100,
            yoyo: true
        });

        if (this.currentHealth <= 0) {
            this.destroy();
        } else {
            // Emit damage event for UI feedback
            this.emit('damaged', {
                position: { x: this.x, y: this.y },
                damage: amount,
                healthRemaining: this.currentHealth
            });
        }
    }

    public destroy(): void {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.destroyed = true;  // Set public destroyed flag

        // Emit event for resource drop
        this.emit('destroyed', {
            position: { x: this.x, y: this.y },
            resourceType: this.resourceType,
            resourceAmount: this.resourceAmount
        });

        // Play destruction animation/particles
        this.createDestructionEffect();

        // Call parent's destroy method
        super.destroy();
    }

    private createDestructionEffect(): void {
        // Create particle effect for destruction
        const particles = this.scene.add.particles(this.x, this.y, 'asteroid_particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 1000,
            blendMode: 'ADD',
            quantity: 20
        });

        // Auto-destroy particles after animation
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    public getHealth(): number {
        return this.currentHealth;
    }

    public getResourceInfo(): { type: string; amount: number } {
        return {
            type: this.resourceType,
            amount: this.resourceAmount
        };
    }
} 