import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

interface ProjectileSprite extends Phaser.Physics.Arcade.Sprite {
    dissolve: () => void;
}

export class PlasmaBlaster implements IWeapon {
    private config: IWeaponConfig;
    private lastFired: number = 0;
    private scene?: Scene;
    private projectileGroup?: Phaser.Physics.Arcade.Group;
    private trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(config: IWeaponConfig) {
        this.config = config;
    }

    initialize(scene: Scene): void {
        this.scene = scene;

        // Create projectile group
        this.projectileGroup = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 30,
            runChildUpdate: true,
            defaultKey: 'plasma_projectile',
            createCallback: (gameObject) => {
                const projectile = gameObject as Phaser.Physics.Arcade.Sprite;
                const body = projectile.body as Phaser.Physics.Arcade.Body;
                if (body) {
                    body.enable = true;
                    body.setSize(projectile.width * 0.8, projectile.height * 0.8);
                    body.setOffset(projectile.width * 0.1, projectile.height * 0.1);
                    body.setBounce(0);
                }
            }
        });

        // Create particle emitter for trails
        this.trailEmitter = scene.add.particles(0, 0, 'plasma_particle', {
            speed: 100,
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 200,
            tint: 0x4444ff,
            alpha: { start: 0.6, end: 0 }
        });

        // Generate placeholder projectile texture if not exists
        if (!scene.textures.exists('plasma_projectile')) {
            const graphics = scene.add.graphics();
            graphics.lineStyle(1, 0x4444ff);
            graphics.fillStyle(0x0000ff, 1);
            graphics.beginPath();
            graphics.arc(8, 8, 4, 0, Math.PI * 2);
            graphics.closePath();
            graphics.strokePath();
            graphics.fillPath();
            graphics.generateTexture('plasma_projectile', 16, 16);
            graphics.destroy();
        }

        // Generate placeholder particle texture if not exists
        if (!scene.textures.exists('plasma_particle')) {
            const graphics = scene.add.graphics();
            graphics.fillStyle(0x4444ff, 1);
            graphics.fillCircle(4, 4, 2);
            graphics.generateTexture('plasma_particle', 8, 8);
            graphics.destroy();
        }
    }

    fire(ship: Phaser.Physics.Arcade.Sprite): void {
        if (!this.scene || !this.projectileGroup) return;

        const now = Date.now();
        if (now - this.lastFired < this.config.cooldown) return;

        // Create projectile
        const projectile = this.projectileGroup.get(ship.x, ship.y, 'plasma_projectile') as ProjectileSprite;
        
        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setAngle(ship.angle);
            
            // Set data for damage
            projectile.setData('damage', this.config.damage);
            projectile.setData('isDissolving', false);
            
            // Calculate velocity based on angle
            const velocity = this.scene.physics.velocityFromRotation(
                ship.rotation - Math.PI/2,
                this.config.projectileSpeed
            );
            projectile.setVelocity(velocity.x, velocity.y);

            // Set up trail
            if (this.trailEmitter) {
                this.trailEmitter.startFollow(projectile);
            }

            // Add dissolve method
            projectile.dissolve = () => {
                if (projectile.getData('isDissolving')) return;
                projectile.setData('isDissolving', true);
                
                // Only try to stop the projectile if it's still active
                if (projectile.active && projectile.body) {
                    projectile.setVelocity(0, 0);
                }
                
                // Create dissolve effect
                if (this.scene) {
                    const particles = this.scene.add.particles(projectile.x, projectile.y, 'plasma_particle', {
                        speed: { min: 20, max: 50 },
                        scale: { start: 0.4, end: 0 },
                        alpha: { start: 0.6, end: 0 },
                        lifespan: 200,
                        quantity: 10,
                        blendMode: 'ADD'
                    });
                    
                    // Fade out the projectile if it's still active
                    if (projectile.active) {
                        this.scene.tweens.add({
                            targets: projectile,
                            alpha: 0,
                            scale: 0.5,
                            duration: 100,
                            onComplete: () => {
                                particles.destroy();
                                projectile.destroy();
                            }
                        });
                    } else {
                        // If projectile is already destroyed, just clean up particles
                        this.scene.time.delayedCall(200, () => {
                            particles.destroy();
                        });
                    }
                }
            };

            // Set lifespan
            this.scene.time.delayedCall(this.config.projectileLifespan, () => {
                if (this.trailEmitter) {
                    this.trailEmitter.stopFollow();
                }
                if (!projectile.getData('isDissolving')) {
                    projectile.dissolve();
                }
            });

            // Play fire sound
            if (this.config.sounds.fire) {
                this.scene.sound.play(this.config.sounds.fire, { volume: 0.5 });
            }

            this.lastFired = now;
        }
    }

    update(delta: number): void {
        // Update any active projectiles or effects
    }

    getCooldownProgress(): number {
        const now = Date.now();
        const timeSinceLastFire = now - this.lastFired;
        return Math.min(1, timeSinceLastFire / this.config.cooldown);
    }

    getProjectileGroup(): Phaser.Physics.Arcade.Group | undefined {
        return this.projectileGroup;
    }
} 