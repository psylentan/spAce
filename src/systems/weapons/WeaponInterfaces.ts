import { Scene } from 'phaser';

export interface IWeapon {
    damage: number;
    cooldown: number;
    currentCooldown: number;
    isReady: boolean;
    fire(scene: Scene, x: number, y: number, angle: number): void;
    update(delta: number): void;
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
    updateCooldown(weapon: IWeapon): void;
    showReadyEffect(): void;
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