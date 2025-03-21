import Phaser from 'phaser';
import { DeckManager } from '../systems/DeckManager';
import { Card, CardData } from '../objects/Card';

interface EncounterData {
    encounterId: number;
    playerHealth: number;
    playerShield: number;
}

interface Enemy {
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    cardPool: CardData[];
}

export class CardBattleScene extends Phaser.Scene {
    private deckManager: DeckManager;
    private playerHealth: number;
    private playerMaxHealth: number = 100;
    private playerShield: number = 0;
    private playerMaxShield: number = 50;
    private playerEnergy: number = 3;
    private playerMaxEnergy: number = 3;
    
    private enemy: Enemy;
    private enemyHealthBar: Phaser.GameObjects.Graphics;
    private playerHealthBar: Phaser.GameObjects.Graphics;
    private playerShieldBar: Phaser.GameObjects.Graphics;
    
    private handContainer: Phaser.GameObjects.Container;
    private cardSprites: Phaser.GameObjects.Sprite[] = [];
    private selectedCardIndex: number = -1;
    
    private isPlayerTurn: boolean = true;
    private turnText: Phaser.GameObjects.Text;
    private energyText: Phaser.GameObjects.Text;
    
    private encounter: EncounterData;
    
    constructor() {
        super('CardBattleScene');
    }
    
    init(data: EncounterData): void {
        this.encounter = data;
        this.playerHealth = data.playerHealth;
        this.playerShield = data.playerShield;
    }
    
    create(): void {
        // Add background
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Create enemy based on encounter ID
        this.createEnemy(this.encounter.encounterId);
        
        // Initialize deck manager with some cards
        this.deckManager = new DeckManager();
        
        // Add initial cards to deck
        const initialDeck: CardData[] = [
            {
                id: 'attack1',
                name: 'Laser Shot',
                cost: 1,
                effects: [{ action: 'damage', amount: 6, target: 'enemy' }],
                type: 'combat',
                description: 'Deal 6 damage to the enemy.'
            },
            {
                id: 'attack2',
                name: 'Heavy Blast',
                cost: 2,
                effects: [{ action: 'damage', amount: 10, target: 'enemy' }],
                type: 'combat',
                description: 'Deal 10 damage to the enemy.'
            },
            {
                id: 'shield1',
                name: 'Shield Up',
                cost: 1,
                effects: [{ action: 'shield', amount: 5, target: 'self' }],
                type: 'combat',
                description: 'Gain 5 shield points.'
            },
            {
                id: 'heal1',
                name: 'Repair Systems',
                cost: 2,
                effects: [{ action: 'heal', amount: 8, target: 'self' }],
                type: 'combat',
                description: 'Restore 8 health points.'
            },
            {
                id: 'multi1',
                name: 'Tactical Strike',
                cost: 3,
                effects: [
                    { action: 'damage', amount: 12, target: 'enemy' },
                    { action: 'shield', amount: 4, target: 'self' }
                ],
                type: 'combat',
                description: 'Deal 12 damage and gain 4 shield points.'
            }
        ];
        
        this.deckManager.initializeDeck(initialDeck);
        
        // Create UI elements
        this.createUI();
        
        // Draw initial hand
        this.deckManager.drawToMaxHand();
        this.renderHand();
        
        // Start player turn
        this.startPlayerTurn();
    }
    
