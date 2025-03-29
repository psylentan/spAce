import { Scene } from 'phaser';

export class Ship extends Phaser.Physics.Arcade.Sprite {
    private shieldHealth: number = 100;
    private hullHealth: number = 100;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'ship');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up physics body
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setDrag(300);
        this.setAngularDrag(400);
        this.setMaxVelocity(600);

        // Set up collision body size
        if (this.body) {
            this.body.setSize(this.width * 0.8, this.height * 0.8);
        }
    }

    public getShieldHealth(): number {
        return this.shieldHealth;
    }

    public getHullHealth(): number {
        return this.hullHealth;
    }

    public damage(amount: number): void {
        // First damage shields
        if (this.shieldHealth > 0) {
            this.shieldHealth = Math.max(0, this.shieldHealth - amount);
            amount = Math.max(0, amount - this.shieldHealth); // Remaining damage after shields
        }

        // Then damage hull if shields are depleted
        if (amount > 0) {
            this.hullHealth = Math.max(0, this.hullHealth - amount);
            if (this.hullHealth <= 0) {
                this.scene.events.emit('shipDestroyed');
            }
        }
    }

    public regenerateShields(amount: number): void {
        this.shieldHealth = Math.min(100, this.shieldHealth + amount);
    }

    public repairHull(amount: number): void {
        this.hullHealth = Math.min(100, this.hullHealth + amount);
    }

    update() {
        // Add any update logic here if needed
    }
} 