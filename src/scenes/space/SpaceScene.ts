import 'phaser';
import { BaseScene } from '../BaseScene';
import { GAME_CONSTANTS } from '../../constants';
import { Card, Encounter } from '../../types';
import { ParallaxBackground } from '../components/ParallaxBackground';

interface SpaceObject {
    type: 'meteor' | 'debris' | 'comet' | 'station' | 'powerup' | 'crate' | 'boss';
    sprite: Phaser.Physics.Arcade.Sprite;
    health?: number;
    reward?: string;
}

export class SpaceScene extends BaseScene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private enemies!: Phaser.Physics.Arcade.Group;
    private spaceObjects!: Phaser.Physics.Arcade.Group;
    private projectiles!: Phaser.Physics.Arcade.Group;
    private enemyProjectiles!: Phaser.Physics.Arcade.Group;
    private parallaxBackground!: ParallaxBackground;
    private spawnTimer: number = 0;
    private shootTimer: number = 0;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private playerDeck: Card[] = [];
    private playerHealth: number = GAME_CONSTANTS.PLAYER.INITIAL_HEALTH;
    private healthText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'SpaceScene' });
    }

    init(): void {
        this.physics.world.setBounds(0, 0, GAME_CONSTANTS.WINDOW.WIDTH, GAME_CONSTANTS.WINDOW.HEIGHT);
        // Initialize a basic deck for testing
        this.playerDeck = [
            { id: '1', name: 'Attack', cost: 1, effects: [{ action: 'damage', amount: 15, target: 'enemy' }], type: 'combat' },
            { id: '2', name: 'Defend', cost: 1, effects: [{ action: 'heal', amount: 10, target: 'self' }], type: 'combat' }
        ];
    }

    preload(): void {
        this.load.image('player-ship', 'assets/images/player-ship.svg');
        this.load.image('enemy-ship', 'assets/images/enemy-ship.svg');
        this.load.image('projectile', 'assets/images/projectile.png');
        this.load.image('meteor', 'assets/images/meteor.png');
        this.load.image('debris', 'assets/images/debris.png');
        this.load.image('comet', 'assets/images/comet.png');
        this.load.image('station', 'assets/images/station.png');
        this.load.image('powerup', 'assets/images/powerup.png');
        this.load.image('crate', 'assets/images/crate.png');
    }

    create(): void {
        super.create();
        
        // Create parallax background
        this.parallaxBackground = new ParallaxBackground(this);
        
        // Initialize groups
        this.enemies = this.physics.add.group();
        this.spaceObjects = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        
        // Create player
        this.player = this.physics.add.sprite(this.centerX, this.gameHeight - 100, 'player-ship');
        this.player.setScale(2);
        this.player.setCollideWorldBounds(true);
        
        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add UI
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#ffffff'
        });
        
        this.healthText = this.add.text(16, 56, `Health: ${this.playerHealth}`, {
            fontSize: '32px',
            color: '#ffffff'
        });

        // Set up collisions
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, undefined, this);
        this.physics.add.overlap(this.player, this.spaceObjects, this.handleSpaceObjectCollision, undefined, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, undefined, this);
        this.physics.add.overlap(this.player, this.enemyProjectiles, this.handleEnemyProjectileHit, undefined, this);

        // Initialize basic deck
        this.playerDeck = [
            { id: '1', name: 'Attack', cost: 1, effects: [{ action: 'damage', amount: 15, target: 'enemy' }], type: 'combat' },
            { id: '2', name: 'Defend', cost: 1, effects: [{ action: 'heal', amount: 10, target: 'self' }], type: 'combat' }
        ];

        // Handle resize
        this.scale.on('resize', this.handleResize, this);
    }

    update(time: number, delta: number): void {
        if (!this.player || !this.cursors) return;

        // Update parallax background
        this.parallaxBackground.update();

        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-GAME_CONSTANTS.PLAYER.SPEED);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(GAME_CONSTANTS.PLAYER.SPEED);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-GAME_CONSTANTS.PLAYER.SPEED);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(GAME_CONSTANTS.PLAYER.SPEED);
        } else {
            this.player.setVelocityY(0);
        }

        // Shooting
        this.shootTimer += delta;
        if (this.cursors.space.isDown && this.shootTimer >= 250) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Spawn objects
        this.spawnTimer += delta;
        if (this.spawnTimer >= GAME_CONSTANTS.ENEMY.SPAWN_RATE) {
            this.spawnRandomObject();
            this.spawnTimer = 0;
        }

        // Update objects
        this.updateGameObjects();
    }

    private shoot(): void {
        const projectile = this.projectiles.create(this.player.x, this.player.y - 20, 'projectile');
        projectile.setVelocityY(-400);
    }

    private spawnRandomObject(): void {
        const x = Phaser.Math.Between(0, this.scale.width);
        const types: SpaceObject['type'][] = ['meteor', 'debris', 'comet', 'station', 'powerup', 'crate', 'boss'];
        const weights = [40, 30, 10, 5, 5, 5, 5]; // Probability weights
        
        const type = this.weightedRandom(types, weights);
        const sprite = this.spaceObjects.create(x, -50, type);
        
        const object: SpaceObject = {
            type,
            sprite,
            health: type === 'boss' ? 100 : (type === 'meteor' ? 3 : 1),
            reward: this.getReward(type)
        };

        sprite.setData('objectData', object);
        sprite.setVelocityY(GAME_CONSTANTS.ENEMY.SPEED);
    }

    private weightedRandom(items: any[], weights: number[]): any {
        const total = weights.reduce((a, b) => a + b);
        let random = Math.random() * total;
        
        for (let i = 0; i < items.length; i++) {
            if (random < weights[i]) return items[i];
            random -= weights[i];
        }
        return items[0];
    }

    private getReward(type: SpaceObject['type']): string {
        switch (type) {
            case 'boss': return 'card';
            case 'crate': return 'powerup';
            case 'station': return 'health';
            default: return 'points';
        }
    }

    private updateGameObjects(): void {
        // Update enemies and space objects
        [...this.enemies.getChildren(), ...this.spaceObjects.getChildren()].forEach((obj: Phaser.GameObjects.GameObject) => {
            const gameObject = obj as Phaser.Physics.Arcade.Sprite;
            if (gameObject.y > this.scale.height + 50) {
                gameObject.destroy();
            }
        });

        // Clean up projectiles
        this.projectiles.getChildren().forEach((proj: Phaser.GameObjects.GameObject) => {
            const projectile = proj as Phaser.Physics.Arcade.Sprite;
            if (projectile.y < -50) {
                projectile.destroy();
            }
        });
    }

    private handleSpaceObjectCollision(player: Phaser.GameObjects.GameObject, object: Phaser.GameObjects.GameObject): void {
        const spaceObject = (object as Phaser.Physics.Arcade.Sprite).getData('objectData') as SpaceObject;
        
        if (spaceObject.type === 'boss') {
            this.startCardBattle();
        } else if (spaceObject.type === 'powerup' || spaceObject.type === 'crate') {
            this.collectReward(spaceObject.reward!);
        } else {
            this.takeDamage(20);
        }
        
        object.destroy();
    }

    private handleProjectileHit(projectile: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject): void {
        projectile.destroy();
        
        const targetData = (target as Phaser.Physics.Arcade.Sprite).getData('objectData') as SpaceObject;
        if (targetData && targetData.health) {
            targetData.health--;
            if (targetData.health <= 0) {
                this.handleDestroy(targetData);
                target.destroy();
            }
        } else {
            target.destroy();
            this.updateScore(100);
        }
    }

    private handleEnemyProjectileHit(player: Phaser.GameObjects.GameObject, projectile: Phaser.GameObjects.GameObject): void {
        projectile.destroy();
        this.takeDamage(10);
    }

    private handleDestroy(object: SpaceObject): void {
        if (object.reward) {
            this.collectReward(object.reward);
        }
        this.updateScore(object.type === 'boss' ? 1000 : 100);
    }

    private collectReward(reward: string): void {
        switch (reward) {
            case 'card':
                // Add new card to deck
                break;
            case 'powerup':
                // Apply powerup
                break;
            case 'health':
                this.healPlayer(20);
                break;
            case 'points':
                this.updateScore(50);
                break;
        }
    }

    private takeDamage(amount: number): void {
        this.playerHealth = Math.max(0, this.playerHealth - amount);
        this.healthText.setText(`Health: ${this.playerHealth}`);
        
        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    private healPlayer(amount: number): void {
        this.playerHealth = Math.min(GAME_CONSTANTS.PLAYER.MAX_HP, this.playerHealth + amount);
        this.healthText.setText(`Health: ${this.playerHealth}`);
    }

    private updateScore(points: number): void {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    private gameOver(): void {
        this.scene.start('GameOverScene', { score: this.score });
    }

    private handleResize(gameSize: Phaser.Structs.Size): void {
        this.parallaxBackground.resize(gameSize.width, gameSize.height);
    }

    private startCardBattle(): void {
        const encounter: Encounter = {
            id: '1',
            enemyName: 'Boss Ship',
            enemyHp: 100,
            enemyDeck: [
                { id: 'e1', name: 'Boss Attack', cost: 1, effects: [{ action: 'damage', amount: 20, target: 'self' }], type: 'combat' }
            ]
        };

        this.scene.pause();
        this.scene.launch('CardBattleScene', {
            deck: this.playerDeck,
            encounter: encounter
        });
    }
} 