import { Scene } from 'phaser';

export interface IWeapon {
    fire(ship: Phaser.Physics.Arcade.Sprite): void;
    update(delta: number): void;
    initialize(scene: Scene): void;
    getCooldownProgress(): number;
}

export interface IProjectile {
    damage: number;
    speed: number;
    lifespan: number;
}

export interface IEffect {
    type: string;
    duration: number;
    value: number;
    apply(target: any): void;
    update(delta: number): void;
}

export interface IWeaponUI {
    updateCooldowns(progress: { primary: number, secondary: number, special: number }): void;
}

export interface IWeaponSound {
    fire: string;
    ready: string;
    impact?: string;
}

export interface IWeaponConfig {
    damage: number;
    cooldown: number;
    projectileSpeed: number;
    projectileLifespan: number;
    effects?: IEffect[];
    sounds: IWeaponSound;
} 