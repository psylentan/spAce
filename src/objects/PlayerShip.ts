import Phaser from 'phaser';

export class PlayerShip extends Phaser.Physics.Arcade.Sprite {
    private speed: number = 200;
    private health: number = 100;
    private maxHealth: number = 100;
    private shield: number = 0;
    private maxShield: number = 50;
    private fireRate: number = 300;
    private lastFired: number = 0;
    private engineSound: Phaser.Sound.BaseSound;
    private wasMoving: boolean = false;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player-ship');
        
        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set physics properties
        this.setCollideWorldBounds(true);
        this.setDrag(300);
        
        // Set display properties
        this.setScale(0.15); // Scale down the ship more
        this.setAngle(0); // Point upward
        
        // Set up engine sounds
        this.setupEngineSounds();
    }
    
    private setupEngineSounds(): void {
        // Check if engine sound assets are available
        if (this.scene.sound.get('engine-loop1')) {
            // Initialize engine sound (not playing yet)
            this.engineSound = this.scene.sound.add('engine-loop1', {
                volume: 0.3,
                loop: true
            });
            
            // Play engine start sound when the scene starts
            const startSound = this.scene.sound.add('engine-start1', {
                volume: 0.3
            });
            
            startSound.once('complete', () => {
                // Start the looping engine sound when the start sound completes
                this.engineSound.play();
            });
            
            startSound.play();
            
            // Ensure engine sound stops when scene changes
            this.scene.events.once('shutdown', () => {
                if (this.engineSound) {
                    this.engineSound.stop();
                }
            });
        }
    }
    
    update(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        const isMoving = cursors.left.isDown || cursors.right.isDown || 
                         cursors.up.isDown || cursors.down.isDown;
                         
        // Adjust engine sound volume based on movement
        if (this.engineSound) {
            const sound = this.engineSound as Phaser.Sound.WebAudioSound;
            if (isMoving && !this.wasMoving) {
                // Increase volume when starting to move
                this.scene.tweens.add({
                    targets: sound,
                    volume: 0.5,
                    duration: 300
                });
            } else if (!isMoving && this.wasMoving) {
                // Decrease volume when stopping
                this.scene.tweens.add({
                    targets: sound,
                    volume: 0.2,
                    duration: 300
                });
            }
            
            this.wasMoving = isMoving;
        }
        
        // Movement
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
        } else {
            this.setVelocityX(0);
        }
        
        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
        } else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
        } else {
            this.setVelocityY(0);
        }
    }
    
    // Fire a projectile
    fire(time: number, projectiles: Phaser.Physics.Arcade.Group): void {
        if (time > this.lastFired + this.fireRate) {
            const projectile = projectiles.create(this.x, this.y - 30, 'projectile') as Phaser.Physics.Arcade.Sprite;
            
            if (projectile) {
                projectile.setVelocityY(-300);
                projectile.setActive(true);
                projectile.setVisible(true);
                
                // Set damage
                (projectile as any).damage = 10;
                
                // Auto destroy when out of bounds
                projectile.setData('checkOffscreen', true);
                
                this.lastFired = time;
                
                // Play sound
                this.scene.sound.play('shoot');
            }
        }
    }
    
    // Take damage
    takeDamage(amount: number): void {
        // Shield absorbs damage first
        if (this.shield > 0) {
            if (this.shield >= amount) {
                this.shield -= amount;
                amount = 0;
            } else {
                amount -= this.shield;
                this.shield = 0;
            }
        }
        
        // Apply remaining damage to health
        if (amount > 0) {
            this.health = Math.max(0, this.health - amount);
            
            // Check if dead
            if (this.health <= 0) {
                this.die();
            } else {
                // Flash damage effect
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0.5,
                    duration: 100,
                    yoyo: true
                });
            }
        }
    }
    
    // Add shield points
    addShield(amount: number): void {
        this.shield = Math.min(this.maxShield, this.shield + amount);
    }
    
    // Heal health points
    heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    // Die
    die(): void {
        // Play explosion animation
        this.scene.sound.play('explosion');
        
        // Create explosion effect
        const explosion = this.scene.add.sprite(this.x, this.y, 'explosion');
        explosion.play('explode');
        explosion.once('animationcomplete', () => {
            explosion.destroy();
            this.destroy();
        });
        
        // Game over
        this.scene.scene.start('GameOverScene');
    }
    
    // Getters
    getHealth(): number {
        return this.health;
    }
    
    getMaxHealth(): number {
        return this.maxHealth;
    }
    
    getShield(): number {
        return this.shield;
    }
    
    getMaxShield(): number {
        return this.maxShield;
    }
} 