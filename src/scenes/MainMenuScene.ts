import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create(): void {
        // Add background
        this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0);
            
        // Add title
        this.add.image(this.cameras.main.width / 2, 100, 'title')
            .setOrigin(0.5);
        
        // Add start button
        const startButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'button'
        ).setOrigin(0.5);
        
        // Add text to the button
        this.add.text(
            startButton.x,
            startButton.y,
            'START GAME',
            {
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Make the button interactive
        startButton.setInteractive();
        
        // Add hover effect
        startButton.on('pointerover', () => {
            startButton.setTint(0xcccccc);
        });
        
        startButton.on('pointerout', () => {
            startButton.clearTint();
        });
        
        // Start the game when clicked
        startButton.on('pointerdown', () => {
            this.scene.start('SpaceFlightScene');
        });
    }
} 