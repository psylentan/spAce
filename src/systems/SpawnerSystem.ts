import Phaser from 'phaser';
import { EnemyShip } from '../objects/EnemyShip';

export class SpawnerSystem {
    private scene: Phaser.Scene;
    private enemyGroup: Phaser.GameObjects.Group;
    private asteroidGroup: Phaser.GameObjects.Group;
    private lootGroup: Phaser.GameObjects.Group;
    private encounterGroup: Phaser.GameObjects.Group;
    private miningGroup: Phaser.GameObjects.Group;
    private enemyProjectiles: Phaser.GameObjects.Group;
    
    private spawnTimer: number = 0;
    private spawnInterval: number = 2000; // ms
    private difficultyMultiplier: number = 1;
    private distance: number = 0;
    
    constructor(scene: Phaser.Scene, enemyProjectiles: Phaser.GameObjects.Group) {
        this.scene = scene;
        this.enemyProjectiles = enemyProjectiles;
        
        // Create groups for different entity types
        this.enemyGroup = this.scene.add.group({
            classType: EnemyShip,
            runChildUpdate: true
        });
        
        this.asteroidGroup = this.scene.add.group();
        this.lootGroup = this.scene.add.group();
        this.encounterGroup = this.scene.add.group();
        this.miningGroup = this.scene.add.group();
        
        // Initialize score
        this.scene.registry.set('score', 0);
        this.scene.registry.set('distance', 0);
    }
    
    update(time: number, delta: number): void {
        // Increment spawn timer
        this.spawnTimer += delta;
        
        // Increment distance (proxy for time/score)
        this.distance += delta / 1000;
        this.scene.registry.set('distance', Math.floor(this.distance));
        
        // Increase difficulty over time
        this.difficultyMultiplier = 1 + (this.distance / 100);
        
        // Spawn entities based on timer
        if (this.spawnTimer > this.spawnInterval) {
            this.spawn();
            this.spawnTimer = 0;
            
            // Adjust spawn interval based on difficulty
            this.spawnInterval = Math.max(500, 2000 - (this.distance / 2));
        }
    }
    
    private spawn(): void {
        // Randomly choose what to spawn
        const roll = Phaser.Math.Between(0, 100);
        
        if (roll < 40) {
            // 40% chance to spawn enemy
            this.spawnEnemy();
        } else if (roll < 70) {
            // 30% chance to spawn asteroid
            this.spawnAsteroid();
        } else if (roll < 85) {
            // 15% chance to spawn loot
            this.spawnLoot();
        } else if (roll < 95) {
            // 10% chance to spawn mining station
            this.spawnMiningStation();
        } else {
            // 5% chance to spawn encounter trigger
            this.spawnEncounterTrigger();
        }
    }
    
    private spawnEnemy(): void {
        const x = Phaser.Math.Between(50, this.scene.cameras.main.width - 50);
        const y = -50;
        
        const enemy = new EnemyShip(this.scene, x, y, this.enemyProjectiles);
        this.enemyGroup.add(enemy);
    }
    
    private spawnAsteroid(): void {
        const x = Phaser.Math.Between(50, this.scene.cameras.main.width - 50);
        const y = -50;
        const scale = Phaser.Math.FloatBetween(0.5, 2);
        
        const asteroid = this.scene.physics.add.sprite(x, y, 'asteroid');
        asteroid.setScale(scale);
        asteroid.setVelocity(
            Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(50, 150)
        );
        
        // Set health and damage based on size
        (asteroid as any).health = Math.floor(20 * scale);
        (asteroid as any).damage = Math.floor(10 * scale);
        
        // Add rotation
        asteroid.setAngularVelocity(Phaser.Math.Between(-20, 20));
        
        this.asteroidGroup.add(asteroid);
        
        // Auto-destroy when off screen
        asteroid.setData('checkOffscreen', true);
    }
    
    private spawnLoot(): void {
        const x = Phaser.Math.Between(50, this.scene.cameras.main.width - 50);
        const y = -50;
        
        const loot = this.scene.physics.add.sprite(x, y, 'loot-crate');
        loot.setVelocity(0, 50);
        
        // Set loot type
        const lootTypes = ['card', 'health', 'shield'];
        (loot as any).lootType = Phaser.Utils.Array.GetRandom(lootTypes);
        
        this.lootGroup.add(loot);
        
        // Auto-destroy when off screen
        loot.setData('checkOffscreen', true);
    }
    
    private spawnMiningStation(): void {
        const x = Phaser.Math.Between(50, this.scene.cameras.main.width - 50);
        const y = -50;
        
        const station = this.scene.physics.add.sprite(x, y, 'mining-station');
        station.setVelocity(0, 30);
        
        // Set mining time and rewards
        (station as any).miningTime = 2000; // ms to mine
        (station as any).miningReward = 200; // score when mined
        (station as any).isMining = false;
        
        this.miningGroup.add(station);
        
        // Auto-destroy when off screen
        station.setData('checkOffscreen', true);
    }
    
    private spawnEncounterTrigger(): void {
        const x = Phaser.Math.Between(50, this.scene.cameras.main.width - 50);
        const y = -50;
        
        const trigger = this.scene.physics.add.sprite(x, y, 'encounter-trigger');
        trigger.setVelocity(0, 40);
        
        // Generate random encounter ID
        (trigger as any).encounterId = Phaser.Math.Between(1, 5);
        
        this.encounterGroup.add(trigger);
        
        // Auto-destroy when off screen
        trigger.setData('checkOffscreen', true);
    }
    
    // Getters for collision detection
    getEnemyGroup(): Phaser.GameObjects.Group {
        return this.enemyGroup;
    }
    
    getAsteroidGroup(): Phaser.GameObjects.Group {
        return this.asteroidGroup;
    }
    
    getLootGroup(): Phaser.GameObjects.Group {
        return this.lootGroup;
    }
    
    getEncounterGroup(): Phaser.GameObjects.Group {
        return this.encounterGroup;
    }
    
    getMiningGroup(): Phaser.GameObjects.Group {
        return this.miningGroup;
    }
} 