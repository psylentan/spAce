import Phaser from 'phaser';

export class EnemyShip extends Phaser.Physics.Arcade.Sprite {
    private health: number = 30;
    private maxHealth: number = 30;
    private speed: number = 100;
    private fireRate: number = 2000;
    private lastFired: number = 0;
    private scoreValue: number = 100;
    private projectiles: Phaser.GameObjects.Group;
    
    constructor(scene: Phaser.Scene, x: number, y: number, projectiles: Phaser.GameObjects.Group) {
        super(scene, x, y, 'enemy-ship');
        
        // Store projectiles group
        this.projectiles = projectiles;
        
        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set display properties
        this.setScale(0.15); // Scale down the ship more
        this.setAngle(180); // Point downward
        
        // Set initial velocity
        this.setVelocityY(this.speed);
    }
    
    update(time: number, delta: number): void {
        // Simple downward movement
        this.setVelocityY(this.speed);
        
        // Fire occasionally
        if (Phaser.Math.Between(0, 100) < 1) {
            this.fire(time);
        }
        
        // Destroy if offscreen
        if (this.y > this.scene.cameras.main.height + 50) {
            this.destroy();
        }
    }
    
    // Fire a projectile
    fire(time: number): void {
        if (time > this.lastFired + this.fireRate) {
            const projectile = this.projectiles.create(this.x, this.y + 30, 'enemy-projectile') as Phaser.Physics.Arcade.Sprite;
            
            if (projectile) {
                projectile.setVelocityY(200);
                projectile.setActive(true);
                projectile.setVisible(true);
                
                // Set damage
                (projectile as any).damage = 10;
                
                // Auto destroy when out of bounds
                projectile.setData('checkOffscreen', true);
                
                this.lastFired = time;
            }
        }
    }
    
    // Take damage
    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
        
        // Flash damage effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true
        });
        
        // Check if dead
        if (this.health <= 0) {
            this.die();
        }
    }
    
    // Die
    die(): void {
        // Play explosion sound
        this.scene.sound.play('explosion');
        
        // Create explosion effect
        const explosion = this.scene.add.sprite(this.x, this.y, 'explosion');
        explosion.play('explode');
        explosion.once('animationcomplete', () => {
            explosion.destroy();
        });
        
        // Add score
        if (this.scene.registry.has('score')) {
            this.scene.registry.values.score += this.scoreValue;
        }
        
        // Chance to drop a pickup
        if (Phaser.Math.Between(0, 100) < 30) {
            // Create pickup at enemy position
            this.scene.events.emit('createPickup', this.x, this.y);
        }
        
        // Destroy ship
        this.destroy();
    }
    
    // Getters
    getHealth(): number {
        return this.health;
    }
    
    getMaxHealth(): number {
        return this.maxHealth;
    }
    
    getScoreValue(): number {
        return this.scoreValue;
    }
} 