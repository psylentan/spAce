import Phaser from 'phaser';
import { createPlaceholder } from './assetPreloader';

/**
 * Creates a starfield effect with multiple layers for parallax scrolling
 */
export const createStarfield = (scene: Phaser.Scene): Phaser.GameObjects.TileSprite[] => {
    // Check if we have the star textures, create them if not
    createStarPlaceholders(scene);
    
    // Create three layers of stars with different sizes and speeds
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;
    
    // Create parallax layers
    const smallStars = scene.add.tileSprite(0, 0, width, height, 'stars-small')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    const mediumStars = scene.add.tileSprite(0, 0, width, height, 'stars-medium')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setAlpha(0.8);
    
    const largeStars = scene.add.tileSprite(0, 0, width, height, 'stars-large')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setAlpha(0.9);
    
    return [smallStars, mediumStars, largeStars];
}

/**
 * Creates placeholder textures for the stars if they don't exist
 */
const createStarPlaceholders = (scene: Phaser.Scene): void => {
    // Small stars
    if (!scene.textures.exists('stars-small')) {
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = 256;
        smallCanvas.height = 512;
        const smallCtx = smallCanvas.getContext('2d');
        
        if (smallCtx) {
            smallCtx.fillStyle = 'black';
            smallCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
            
            // Draw many small stars
            for (let i = 0; i < 150; i++) {
                const x = Math.random() * smallCanvas.width;
                const y = Math.random() * smallCanvas.height;
                const size = 1;
                
                smallCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
                smallCtx.fillRect(x, y, size, size);
            }
            
            scene.textures.addCanvas('stars-small', smallCanvas);
        }
    }
    
    // Medium stars
    if (!scene.textures.exists('stars-medium')) {
        const mediumCanvas = document.createElement('canvas');
        mediumCanvas.width = 256;
        mediumCanvas.height = 512;
        const mediumCtx = mediumCanvas.getContext('2d');
        
        if (mediumCtx) {
            mediumCtx.fillStyle = 'black';
            mediumCtx.fillRect(0, 0, mediumCanvas.width, mediumCanvas.height);
            
            // Draw medium stars
            for (let i = 0; i < 75; i++) {
                const x = Math.random() * mediumCanvas.width;
                const y = Math.random() * mediumCanvas.height;
                const size = 2;
                
                mediumCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`;
                mediumCtx.fillRect(x, y, size, size);
                
                // Add some blue and yellow stars
                if (i % 5 === 0) {
                    mediumCtx.fillStyle = `rgba(100, 150, 255, ${Math.random() * 0.6 + 0.4})`;
                    mediumCtx.fillRect(Math.random() * mediumCanvas.width, Math.random() * mediumCanvas.height, size, size);
                }
                
                if (i % 7 === 0) {
                    mediumCtx.fillStyle = `rgba(255, 255, 150, ${Math.random() * 0.6 + 0.4})`;
                    mediumCtx.fillRect(Math.random() * mediumCanvas.width, Math.random() * mediumCanvas.height, size, size);
                }
            }
            
            scene.textures.addCanvas('stars-medium', mediumCanvas);
        }
    }
    
    // Large stars
    if (!scene.textures.exists('stars-large')) {
        const largeCanvas = document.createElement('canvas');
        largeCanvas.width = 256;
        largeCanvas.height = 512;
        const largeCtx = largeCanvas.getContext('2d');
        
        if (largeCtx) {
            largeCtx.fillStyle = 'black';
            largeCtx.fillRect(0, 0, largeCanvas.width, largeCanvas.height);
            
            // Draw larger stars
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * largeCanvas.width;
                const y = Math.random() * largeCanvas.height;
                const size = Math.random() * 2 + 2;
                
                // Add glow effect
                const gradient = largeCtx.createRadialGradient(
                    x + size/2, y + size/2, 0,
                    x + size/2, y + size/2, size * 2
                );
                
                // Random star colors
                const colors = [
                    [255, 255, 255], // White
                    [100, 150, 255], // Blue
                    [255, 255, 150], // Yellow
                    [255, 200, 150]  // Orange
                ];
                
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                largeCtx.fillStyle = gradient;
                largeCtx.beginPath();
                largeCtx.arc(x + size/2, y + size/2, size, 0, Math.PI * 2);
                largeCtx.fill();
            }
            
            scene.textures.addCanvas('stars-large', largeCanvas);
        }
    }
} 