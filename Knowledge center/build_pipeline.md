# Build Pipeline

## Development Environment Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up **Webpack/Vite** for bundling TypeScript and assets.
4. Ensure **Phaser 3** and **TypeScript** are correctly configured.

## Build Process Steps
1. Run `npm run build` to build the production version.
2. Check the output directory (`dist/`) for bundled assets and minified code.
3. Ensure that assets are optimized for mobile and desktop use.

## Asset Optimization
- Use **ImageOptim** for image compression (for sprite sheets, etc.).
- Use **WebP** for backgrounds to reduce size without losing quality.
- Compress audio files using **Audacity** or **FFmpeg** to maintain game performance.

## Deployment Procedures
1. Upload the built game to a server or hosting platform (e.g., Netlify, GitHub Pages).
2. Test the game in production environment to ensure assets are loaded correctly and the game runs smoothly.
