import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';

export class CloakingDevice implements IWeapon {
    private config: IWeaponConfig;
    private lastFired: number = 0;
    private isActive: boolean = false;
    private scene!: Scene;
    private activeEffect?: Phaser.GameObjects.Particles.ParticleEmitter;
    private activeShip?: Phaser.Physics.Arcade.Sprite;
    private originalShipAlpha: number = 1;
    private cloakDuration: number = 5000; // 5 seconds of cloaking

    constructor(config: IWeaponConfig) {
        this.config = config;
    }

    initialize(scene: Scene): void {
        this.scene = scene;

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

    fire(ship: Phaser.Physics.Arcade.Sprite): void {
        const now = Date.now();
        if (now - this.lastFired < this.config.cooldown || this.isActive) return;

        // Play activation sound
        if (this.config.sounds.fire) {
            this.scene.sound.play(this.config.sounds.fire);
        }

        // Store ship reference and original alpha
        this.activeShip = ship;
        this.originalShipAlpha = ship.alpha;

        // Create cloaking effect
        this.activeEffect = this.scene.add.particles(0, 0, 'cloak_particle', {
            follow: ship,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.2, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 1000,
            blendMode: 'ADD',
            frequency: 50,
            quantity: 2
        });

        // Apply cloaking effect
        this.scene.tweens.add({
            targets: ship,
            alpha: 0.2,
            duration: 500,
            ease: 'Power2'
        });

        // Set active state
        this.isActive = true;
        this.lastFired = now;

        // Set up deactivation timer
        this.scene.time.delayedCall(this.cloakDuration, () => {
            this.deactivate();
        });

        // Play ready sound when cooldown completes
        this.scene.time.delayedCall(this.config.cooldown, () => {
            if (this.getCooldownProgress() === 1 && this.config.sounds.ready) {
                this.scene.sound.play(this.config.sounds.ready);
            }
        });
    }

    private deactivate(): void {
        if (!this.isActive) return;

        // Restore ship visibility
        if (this.activeShip) {
            this.scene.tweens.add({
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
        // No continuous updates needed - using time-based cooldown
    }

    getCooldownProgress(): number {
        const now = Date.now();
        const timeSinceLastFire = now - this.lastFired;
        return Math.min(1, timeSinceLastFire / this.config.cooldown);
    }
} 