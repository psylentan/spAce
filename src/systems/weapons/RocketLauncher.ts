import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

export class RocketLauncher implements IWeapon {
    private config: IWeaponConfig;
    private lastFired: number = 0;
    private scene?: Scene;
    private projectiles: Phaser.GameObjects.Container[] = [];

    constructor(config: IWeaponConfig) {
        this.config = config;
    }

    initialize(scene: Scene): void {
        this.scene = scene;
    }

    fire(ship: Phaser.Physics.Arcade.Sprite): void {
        if (!this.scene) return;

        const now = Date.now();
        if (now - this.lastFired < this.config.cooldown) return;

        // Create rocket container
        const rocket = this.scene.add.container(ship.x, ship.y);
        this.projectiles.push(rocket);

        // Create rocket body
        const rocketBody = this.scene.add.rectangle(0, 0, 20, 8, 0xff4444);
        rocket.add(rocketBody);

        // Add fins
        const finLeft = this.scene.add.triangle(-8, 0, 0, -4, 0, 4, -8, 0, 0xff2222);
        const finRight = this.scene.add.triangle(-8, 0, 0, -4, 0, 4, -8, 0, 0xff2222);
        rocket.add([finLeft, finRight]);

        // Add thruster particles
        const particles = this.scene.add.particles(-10, 0, 'particle', {
            speed: 100,
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 200,
            frequency: 20,
            quantity: 2
        });
        rocket.add(particles);

        // Add physics body to rocket container
        this.scene.physics.add.existing(rocket);
        const rocketPhysics = (rocket.body as Phaser.Physics.Arcade.Body);
        
        // Set rocket angle and velocity
        rocket.rotation = ship.rotation;
        const angle = ship.rotation - Math.PI/2;
        this.scene.physics.velocityFromRotation(
            angle,
            this.config.projectileSpeed,
            rocketPhysics.velocity
        );

        // Add glow effect
        const glow = this.scene.add.pointlight(0, 0, 0xff4444, 30, 0.5);
        rocket.add(glow);

        // Play fire sound
        if (this.config.sounds.fire) {
            this.scene.sound.play(this.config.sounds.fire);
        }

        // Set lifespan
        this.scene.time.delayedCall(this.config.projectileLifespan, () => {
            // Create explosion effect
            if (rocket.active) {
                this.createExplosion(rocket.x, rocket.y);
                rocket.destroy();
                const index = this.projectiles.indexOf(rocket);
                if (index > -1) {
                    this.projectiles.splice(index, 1);
                }
            }
        });

        this.lastFired = now;
    }

    private createExplosion(x: number, y: number): void {
        if (!this.scene) return;

        // Create explosion particles
        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            quantity: 20,
            emitting: false
        });

        // Emit a single burst of particles
        particles.emitParticle(20);

        // Create expanding circle effect
        const circle = this.scene.add.circle(x, y, 5, 0xff4444);
        this.scene.tweens.add({
            targets: circle,
            radius: 30,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                circle.destroy();
                particles.destroy();
            }
        });

        // Add point light for glow effect
        const light = this.scene.add.pointlight(x, y, 0xff4444, 60, 0.8);
        this.scene.tweens.add({
            targets: light,
            radius: 100,
            intensity: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => light.destroy()
        });
    }

    update(delta: number): void {
        // Update projectiles
        for (const rocket of this.projectiles) {
            if (rocket.active) {
                // Add smoke trail
                if (this.scene && Math.random() < 0.3) {
                    const smoke = this.scene.add.circle(
                        rocket.x - Math.cos(rocket.rotation + Math.PI/2) * 10,
                        rocket.y - Math.sin(rocket.rotation + Math.PI/2) * 10,
                        2,
                        0x666666,
                        0.3
                    );
                    this.scene.tweens.add({
                        targets: smoke,
                        alpha: 0,
                        scale: 2,
                        duration: 400,
                        onComplete: () => smoke.destroy()
                    });
                }
            }
        }
    }

    getCooldownProgress(): number {
        const now = Date.now();
        const timeSinceLastFire = now - this.lastFired;
        return Math.min(1, timeSinceLastFire / this.config.cooldown);
    }
} 