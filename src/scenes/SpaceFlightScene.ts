import Phaser from 'phaser';
import { PlayerShip } from '../objects/PlayerShip';
import { SpawnerSystem } from '../systems/SpawnerSystem';
import { createStarfield } from '../utils/createStarfield';

export class SpaceFlightScene extends Phaser.Scene {
    private player: PlayerShip;
    private spawner: SpawnerSystem;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerProjectiles: Phaser.Physics.Arcade.Group;
    private enemyProjectiles: Phaser.Physics.Arcade.Group;
    private background: Phaser.GameObjects.Image;
    private starLayers: Phaser.GameObjects.TileSprite[] = [];
    private scoreText: Phaser.GameObjects.Text;
    private distanceText: Phaser.GameObjects.Text;
    private healthBar: Phaser.GameObjects.Graphics;
    private shieldBar: Phaser.GameObjects.Graphics;
    private isMining: boolean = false;
    private currentMiningStation: any = null;
    private miningTimer: number = 0;
    private miningDuration: number = 2000; // 2 seconds to mine
    private backgroundMusic: Phaser.Sound.BaseSound;
    
    constructor() {
        super('SpaceFlightScene');
    }
    
    create(): void {
        // Create static background
        this.background = this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0);
            
        // Scale the background to fill the screen
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Create parallax star layers
        this.starLayers = createStarfield(this);
        
        // Create player
        this.player = new PlayerShip(
            this,
            this.cameras.main.width / 2,
            this.cameras.main.height - 100
        );
        
        // Get cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add spacebar for shooting
        this.input.keyboard.on('keydown-SPACE', () => {
            this.playerShoot();
        });
        
