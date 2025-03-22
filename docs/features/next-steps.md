# Next Implementation Steps

## 1. Movement Enhancement

### Required Assets
- Camera shake effect (built into Phaser)
- Zoom effect (built into Phaser)
- Thrust particle effect (simple white/blue particles)

### Color Scheme
```typescript
const COLORS = {
    // UI Colors
    HEALTH_BAR: 0xff0000,    // Red
    SHIELD_BAR: 0x00ffff,    // Cyan
    ENERGY_BAR: 0xffff00,    // Yellow
    
    // Visual Effects
    THRUST_PARTICLES: 0x00ffff,  // Cyan
    DAMAGE_FLASH: 0xff0000,      // Red
    SHIELD_HIT: 0x00ffff,        // Cyan
    
    // Background
    STAR_SMALL: 0xffffff,    // White
    STAR_MEDIUM: 0xcccccc,   // Light Gray
    STAR_LARGE: 0x999999     // Gray
};
```

### Implementation Steps
1. Add 360° movement using vector math
2. Implement camera shake on damage/combat
3. Add zoom effects for special events
4. Create thrust particle system

## 2. Combat System

### Required Assets
- Projectile sprites (already have)
- Shield hit effect (simple circle with cyan color)
- Damage number popups (text with animation)
- Special ability icons (placeholder circles for now)

### Implementation Steps
1. Add auto-shooting system with configurable intervals
2. Implement visual damage feedback
3. Enhance shield system with visual effects
4. Create special abilities framework

## 3. Mining System

### Required Assets
- Mining laser effect (simple line with cyan color)
- Mining progress bar (rectangle with yellow fill)
- Resource icons (simple colored circles for now)

### Implementation Steps
1. Complete mining mechanics
2. Add mining tool requirements
3. Implement aggro system
4. Create resource collection system

## Loot Table

### Space Materials
```typescript
const SPACE_MATERIALS = {
    // Common Materials (60% drop rate)
    IRON_ORE: {
        name: "Iron Ore",
        value: 10,
        dropRate: 0.3,
        description: "Common metal ore, useful for basic repairs"
    },
    CARBON: {
        name: "Carbon",
        value: 15,
        dropRate: 0.2,
        description: "Essential for advanced materials"
    },
    SILICON: {
        name: "Silicon",
        value: 20,
        dropRate: 0.1,
        description: "Used in electronic components"
    },
    
    // Rare Materials (30% drop rate)
    PLATINUM: {
        name: "Platinum",
        value: 50,
        dropRate: 0.15,
        description: "Valuable precious metal"
    },
    URANIUM: {
        name: "Uranium",
        value: 75,
        dropRate: 0.1,
        description: "Radioactive material, handle with care"
    },
    CRYSTAL: {
        name: "Energy Crystal",
        value: 100,
        dropRate: 0.05,
        description: "Pure energy in crystalline form"
    },
    
    // Legendary Materials (10% drop rate)
    STARDUST: {
        name: "Stardust",
        value: 200,
        dropRate: 0.05,
        description: "Mysterious material from distant stars"
    },
    DARK_MATTER: {
        name: "Dark Matter",
        value: 500,
        dropRate: 0.02,
        description: "Incredibly rare and valuable"
    },
    QUANTUM_ESSENCE: {
        name: "Quantum Essence",
        value: 1000,
        dropRate: 0.01,
        description: "The rarest material in the universe"
    }
};
```

### Credits System
```typescript
const CREDITS = {
    // Basic Rewards
    SMALL_CREDIT: {
        amount: 10,
        dropRate: 0.4
    },
    MEDIUM_CREDIT: {
        amount: 25,
        dropRate: 0.3
    },
    LARGE_CREDIT: {
        amount: 50,
        dropRate: 0.2
    },
    
    // Special Rewards
    CREDIT_CACHE: {
        amount: 100,
        dropRate: 0.1
    },
    TREASURE_TROVE: {
        amount: 500,
        dropRate: 0.01
    }
};
```

### Drop Rate Modifiers
```typescript
const DROP_MODIFIERS = {
    // Mining Bonuses
    MINING_TOOL_BASIC: 1.2,    // +20% drop rate
    MINING_TOOL_ADVANCED: 1.5,  // +50% drop rate
    MINING_TOOL_EXPERT: 2.0,    // +100% drop rate
    
    // Luck Bonuses
    LUCK_SMALL: 1.1,           // +10% drop rate
    LUCK_MEDIUM: 1.25,         // +25% drop rate
    LUCK_LARGE: 1.5,           // +50% drop rate
    
    // Difficulty Scaling
    DIFFICULTY_EASY: 1.0,
    DIFFICULTY_NORMAL: 1.2,
    DIFFICULTY_HARD: 1.5
};
```

## Implementation Order

1. **Phase 1: Movement Enhancement**
   - Implement 360° movement
   - Add camera effects
   - Create particle systems

2. **Phase 2: Combat System**
   - Add auto-shooting
   - Implement damage feedback
   - Create shield system
   - Add special abilities

3. **Phase 3: Mining System**
   - Complete mining mechanics
   - Add tool requirements
   - Implement aggro system
   - Create resource collection

4. **Phase 4: Polish & Integration**
   - Add visual effects
   - Implement sound effects
   - Balance drop rates
   - Add UI feedback 