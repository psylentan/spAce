import 'phaser';
import { GAME_CONSTANTS } from './constants';
import { MenuScene } from './scenes/menu/MenuScene';
import { SpaceScene } from './scenes/space/SpaceScene';
import { CardBattleScene } from './scenes/card-battle/CardBattleScene';
import { GameOverScene } from './scenes/game-over/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: GAME_CONSTANTS.WINDOW.BACKGROUND_COLOR,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, SpaceScene, CardBattleScene, GameOverScene]
};

new Phaser.Game(config); 