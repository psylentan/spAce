import Phaser from 'phaser';
import { createPlaceholder } from '../utils/assetPreloader';
import { createAllPlaceholders } from '../utils/createPlaceholders';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload(): void {
        // Try to load essential assets needed for the preloader
        this.load.image('loading-background', 'assets/ui/loading-background.png');
        this.load.image('loading-bar', 'assets/ui/loading-bar.png');
        
        // Handle loading errors by creating placeholders
        this.load.on('loaderror', (fileObj: any) => {
            console.warn(`Error loading asset: ${fileObj.key}`);
            
            // Create placeholder for missing texture
            if (fileObj.type === 'image') {
                if (fileObj.key === 'loading-background') {
                    createPlaceholder(this, fileObj.key, 400, 50, 0x222222);
                } else if (fileObj.key === 'loading-bar') {
                    createPlaceholder(this, fileObj.key, 398, 48, 0x00ff00);
                } else {
                    createPlaceholder(this, fileObj.key);
                }
            }
        });
    }

    create(): void {
        // Create all placeholder assets
        createAllPlaceholders(this);
        
        // Transition to the preloader scene
        this.scene.start('PreloaderScene');
    }
} 