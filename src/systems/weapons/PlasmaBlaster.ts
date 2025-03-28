import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

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
            runChildUpdate: true
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
        const projectile = this.projectileGroup.get(ship.x, ship.y, 'plasma_projectile') as Phaser.Physics.Arcade.Sprite;
        
        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setAngle(ship.angle);
            
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

            // Set lifespan
            this.scene.time.delayedCall(this.config.projectileLifespan, () => {
                if (this.trailEmitter) {
                    this.trailEmitter.stopFollow();
                }
                projectile.setActive(false);
                projectile.setVisible(false);
                projectile.destroy();
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
} 