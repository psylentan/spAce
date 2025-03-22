import { BaseScene } from '../BaseScene';
import { GAME_CONSTANTS } from '../../constants';

export class MenuScene extends BaseScene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        super.create();
        
        // Set background
        this.cameras.main.setBackgroundColor(GAME_CONSTANTS.WINDOW.BACKGROUND_COLOR);

        // Add title text
        const titleText = this.add.text(
            this.centerX,
            this.gameHeight / 3,
            'Space Game',
            {
                fontSize: '64px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(
            this.centerX,
            this.gameHeight * 0.6,
            'Start Game',
            {
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#4a9eff',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Add hover effect
        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#2d5a8b' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#4a9eff' });
        });

        // Start game on click
        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => {
                this.scene.start('SpaceScene');
            });
        });
    }
} 