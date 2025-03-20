import 'phaser';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Title
        this.add.text(width / 2, height / 4, 'Space Explorer', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Menu options
        const startButton = this.add.text(width / 2, height / 2, 'Start Game', {
            fontSize: '32px',
            color: '#ffffff'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => startButton.setColor('#ff0'))
            .on('pointerout', () => startButton.setColor('#ffffff'))
            .on('pointerdown', () => this.scene.start('GameScene'));

        // Version info
        this.add.text(width / 2, height - 50, 'Alpha Version 0.1', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
    }
} 