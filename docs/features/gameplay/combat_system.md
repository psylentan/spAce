# Combat System

## Overview
Turn-based card combat system that handles both space combat and crew combat scenarios.

## Key Questions
1. Combat Flow
   - How does initiative/turn order work?
   - What are the phases of combat?
   - How does combat end?

2. Combat Types
   - How does space combat differ from crew combat?
   - What unique mechanics exist for each type?
   - How do environmental factors affect combat?

3. Balance
   - How is damage calculated?
   - What determines combat difficulty?
   - How are rewards scaled?

## Technical Specifications

### Combat Interface
```typescript
interface CombatState {
  id: string;
  type: 'space' | 'crew';
  participants: CombatParticipant[];
  turn: number;
  phase: CombatPhase;
  environment: CombatEnvironment;
  effects: StatusEffect[];
}

interface CombatParticipant {
  id: string;
  type: 'player' | 'enemy' | 'ally';
  stats: CombatStats;
  deck: Deck;
  hand: Card[];
  effects: StatusEffect[];
  position?: Position;
}
```

### Combat Manager
```typescript
interface CombatManager {
  initiateCombat(type: CombatType, participants: CombatParticipant[]): CombatState;
  playCard(combatId: string, cardId: string, targets: string[]): void;
  endTurn(combatId: string): void;
  resolveEffects(combatId: string): void;
  checkVictoryConditions(combatId: string): VictoryResult;
}
```

## Development Priorities

### Phase 1 (Weeks 1-2)
- [ ] Implement basic combat flow
- [ ] Create turn system
- [ ] Build effect resolution system

### Phase 2 (Weeks 3-4)
- [ ] Add space combat specifics
- [ ] Add crew combat specifics
- [ ] Implement combat AI

### Phase 3 (Weeks 5-6)
- [ ] Add environmental effects
- [ ] Implement combat rewards
- [ ] Add combat animations

## Dependencies
- Card system
- Deck system
- Effect system
- Animation system

## Open Questions
1. Should there be a retreat mechanic?
2. How should critical hits work?
3. Should there be combat positioning?
4. How will multi-ship battles work?
5. Should there be combat objectives beyond elimination?

## Combat Types

### Space Combat
- Ship-to-ship battles
- Movement in 2D space
- Shield and hull damage
- System targeting
- Crew station bonuses

### Crew Combat
- Character-based combat
- Position-based tactics
- Equipment effects
- Cover mechanics
- Team synergies

## Environmental Factors
- Asteroid fields
- Nebula effects
- Gravity wells
- Space anomalies
- Planetary conditions 