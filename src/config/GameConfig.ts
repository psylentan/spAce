import { Types, AUTO, Scale } from 'phaser';

export const GameConfig: Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: process.env.NODE_ENV === 'development'
        }
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    pixelArt: true
}; 