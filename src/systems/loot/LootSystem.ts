import { Scene } from 'phaser';
import { Ship } from '../../objects/Ship';

export enum ResourceType {
    SpaceMinerals = 'minerals',    // Common
    RareElements = 'elements',     // Uncommon
    EnergyCrystals = 'crystals',   // Rare
    ShieldComponents = 'shield',    // Uncommon
    WeaponParts = 'weapon'         // Rare
}

export type ResourceRarity = 'common' | 'uncommon' | 'rare';

interface ResourceConfig {
    type: ResourceType;
    rarity: ResourceRarity;
    texture: string;
    frame?: string | number;
    baseValue: number;
    glowColor: number;
    glowAlpha: number;
    scale: number;
}

export class LootSystem {
    private scene: Scene;
    private lootGroup: Phaser.Physics.Arcade.Group;
    private ship: Ship;
    private magneticRange: number = 150; // Range at which loot starts moving towards the ship

    // Resource configurations with visual properties
    private readonly resourceConfigs: { [key in ResourceType]: ResourceConfig } = {
        [ResourceType.SpaceMinerals]: {
            type: ResourceType.SpaceMinerals,
            rarity: 'common',
            texture: 'minerals',
            baseValue: 10,
            glowColor: 0x66ff66, // Green glow
            glowAlpha: 0.4,
            scale: 0.5
        },
        [ResourceType.RareElements]: {
            type: ResourceType.RareElements,
            rarity: 'uncommon',
            texture: 'elements',
            baseValue: 25,
            glowColor: 0x66ffff, // Cyan glow
            glowAlpha: 0.6,
            scale: 0.5
        },
        [ResourceType.EnergyCrystals]: {
            type: ResourceType.EnergyCrystals,
            rarity: 'rare',
            texture: 'crystals',
            baseValue: 50,
            glowColor: 0xff66ff, // Purple glow
            glowAlpha: 0.8,
            scale: 0.5
        },
        [ResourceType.ShieldComponents]: {
            type: ResourceType.ShieldComponents,
            rarity: 'uncommon',
            texture: 'shield_parts',
            baseValue: 30,
            glowColor: 0x6666ff, // Blue glow
            glowAlpha: 0.6,
            scale: 0.5
        },
        [ResourceType.WeaponParts]: {
            type: ResourceType.WeaponParts,
            rarity: 'rare',
            texture: 'weapon_parts',
            baseValue: 45,
            glowColor: 0xff6666, // Red glow
            glowAlpha: 0.8,
            scale: 0.5
        }
    };

    constructor(scene: Scene, ship: Ship) {
        this.scene = scene;
        this.ship = ship;
        
        // Initialize physics group for loot items
        this.lootGroup = this.scene.physics.add.group({
            collideWorldBounds: true,
            bounceX: 0.5,
            bounceY: 0.5,
            dragX: 50,
            dragY: 50
        });

        // Set up collision between ship and loot
        this.scene.physics.add.overlap(
            this.ship,
            this.lootGroup,
            (obj1, obj2) => {
                if (obj1 instanceof Ship && obj2 instanceof Phaser.GameObjects.Container) {
                    this.collectLoot(obj1, obj2);
                }
            },
            undefined,
            this
        );
    }

