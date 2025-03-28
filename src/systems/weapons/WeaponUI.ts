import { Scene } from 'phaser';

export class WeaponUI {
    private scene: Scene;
    private primaryCooldownBar: Phaser.GameObjects.Graphics;
    private secondaryCooldownBar: Phaser.GameObjects.Graphics;
    private specialCooldownBar: Phaser.GameObjects.Graphics;

    constructor(scene: Scene) {
        this.scene = scene;
        this.primaryCooldownBar = scene.add.graphics();
        this.secondaryCooldownBar = scene.add.graphics();
        this.specialCooldownBar = scene.add.graphics();
        
        this.primaryCooldownBar.setScrollFactor(0);
        this.secondaryCooldownBar.setScrollFactor(0);
        this.specialCooldownBar.setScrollFactor(0);
        
        this.primaryCooldownBar.setDepth(1000);
        this.secondaryCooldownBar.setDepth(1000);
        this.specialCooldownBar.setDepth(1000);
    }

    updateCooldowns(progress: { primary: number, secondary: number, special: number }): void {
        // Clear all bars
        this.primaryCooldownBar.clear();
        this.secondaryCooldownBar.clear();
        this.specialCooldownBar.clear();

        // Draw primary weapon cooldown bar
        this.primaryCooldownBar.fillStyle(0x444444);
        this.primaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 30, 100, 10);
        
        this.primaryCooldownBar.fillStyle(0x4444ff);
        this.primaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 30, 100 * progress.primary, 10);

        // Draw secondary weapon cooldown bar
        this.secondaryCooldownBar.fillStyle(0x444444);
        this.secondaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 50, 100, 10);
        
        this.secondaryCooldownBar.fillStyle(0xff4444);
        this.secondaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 50, 100 * progress.secondary, 10);

        // Draw special weapon cooldown bar
        this.specialCooldownBar.fillStyle(0x444444);
        this.specialCooldownBar.fillRect(10, this.scene.cameras.main.height - 70, 100, 10);
        
        this.specialCooldownBar.fillStyle(0x44ffff);
        this.specialCooldownBar.fillRect(10, this.scene.cameras.main.height - 70, 100 * progress.special, 10);

        // Show ready effects
        if (progress.primary === 1) {
            this.primaryCooldownBar.lineStyle(2, 0xffffff);
            this.primaryCooldownBar.strokeRect(10, this.scene.cameras.main.height - 30, 100, 10);
        }
        if (progress.secondary === 1) {
            this.secondaryCooldownBar.lineStyle(2, 0xffffff);
            this.secondaryCooldownBar.strokeRect(10, this.scene.cameras.main.height - 50, 100, 10);
        }
        if (progress.special === 1) {
            this.specialCooldownBar.lineStyle(2, 0xffffff);
            this.specialCooldownBar.strokeRect(10, this.scene.cameras.main.height - 70, 100, 10);
        }
    }
} 