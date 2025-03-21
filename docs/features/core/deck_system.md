# Deck Management System

## Overview
System for managing multiple deck types, deck building, and deck modifications during gameplay.

## Key Questions
1. Deck Structure
   - What are the deck size limits for each type?
Answer: Each encounter type has its own dedicated deck with minimum and maximum card limits to ensure strategic depth while avoiding bloat.

Deck Type	Min Cards	Max Cards
Combat	15	25
Negotiation	10	20
Crew Combat	8	16
Exploration	5	12
Minimum ensures viable hands and avoids "ultra-thin" exploit builds.
Maximum encourages curation and synergy, avoiding dilution.
Deck size can be expanded through upgrades or special traits (e.g., “Memory Module: +2 max to any deck”).
   - How will deck validation work?
Answer: Decks are validated before use (e.g., before entering an encounter or saving the build). Validation checks include:

Deck size within allowed range.
No duplicate cards beyond allowed copies (e.g., max 2 per card unless "Unique").
Cards must be unlocked.
Cards must match the current encounter type.
Cards can be filtered by faction, character-specific locks, or banned cards (if temporary effects are active).
Validation Result:

ts
Copy
Edit
{
  isValid: boolean,
  errors: string[],
  suggestions?: string[]
}

   - How will deck persistence work between runs?
Answer: Decks are run-bound, meaning they reset at the end of a run. However:

Unlocked cards persist in the player's meta-profile and are available for future runs.
Saved Builds: Players can save "deck templates" (preference-based loadouts) that can be reused at the start of new runs (if the cards are still unlocked).
Decks are saved as part of RunState:
ts
Copy
Edit
runState.decks = {
  combat: [...],
  negotiation: [...],
  crew: [...],
  exploration: [...]
}
Persistence also allows for partial deck recovery if a session crashes.

2. Deck Types
   - How will different deck types be balanced?
Answer: Each deck type is balanced around encounter mechanics, card tempo, and synergy windows:

Combat: Fast-paced, direct damage, AOE, shield mechanics.
Balanced by energy limits and enemy pressure.
Negotiation: Tempo and argument stacking; longer fights with buildup.
Balanced by resolve mechanics and tug-of-war card states.
Crew Combat: High stakes, fewer cards, synergy with crew abilities.
Balanced by crew health, positioning effects, and injury risks.
Exploration: Low deck size, choice-based effects.
Balanced around rarity of triggers and resource tradeoffs.
Global balance metrics:

Average energy-to-power ratio.
Status effect strength/duration norms.
Curve shaping (early vs. late game cards).
Analytics-driven patching (e.g., playrate vs. winrate per card).   - What are the building restrictions for each type?
   Answer:

Type-Specific Effects: Only exploration cards can trigger exploration events.
Faction Locks: Some cards are restricted to specific factions or require a minimum faction rep.
Crew-Based Unlocks: Certain cards require specific crew members or classes.
Character Locks: Some cards are tied to specific player characters (hero-locked).
E.g., a negotiation card that only appears if you have a "Diplomat" crew or are playing as the Ambassador.

   - How do deck types interact with faction alignment?
Answer:

Faction alignment has dual interaction:

Deck Composition Affects Reputation:

Having more cards of one faction increases your reputation with them.
Having cards from rival factions may decrease it.
Reputation Affects Card Access:

High faction rep can unlock unique cards from that faction’s pool.
Some high-rep decks unlock elite faction cards mid-run.
Opposing factions may ban you from shops or events (even removing faction cards from your deck).
Reputation Synergy:

60%+ cards from one faction → unlock Faction Synergy Bonus (e.g., +1 energy at start of turn, or passive effect).


3. Deck Building
   - What are the deck building rules?
Answer:

Players can modify decks at:
Run start (character setup).
After encounters (add/remove rewards).
Visiting stations/vendors (buy/swap cards).
Restrictions:
Only valid cards (unlocked or earned during run).
Max duplicates per card (typically 2, unless “Unique”).
Minimum deck size must be maintained.
Can’t add faction cards if reputation is hostile or card is locked.

   - How will the deck building UI work?
Answer: A modular tabbed interface with drag-and-drop support:

Tabs for each deck type (combat, negotiation, etc.).
Cards grouped by faction, energy cost, or rarity.
Filters for:
Faction
Type
Keywords (e.g., “draw”, “status”)
Card preview shows:
Visual (art, cost)
Faction tag
Effects
Deck Stats Overview:
Avg cost, faction % breakdown, synergy score.
UI Features:

Warnings when deck is invalid (e.g., too few cards).
Hover/tooltip for card effects.
Save/load templates.
   - What restrictions should be in place?
Answer:

Restriction Type	Example
Card Duplicates	Max 2 copies unless marked Unique
Deck Size	Min/max limits per type
Faction Lock	Can’t use cards from hostile factions
Character Lock	Card only usable by specific player character
Crew Synergy	Some cards require crew classes or equipment
Meta-Progression	Some cards only usable after unlock via meta XP
Optional: Allow “challenge” decks where restrictions are lifted for higher rewards (like chaos or draft mode).
## Technical Specifications

### Deck Interface
```typescript
interface Deck {
  id: string;
  type: DeckType;
  cards: BaseCard[];
  owner: string; // playerId
  metadata: {
    name: string;
    created: Date;
    modified: Date;
  }
  stats: DeckStats;
}

interface DeckStats {
  cardCount: number;
  averageCost: number;
  factionInfluence: Record<string, number>;
  typeDistribution: Record<CardType, number>;
}
```

### Deck Management System
```typescript
interface DeckManager {
  createDeck(type: DeckType): Deck;
  addCard(deckId: string, cardId: string): boolean;
  removeCard(deckId: string, cardId: string): boolean;
  validateDeck(deckId: string): ValidationResult;
  saveDeck(deckId: string): Promise<void>;
  loadDeck(deckId: string): Promise<Deck>;
}
```

## Development Priorities

### Phase 1 (Weeks 1-2)
- [ ] Implement basic deck structure
- [ ] Create deck validation system
- [ ] Build deck persistence layer

### Phase 2 (Weeks 3-4)
- [ ] Implement deck building UI
- [ ] Add deck type specific rules
- [ ] Create deck statistics tracking

### Phase 3 (Weeks 5-6)
- [ ] Add deck sharing/importing
- [ ] Implement deck versioning
- [ ] Add deck templates

## Dependencies
- Card system
- Faction system
- Save system
- UI system

## Open Questions
1. Should decks have minimum size requirements?
2. How will deck "recipes" or templates work?
3. Should there be deck-wide bonuses?
4. How will deck modification during runs work?
5. Should there be a "sideboard" system? 