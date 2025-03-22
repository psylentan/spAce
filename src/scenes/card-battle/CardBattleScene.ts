import 'phaser';
import { BaseScene } from '../BaseScene';
import { GAME_CONSTANTS } from '../../constants';
import { Card, Encounter } from '../../types';

export class CardBattleScene extends BaseScene {
    private playerDeck: Card[] = [];
    private playerHand: Card[] = [];
    private playerHp: number = GAME_CONSTANTS.PLAYER.MAX_HP;
    private enemyHp: number = 0;
    private enemyName: string = '';
    private enemyDeck: Card[] = [];
    private currentTurn: 'player' | 'enemy' = 'player';
    private energy: number = GAME_CONSTANTS.CARD_BATTLE.MAX_ENERGY;
    
    // UI Elements
    private playerHpText!: Phaser.GameObjects.Text;
    private enemyHpText!: Phaser.GameObjects.Text;
    private energyText!: Phaser.GameObjects.Text;
    private handContainer!: Phaser.GameObjects.Container;
    private endTurnButton!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'CardBattleScene' });
    }

    init(data: { deck: Card[], encounter: Encounter }): void {
        this.playerDeck = [...data.deck]; // Create a copy of the deck
        this.enemyName = data.encounter.enemyName;
        this.enemyHp = data.encounter.enemyHp;
        this.enemyDeck = [...data.encounter.enemyDeck];
    }

    create(): void {
        super.create();
        
        // Create background
        this.createBackground(0x000066);
        
        // Draw initial hand
        this.drawInitialHand();
        
        // Create UI elements
        this.createUI();
        
        // Start player's turn
        this.startPlayerTurn();
    }

    private drawInitialHand(): void {
        // Draw 5 cards for the player
        for (let i = 0; i < GAME_CONSTANTS.CARD_BATTLE.CARDS_PER_HAND; i++) {
            this.drawCard();
        }
    }

    private drawCard(): void {
        if (this.playerDeck.length === 0) {
            // TODO: Implement deck reshuffle
            return;
        }
        
        const card = this.playerDeck.pop()!;
        this.playerHand.push(card);
        this.renderCard(card);
    }

    private renderCard(card: Card): void {
        // Create card sprite
        const cardSprite = this.add.rectangle(0, 0, 120, 160, 0x444444);
        const cardText = this.add.text(0, 0, card.name, {
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 100 }
        });
        
        // Create card container
        const cardContainer = this.add.container(0, 0, [cardSprite, cardText]);
        
        // Make card interactive
        cardContainer.setInteractive();
        cardContainer.on('pointerdown', () => this.playCard(card));
        
        // Position card in hand
        this.positionCardInHand(cardContainer);
    }

    private positionCardInHand(cardContainer: Phaser.GameObjects.Container): void {
        const cardIndex = this.playerHand.length - 1;
        const startX = this.centerX - (this.playerHand.length * 130) / 2;
        const x = startX + cardIndex * 130;
        const y = this.gameHeight - 200;
        
        cardContainer.setPosition(x, y);
    }

    private createUI(): void {
        // Player HP
        this.playerHpText = this.add.text(16, 16, `Player HP: ${this.playerHp}`, {
            fontSize: '24px',
            color: '#ffffff'
        });

        // Enemy HP
        this.enemyHpText = this.add.text(16, 50, `${this.enemyName} HP: ${this.enemyHp}`, {
            fontSize: '24px',
            color: '#ffffff'
        });

        // Energy
        this.energyText = this.add.text(16, 84, `Energy: ${this.energy}`, {
            fontSize: '24px',
            color: '#ffffff'
        });

        // End Turn Button
        this.endTurnButton = this.add.text(this.gameWidth - 100, 16, 'End Turn', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => this.endPlayerTurn());
    }

    private startPlayerTurn(): void {
        this.currentTurn = 'player';
        this.energy = GAME_CONSTANTS.CARD_BATTLE.MAX_ENERGY;
        this.energyText.setText(`Energy: ${this.energy}`);
        this.drawCard();
    }

    private playCard(card: Card): void {
        if (this.energy < card.cost) {
            return; // Not enough energy
        }

        this.energy -= card.cost;
        this.energyText.setText(`Energy: ${this.energy}`);

        // Apply card effects
        card.effects.forEach(effect => {
            if (effect.target === 'enemy') {
                this.enemyHp -= effect.amount;
                this.enemyHpText.setText(`${this.enemyName} HP: ${this.enemyHp}`);
                
                if (this.enemyHp <= 0) {
                    this.handleVictory();
                }
            } else {
                this.playerHp += effect.amount;
                this.playerHpText.setText(`Player HP: ${this.playerHp}`);
            }
        });

        // Remove card from hand
        const cardIndex = this.playerHand.indexOf(card);
        if (cardIndex > -1) {
            this.playerHand.splice(cardIndex, 1);
        }
    }

    private endPlayerTurn(): void {
        this.currentTurn = 'enemy';
        this.enemyTurn();
    }

    private enemyTurn(): void {
        // TODO: Implement enemy AI and card playing
        // For now, just do some basic damage
        this.playerHp -= GAME_CONSTANTS.CARD_BATTLE.ENEMY_DAMAGE;
        this.playerHpText.setText(`Player HP: ${this.playerHp}`);

        if (this.playerHp <= 0) {
            this.handleDefeat();
        } else {
            this.startPlayerTurn();
        }
    }

    private handleVictory(): void {
        // TODO: Add victory animation and rewards
        this.scene.stop('CardBattleScene');
        this.scene.resume('SpaceScene');
    }

    private handleDefeat(): void {
        // TODO: Add defeat animation
        this.scene.stop('CardBattleScene');
        this.scene.stop('SpaceScene');
        this.scene.start('GameOverScene');
    }
} 