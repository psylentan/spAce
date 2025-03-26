import { Types, AUTO, Scale } from 'phaser';
import { FlightScene } from '../scenes/flight/FlightScene';

export const GameConfig: Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: process.env.NODE_ENV === 'development'
        }
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    pixelArt: true,
    scene: [FlightScene]
}; 