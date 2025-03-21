import Phaser from 'phaser';

/**
 * Creates a simple placeholder image with the given name
 * This is used when real assets are missing during development
 */
export const createPlaceholder = (
    scene: Phaser.Scene,
    key: string,
    width: number = 64, 
    height: number = 64,
    color: number = 0xaaaaaa
): void => {
    // Check if texture already exists
    if (scene.textures.exists(key)) {
        return;
    }
    
    // Create a canvas for the placeholder
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    
    // Add text with the key name
    const text = scene.add.text(
        width / 2,
        height / 2,
        key,
        {
            fontSize: `${Math.min(width, height) / 6}px`,
            color: '#000000',
            align: 'center',
            wordWrap: { width: width - 10 }
        }
    );
    text.setOrigin(0.5);
    
    // Generate texture from graphics and text
    const rt = scene.add.renderTexture(0, 0, width, height);
    rt.draw(graphics, 0, 0);
    rt.draw(text, width / 2 - text.width / 2, height / 2 - text.height / 2);
    
    // Generate a texture from the render texture
    rt.saveTexture(key);
    
    // Cleanup
    rt.destroy();
    graphics.destroy();
    text.destroy();
}; 