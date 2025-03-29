import { Scene } from 'phaser';
import { Asteroid, AsteroidConfig } from './Asteroid';
import { LootSystem } from '../loot/LootSystem';
import { Ship } from '../../objects/Ship';

export interface AsteroidSystemConfig {
    spawnArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    maxAsteroids?: number;
    minSpawnDistance?: number;
    asteroidTypes?: {
        key: string;
        frame?: string | number;
        resourceType: string;
        health: number;
        scale: number;
        probability: number;
    }[];
}

export class AsteroidSystem {
    private scene: Scene;
    private config: AsteroidSystemConfig;
    private asteroids: Phaser.GameObjects.Group;
    private lootSystem: LootSystem;
    private ship: Ship;
    private smallAsteroids: Phaser.Physics.Arcade.Group;
    private mediumAsteroids: Phaser.Physics.Arcade.Group;
    private largeAsteroids: Phaser.Physics.Arcade.Group;
    private weaponGroup: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene, config: AsteroidSystemConfig, ship: Ship) {
        this.scene = scene;
        this.config = config;
        this.ship = ship;
        
        // Initialize groups
        this.asteroids = this.scene.add.group();
        this.smallAsteroids = this.scene.physics.add.group();
        this.mediumAsteroids = this.scene.physics.add.group();
        this.largeAsteroids = this.scene.physics.add.group();
        this.weaponGroup = this.scene.physics.add.group();
        
        // Initialize loot system
        this.lootSystem = new LootSystem(scene, ship);

        // Initialize asteroid field
        this.initializeAsteroids();
        
        // Setup asteroid-to-asteroid collisions
        this.setupAsteroidCollisions();
    }

    private initializeAsteroids(): void {
        // Initial spawn of asteroids
        const initialCount = Math.floor(this.config.maxAsteroids! / 2);
        for (let i = 0; i < initialCount; i++) {
            this.spawnAsteroid();
        }
    }

    private spawnAsteroid(): void {
        // Safety check for required configuration
        if (!this.config.maxAsteroids || !this.config.minSpawnDistance || !this.config.asteroidTypes) {
            console.warn('Missing required asteroid configuration');
            return;
        }

        const asteroids = this.asteroids.getChildren() as Asteroid[];
        if (asteroids.length >= this.config.maxAsteroids) return;

        // Get random position within spawn area
        const position = this.getRandomSpawnPosition();
        if (!this.isValidSpawnPosition(position)) {
            console.log('Failed to find valid spawn position');
            return;
        }

        // Get random asteroid type with safety check
        const asteroidType = this.getRandomAsteroidType();
        if (!asteroidType) {
            console.warn('Failed to get valid asteroid type');
            return;
        }

        // Create asteroid config
        const config: AsteroidConfig = {
            position,
            health: asteroidType.health,
            scale: asteroidType.scale,
            resourceType: asteroidType.resourceType,
            lootSystem: this.lootSystem
        };

        try {
            // Create new asteroid
            const asteroid = new Asteroid(this.scene, config);
            
            // Add to appropriate physics group based on size
            const scale = config.scale || 1;
            if (scale < 0.5) {
                this.smallAsteroids.add(asteroid);
            } else if (scale < 0.8) {
                this.mediumAsteroids.add(asteroid);
            } else {
                this.largeAsteroids.add(asteroid);
            }

            // Add to general asteroids group for tracking
            this.asteroids.add(asteroid);

            // Add very slow random velocity to make asteroids drift gently
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const speed = Phaser.Math.FloatBetween(0.05, 0.15);
            asteroid.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Add very slow rotation
            const rotationSpeed = Phaser.Math.FloatBetween(-0.2, 0.2);
            asteroid.setAngularVelocity(rotationSpeed);
        } catch (error) {
            console.error('Failed to create asteroid:', error);
        }
    }

    private getRandomSpawnPosition(): { x: number; y: number } {
        return {
            x: this.config.spawnArea.x + Math.random() * this.config.spawnArea.width,
            y: this.config.spawnArea.y + Math.random() * this.config.spawnArea.height
        };
    }

    private isValidSpawnPosition(position: { x: number; y: number }): boolean {
        // Check distance from ship
        const distanceToShip = Phaser.Math.Distance.Between(
            position.x,
            position.y,
            this.ship.x,
            this.ship.y
        );
        if (distanceToShip < this.config.minSpawnDistance!) return false;

        // Check distance from other asteroids
        const asteroids = this.asteroids.getChildren() as Asteroid[];
        for (const asteroid of asteroids) {
            const distanceToAsteroid = Phaser.Math.Distance.Between(
                position.x,
                position.y,
                asteroid.x,
                asteroid.y
            );
            if (distanceToAsteroid < this.config.minSpawnDistance!) return false;
        }

        return true;
    }

    private getRandomAsteroidType() {
        const totalProbability = this.config.asteroidTypes!.reduce(
            (sum, type) => sum + type.probability,
            0
        );
        let random = Math.random() * totalProbability;

        for (const type of this.config.asteroidTypes!) {
            random -= type.probability;
            if (random <= 0) {
                return type;
            }
        }

        return this.config.asteroidTypes![0];
    }

    private onAsteroidDestroyed(data: { position: { x: number; y: number }; resourceType: string; resourceAmount: number }): void {
        // Remove destroyed asteroids
        const asteroids = this.asteroids.getChildren() as Asteroid[];
        this.asteroids.clear();
        asteroids.filter(asteroid => !asteroid.destroyed).forEach(asteroid => {
            this.asteroids.add(asteroid);
        });

        // Only spawn a new asteroid if we're below the maximum
        if (this.asteroids.getChildren().length < this.config.maxAsteroids!) {
            // Spawn a new asteroid after some delay
            this.scene.time.delayedCall(10000, () => {
                this.spawnAsteroid();
            });
        }

        // Emit event for resource collection
        this.scene.events.emit('resourceDropped', data);
    }

    public update(): void {
        // Clean up destroyed asteroids
        const asteroids = this.asteroids.getChildren() as Asteroid[];
        this.asteroids.clear();
        asteroids.filter(asteroid => !asteroid.destroyed).forEach(asteroid => {
            this.asteroids.add(asteroid);
        });

        // Only spawn new asteroids when one is destroyed, not continuously
        // This is now handled in onAsteroidDestroyed()
    }

    public getAsteroids(): Asteroid[] {
        return this.asteroids.getChildren() as Asteroid[];
    }

    private setupAsteroidCollisions(): void {
        // Enable collisions between different asteroid groups
        this.scene.physics.add.collider(this.smallAsteroids, this.smallAsteroids);
        this.scene.physics.add.collider(this.smallAsteroids, this.mediumAsteroids);
        this.scene.physics.add.collider(this.smallAsteroids, this.largeAsteroids);
        this.scene.physics.add.collider(this.mediumAsteroids, this.mediumAsteroids);
        this.scene.physics.add.collider(this.mediumAsteroids, this.largeAsteroids);
        this.scene.physics.add.collider(this.largeAsteroids, this.largeAsteroids);
        
        // Add collision with ship for each asteroid group
        [this.smallAsteroids, this.mediumAsteroids, this.largeAsteroids].forEach(group => {
            this.scene.physics.add.overlap(
                this.ship,
                group,
                this.handleShipCollision,
                undefined,
                this
            );
        });
    }

    private handleShipCollision(object1: any, object2: any): void {
        // Ensure we have the right objects, regardless of order
        let ship: Ship;
        let asteroid: Asteroid;
        
        if (object1 instanceof Ship && object2 instanceof Asteroid) {
            ship = object1;
            asteroid = object2;
        } else if (object2 instanceof Ship && object1 instanceof Asteroid) {
            ship = object2;
            asteroid = object1;
        } else {
            console.warn('Invalid collision objects:', { object1, object2 });
            return;
        }

        if (!ship.body || !asteroid.body) {
            console.warn('Ship or asteroid missing physics body in collision');
            return;
        }

        // Calculate relative velocity for damage
        const relativeVelocity = new Phaser.Math.Vector2()
            .copy(ship.body.velocity)
            .subtract(asteroid.body.velocity);
        
        const impactSpeed = relativeVelocity.length();
        const damage = Math.floor(impactSpeed * 0.1); // 10% of impact speed as damage

        console.log('Ship collision detected:', {
            impactSpeed,
            calculatedDamage: damage,
            shipVelocity: ship.body.velocity,
            asteroidVelocity: asteroid.body.velocity,
            shipInitialHealth: {
                hull: ship.getHullHealth(),
                shield: ship.getShieldHealth()
            }
        });

        // Apply damage to ship
        ship.damage(damage);

        // Log post-damage state
        console.log('Ship damage applied:', {
            damage,
            shipFinalHealth: {
                hull: ship.getHullHealth(),
                shield: ship.getShieldHealth()
            }
        });
    }

    public setupCollisionWithWeapons(weaponGroup: Phaser.Physics.Arcade.Group): void {
        console.log('Setting up collision detection with weapon groups', {
            weaponGroup: weaponGroup,
            smallAsteroids: this.smallAsteroids,
            mediumAsteroids: this.mediumAsteroids,
            largeAsteroids: this.largeAsteroids
        });
        
        // Set up collision with each asteroid group
        [this.smallAsteroids, this.mediumAsteroids, this.largeAsteroids].forEach(asteroidGroup => {
            console.log('Setting up overlap for asteroid group:', asteroidGroup);
            this.scene.physics.add.overlap(
                weaponGroup,
                asteroidGroup,
                this.handleWeaponCollision,
                undefined,
                this
            );
        });
    }

    private handleWeaponCollision = (object1: any, object2: any): void => {
        console.log('handleWeaponCollision called with:', { object1, object2 });
        const weapon = object1 as Phaser.GameObjects.GameObject;
        const asteroid = object2 as Asteroid;
        
        // Handle weapon-specific damage
        const damage = weapon.getData('damage') as number || 10;
        console.log('Applying weapon damage:', { damage, asteroid });
        asteroid.damage(damage);
        
        // Use dissolve effect if available, otherwise destroy
        if (typeof (weapon as any).dissolve === 'function') {
            console.log('Dissolving weapon');
            (weapon as any).dissolve();
        } else {
            console.log('Destroying weapon');
            weapon.destroy();
        }
    }
} 