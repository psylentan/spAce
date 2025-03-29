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

        // Verify texture assignment
        console.log('Asteroid texture details:', {
            key: this.texture.key,
            exists: scene.textures.exists(this.texture.key),
            frame: this.frame.name,
            textureSource: this.texture.source[0]?.width ? 'Valid' : 'Invalid',
            config: config.sprite
        });

        // Set properties
        this.maxHealth = config.health || 100;
        this.currentHealth = this.maxHealth;
        this.resourceType = config.resourceType || 'iron';
        this.resourceAmount = config.resourceAmount || 10;
        
        // Set scale and make sure texture is visible
        this.setScale(config.scale || 1);
        
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
        
        // Store scene reference
        const scene = this.scene;
        
        // Create hit particles first
        const particles = scene.add.particles(this.x, this.y, 'asteroid_particle', {
            speed: { min: 30, max: 60 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 300,
            quantity: 5,
            blendMode: 'NORMAL'  // Changed from ADD to NORMAL
        });

        // Auto-destroy particles
        scene.time.delayedCall(300, () => {
            particles.destroy();
        });
        
        // Visual feedback
        scene.tweens.add({
            targets: this,
            alpha: 0.6,
            duration: 50,
            yoyo: true
        });

        // Scale effect based on damage
        const damageRatio = amount / this.maxHealth;
        scene.tweens.add({
            targets: this,
            scale: this.scale * (1 - damageRatio * 0.1),  // Shrink slightly based on damage
            duration: 100,
            yoyo: true,
            onComplete: () => {
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
        });
    }

    public destroy(): void {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.destroyed = true;

        // Store scene reference and position before destruction
        const scene = this.scene;
        const position = { x: this.x, y: this.y };
        
        // Create multiple spinning particles
        const numParticles = Phaser.Math.Between(6, 12);
        const particles = [];
        
        for (let i = 0; i < numParticles; i++) {
            // Create individual particle sprite with physics
            const particle = scene.physics.add.sprite(position.x, position.y, 'asteroid_particle');
            
            // Set initial scale based on asteroid size
            const baseScale = this.scale * 0.3;
            particle.setScale(baseScale);
            
            // Set origin to center for better rotation
            particle.setOrigin(0.5, 0.5);
            
            // Make sure particle uses the actual texture
            particle.setTexture('asteroid_particle');
            
            // Random direction and speed
            const angle = (i / numParticles) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.2, 0.2);
            const speed = Phaser.Math.FloatBetween(60, 180);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            // Set velocity and rotation
            particle.setVelocity(velocityX, velocityY);
            particle.setAngularVelocity(Phaser.Math.FloatBetween(-300, 300));
            
            // Fade out and scale down tween
            scene.tweens.add({
                targets: particle,
                alpha: { from: 1, to: 0 },
                scale: { from: baseScale, to: baseScale * 0.3 },
                duration: Phaser.Math.FloatBetween(600, 1000),
                ease: 'Power2',
                onComplete: () => {
                    particle.destroy();
                }
            });
            
            particles.push(particle);
        }

        // Emit event for resource drop
        this.emit('destroyed', {
            position: position,
            resourceType: this.resourceType,
            resourceAmount: this.resourceAmount
        });

        // Call parent's destroy method
        super.destroy();
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