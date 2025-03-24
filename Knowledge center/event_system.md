# Event System

## Overview
This document defines the event-driven architecture used throughout the game. We use a publisher-subscriber pattern to decouple game systems and enable flexible communication between components.

## Global Events
### Combat Events
```typescript
interface CombatEvents {
  PLAYER_DAMAGED: {
    damage: number;
    source: string;
    position: Vector2;
    damageType: 'collision' | 'projectile' | 'explosion';
  };
  
  ENEMY_DESTROYED: {
    enemyType: string;
    position: Vector2;
    scoreValue: number;
    lootTable?: string[];
  };
  
  WEAPON_FIRED: {
    weaponType: string;
    position: Vector2;
    direction: Vector2;
    damage: number;
  };
}
```

### PowerUp Events
```typescript
interface PowerUpEvents {
  POWERUP_COLLECTED: {
    type: string;
    effect: Effect;
    duration: number;
  };
  
  POWERUP_EXPIRED: {
    type: string;
    finalStats: StatBlock;
  };
}
```

### Game State Events
```typescript
interface GameStateEvents {
  GAME_PAUSED: void;
  GAME_RESUMED: void;
  SCENE_TRANSITION: {
    from: string;
    to: string;
    data?: any;
  };
  SAVE_GAME: {
    saveData: SaveGameData;
    timestamp: number;
  };
}
```

## Scene-Specific Events
### EncounterScene
```typescript
interface EncounterEvents {
  ENCOUNTER_STARTED: {
    type: string;
    difficulty: number;
    rewards: Reward[];
  };
  
  DIALOG_CHOICE_MADE: {
    choiceId: string;
    consequences: string[];
  };
  
  ENCOUNTER_COMPLETED: {
    outcome: 'success' | 'failure' | 'flee';
    rewards?: Reward[];
  };
}
```

### CardBattleScene
```typescript
interface CardBattleEvents {
  CARD_PLAYED: {
    cardId: string;
    target?: string;
    effects: Effect[];
  };
  
  TURN_ENDED: {
    currentPlayer: string;
    nextPlayer: string;
    turnCount: number;
  };
}
```

## Implementation
### Event Bus
```typescript
class EventBus {
  private listeners: Map<string, Function[]>;
  
  emit<T>(event: string, payload?: T): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(payload));
  }
  
  on<T>(event: string, callback: (payload: T) => void): void {
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(event, [...callbacks, callback]);
  }
  
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(event, callbacks.filter(cb => cb !== callback));
  }
}
```

### Usage Example
```typescript
// In PlayerShip class
this.scene.events.on('POWERUP_COLLECTED', (data: PowerUpEvents['POWERUP_COLLECTED']) => {
  this.applyPowerUp(data.effect, data.duration);
});

// Emitting an event
this.scene.events.emit('PLAYER_DAMAGED', {
  damage: 10,
  source: 'asteroid',
  position: { x: this.x, y: this.y },
  damageType: 'collision'
});
```

## Questions/Suggestions:
1. Should we add event validation/type checking?
2. Consider adding event queuing for performance
3. Need to handle scene-specific event cleanup
4. Add event logging for debugging?
5. Consider adding event priorities

## Best Practices
1. Always unsubscribe from events when scenes/objects are destroyed
2. Use TypeScript interfaces for event payloads
3. Keep event payloads serializable
4. Document all events and their usage
5. Consider performance impact of frequent events

## TODO:
- [ ] Implement event validation
- [ ] Add debug logging
- [ ] Create event visualization tool
- [ ] Add event performance metrics
- [ ] Document all event payloads

Example Event:

PLAYER_DAMAGED: Triggered when a player takes damage. Payload: { damageAmount: number, damageType: string }

ENEMY_DESTROYED: Triggered when an enemy is destroyed. Payload: { enemyType: string, scoreValue: number }

Scene-Specific Events: Document events specific to certain scenes.

Example:

EncounterInitiated: Triggered when an encounter starts in EncounterScene.

Event Handlers and Subscribers: Define how the system listens for and responds to events. Use a publisher-subscriber pattern to decouple different parts of the game.