import { BaseScene } from '../BaseScene';
import { GAME_CONSTANTS } from '../../constants';

interface GameOverData {
    score: number;
}

export class GameOverScene extends BaseScene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data: GameOverData): void {
        super.create();
        
        // Set background
        this.cameras.main.setBackgroundColor(GAME_CONSTANTS.WINDOW.BACKGROUND_COLOR);

        // Add game over text
        const gameOverText = this.add.text(
            this.centerX,
            this.gameHeight / 3,
            'Game Over',
            {
                fontSize: '64px',
                color: '#ff4a4a',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Add score text
        const scoreText = this.add.text(
            this.centerX,
            this.gameHeight / 2,
            `Final Score: ${data.score}`,
            {
                fontSize: '32px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Add restart button
        const restartButton = this.add.text(
            this.centerX,
            this.gameHeight * 0.7,
            'Play Again',
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
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ backgroundColor: '#2d5a8b' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ backgroundColor: '#4a9eff' });
        });

        // Restart game on click
        restartButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene');
            });
        });
    }
} 