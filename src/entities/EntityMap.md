# Game Entity Class Map

## Core Entities

### Ships (`/entities/ships/`)
- **BaseShip**
  - Base class for all ships
  - Properties: position, rotation, health, shields
  - Methods: move(), rotate(), takeDamage()

- **PlayerShip** (extends BaseShip)
  - Player-controlled ship
  - Additional: inventory, equipment slots, energy
  - Methods: shoot(), useAbility(), collectItem()

- **EnemyShip** (extends BaseShip)
  - AI-controlled ships
  - Additional: behavior patterns, loot tables
  - Methods: updateAI(), dropLoot()

### Projectiles (`/entities/projectiles/`)
- **BaseProjectile**
  - Base class for all projectiles
  - Properties: position, velocity, damage
  - Methods: update(), hit()

- **Bullet** (extends BaseProjectile)
  - Basic projectile type
  - Properties: speed, range
  - Methods: calculateTrajectory()

### Items (`/entities/items/`)
- **BaseItem**
  - Base class for collectible items
  - Properties: type, value, rarity
  - Methods: collect(), apply()

- **PowerUp** (extends BaseItem)
  - Temporary power-ups
  - Properties: duration, effectType
  - Methods: activate(), deactivate()

## Game Systems

### Effects (`/systems/effects/`)
- **EffectManager**
  - Manages active effects on entities
  - Methods: addEffect(), removeEffect(), updateEffects()

### Combat (`/systems/combat/`)
- **CombatManager**
  - Handles combat interactions
  - Methods: calculateDamage(), processHit()

### Cards (`/systems/cards/`)
- **Card**
  - Base class for game cards
  - Properties: type, cost, effects
  - Methods: play(), discard()

- **Deck**
  - Card collection and management
  - Methods: draw(), shuffle(), addCard()

## Relationships
- PlayerShip ↔ CombatManager: Combat interactions
- PlayerShip ↔ EffectManager: Status effects
- PlayerShip ↔ Items: Collection and usage
- EnemyShip ↔ CombatManager: AI combat
- Projectiles ↔ CombatManager: Damage calculation
- Cards ↔ EffectManager: Card effects

## Implementation Phases
1. Core Ship Classes (Phase 1)
2. Basic Combat (Phase 1)
3. Items and Effects (Phase 2)
4. Card System (Phase 4)

## Notes
- All entities inherit from Phaser.GameObjects
- Systems use event-driven communication
- Entity states managed through EffectManager 