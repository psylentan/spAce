import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(): void {
        // Add background
        this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0);
            
        // Add game over text
        this.add.text(
            this.cameras.main.width / 2,
            100,
            'GAME OVER',
            {
                fontSize: '48px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
        
        // Add retry button
        const retryButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'button'
        ).setOrigin(0.5);
        
        // Add text to the button
        this.add.text(
            retryButton.x,
            retryButton.y,
            'RETRY',
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Make the button interactive
        retryButton.setInteractive();
        
        // Add hover effect
        retryButton.on('pointerover', () => {
            retryButton.setTint(0xcccccc);
        });
        
        retryButton.on('pointerout', () => {
            retryButton.clearTint();
        });
        
        // Restart the game when clicked
        retryButton.on('pointerdown', () => {
            this.scene.start('SpaceFlightScene');
        });
        
        // Add main menu button
        const menuButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 80,
            'button'
        ).setOrigin(0.5);
        
        // Add text to the button
        this.add.text(
            menuButton.x,
            menuButton.y,
            'MAIN MENU',
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Make the button interactive
        menuButton.setInteractive();
        
        // Add hover effect
        menuButton.on('pointerover', () => {
            menuButton.setTint(0xcccccc);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.clearTint();
        });
        
        // Return to main menu when clicked
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
} 