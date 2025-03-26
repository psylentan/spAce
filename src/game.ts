import 'phaser';
import { FlightScene } from './scenes/flight/FlightScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  backgroundColor: '#000000',
  scene: FlightScene
};

new Phaser.Game(config); 