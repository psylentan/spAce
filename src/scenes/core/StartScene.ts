import { Scene } from 'phaser';

export class StartScene extends Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create(): void {
        // Add title text
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'Space Game',
            {
                fontSize: '64px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Start Game',
            {
                fontSize: '32px',
                color: '#ffffff'
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => startButton.setStyle({ color: '#ff0' }))
        .on('pointerout', () => startButton.setStyle({ color: '#ffffff' }))
        .on('pointerdown', () => this.startGame());

        // Add version text
        this.add.text(
            10,
            this.cameras.main.height - 20,
            'v0.1.0',
            {
                fontSize: '16px',
                color: '#666666'
            }
        );
    }

    private startGame(): void {
        console.log('Starting game...');
        this.scene.start('FlightScene');
    }
} 