        // Initialize projectile groups as physics groups
        this.playerProjectiles = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true
        });
        
        this.enemyProjectiles = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true
        });
        
        // Initialize spawner system
        this.spawner = new SpawnerSystem(this, this.enemyProjectiles);
        
        // Set up collisions
        this.setupCollisions();
        
        // UI elements
        this.createUI();
        
        // Create event for pickups
        this.events.on('createPickup', this.createPickup, this);
        
        // Play background music
        this.playBackgroundMusic();
    }
    
    update(time: number, delta: number): void {
        // Update player movement
        this.player?.update(time, delta, this.cursors);
        
        // Update spawner system
        this.spawner.update(time, delta);
        
        // Scroll starfield layers at different speeds for parallax effect
        if (this.starLayers.length >= 3) {
            // Smaller stars move slower (distant background)
            this.starLayers[0].tilePositionY += 0.5;
            
            // Medium stars move at medium speed (middle layer)
            this.starLayers[1].tilePositionY += 1;
            
            // Larger stars move faster (foreground)
            this.starLayers[2].tilePositionY += 1.5;
        }
        
        // Update UI
        this.updateUI();
        
        // Check for offscreen objects
        this.checkOffscreenObjects();
        
        // Update mining progress
        this.updateMining(time, delta);
    }
    
    private playBackgroundMusic(): void {
        // Check if audio has loaded
        if (this.sound.get('background-music')) {
            // Play background music with looping
            this.backgroundMusic = this.sound.add('background-music', {
                volume: 0.3,
                loop: true
            });
            
            // Add fade-in effect
            this.backgroundMusic.play();
            this.tweens.add({
                targets: this.backgroundMusic,
                volume: {
                    from: 0,
                    to: 0.3
                },
                duration: 2000,
                ease: 'Linear'
            });
            
            // Handle scene transitions - fade out music before stopping
            this.events.once('shutdown', () => {
                if (this.backgroundMusic) {
                    this.tweens.add({
                        targets: this.backgroundMusic,
                        volume: 0,
                        duration: 1000,
                        onComplete: () => {
                            this.backgroundMusic.stop();
                        }
                    });
                }
            });
            
            // Add key to toggle mute
            this.input.keyboard.on('keydown-M', () => {
                if (this.backgroundMusic) {
                    // We need to cast to WebAudioSound to access volume methods
                    const sound = this.backgroundMusic as Phaser.Sound.WebAudioSound;
                    
                    if (sound.volume > 0) {
                        // Store current volume before muting
                        const prevVolume = sound.volume;
                        sound.volume = 0;
                        
                        // Store in the registry for later access
                        this.registry.set('prevMusicVolume', prevVolume);
                    } else {
                        // Restore previous volume
                        const prevVolume = this.registry.get('prevMusicVolume') || 0.3;
                        sound.volume = prevVolume;
                    }
                }
            });
        } else {
            console.warn('Background music not found');
        }
    }
    
    private playerShoot(): void {
        if (this.player) {
            this.player.fire(this.time.now, this.playerProjectiles);
        }
    }
    
    private setupCollisions(): void {
        // Player projectiles hitting enemies
        this.physics.add.overlap(
            this.playerProjectiles,
            this.spawner.getEnemyGroup(),
            this.onPlayerProjectileHitEnemy,
            null,
            this
        );
        
        // Enemy projectiles hitting player
        this.physics.add.overlap(
            this.enemyProjectiles,
            this.player,
            this.onEnemyProjectileHitPlayer,
            null,
            this
        );
        
        // Player colliding with enemies
        this.physics.add.overlap(
            this.player,
            this.spawner.getEnemyGroup(),
            this.onPlayerHitEnemy,
            null,
            this
        );
        
        // Player colliding with asteroids
        this.physics.add.overlap(
            this.player,
            this.spawner.getAsteroidGroup(),
            this.onPlayerHitAsteroid,
            null,
            this
        );
        
        // Player projectiles hitting asteroids
        this.physics.add.overlap(
            this.playerProjectiles,
            this.spawner.getAsteroidGroup(),
            this.onPlayerProjectileHitAsteroid,
            null,
            this
        );
        
        // Player collecting loot
        this.physics.add.overlap(
            this.player,
            this.spawner.getLootGroup(),
            this.onPlayerCollectLoot,
            null,
            this
        );
        
        // Player interacting with mining stations
        this.physics.add.overlap(
            this.player,
            this.spawner.getMiningGroup(),
            this.onPlayerNearMiningStation,
            null,
            this
        );
        
        // Player triggering encounter
        this.physics.add.overlap(
            this.player,
            this.spawner.getEncounterGroup(),
            this.onPlayerTriggerEncounter,
            null,
            this
        );
    }
    
    private onPlayerProjectileHitEnemy(projectile: any, enemy: any): void {
        // Apply damage to enemy
        enemy.takeDamage(projectile.damage);
        
        // Destroy projectile
        projectile.destroy();
    }
    
    private onEnemyProjectileHitPlayer(player: any, projectile: any): void {
        // Apply damage to player
        player.takeDamage(projectile.damage);
        
        // Destroy projectile
        projectile.destroy();
    }
    
    private onPlayerHitEnemy(player: any, enemy: any): void {
        // Both take damage in collision
        player.takeDamage(20);
        enemy.takeDamage(20);
    }
    
    private onPlayerHitAsteroid(player: any, asteroid: any): void {
        // Player takes damage based on asteroid size
        player.takeDamage(asteroid.damage);
        
        // Asteroid takes damage too
        asteroid.health -= 10;
        
        // Destroy asteroid if health depleted
        if (asteroid.health <= 0) {
            asteroid.destroy();
        }
    }
    
    private onPlayerProjectileHitAsteroid(projectile: any, asteroid: any): void {
        // Apply damage to asteroid
        asteroid.health -= projectile.damage;
        
        // Destroy projectile
        projectile.destroy();
        
        // Destroy asteroid if health depleted
        if (asteroid.health <= 0) {
            // Add score
            this.registry.values.score += 50;
            
            // Create explosion
            const explosion = this.add.sprite(asteroid.x, asteroid.y, 'explosion');
            explosion.play('explode');
            explosion.once('animationcomplete', () => {
                explosion.destroy();
            });
            
            // Destroy asteroid
            asteroid.destroy();
        }
    }
    
    private onPlayerCollectLoot(player: any, loot: any): void {
        // Apply loot effect based on type
        switch (loot.lootType) {
            case 'health':
                player.heal(20);
                break;
            case 'shield':
                player.addShield(15);
                break;
            case 'card':
                // Trigger card collection for deck
                this.events.emit('collectCard');
                break;
        }
        
        // Play collection sound
        this.sound.play('collect');
        
        // Add score
        this.registry.values.score += 25;
        
        // Destroy loot
        loot.destroy();
    }
    
    private onPlayerNearMiningStation(player: any, station: any): void {
        // Start mining if close to station and not already mining
        if (!this.isMining && !station.isMining) {
            this.isMining = true;
            this.currentMiningStation = station;
            station.isMining = true;
            
            // Show mining indicator
            station.setTint(0x00ff00);
            
            // Reset mining timer
            this.miningTimer = 0;
        }
    }
    
    private updateMining(time: number, delta: number): void {
        if (this.isMining && this.currentMiningStation) {
            // Check if player moved away
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.currentMiningStation.x, this.currentMiningStation.y
            );
            
            if (distance > 50) {
                // Cancel mining if moved too far
                this.isMining = false;
                this.currentMiningStation.isMining = false;
                this.currentMiningStation.clearTint();
                this.currentMiningStation = null;
                return;
            }
            
            // Increment mining timer
            this.miningTimer += delta;
            
            // Check if mining is complete
            if (this.miningTimer >= this.miningDuration) {
                // Mining complete - give rewards
                this.registry.values.score += this.currentMiningStation.miningReward;
                
                // Play collection sound
                this.sound.play('collect');
                
                // Complete mining
                this.isMining = false;
                this.currentMiningStation.destroy();
                this.currentMiningStation = null;
            }
        }
    }
    
    private onPlayerTriggerEncounter(player: any, trigger: any): void {
        // Pause this scene
        this.scene.pause();
        
        // Start card battle scene with this encounter
        this.scene.launch('CardBattleScene', { 
            encounterId: trigger.encounterId,
            playerHealth: player.getHealth(),
            playerShield: player.getShield()
        });
        
        // Listen for battle result
        this.events.once('battleComplete', (result: {victory: boolean}) => {
            if (result.victory) {
                // Resume game on victory
                this.scene.resume();
            } else {
                // Game over on defeat
                this.scene.start('GameOverScene');
            }
        });
        
        // Destroy trigger
        trigger.destroy();
    }
    
    private checkOffscreenObjects(): void {
        // Check and destroy objects that have gone offscreen
        const groups = [
            this.playerProjectiles,
            this.enemyProjectiles,
            this.spawner.getAsteroidGroup(),
            this.spawner.getLootGroup(),
            this.spawner.getMiningGroup(),
            this.spawner.getEncounterGroup()
        ];
        
        for (const group of groups) {
            group.getChildren().forEach((child: any) => {
                if (child.y > this.cameras.main.height + 50 || 
                    child.y < -50 || 
                    child.x > this.cameras.main.width + 50 || 
                    child.x < -50) {
                    if (child.getData('checkOffscreen')) {
                        child.destroy();
                    }
                }
            });
        }
    }
    
    private createPickup(x: number, y: number): void {
        // Create a pickup at the given position
        const loot = this.physics.add.sprite(x, y, 'loot-crate');
        
        // Set loot type
        const lootTypes = ['card', 'health', 'shield'];
        (loot as any).lootType = Phaser.Utils.Array.GetRandom(lootTypes);
        
        // Add to loot group
        this.spawner.getLootGroup().add(loot);
        
        // Set velocity
        loot.setVelocity(
            Phaser.Math.Between(-20, 20),
            Phaser.Math.Between(50, 100)
        );
        
        // Auto-destroy when off screen
        loot.setData('checkOffscreen', true);
    }
    
    private createUI(): void {
        // Score display
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            color: '#ffffff'
        });
        
        // Distance display
        this.distanceText = this.add.text(20, 50, 'Distance: 0', {
            fontSize: '16px',
            color: '#ffffff'
        });
        
        // Health bar
        this.healthBar = this.add.graphics();
        this.updateHealthBar();
        
        // Shield bar
        this.shieldBar = this.add.graphics();
        this.updateShieldBar();
    }
    
    private updateUI(): void {
        // Update score text
        this.scoreText.setText(`Score: ${this.registry.values.score}`);
        
        // Update distance text
        this.distanceText.setText(`Distance: ${this.registry.values.distance}`);
        
        // Update health bar
        this.updateHealthBar();
        
        // Update shield bar
        this.updateShieldBar();
    }
    
    private updateHealthBar(): void {
        if (!this.player) return;
        
        this.healthBar.clear();
        
        // Background
        this.healthBar.fillStyle(0x222222, 0.8);
        this.healthBar.fillRect(10, this.cameras.main.height - 30, 200, 15);
        
        // Health amount
        const healthPercentage = this.player.getHealth() / this.player.getMaxHealth();
        
        // Choose color based on health amount
        let color = 0x00ff00; // Green
        if (healthPercentage < 0.6) color = 0xffff00; // Yellow
        if (healthPercentage < 0.3) color = 0xff0000; // Red
        
        this.healthBar.fillStyle(color, 1);
        this.healthBar.fillRect(10, this.cameras.main.height - 30, 200 * healthPercentage, 15);
    }
    
    private updateShieldBar(): void {
        if (!this.player) return;
        
        this.shieldBar.clear();
        
        // Only show if we have shield
        if (this.player.getShield() > 0) {
            // Background
            this.shieldBar.fillStyle(0x222222, 0.8);
            this.shieldBar.fillRect(10, this.cameras.main.height - 50, 200, 15);
            
            // Shield amount
            const shieldPercentage = this.player.getShield() / this.player.getMaxShield();
            
            this.shieldBar.fillStyle(0x00aaff, 1);
            this.shieldBar.fillRect(10, this.cameras.main.height - 50, 200 * shieldPercentage, 15);
        }
    }
} 