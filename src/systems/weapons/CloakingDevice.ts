import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

export class CloakingDevice implements IWeapon {
    private config: IWeaponConfig;
    private lastFired: number = 0;
    private isActive: boolean = false;
    private activeEffect?: Phaser.GameObjects.Particles.ParticleEmitter;
    private activeShip?: Phaser.Physics.Arcade.Sprite;
    private originalShipAlpha: number = 1;
    private cloakDuration: number = 5000; // 5 seconds of cloaking

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
        // Create cloak effect particle texture
        const graphics = scene.add.graphics();
        graphics.lineStyle(1, 0x00ffff);
        graphics.fillStyle(0x00ffff, 0.1);
        graphics.beginPath();
        graphics.arc(0, 0, 4, 0, Math.PI * 2);
        graphics.closePath();
        graphics.strokePath();
        graphics.fillPath();
        graphics.generateTexture('cloak_particle', 8, 8);
        graphics.destroy();
    }

    fire(scene: Scene, x: number, y: number, angle: number): void {
        if (!this.isReady || this.isActive) return;

        // Play activation sound
        scene.sound.play(this.config.sounds.fire);

        // Get reference to the ship
        this.activeShip = scene.ship;
        if (!this.activeShip) return;

        // Store original alpha
        this.originalShipAlpha = this.activeShip.alpha;

        // Create cloaking effect
        this.activeEffect = scene.add.particles(0, 0, 'cloak_particle', {
            follow: this.activeShip,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.2, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 1000,
            blendMode: 'ADD',
            frequency: 50,
            quantity: 2
        });

        // Apply cloaking effect
        scene.tweens.add({
            targets: this.activeShip,
            alpha: 0.2,
            duration: 500,
            ease: 'Power2'
        });

        // Set active state
        this.isActive = true;
        this.currentCooldown = this.cooldown;

        // Set up deactivation timer
        scene.time.delayedCall(this.cloakDuration, () => {
            this.deactivate(scene);
        });

        // Play ready sound when cooldown completes
        scene.time.delayedCall(this.cooldown, () => {
            if (this.isReady) {
                scene.sound.play(this.config.sounds.ready);
            }
        });
    }

    deactivate(scene: Scene): void {
        if (!this.isActive) return;

        // Restore ship visibility
        if (this.activeShip) {
            scene.tweens.add({
                targets: this.activeShip,
                alpha: this.originalShipAlpha,
                duration: 500,
                ease: 'Power2'
            });
        }

        // Clean up particle effect
        if (this.activeEffect) {
            this.activeEffect.destroy();
            this.activeEffect = undefined;
        }

        // Reset state
        this.isActive = false;
        this.activeShip = undefined;
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