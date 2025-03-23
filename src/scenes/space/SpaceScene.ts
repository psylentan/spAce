import 'phaser';
import { BaseScene } from '../BaseScene';
import { GAME_CONSTANTS, SpaceObject } from '@/constants';
import { Card, PlayerState, Encounter } from '@/types';
import { ParallaxBackground } from '../../systems/ParallaxBackground';

type SpaceObjectType = SpaceObject['type'];

interface SpaceObjectData {
    type: SpaceObjectType;
    health: number;
    damage: number;
    reward: number;
}

export class SpaceScene extends BaseScene {
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
    private enemies: Phaser.GameObjects.Group | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private playerHealth: number;
    private playerDeck: Card[] = [];
    private lastFired: number = 0;
    private spaceObjects: Phaser.Physics.Arcade.Group | null = null;
    private parallaxBackground: ParallaxBackground | null = null;
    private healthText: Phaser.GameObjects.Text | null = null;
    private scoreText: Phaser.GameObjects.Text | null = null;
    private score: number = 0;
    private gameOver: boolean = false;
    private playerState: PlayerState;

    constructor() {
        super({ key: 'SpaceScene' });
        this.playerHealth = GAME_CONSTANTS.PLAYER.INITIAL_HP;
        this.playerState = {
            hp: this.playerHealth,
            shield: 0,
            deck: this.playerDeck,
            position: { x: 0, y: 0 }
        };
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
        // Load game assets
        this.load.image('player-ship', 'assets/images/player-ship.svg');
        this.load.image('enemy-ship', 'assets/images/enemy-ship.svg');
        this.load.image('projectile', 'assets/images/projectile.svg');
        this.load.image('meteor', 'assets/images/meteor.svg');
        this.load.image('debris', 'assets/images/debris.svg');
        this.load.image('comet', 'assets/images/comet.svg');
        this.load.image('station', 'assets/images/station.svg');
        this.load.image('powerup', 'assets/images/powerup.svg');
        this.load.image('crate', 'assets/images/crate.svg');

        // Load audio files that actually exist
        this.load.audio('background-music', 'assets/audio/space-arcade.mp3');
        this.load.audio('engine-loop', 'assets/audio/engine-loop1.mp3');
        this.load.audio('engine-start', 'assets/audio/engine-start1.mp3');
        
        // Generate background layers
        this.generateBackgroundTextures();
    }

    private generateBackgroundTextures(): void {
        const generateStarField = (key: string, starCount: number, color: number, size: number) => {
            const graphics = this.add.graphics();
            graphics.clear();
            
            // Create a gradient background
            graphics.fillGradientStyle(0x000022, 0x000022, 0x000044, 0x000044, 1);
            graphics.fillRect(0, 0, 512, 512);

            // Add stars
            graphics.fillStyle(color);
            for (let i = 0; i < starCount; i++) {
                const x = Phaser.Math.Between(0, 512);
                const y = Phaser.Math.Between(0, 512);
                graphics.fillCircle(x, y, size);
            }

            graphics.generateTexture(key, 512, 512);
            graphics.destroy();
        };

        // Generate three layers with different star densities
        generateStarField('background-far', 50, 0x666666, 1);  // Distant stars
        generateStarField('background-mid', 30, 0x888888, 2);  // Mid-distance stars
        generateStarField('background-near', 15, 0xaaaaaa, 3); // Near stars
    }

