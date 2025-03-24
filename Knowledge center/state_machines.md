# State Machines

## Overview
This file defines state machines for each key entity in the game. It clarifies what states each entity can be in and how they transition between states.

## PlayerShip States
### State Definitions
```typescript
enum PlayerShipState {
  IDLE,
  ACCELERATING,
  DECELERATING,
  SHOOTING,
  DAMAGED,
  DEAD,
  INVULNERABLE,
  POWER_UP_ACTIVE
}
```

### State Transitions Matrix
| Current State | Input/Event | Next State | Conditions |
|---------------|-------------|------------|------------|
| IDLE | Thrust | ACCELERATING | Player input detected |
| ACCELERATING | Release thrust | DECELERATING | No thrust input |
| ANY | Take damage | DAMAGED | health > 0 |
| DAMAGED | - | INVULNERABLE | After damage animation |
| INVULNERABLE | Timer | Previous state | After invulnerability period |
| ANY | Health = 0 | DEAD | - |

### State-Specific Behaviors
```typescript
interface PlayerShipBehaviors {
  IDLE: {
    animation: 'idle',
    canShoot: true,
    drag: 0.98
  },
  ACCELERATING: {
    animation: 'thrust',
    particleEffect: 'engineTrail',
    acceleration: 300
  },
  // Add other states...
}
```

## Enemy States
### State Definitions
```typescript
enum EnemyState {
  PATROL,
  CHASE,
  ATTACK,
  RETREAT,
  STUNNED,
  DEAD
}
```

### State Transitions Matrix
| Current State | Input/Event | Next State | Conditions |
|---------------|-------------|------------|------------|
| PATROL | Player detected | CHASE | Player in range |
| CHASE | Player in range | ATTACK | Distance < attackRange |
| ATTACK | Health low | RETREAT | health < 30% |
| ANY | Take damage | STUNNED | Can be stunned |

### Questions/Suggestions:
1. Should we add a DASHING state for quick dodge movements?
2. Consider adding SHIELD_ACTIVE state for shield powerups
3. Need to define exact timing for INVULNERABLE state
4. Add state persistence between scene transitions?
5. Consider adding HYPERSPACE state for fast travel

## PowerUp States
### State Definitions
```typescript
enum PowerUpState {
  FLOATING,
  COLLECTED,
  ACTIVE,
  EXPIRING,
  EXPIRED
}
```

### State Transitions Matrix
| Current State | Input/Event | Next State | Conditions |
|---------------|-------------|------------|------------|
| FLOATING | Player collision | COLLECTED | - |
| COLLECTED | - | ACTIVE | Immediate |
| ACTIVE | Duration low | EXPIRING | time < 3s |
| EXPIRING | Timer | EXPIRED | time = 0 |

## Implementation Notes
1. Use TypeScript enums for type safety
2. Implement state machine using Strategy pattern
3. Each state should have:
   - Entry actions
   - Exit actions
   - Update behavior
   - Allowed transitions

## Code Example
```typescript
class StateMachine<T extends string | number> {
  private currentState: T;
  private states: Map<T, State>;

  transition(newState: T): void {
    const oldState = this.states.get(this.currentState);
    const nextState = this.states.get(newState);
    
    oldState?.onExit();
    this.currentState = newState;
    nextState?.onEnter();
  }
}
```

// ... existing code ...

