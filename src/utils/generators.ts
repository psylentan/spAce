import { Scene, GameObjects, Physics } from 'phaser';

// Types from our templates
interface ShipConfig {
    type: 'player' | 'enemy';
    name: string;
    stats: {
        health: number;
        shield: number;
        speed: number;
        rotationSpeed: number;
    };
    weapon: WeaponConfig;
}

interface WeaponConfig {
    name: string;
    damage: number;
    cooldown: number;
    projectileSpeed: number;
    effects?: EffectConfig[];
}

interface PowerUpConfig {
    type: 'health' | 'shield' | 'speed' | 'weapon';
    value: number;
    duration?: number;
    visualEffect: string;
}

interface MineConfig {
    damage: number;
    triggerRadius: number;
    explosionDelay: number;
    explosionRadius: number;
}

interface DebrisConfig {
    size: 'small' | 'medium' | 'large';
    health: number;
    resourceValue: number;
    damageOnCollision: number;
}

interface EffectConfig {
    type: 'damage' | 'heal' | 'speed' | 'slow';
    value: number;
    duration: number;
    stackable?: boolean;
    maxStacks?: number;
}

export class EntityGenerator {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    generateShip(config: ShipConfig): Physics.Arcade.Sprite {
        const ship = this.scene.physics.add.sprite(0, 0, `ship_${config.type}`);
        
        // Set custom properties
        ship.setData('config', config);
        ship.setData('stats', config.stats);
        ship.setData('weapon', config.weapon);
        
        // Scale down the player ship significantly
        if (config.type === 'player') {
            ship.setScale(0.05); // Try a much smaller scale (5% of original size)
        }
        
        // Set physics properties
        ship.setDrag(100);
        ship.setAngularDrag(100);
        ship.setMaxVelocity(config.stats.speed);
        
        return ship;
    }

    generateWeapon(config: WeaponConfig): GameObjects.Group {
        // Create a group for projectiles
        const projectiles = this.scene.add.group({
            classType: Physics.Arcade.Sprite,
            maxSize: 30,
            runChildUpdate: true
        }) as GameObjects.Group & { weaponConfig?: WeaponConfig };
        
        // Store config as a custom property
        projectiles.weaponConfig = config;
        
        return projectiles;
    }

    generatePowerUp(config: PowerUpConfig): Physics.Arcade.Sprite {
        const powerUp = this.scene.physics.add.sprite(0, 0, `powerup_${config.type}`);
        
        powerUp.setData('config', config);
        
        // Add visual effect
        if (config.visualEffect) {
            this.scene.add.particles(0, 0, config.visualEffect, {
                follow: powerUp
            });
        }
        
        return powerUp;
    }

    generateMine(config: MineConfig): Physics.Arcade.Sprite {
        const mine = this.scene.physics.add.sprite(0, 0, 'mine');
        
        mine.setData('config', config);
        mine.setData('armed', false);
        
        // Add trigger area
        const triggerArea = this.scene.add.circle(0, 0, config.triggerRadius);
        this.scene.physics.add.existing(triggerArea, true);
        
        mine.setData('triggerArea', triggerArea);
        
        return mine;
    }

    generateDebris(config: DebrisConfig): Physics.Arcade.Sprite {
        const debris = this.scene.physics.add.sprite(0, 0, `debris_${config.size}`);
        
        debris.setData('config', config);
        debris.setData('health', config.health);
        
        // Add random rotation
        debris.setAngularVelocity(Phaser.Math.Between(-100, 100));
        
        return debris;
    }

    generateEffect(config: EffectConfig): GameObjects.GameObject {
        const effect = new GameObjects.GameObject(this.scene, 'effect');
        
        effect.setData('config', config);
        effect.setData('startTime', this.scene.time.now);
        effect.setData('stacks', 1);
        
        return effect;
    }
}

// Example usage in a scene:
/*
class GameScene extends Scene {
    private entityGenerator: EntityGenerator;

    create() {
        this.entityGenerator = new EntityGenerator(this);
        
        // Generate player ship
        const playerShip = this.entityGenerator.generateShip({
            type: 'player',
            name: 'Scout',
            stats: {
                health: 100,
                shield: 50,
                speed: 300,
                rotationSpeed: 150
            },
            weapon: {
                name: 'Basic Laser',
                damage: 20,
                cooldown: 200,
                projectileSpeed: 500
            }
        });
        
        // Position it on screen
        playerShip.setPosition(
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );
    }
}
*/ 