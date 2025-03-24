import 'phaser';
import { BootScene } from './scenes/core/BootScene';
import { PreloadScene } from './scenes/core/PreloadScene';
import { StartScene } from './scenes/core/StartScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: process.env.NODE_ENV === 'development'
    }
  },
  scene: [BootScene, PreloadScene, StartScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#000000'
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
}); 