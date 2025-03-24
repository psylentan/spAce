# Scaling Strategy

## How the Game Scales with Different Screen Sizes
- The game should use a responsive camera system that scales the world to fit different screen sizes without distorting or cutting off content.
- **Phaser's `scale` manager** will be used to adjust the game to different screen resolutions.

## Responsive UI Layout Rules
- UI elements (buttons, health bars) should use relative units (percentages or `vw`, `vh`).
- **Example:** The health bar should resize dynamically depending on the screen width and maintain the same aspect ratio.

## Asset Resolution Handling
- Provide 2x and 3x resolution assets (e.g., `sprite_1x.png`, `sprite_2x.png`).
- Use Phaser's `scaleMode` to load the appropriate resolution based on device.

## Performance Optimization Tiers
- **Low-end devices**: Disable certain effects (e.g., particle effects), reduce spawn rate of enemies, and lower resolution assets.
- **High-end devices**: Enable high-quality particle effects, full-screen backgrounds, and other advanced features.