    create(): void {
        // Set world bounds for physics
        this.physics.world.setBounds(0, 0, GAME_CONSTANTS.PLAY_AREA.WIDTH, GAME_CONSTANTS.PLAY_AREA.HEIGHT);

        // Initialize game objects and systems
        this.parallaxBackground = new ParallaxBackground(this);

        // Play background music with loop
        this.sound.play('background-music', { loop: true, volume: 0.3 });

        // Create game objects
        this.player = this.createPlayer();
        // Set up camera to follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.0); // Adjust zoom as needed

        if (this.parallaxBackground) {
            this.parallaxBackground.setPlayer(this.player);
        }
        this.enemies = this.createEnemies();
        this.spaceObjects = this.createSpaceObjects();

        // Initialize input
        if (!this.input) {
            console.error('Input system not initialized');
            return;
        }
        const cursorKeys = this.input.keyboard?.createCursorKeys();
        if (!cursorKeys) {
            console.error('Failed to create cursor keys');
            return;
        }
        this.cursors = cursorKeys;

        // Setup collisions
        this.setupCollisions();

        // Create UI
        this.createUI();

        // Start spawning
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnRandomObject.bind(this),
            loop: true
        });

        // Listen for resize events
        this.scale.on('resize', this.handleResize, this);

        // Update player state position
        this.updatePlayerStatePosition();
    }

    private setupCollisions(): void {
        if (!this.player || !this.enemies || !this.spaceObjects) return;

        // Add collision between player and enemies
        this.physics.add.collider(
            this.player,
            this.enemies,
            this.handleEnemyCollision.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
        );

        // Add collision between player and space objects
        this.physics.add.collider(
            this.player,
            this.spaceObjects,
            this.handleSpaceObjectCollision.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
        );
    }

    private createUI(): void {
        this.healthText = this.add.text(16, 16, `HP: ${this.playerHealth}`, {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.scoreText = this.add.text(16, 50, `Score: ${this.score}`, {
            fontSize: '24px',
            color: '#ffffff'
        });
    }

    private updateUI(): void {
        if (this.healthText) {
            this.healthText.setText(`HP: ${this.playerHealth}`);
        }
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    update(time: number): void {
        if (!this.player || !this.cursors || this.gameOver) return;

        // Update parallax background based on movement
        if (this.parallaxBackground) {
            this.parallaxBackground.update();
        }

        // Get current velocities
        const currentVelocityX = this.player.body.velocity.x;
        const currentVelocityY = this.player.body.velocity.y;
        const speed = GAME_CONSTANTS.PLAYER.SPEED;

        // Rotation controls (keyboard or mouse)
        const pointer = this.input?.activePointer;
        if (pointer) {
            // Calculate angle between player and mouse pointer in world coordinates
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const targetAngle = Phaser.Math.Angle.Between(
                this.player.x, this.player.y,
                worldPoint.x, worldPoint.y
            );
            // Add 90 degrees because our sprite faces up
            const targetRotation = targetAngle + Math.PI/2;
            
            // Smoothly rotate towards target angle
            const currentRotation = this.player.rotation;
            const rotationDiff = Phaser.Math.Angle.Wrap(targetRotation - currentRotation);
            const rotationSpeed = 0.1; // Adjust this for faster/slower rotation
            
            this.player.setRotation(currentRotation + rotationDiff * rotationSpeed);
        }
        // Keyboard rotation (alternative to mouse)
        else if (this.cursors.left.isDown) {
            this.player.setAngularVelocity(-150); // Rotate left
        }
        else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(150);  // Rotate right
        }
        else {
            this.player.setAngularVelocity(0);    // Stop rotation
        }

        // Forward/Backward movement
        if (this.cursors.up.isDown) {
            // Accelerate in the direction the ship is facing
            const acceleration = 0.05; // Lower value for more gradual acceleration
            const shipAngle = this.player.rotation - Math.PI/2; // Subtract 90 degrees because sprite faces up
            const targetVelocityX = Math.cos(shipAngle) * speed;
            const targetVelocityY = Math.sin(shipAngle) * speed;
            
            // Smoothly accelerate towards target velocity
            this.player.setVelocity(
                currentVelocityX + (targetVelocityX - currentVelocityX) * acceleration,
                currentVelocityY + (targetVelocityY - currentVelocityY) * acceleration
            );
        }
        else if (this.cursors.down.isDown) {
            // Gradual deceleration when moving backward
            const deceleration = 0.98;
            this.player.setVelocity(
                currentVelocityX * deceleration,
                currentVelocityY * deceleration
            );
        }
        else {
            // Very slight natural deceleration when no keys are pressed
            const drag = 0.995;
            this.player.setVelocity(
                currentVelocityX * drag,
                currentVelocityY * drag
            );
        }

        // Shooting
        if (this.cursors.space.isDown && time > this.lastFired) {
            this.playerShoot();
            this.lastFired = time + GAME_CONSTANTS.PLAYER.SHOOT_DELAY;
        }

        // Update player state
        this.playerState.position = {
            x: this.player.x,
            y: this.player.y
        };
        this.playerState.hp = this.playerHealth;

        // Update UI
        this.updateUI();
    }

    private handleEnemyCollision(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | null,
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | null
    ): void {
        if (!player || !enemy) return;

        const enemySprite = enemy as Phaser.GameObjects.Sprite;
        const encounter: Encounter = {
            id: 'normal-enemy',
            enemyName: 'Space Enemy',
            enemyHp: GAME_CONSTANTS.ENEMY.INITIAL_HP,
            enemyDeck: []
        };

        this.scene.start('CardBattleScene', {
            playerState: this.playerState,
            encounter,
            returnScene: 'SpaceScene'
        });
        enemySprite.destroy();
    }

    private playerShoot(): void {
        if (!this.player) return;

        // Play shoot sound using the correct audio key
        this.sound.play('player-shoot', { volume: 0.4 });

        const projectile = this.physics.add.sprite(
            this.player.x,
            this.player.y - 20,
            'projectile'
        );
        if (projectile) {
            // Set velocity based on player's rotation
            const angle = this.player.rotation - Math.PI/2;
            const speed = GAME_CONSTANTS.PLAYER.PROJECTILE_SPEED;
            projectile.setVelocity(
                Math.sin(angle) * speed,
                Math.cos(angle) * -speed
            );
            projectile.setRotation(this.player.rotation);
        }
    }

    private enemyShoot(enemy: Phaser.GameObjects.Sprite): void {
        if (!this.enemies) return;

        const projectile = this.physics.add.sprite(
            enemy.x,
            enemy.y + 20,
            'projectile'
        );
        if (projectile) {
            projectile.setVelocityY(GAME_CONSTANTS.ENEMY.PROJECTILE_SPEED);
        }
    }

    private spawnRandomObject(): void {
        if (this.gameOver || !this.player) return;

        const buffer = GAME_CONSTANTS.PLAY_AREA.EDGE_BUFFER;
        const spawnSide = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
        
        let x, y;
        switch (spawnSide) {
            case 0: // top
                x = Phaser.Math.Between(buffer, GAME_CONSTANTS.PLAY_AREA.WIDTH - buffer);
                y = -buffer;
                break;
            case 1: // right
                x = GAME_CONSTANTS.PLAY_AREA.WIDTH + buffer;
                y = Phaser.Math.Between(buffer, GAME_CONSTANTS.PLAY_AREA.HEIGHT - buffer);
                break;
            case 2: // bottom
                x = Phaser.Math.Between(buffer, GAME_CONSTANTS.PLAY_AREA.WIDTH - buffer);
                y = GAME_CONSTANTS.PLAY_AREA.HEIGHT + buffer;
                break;
            default: // left
                x = -buffer;
                y = Phaser.Math.Between(buffer, GAME_CONSTANTS.PLAY_AREA.HEIGHT - buffer);
                break;
        }

        const types: SpaceObjectType[] = ['meteor', 'debris', 'comet', 'station', 'powerup', 'crate', 'boss'];
        const weights = [40, 30, 10, 5, 5, 5, 5];
        
        const type = this.weightedRandom<SpaceObjectType>(types, weights);
        const sprite = this.physics.add.sprite(x, y, type);
        if (!sprite) return;

        if (this.spaceObjects) {
            this.spaceObjects.add(sprite);
        }
        
        const config = GAME_CONSTANTS.SPACE_OBJECTS[type.toUpperCase() as keyof typeof GAME_CONSTANTS.SPACE_OBJECTS];
        if (!config) return;

        // Set appropriate scale for each object type
        const scales: Record<SpaceObjectType, number> = {
            meteor: 1.5,
            debris: 1.2,
            comet: 1.8,
            station: 2,
            powerup: 1,
            crate: 1.2,
            boss: 3
        };
        sprite.setScale(scales[type]);

        // Calculate direction towards player
        const angle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
        
        // Set velocity based on type and direction
        const speed = GAME_CONSTANTS.ENEMY.SPEED;
        const velocities: Record<SpaceObjectType, number> = {
            meteor: speed * 1.2,
            debris: speed * 0.8,
            comet: speed * 1.5,
            station: speed * 0.5,
            powerup: speed * 0.7,
            crate: speed * 0.6,
            boss: speed * 0.4
        };

        const objectSpeed = velocities[type];
        sprite.setVelocity(
            Math.cos(angle) * objectSpeed,
            Math.sin(angle) * objectSpeed
        );

        // Rotate meteors and debris
        if (type === 'meteor' || type === 'debris') {
            sprite.setAngularVelocity(Phaser.Math.Between(-100, 100));
        }

        const objectData: SpaceObjectData = {
            type,
            health: config.HEALTH,
            damage: config.DAMAGE,
            reward: config.REWARD
        };
        sprite.setData('objectData', objectData);

        // Special effects for certain types
        if (type === 'powerup') {
            this.tweens.add({
                targets: sprite,
                alpha: 0.5,
                yoyo: true,
                repeat: -1,
                duration: 1000
            });
            // Play powerup sound using engine start since we don't have a dedicated powerup sound
            this.sound.play('engine-start', { volume: 0.3 });
        }

        if (type === 'boss') {
            sprite.setAlpha(0);
            this.tweens.add({
                targets: sprite,
                alpha: 1,
                duration: 1000,
                ease: 'Power2'
            });
        }
    }

    private handleSpaceObjectCollision(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        spaceObject: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ): void {
        const sprite = spaceObject as Phaser.GameObjects.Sprite;
        const objectData = sprite.getData('objectData') as SpaceObjectData;
        if (!objectData) return;

        // Play collision sound using engine sound since we don't have a dedicated collision sound
        this.sound.play('engine-start', { volume: 0.4 });

        const config = GAME_CONSTANTS.SPACE_OBJECTS[objectData.type.toUpperCase() as keyof typeof GAME_CONSTANTS.SPACE_OBJECTS];
        if (!config) return;

        this.playerHealth = Math.max(0, this.playerHealth - config.DAMAGE);
        this.playerState.hp = this.playerHealth;
        this.updateUI();

        if (objectData.type === 'boss') {
            const encounter: Encounter = {
                id: 'boss-enemy',
                enemyName: 'Space Boss',
                enemyHp: GAME_CONSTANTS.ENEMY.INITIAL_HP * 2,
                enemyDeck: []
            };

            this.scene.start('CardBattleScene', { 
                playerState: this.playerState,
                encounter,
                returnScene: 'SpaceScene'
            });
        }

        if (this.playerHealth <= 0) {
            this.gameOver = true;
            this.scene.start('GameOverScene', { score: this.score });
        }

        // Destroy the space object
        sprite.destroy();
    }

    private weightedRandom<T>(items: T[], weights: number[]): T {
        const total = weights.reduce((a, b) => a + b);
        let random = Math.random() * total;
        
        for (let i = 0; i < items.length; i++) {
            if (random < weights[i]) return items[i];
            random -= weights[i];
        }
        return items[0];
    }

    private handleResize(gameSize: Phaser.Structs.Size): void {
        if (this.parallaxBackground) {
            this.parallaxBackground.resize(gameSize.width, gameSize.height);
        }
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

    private updatePlayerStatePosition(): void {
        if (this.player) {
            this.playerState.position = {
                x: this.player.x,
                y: this.player.y
            };
        }
    }

    private createPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        // Create player in the center of the screen
        const player = this.physics.add.sprite(
            this.scale.width / 2,
            this.scale.height / 2,
            'player-ship'
        );
        player.setCollideWorldBounds(true);
        // Set the origin to center for proper rotation
        player.setOrigin(0.5, 0.5);
        return player;
    }

    private createEnemies(): Phaser.GameObjects.Group {
        return this.add.group();
    }

    private createSpaceObjects(): Phaser.Physics.Arcade.Group {
        return this.physics.add.group();
    }
} 