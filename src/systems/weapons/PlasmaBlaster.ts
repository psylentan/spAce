import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

export class PlasmaBlaster implements IWeapon {
    damage: number;
    cooldown: number;
    currentCooldown: number;
    isReady: boolean;
    private projectileSpeed: number;
    private projectileLifespan: number;
    private projectileGroup?: Phaser.Physics.Arcade.Group;
    private trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(config: IWeaponConfig) {
        this.damage = config.damage;
        this.cooldown = config.cooldown;
        this.currentCooldown = 0;
        this.isReady = true;
        this.projectileSpeed = config.projectileSpeed;
        this.projectileLifespan = config.projectileLifespan;
    }

    initialize(scene: Scene) {
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

    fire(scene: Scene, x: number, y: number, angle: number): void {
        if (!this.isReady || !this.projectileGroup) return;

        // Create projectile
        const projectile = this.projectileGroup.get(x, y, 'plasma_projectile') as Phaser.Physics.Arcade.Sprite;
        
        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setAngle(angle);
            
            // Calculate velocity based on angle
            const velocity = scene.physics.velocityFromAngle(angle - 90, this.projectileSpeed);
            projectile.setVelocity(velocity.x, velocity.y);

            // Set up trail
            if (this.trailEmitter) {
                this.trailEmitter.startFollow(projectile);
            }

            // Set lifespan
            scene.time.delayedCall(this.projectileLifespan, () => {
                if (this.trailEmitter) {
                    this.trailEmitter.stopFollow();
                }
                projectile.setActive(false);
                projectile.setVisible(false);
                projectile.destroy();
            });

            // Play fire sound
            scene.sound.play('plasma_fire', { volume: 0.5 });

            // Start cooldown
            this.isReady = false;
            this.currentCooldown = this.cooldown;
        }
    }

    update(delta: number): void {
        if (!this.isReady && this.currentCooldown > 0) {
            this.currentCooldown -= delta;
            if (this.currentCooldown <= 0) {
                this.isReady = true;
                this.currentCooldown = 0;
            }
        }
    }

    getCooldownProgress(): number {
        return this.isReady ? 1 : 1 - (this.currentCooldown / this.cooldown);
    }
} 