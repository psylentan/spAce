import 'phaser';
import { GAME_CONSTANTS } from '../constants';

export class BaseScene extends Phaser.Scene {
    protected centerX: number;
    protected centerY: number;
    protected gameWidth: number;
    protected gameHeight: number;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.centerX = GAME_CONSTANTS.WINDOW.WIDTH / 2;
        this.centerY = GAME_CONSTANTS.WINDOW.HEIGHT / 2;
        this.gameWidth = GAME_CONSTANTS.WINDOW.WIDTH;
        this.gameHeight = GAME_CONSTANTS.WINDOW.HEIGHT;
    }

    create(data?: any): void {
        // Common scene setup can go here
    }

    protected createBackground(color: number): void {
        this.add.rectangle(
            this.centerX,
            this.centerY,
            this.gameWidth,
            this.gameHeight,
            color
        ).setOrigin(0.5);
    }
} 