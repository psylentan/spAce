# Space Game Development Documentation

This document outlines the development plan and system documentation for our space exploration game.

## Table of Contents
- [Master Plan](#master-plan)
- [System Documentation](#system-documentation)
  - [Asteroid System](#asteroid-system)
  - [Resource System](#resource-system)

## Master Plan

### Overview
A space exploration and combat-focused deck-building game using Phaser 3, featuring layered environments, diverse space objects, and strategic combat mechanics.

### Phase Status

#### Completed Phases ✅
- PHASE 0 - FOUNDATION
- PHASE 1.1 - BASIC SHIP MOVEMENT
- PHASE 1.2 - ENHANCED FLIGHT SCENE
- PHASE 1.3 - LAYER SYSTEM
- PHASE 1.4.1 - WEAPON SYSTEM
- PHASE 1.4.2 - BASIC PLANET SYSTEM

#### Current Phase 🔄
- PHASE 1.4.3 - RESOURCE & ASTEROID SYSTEM
  - Destructible asteroids
  - Resource drops
  - Basic inventory system
  - Resource collection UI

#### Next Phase 🎯
- PHASE 1.4.4 - SPACE OBJECTS
  - Enhanced planet types (Volcanic, Ice)
  - Space Stations
  - Alien Structures

#### Future Phases 📅
- PHASE 2 - COMBAT MECHANICS
- PHASE 3 - LAYER EFFECTS
- PHASE 4 - UI & HUD
- PHASE 5 - ENCOUNTERS & CARDS
- PHASE 6 - META & PROGRESSION

### Core Systems
- Layer System ✅
- Weapon System ✅
- Space Objects 🔄
  - Planet System ✅
  - Asteroid System 🔄
  - Resource System 🎯

## System Documentation

### Asteroid System

#### Overview
The asteroid system consists of two integrated components that provide both visual atmosphere and gameplay mechanics.

#### 1. Background Meteorite Belt (Implemented ✅)
Currently implemented as a non-interactive background system providing visual atmosphere.

##### Features
- Configurable density and appearance
- Parallax scrolling effect
- Multiple meteorite sizes
- Automatic spawning and cleanup

##### Configuration Options
```typescript
{
    smallCount: number;      // Number of small meteorites
    largeCount: number;      // Number of large meteorites
    beltWidth: number;       // Width of the meteorite field
    beltHeight: number;      // Height of the meteorite field
    beltAngle: number;       // Angle of the belt in degrees
    parallaxFactor: number;  // Scrolling effect strength
    // Visual settings
    minScale: number;        // Minimum meteorite size
    maxScale: number;        // Maximum meteorite size
    colors: number[];        // Array of color values
}
```

#### 2. Destructible Asteroid System (Planned 🎯)

##### Core Features
- Physics-based collisions
- Health system
- Break-apart mechanics
- Resource drops

##### Asteroid Types
```typescript
{
    SMALL: {
        size: 'small',
        health: 50,
        resources: [
            { resourceId: 'metal', minAmount: 1, maxAmount: 3, chance: 0.8 },
            { resourceId: 'crystal', minAmount: 1, maxAmount: 2, chance: 0.2 }
        ]
    },
    MEDIUM: {
        size: 'medium',
        health: 150,
        resources: [
            { resourceId: 'metal', minAmount: 2, maxAmount: 5, chance: 0.9 },
            { resourceId: 'crystal', minAmount: 2, maxAmount: 4, chance: 0.4 },
            { resourceId: 'fuel', minAmount: 1, maxAmount: 3, chance: 0.3 }
        ]
    },
    LARGE: {
        size: 'large',
        health: 400,
        resources: [
            { resourceId: 'metal', minAmount: 4, maxAmount: 8, chance: 1.0 },
            { resourceId: 'crystal', minAmount: 3, maxAmount: 6, chance: 0.6 },
            { resourceId: 'fuel', minAmount: 2, maxAmount: 5, chance: 0.5 }
        ]
    }
}
```

### Resource System (Planned 🎯)

#### Basic Resources
```typescript
{
    METAL: {
        id: 'metal',
        name: 'Space Metal',
        description: 'Common metal from asteroids',
        rarity: 'common',
        baseValue: 10,
        stackLimit: 100
    },
    CRYSTAL: {
        id: 'crystal',
        name: 'Energy Crystal',
        description: 'Crystal with stored energy',
        rarity: 'uncommon',
        baseValue: 25,
        stackLimit: 50
    },
    FUEL: {
        id: 'fuel',
        name: 'Raw Fuel',
        description: 'Unstable fuel material',
        rarity: 'common',
        baseValue: 15,
        stackLimit: 75
    }
}
```

#### Implementation Phases

##### Phase 1: Basic Integration
- Create destructible asteroid class
- Implement health system
- Add basic collision detection
- Simple resource drops

##### Phase 2: Resource Management
- Implement inventory system
- Add resource collection mechanics
- Create resource UI
- Add storage limitations

##### Phase 3: Enhanced Features
- Break-apart animations
- Particle effects
- Sound effects
- Resource scanner

#### Future Expansions
1. Resource Processing
   - Refining raw materials
   - Combining resources
   - Quality grades

2. Trading System
   - Dynamic pricing
   - Supply/demand
   - Trading with stations

3. Scanner Upgrades
   - Detection range
   - Resource prediction
   - Rarity identification 