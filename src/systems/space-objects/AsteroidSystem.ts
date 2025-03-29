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
        // Create a physics group for asteroids
        const asteroidGroup = this.scene.physics.add.group(this.asteroids);
        
        // Enable collision between asteroids in the group
        this.scene.physics.add.collider(asteroidGroup, asteroidGroup);
        
        // Add collision with ship (optional, depending on your game design)
        this.scene.physics.add.collider(this.ship, asteroidGroup, (ship, asteroid) => {
            // Handle ship-asteroid collision here
            console.log('Ship collided with asteroid');
        });
    }

    public setupCollisionWithWeapons(weaponGroup: Phaser.Physics.Arcade.Group): void {
        console.log('Setting up collision detection. Active asteroids:', this.asteroids.length);
        
        // Debug log weapon group
        console.log('Weapon group details:', {
            name: weaponGroup.name,
            active: weaponGroup.active,
            childrenCount: weaponGroup.getChildren().length,
            isRunChildUpdate: weaponGroup.runChildUpdate
        });

        // Create a physics group for asteroids if not already created
        const asteroidGroup = this.scene.physics.add.group(this.asteroids);

        // Ensure all asteroids have proper physics bodies
        this.asteroids.forEach((asteroid, index) => {
            if (!asteroid.body || !(asteroid.body as Phaser.Physics.Arcade.Body).enable) {
                console.warn(`Asteroid ${index} has invalid physics body, reinitializing...`);
                this.scene.physics.add.existing(asteroid);
                const body = asteroid.body as Phaser.Physics.Arcade.Body;
                body.setCircle(asteroid.width / 2);
                body.enable = true;
            }

            console.log(`Asteroid ${index} details:`, {
                active: asteroid.active,
                visible: asteroid.visible,
                body: asteroid.body ? {
                    enable: (asteroid.body as Phaser.Physics.Arcade.Body).enable,
                    width: (asteroid.body as Phaser.Physics.Arcade.Body).width,
                    height: (asteroid.body as Phaser.Physics.Arcade.Body).height
                } : 'no body'
            });
        });
        
        // Use collider for weapon-asteroid collision
        this.scene.physics.add.overlap(
            weaponGroup,
            asteroidGroup,
            (weaponObj, asteroidObj) => {
                const weapon = weaponObj as Phaser.GameObjects.Sprite;
                const asteroidSprite = asteroidObj as Phaser.Physics.Arcade.Sprite;
                
                // Find the actual Asteroid instance from our array
                const asteroid = this.asteroids.find(a => a === asteroidSprite);
                
                if (!asteroid) {
                    console.warn('Could not find matching asteroid instance');
                    return;
                }
                
                console.log('Collision detected between weapon and asteroid:', {
                    weaponPosition: { x: weapon.x, y: weapon.y },
                    asteroidPosition: { x: asteroid.x, y: asteroid.y }
                });
                
                // Handle weapon-specific damage
                const damage = weapon.getData('damage') as number || 10;
                asteroid.damage(damage);
                
                // Use dissolve effect if available, otherwise destroy
                if (typeof (weapon as any).dissolve === 'function') {
                    (weapon as any).dissolve();
                } else {
                    weapon.destroy();
                }
            },
            undefined,
            this
        );
    }
} 