    public spawnLoot(x: number, y: number, asteroidSize: number, asteroidVelocity: Phaser.Math.Vector2) {
        const dropCount = this.getDropCount(asteroidSize);

        for (let i = 0; i < dropCount; i++) {
            const resourceType = this.getRandomResourceType(asteroidSize);
            const config = this.resourceConfigs[resourceType];

            // Create loot container
            const container = this.scene.add.container(x, y);
            
            // Create glow effect
            const glow = this.scene.add.image(0, 0, 'loot_glow');
            glow.setTint(config.glowColor);
            glow.setAlpha(config.glowAlpha);
            glow.setScale(config.scale * 1.5); // Glow is bigger than the item
            
            // Create resource sprite
            const sprite = this.scene.physics.add.sprite(0, 0, config.texture);
            sprite.setScale(config.scale);
            
            // Add both to container
            container.add([glow, sprite]);
            
            // Enable physics on container
            this.scene.physics.world.enable(container);
            const body = container.body as Phaser.Physics.Arcade.Body;
            
            // Store resource data
            container.setData('type', resourceType);
            container.setData('value', config.baseValue);
            
            // Set random velocity based on asteroid's velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 50;
            const velocityX = Math.cos(angle) * speed + asteroidVelocity.x * 0.3;
            const velocityY = Math.sin(angle) * speed + asteroidVelocity.y * 0.3;
            
            body.setVelocity(velocityX, velocityY);
            body.setAngularVelocity(Math.random() * 180 - 90);
            
            // Add to loot group
            this.lootGroup.add(container);

            // Destroy after 30 seconds if not collected
            this.scene.time.delayedCall(30000, () => {
                if (container && container.active) {
                    container.destroy();
                }
            });

            // Add pulsing effect to glow
            this.scene.tweens.add({
                targets: glow,
                alpha: { from: config.glowAlpha, to: config.glowAlpha * 0.5 },
                scale: { from: config.scale * 1.5, to: config.scale * 1.3 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    private getRandomResourceType(asteroidSize: number): ResourceType {
        const rand = Math.random();
        let rarity: ResourceRarity;

        // Determine rarity based on asteroid size
        if (asteroidSize < 0.5) { // Small asteroid
            rarity = rand < 0.9 ? 'common' : 'uncommon';
        } else if (asteroidSize < 0.8) { // Medium asteroid
            rarity = rand < 0.7 ? 'common' : (rand < 0.95 ? 'uncommon' : 'rare');
        } else { // Large asteroid
            rarity = rand < 0.5 ? 'common' : (rand < 0.85 ? 'uncommon' : 'rare');
        }

        // Filter resources by rarity and pick one randomly
        const possibleResources = Object.values(this.resourceConfigs)
            .filter(config => config.rarity === rarity);
        return possibleResources[Math.floor(Math.random() * possibleResources.length)].type;
    }

    private getDropCount(asteroidSize: number): number {
        if (asteroidSize < 0.5) return 1 + Math.floor(Math.random() * 2); // 1-2 drops
        if (asteroidSize < 0.8) return 2 + Math.floor(Math.random() * 2); // 2-3 drops
        return 3 + Math.floor(Math.random() * 2); // 3-4 drops
    }

    private collectLoot(ship: Ship, lootContainer: Phaser.GameObjects.Container) {
        const resourceType = lootContainer.getData('type') as ResourceType;
        const value = lootContainer.getData('value') as number;
        const config = this.resourceConfigs[resourceType];

        // Create collection effect
        const particles = this.scene.add.particles(lootContainer.x, lootContainer.y, 'flares', {
            frame: ['blue'],
            lifespan: 500,
            speed: { min: 50, max: 100 },
            scale: { start: 0.4, end: 0 },
            quantity: 5,
            blendMode: 'ADD',
            tint: config.glowColor
        });

        // Auto-destroy particles
        this.scene.time.delayedCall(500, () => particles.destroy());

        // Emit collection event
        this.scene.events.emit('lootCollected', { type: resourceType, value: value });

        // Destroy the loot container
        lootContainer.destroy();
    }

    public update() {
        // Update magnetic effect
        const lootItems = this.lootGroup.getChildren();
        for (const loot of lootItems) {
            const container = loot as Phaser.GameObjects.Container;
            const distance = Phaser.Math.Distance.Between(
                container.x,
                container.y,
                this.ship.x,
                this.ship.y
            );

            if (distance < this.magneticRange) {
                // Calculate direction to ship
                const angle = Phaser.Math.Angle.Between(
                    container.x,
                    container.y,
                    this.ship.x,
                    this.ship.y
                );

                // Stronger pull when closer
                const pullStrength = (1 - distance / this.magneticRange) * 200;

                // Apply force towards ship
                const body = container.body as Phaser.Physics.Arcade.Body;
                body.velocity.x += Math.cos(angle) * pullStrength;
                body.velocity.y += Math.sin(angle) * pullStrength;
            }
        }
    }
} 