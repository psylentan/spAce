import { Scene } from 'phaser';
import { Planet, PlanetConfig } from './Planet';

export class PlanetManager {
    private scene: Scene;
    private planets: Planet[] = [];
    private ship: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Scene, ship: Phaser.Physics.Arcade.Sprite) {
        this.scene = scene;
        this.ship = ship;
    }

    public createPlanet(config: PlanetConfig): Planet {
        const planet = new Planet(this.scene, config);
        this.planets.push(planet);
        return planet;
    }

    public update(): void {
        // Update each planet and apply gravity to ship
        this.planets.forEach(planet => {
            planet.update();
            planet.applyGravityToObject(this.ship);
        });
    }

    public getPlanets(): Planet[] {
        return this.planets;
    }

    // Helper method to create a test planet
    public createTestPlanet(x: number, y: number): Planet {
        const config: PlanetConfig = {
            name: 'Test Planet',
            type: 'earth',
            position: { x, y },
            scale: 1,
            gravityRadius: 300,
            gravityStrength: 100,
            sprite: {
                key: 'planet_earth', // We'll need to load this asset
            }
        };

        return this.createPlanet(config);
    }
} 