# Asset Pipeline

## Directory Structure
```
assets/
├── sprites/
│   ├── player/
│   │   ├── ship.png
│   │   ├── engines.png
│   │   └── weapons.png
│   ├── enemies/
│   │   ├── basic/
│   │   ├── boss/
│   │   └── projectiles/
│   └── effects/
│       ├── explosions/
│       ├── particles/
│       └── powerups/
├── audio/
│   ├── music/
│   │   ├── background/
│   │   ├── battle/
│   │   └── menu/
│   └── sfx/
│       ├── weapons/
│       ├── engines/
│       └── impacts/
├── ui/
│   ├── hud/
│   │   ├── health.png
│   │   ├── energy.png
│   │   └── icons/
│   └── menus/
│       ├── buttons/
│       ├── backgrounds/
│       └── cards/
└── shaders/
    ├── space.glsl
    ├── shield.glsl
    └── explosion.glsl
```

## Naming Conventions

### Sprites
```
entity_action_variant_frame.png
Examples:
- player_ship_basic_idle.png
- enemy_scout_attack_01.png
- powerup_shield_blue.png
```

### Audio
```
category_name_variant.format
Examples:
- sfx_laser_shot_01.mp3
- music_battle_intense.ogg
- ambient_space_quiet.mp3
```

### UI Elements
```
screen_element_state.png
Examples:
- hud_health_full.png
- menu_button_hover.png
- card_frame_rare.png
```

## Asset Requirements

### Sprites
- Format: PNG (transparent background)
- Resolution: 2x intended display size
- Power of 2 dimensions (e.g., 128x128, 256x512)
- Max Size: 2048x2048
- Compression: TinyPNG optimized

### Audio
- Music:
  - Format: OGG (primary), MP3 (fallback)
  - Sample Rate: 44.1kHz
  - Bit Rate: 192kbps
  - Channels: Stereo
- SFX:
  - Format: MP3
  - Sample Rate: 44.1kHz
  - Bit Rate: 128kbps
  - Channels: Mono

### UI
- Format: PNG/SVG
- Resolution: Support 2x scaling
- Text: Vector when possible
- Colors: Match game palette
- Accessibility: High contrast

## Loading Strategy

### Progressive Loading
```typescript
class LoadingScene extends Phaser.Scene {
  preload() {
    // Essential assets first
    this.load.image('player_ship', 'assets/sprites/player/ship.png');
    
    // Background loading for non-critical assets
    this.load.on('complete', () => {
      this.loadSecondaryAssets();
    });
  }

  loadSecondaryAssets() {
    // Load remaining assets in background
    this.load.audio('background_music', [
      'assets/audio/music/background.ogg',
      'assets/audio/music/background.mp3'
    ]);
  }
}
```

### Asset Groups
```typescript
const AssetManifest = {
  CORE: [
    // Minimum required to start game
  ],
  GAMEPLAY: [
    // Main gameplay assets
  ],
  AUDIO: [
    // Sound files
  ],
  OPTIONAL: [
    // Nice-to-have assets
  ]
};
```

## Optimization Process

### 1. Image Optimization
```bash
# Install tools
npm install -g imagemin-cli

# Optimize PNG files
imagemin assets/sprites/**/*.png --out-dir dist/assets/sprites

# Create sprite sheets
npm run atlas-packer
```

### 2. Audio Processing
```bash
# Convert to OGG
ffmpeg -i input.mp3 -c:a libvorbis -q:a 4 output.ogg

# Optimize MP3
ffmpeg -i input.mp3 -codec:a libmp3lame -qscale:a 2 output.mp3
```

### 3. Texture Atlases
```json
{
  "frames": {
    "player_ship": {
      "frame": {"x":0, "y":0, "w":64, "h":64},
      "rotated": false,
      "trimmed": true
    }
  }
}
```

## Webpack Configuration
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'assets'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(mp3|ogg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'assets'
            }
          }
        ]
      }
    ]
  }
};
```

## Questions/Suggestions:
1. Add WebP support for modern browsers?
2. Implement lazy loading for large assets?
3. Add asset preloading based on scene?
4. Consider using CDN for assets?
5. Add asset versioning?

## Best Practices
1. Always optimize assets before commit
2. Use appropriate formats for each asset type
3. Implement progressive loading
4. Cache assets effectively
5. Version assets for updates

## TODO:
- [ ] Set up automated asset optimization
- [ ] Create sprite sheet generator
- [ ] Implement asset preloading
- [ ] Add asset versioning
- [ ] Document asset creation guidelines
``` 