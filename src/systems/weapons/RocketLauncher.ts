import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

export class RocketLauncher implements IWeapon {
    private config: IWeaponConfig;
    private lastFired: number = 0;
    private projectileGroup?: Phaser.Physics.Arcade.Group;
    private explosionGroup?: Phaser.GameObjects.Group;

    // IWeapon interface properties
    damage: number;
    cooldown: number;
    currentCooldown: number = 0;

    constructor(config: IWeaponConfig) {
        this.config = config;
        this.damage = config.damage;
        this.cooldown = config.cooldown;
    }

    get isReady(): boolean {
        return this.currentCooldown <= 0;
    }

    initialize(scene: Scene): void {
        // Create projectile group for rockets
        this.projectileGroup = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });

        // Create explosion group
        this.explosionGroup = scene.add.group({
            defaultKey: 'explosion',
            maxSize: 10
        });

        // Create placeholder texture for rockets
        const graphics = scene.add.graphics();
        graphics.lineStyle(2, 0xff0000);
        graphics.fillStyle(0xff4444);
        graphics.beginPath();
        graphics.moveTo(0, -10);
        graphics.lineTo(5, 5);
        graphics.lineTo(-5, 5);
        graphics.closePath();
        graphics.strokePath();
        graphics.fillPath();
        graphics.generateTexture('rocket', 10, 15);
        graphics.destroy();

        // Create placeholder texture for explosions
        const explosionGraphics = scene.add.graphics();
        explosionGraphics.lineStyle(2, 0xff8800);
        explosionGraphics.fillStyle(0xff4400, 0.5);
        explosionGraphics.beginPath();
        explosionGraphics.arc(0, 0, 20, 0, Math.PI * 2);
        explosionGraphics.closePath();
        explosionGraphics.strokePath();
        explosionGraphics.fillPath();
        explosionGraphics.generateTexture('explosion', 40, 40);
        explosionGraphics.destroy();
    }

    fire(scene: Scene, x: number, y: number, angle: number): void {
        const currentTime = scene.time.now;
        if (currentTime - this.lastFired < this.config.cooldown) {
            return;
        }

        // Play fire sound
        scene.sound.play(this.config.sounds.fire);

        // Create rocket projectile
        const rocket = this.projectileGroup?.get(x, y, 'rocket') as Phaser.Physics.Arcade.Sprite;
        if (rocket) {
            rocket.setActive(true);
            rocket.setVisible(true);
            rocket.setAngle(angle);

            // Calculate velocity based on angle
            const velocity = scene.physics.velocityFromAngle(angle - 90, this.config.projectileSpeed);
            rocket.setVelocity(velocity.x, velocity.y);

            // Add particle trail
            const particles = scene.add.particles(0, 0, 'rocket', {
                speed: 100,
                scale: { start: 0.2, end: 0 },
                alpha: { start: 0.5, end: 0 },
                lifespan: 200,
                blendMode: 'ADD',
                follow: rocket
            });

            // Set up rocket destruction and explosion
            scene.time.delayedCall(this.config.projectileLifespan, () => {
                this.createExplosion(scene, rocket.x, rocket.y);
                particles.destroy();
                rocket.destroy();
            });

            this.lastFired = currentTime;
            this.currentCooldown = this.cooldown;
        }
    }

    private createExplosion(scene: Scene, x: number, y: number): void {
        const explosion = this.explosionGroup?.get(x, y) as Phaser.GameObjects.Sprite;
        if (explosion) {
            explosion.setActive(true);
            explosion.setVisible(true);
            explosion.setScale(0.1);

            // Create explosion animation
            scene.tweens.add({
                targets: explosion,
                scale: 2,
                alpha: { from: 1, to: 0 },
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    explosion.setActive(false);
                    explosion.setVisible(false);
                }
            });

            // Add particle effect for the explosion
            const particles = scene.add.particles(x, y, 'explosion', {
                speed: { min: 50, max: 200 },
                scale: { start: 0.5, end: 0 },
                alpha: { start: 0.8, end: 0 },
                lifespan: 500,
                blendMode: 'ADD',
                quantity: 20
            });

            // Destroy particles after animation
            scene.time.delayedCall(500, () => {
                particles.destroy();
            });
        }
    }

    update(delta: number): void {
        // Update cooldown
        if (this.currentCooldown > 0) {
            this.currentCooldown = Math.max(0, this.currentCooldown - delta);
        }
    }

    getCooldownProgress(): number {
        return 1 - (this.currentCooldown / this.cooldown);
    }
} 