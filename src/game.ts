import 'phaser';
import { FlightScene } from './scenes/flight/FlightScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
    min: {
      width: 800,
      height: 600
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  backgroundColor: '#000000',
  scene: FlightScene,
  pixelArt: true,
  roundPixels: true // For crisp rendering
};

new Phaser.Game(config); 