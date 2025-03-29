import { Scene } from 'phaser';
import { Asteroid, AsteroidConfig } from './Asteroid';

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
    private asteroids: Asteroid[] = [];
    private ship: Phaser.Physics.Arcade.Sprite;
    private smallAsteroids: Phaser.Physics.Arcade.Group;
    private mediumAsteroids: Phaser.Physics.Arcade.Group;
    private largeAsteroids: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene, config: AsteroidSystemConfig, ship: Phaser.Physics.Arcade.Sprite) {
        this.scene = scene;
        this.config = {
            ...config,
            maxAsteroids: config.maxAsteroids || 20,
            minSpawnDistance: config.minSpawnDistance || 200,
            asteroidTypes: config.asteroidTypes || [
                {
                    key: 'asteroid',
                    resourceType: 'iron',
                    health: 100,
                    scale: 1,
                    probability: 1
                }
            ]
        };
        this.ship = ship;

        // Initialize physics groups
        this.smallAsteroids = this.scene.physics.add.group({ classType: Asteroid });
        this.mediumAsteroids = this.scene.physics.add.group({ classType: Asteroid });
        this.largeAsteroids = this.scene.physics.add.group({ classType: Asteroid });

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
        if (this.asteroids.length >= this.config.maxAsteroids!) return;

        // Get random position within spawn area
        const position = this.getRandomSpawnPosition();
        
        // Check if position is too close to ship or other asteroids
        if (!this.isValidSpawnPosition(position)) {
            return;
        }

        // Select random asteroid type based on probability
        const asteroidType = this.selectRandomAsteroidType();

        // Create asteroid config
        const config: AsteroidConfig = {
            position,
            sprite: {
                key: asteroidType.key,
                frame: asteroidType.frame
            },
            health: asteroidType.health,
            scale: asteroidType.scale,
            resourceType: asteroidType.resourceType
        };

        // Create new asteroid
        const asteroid = new Asteroid(this.scene, config);
        this.asteroids.push(asteroid);
        
        // Add asteroid to appropriate physics group
        this.addAsteroidToGroup(asteroid);
        
        console.log('Spawned asteroid:', {
            position: position,
            scale: asteroidType.scale,
            resourceType: asteroidType.resourceType
        });

        // Listen for asteroid destruction
        asteroid.on('destroyed', this.onAsteroidDestroyed, this);
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
        if (distanceToShip < this.config.minSpawnDistance!) {
            return false;
        }

        // Check distance from other asteroids
        for (const asteroid of this.asteroids) {
            const distanceToAsteroid = Phaser.Math.Distance.Between(
                position.x,
                position.y,
                asteroid.x,
                asteroid.y
            );
            if (distanceToAsteroid < this.config.minSpawnDistance!) {
                return false;
            }
        }

        return true;
    }

    private selectRandomAsteroidType() {
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
        // Remove destroyed asteroid from array
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.destroyed);

        // Spawn a new asteroid after some delay
        this.scene.time.delayedCall(2000, () => {
            this.spawnAsteroid();
        });

        // Emit event for resource collection
        this.scene.events.emit('resourceDropped', data);
    }

    public update(): void {
        // Clean up destroyed asteroids
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.destroyed);

        // Spawn new asteroids if below maximum
        while (this.asteroids.length < this.config.maxAsteroids!) {
            this.spawnAsteroid();
        }
    }

    public getAsteroids(): Asteroid[] {
        return this.asteroids;
    }

    private setupAsteroidCollisions(): void {
        // Enable collisions between different asteroid groups
        this.scene.physics.add.collider(this.smallAsteroids, this.smallAsteroids);
        this.scene.physics.add.collider(this.smallAsteroids, this.mediumAsteroids);
        this.scene.physics.add.collider(this.smallAsteroids, this.largeAsteroids);
        this.scene.physics.add.collider(this.mediumAsteroids, this.mediumAsteroids);
        this.scene.physics.add.collider(this.mediumAsteroids, this.largeAsteroids);
        this.scene.physics.add.collider(this.largeAsteroids, this.largeAsteroids);
        
        // Add collision with ship
        this.scene.physics.add.collider(this.ship, this.smallAsteroids, this.handleShipCollision, undefined, this);
        this.scene.physics.add.collider(this.ship, this.mediumAsteroids, this.handleShipCollision, undefined, this);
        this.scene.physics.add.collider(this.ship, this.largeAsteroids, this.handleShipCollision, undefined, this);
    }

    private handleShipCollision = (object1: any, object2: any): void => {
        const ship = object1 as Phaser.Physics.Arcade.Sprite;
        const asteroid = object2 as Asteroid;

        if (!ship.body || !asteroid.body) return;

        // Calculate collision damage based on relative velocity
        const relativeVelocity = Phaser.Math.Distance.Between(
            ship.body.velocity.x,
            ship.body.velocity.y,
            (asteroid.body as Phaser.Physics.Arcade.Body).velocity.x,
            (asteroid.body as Phaser.Physics.Arcade.Body).velocity.y
        );

        // Emit collision event for the ship to handle
        this.scene.events.emit('shipAsteroidCollision', {
            ship: ship,
            asteroid: asteroid,
            velocity: relativeVelocity
        });

        console.log('Ship-asteroid collision:', {
            relativeVelocity,
            shipVelocity: ship.body.velocity,
            asteroidVelocity: (asteroid.body as Phaser.Physics.Arcade.Body).velocity
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
                (weapon, asteroid) => {
                    console.log('Weapon-asteroid overlap detected:', { weapon, asteroid });
                    this.handleWeaponCollision(weapon, asteroid);
                },
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

    private addAsteroidToGroup(asteroid: Asteroid): void {
        // Add asteroid to appropriate group based on size
        const scale = asteroid.scale;
        if (scale <= 0.5) {
            this.smallAsteroids.add(asteroid);
        } else if (scale <= 0.8) {
            this.mediumAsteroids.add(asteroid);
        } else {
            this.largeAsteroids.add(asteroid);
        }
        
        // Configure physics body
        const body = asteroid.body as Phaser.Physics.Arcade.Body;
        body.setCircle(asteroid.width / 2);
        body.setBounce(0.5);
        body.setDrag(50);
        body.setAngularDrag(50);
        body.setMaxVelocity(200);
        
        // Set velocity inversely proportional to size
        const baseSpeed = 50;
        const speedMultiplier = 1 / asteroid.scale;
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const speed = baseSpeed * speedMultiplier;
        body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }
} 