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
  ✅ Completed:
  - Destructible asteroids with proper physics
  - Balanced spawn system (max 15 asteroids)
  - Large play area (4000x4000)
  - Resource drops with three types
  - Basic inventory system
  - Resource collection UI
  - Smooth movement and rotation
  - Particle effects for destruction

  🔄 In Progress:
  - Enhanced resource collection mechanics
  - Resource trading system
  - Advanced inventory management

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
  - Asteroid System ✅
  - Resource System 🔄

## System Documentation

### Asteroid System

#### Overview
The asteroid system provides both visual atmosphere and gameplay mechanics, now fully implemented with resource gathering.

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

#### 2. Destructible Asteroid System (Implemented ✅)

##### Core Features
- Physics-based collisions
- Health system
- Break-apart mechanics with particle effects
- Resource drops with three types
- Smooth movement and rotation
- Balanced spawn system (max 15)
- Large play area (4000x4000)

##### Asteroid Types
```typescript
{
    SMALL: {
        scale: 0.3,
        health: 100,
        resourceType: 'iron',
        probability: 0.7
    },
    MEDIUM: {
        scale: 0.4,
        health: 150,
        resourceType: 'gold',
        probability: 0.2
    },
    LARGE: {
        scale: 0.5,
        health: 200,
        resourceType: 'platinum',
        probability: 0.1
    }
}
```

### Resource System (Implemented 🔄)

#### Basic Resources
```typescript
{
    IRON: {
        id: 'iron',
        name: 'Iron',
        description: 'Common metal from asteroids',
        rarity: 'common',
        probability: 0.7
    },
    GOLD: {
        id: 'gold',
        name: 'Gold',
        description: 'Valuable metal resource',
        rarity: 'uncommon',
        probability: 0.2
    },
    PLATINUM: {
        id: 'platinum',
        name: 'Platinum',
        description: 'Rare and precious metal',
        rarity: 'rare',
        probability: 0.1
    }
}
```

#### Implementation Status

##### Phase 1: Basic Integration ✅
- Created destructible asteroid class
- Implemented health system
- Added collision detection
- Implemented resource drops

##### Phase 2: Resource Management 🔄
- Basic inventory system implemented
- Resource collection mechanics working
- Visual feedback for collection
- Storage system in progress

##### Phase 3: Enhanced Features 🔄
- Break-apart animations completed
- Particle effects implemented
- Sound effects pending
- Resource scanner planned

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