    private createEnemy(encounterId: number): void {
        // Define enemies based on encounter ID
        const enemies: Record<number, Enemy> = {
            1: {
                id: 'scout',
                name: 'Enemy Scout',
                health: 30,
                maxHealth: 30,
                cardPool: []
            },
            2: {
                id: 'fighter',
                name: 'Enemy Fighter',
                health: 45,
                maxHealth: 45,
                cardPool: []
            },
            3: {
                id: 'cruiser',
                name: 'Enemy Cruiser',
                health: 60,
                maxHealth: 60,
                cardPool: []
            },
            4: {
                id: 'battleship',
                name: 'Enemy Battleship',
                health: 80,
                maxHealth: 80,
                cardPool: []
            },
            5: {
                id: 'dreadnought',
                name: 'Enemy Dreadnought',
                health: 100,
                maxHealth: 100,
                cardPool: []
            }
        };
        
        // Default to the first enemy if ID not found
        this.enemy = enemies[encounterId] || enemies[1];
        
        // Add enemy sprite
        this.add.sprite(
            this.cameras.main.width / 2,
            150,
            'enemy-ship'
        ).setScale(2);
        
        // Add enemy name text
        this.add.text(
            this.cameras.main.width / 2,
            80,
            this.enemy.name,
            {
                fontSize: '24px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
    }
    
    private createUI(): void {
        // Turn indicator
        this.turnText = this.add.text(
            this.cameras.main.width / 2,
            50,
            'Your Turn',
            {
                fontSize: '28px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Energy display
        this.energyText = this.add.text(
            this.cameras.main.width - 20,
            20,
            `Energy: ${this.playerEnergy}/${this.playerMaxEnergy}`,
            {
                fontSize: '18px',
                color: '#00ffff'
            }
        ).setOrigin(1, 0);
        
        // End turn button
        const endTurnButton = this.add.rectangle(
            this.cameras.main.width - 100,
            50,
            160,
            40,
            0x666666
        ).setInteractive();
        
        this.add.text(
            endTurnButton.x,
            endTurnButton.y,
            'END TURN',
            {
                fontSize: '18px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        endTurnButton.on('pointerdown', () => {
            if (this.isPlayerTurn) {
                this.endPlayerTurn();
            }
        });
        
        // Enemy health bar
        this.enemyHealthBar = this.add.graphics();
        this.updateEnemyHealthBar();
        
        // Player health bar
        this.playerHealthBar = this.add.graphics();
        this.updatePlayerHealthBar();
        
        // Player shield bar
        this.playerShieldBar = this.add.graphics();
        this.updatePlayerShieldBar();
        
        // Hand container (for cards)
        this.handContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height - 120
        );
    }
    
    private renderHand(): void {
        // Clear existing cards
        this.handContainer.removeAll();
        this.cardSprites = [];
        
        // Get current hand
        const hand = this.deckManager.getHand();
        
        // Calculate card positioning
        const cardWidth = 120;
        const cardHeight = 180;
        const cardSpacing = 130;
        const startX = -(hand.length - 1) * cardSpacing / 2;
        
        // Render each card
        hand.forEach((card, index) => {
            // Create card container
            const cardX = startX + index * cardSpacing;
            
            // Card background
            const cardSprite = this.add.sprite(cardX, 0, 'card-frame')
                .setDisplaySize(cardWidth, cardHeight);
            
            // Make card interactive
            cardSprite.setInteractive();
            this.cardSprites.push(cardSprite);
            
            // Add card name
            const nameText = this.add.text(cardX, -65, card.getName(), {
                fontSize: '14px',
                color: '#ffffff',
                wordWrap: { width: cardWidth - 20 }
            }).setOrigin(0.5);
            
            // Add card cost
            const costText = this.add.text(cardX - 45, -75, `${card.getCost()}`, {
                fontSize: '18px',
                color: '#00ffff'
            }).setOrigin(0.5);
            
            // Add card description
            const descText = this.add.text(cardX, 20, card.getDescription(), {
                fontSize: '12px',
                color: '#ffffff',
                wordWrap: { width: cardWidth - 20 },
                align: 'center'
            }).setOrigin(0.5);
            
            // Add all elements to the container
            this.handContainer.add([cardSprite, nameText, costText, descText]);
            
            // Set up card selection
            cardSprite.on('pointerdown', () => {
                if (this.isPlayerTurn) {
                    this.selectCard(index);
                }
            });
            
            // Dim cards that are too expensive
            if (card.getCost() > this.playerEnergy) {
                cardSprite.setTint(0x666666);
                nameText.setTint(0x666666);
                descText.setTint(0x666666);
            }
        });
    }
    
    private selectCard(index: number): void {
        // Deselect previous card
        if (this.selectedCardIndex !== -1 && this.selectedCardIndex < this.cardSprites.length) {
            this.cardSprites[this.selectedCardIndex].setTint(0xffffff);
        }
        
        // Select new card
        this.selectedCardIndex = index;
        
        // Check if we can play this card
        const card = this.deckManager.getHand()[index];
        if (card.getCost() <= this.playerEnergy) {
            // Highlight selected card
            this.cardSprites[index].setTint(0x00ff00);
            
            // Play the card
            this.playCard(index);
        } else {
            // Can't afford this card
            this.selectedCardIndex = -1;
            this.cardSprites[index].setTint(0xff0000);
            
            // Reset after a short delay
            this.time.delayedCall(500, () => {
                if (index < this.cardSprites.length) {
                    this.cardSprites[index].setTint(0xffffff);
                }
            });
        }
    }
    
    private playCard(index: number): void {
        // Get the card
        const card = this.deckManager.getHand()[index];
        
        // Play sound
        this.sound.play('card-play');
        
        // Use energy
        this.playerEnergy -= card.getCost();
        this.updateEnergyText();
        
        // Apply card effects
        const playerData = {
            takeDamage: (amount: number) => this.playerTakeDamage(amount),
            heal: (amount: number) => this.playerHeal(amount),
            addShield: (amount: number) => this.playerAddShield(amount)
        };
        
        const enemyData = {
            takeDamage: (amount: number) => this.enemyTakeDamage(amount),
            heal: (amount: number) => {}, // Enemy can't heal in this version
            addShield: (amount: number) => {} // Enemy doesn't have shields in this version
        };
        
        // Apply card effects
        card.applyEffects(playerData, enemyData);
        
        // Remove the card from hand
        this.deckManager.playCard(index);
        
        // Re-render hand
        this.renderHand();
        
        // Reset selected card index
        this.selectedCardIndex = -1;
        
        // Check if enemy defeated
        if (this.enemy.health <= 0) {
            this.onVictory();
        }
    }
    
    private startPlayerTurn(): void {
        this.isPlayerTurn = true;
        this.turnText.setText('Your Turn');
        
        // Reset energy
        this.playerEnergy = this.playerMaxEnergy;
        this.updateEnergyText();
        
        // Draw a card if possible
        this.deckManager.drawCard();
        this.renderHand();
    }
    
    private endPlayerTurn(): void {
        this.isPlayerTurn = false;
        this.turnText.setText('Enemy Turn');
        
        // Start enemy turn after a delay
        this.time.delayedCall(1000, () => {
            this.enemyTurn();
        });
    }
    
    private enemyTurn(): void {
        // Simple enemy AI: just deal random damage
        const damage = Phaser.Math.Between(5, 10);
        
        // Show enemy attack animation
        const attackText = this.add.text(
            this.cameras.main.width / 2,
            200,
            `Enemy attacks for ${damage} damage!`,
            {
                fontSize: '24px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
        
        // Apply damage after a delay
        this.time.delayedCall(1000, () => {
            this.playerTakeDamage(damage);
            attackText.destroy();
            
            // Check if player is defeated
            if (this.playerHealth <= 0) {
                this.onDefeat();
            } else {
                // Start player turn after a delay
                this.time.delayedCall(500, () => {
                    this.startPlayerTurn();
                });
            }
        });
    }
    
    private playerTakeDamage(amount: number): void {
        // Shield absorbs damage first
        if (this.playerShield > 0) {
            if (this.playerShield >= amount) {
                this.playerShield -= amount;
                amount = 0;
            } else {
                amount -= this.playerShield;
                this.playerShield = 0;
            }
            
            this.updatePlayerShieldBar();
        }
        
        // Apply remaining damage to health
        if (amount > 0) {
            this.playerHealth = Math.max(0, this.playerHealth - amount);
            this.updatePlayerHealthBar();
        }
    }
    
    private playerHeal(amount: number): void {
        this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + amount);
        this.updatePlayerHealthBar();
    }
    
    private playerAddShield(amount: number): void {
        this.playerShield = Math.min(this.playerMaxShield, this.playerShield + amount);
        this.updatePlayerShieldBar();
    }
    
    private enemyTakeDamage(amount: number): void {
        this.enemy.health = Math.max(0, this.enemy.health - amount);
        this.updateEnemyHealthBar();
        
        // Flash enemy sprite
        const enemySprite = this.children.getByName('enemy-sprite');
        if (enemySprite) {
            this.tweens.add({
                targets: enemySprite,
                alpha: 0.5,
                duration: 100,
                yoyo: true
            });
        }
    }
    
    private updateEnergyText(): void {
        this.energyText.setText(`Energy: ${this.playerEnergy}/${this.playerMaxEnergy}`);
    }
    
    private updateEnemyHealthBar(): void {
        this.enemyHealthBar.clear();
        
        // Background
        this.enemyHealthBar.fillStyle(0x222222, 0.8);
        this.enemyHealthBar.fillRect(
            this.cameras.main.width / 2 - 100,
            100,
            200,
            15
        );
        
        // Health amount
        const healthPercentage = this.enemy.health / this.enemy.maxHealth;
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        this.enemyHealthBar.fillRect(
            this.cameras.main.width / 2 - 100,
            100,
            200 * healthPercentage,
            15
        );
    }
    
    private updatePlayerHealthBar(): void {
        this.playerHealthBar.clear();
        
        // Background
        this.playerHealthBar.fillStyle(0x222222, 0.8);
        this.playerHealthBar.fillRect(10, this.cameras.main.height - 30, 200, 15);
        
        // Health amount
        const healthPercentage = this.playerHealth / this.playerMaxHealth;
        
        // Choose color based on health amount
        let color = 0x00ff00; // Green
        if (healthPercentage < 0.6) color = 0xffff00; // Yellow
        if (healthPercentage < 0.3) color = 0xff0000; // Red
        
        this.playerHealthBar.fillStyle(color, 1);
        this.playerHealthBar.fillRect(10, this.cameras.main.height - 30, 200 * healthPercentage, 15);
    }
    
    private updatePlayerShieldBar(): void {
        this.playerShieldBar.clear();
        
        // Only show if we have shield
        if (this.playerShield > 0) {
            // Background
            this.playerShieldBar.fillStyle(0x222222, 0.8);
            this.playerShieldBar.fillRect(10, this.cameras.main.height - 50, 200, 15);
            
            // Shield amount
            const shieldPercentage = this.playerShield / this.playerMaxShield;
            
            this.playerShieldBar.fillStyle(0x00aaff, 1);
            this.playerShieldBar.fillRect(10, this.cameras.main.height - 50, 200 * shieldPercentage, 15);
        }
    }
    
    private onVictory(): void {
        // Show victory message
        const victoryText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'VICTORY!',
            {
                fontSize: '48px',
                color: '#00ff00'
            }
        ).setOrigin(0.5);
        
        // Add reward message
        const rewardText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 60,
            'You received a new card!',
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Return to space flight scene after delay
        this.time.delayedCall(3000, () => {
            // Pass battle result back to SpaceFlightScene
            this.scene.get('SpaceFlightScene').events.emit('battleComplete', { victory: true });
            this.scene.stop();
        });
    }
    
    private onDefeat(): void {
        // Show defeat message
        const defeatText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'DEFEAT',
            {
                fontSize: '48px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
        
        // Start game over scene after delay
        this.time.delayedCall(3000, () => {
            // Pass battle result back to SpaceFlightScene
            this.scene.get('SpaceFlightScene').events.emit('battleComplete', { victory: false });
            this.scene.stop();
        });
    }
} 