# Card System

## Overview
The core card mechanics that power all interactions in the game, from combat to negotiations.

## Key Questions
1. Card Structure
   - How will different card types share base functionality?
   Answer:
We will implement an abstract base class or interface called CardBase which will contain shared properties and methods. All specific card types (CombatCard, NegotiationCard, etc.) will extend this base class, adding their own unique attributes.

TypeScript Example:

ts
Copy
Edit
interface CardBase {
  id: string;
  name: string;
  type: 'combat' | 'negotiation' | 'crew' | 'exploration';
  faction: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  energyCost: number;
  description: string;
  tags: string[];
  effects: CardEffect[];
}
This provides a unified API for deck-building, rendering, and play resolution, while allowing polymorphism in gameplay logic.


   - What properties are common across all cards?
   Answer:

id: Unique identifier.
name: Card display name.
type: Card category (e.g., combat, negotiation).
faction: Associated faction (used for reputation system).
rarity: Affects drop chance and power.
energyCost: How much energy/action points it takes to play.
description: UI-friendly explanation.
tags: Keywords for synergies (e.g., "aoe", "status", "diplomatic").
effects: A structured set of effect instructions (see below).

   - How will card effects be implemented and validated?
   Card effects will use a data-driven effect system, where each card has an effects array of structured operations (like a mini scripting language). Effects are resolved by a centralized EffectResolver that interprets them.

Example JSON Schema for Effects:

json
Copy
Edit
{
  "target": "enemy",
  "action": "damage",
  "amount": 15,
  "condition": "ifTargetHasStatus('shield')",
  "statusEffect": null
}
Validation Process:

Before runtime: Schema validation during card definition or import.
During gameplay: EffectResolver checks context (e.g., energy, valid target) before resolving.
TypeScript Sample:

ts
Copy
Edit
interface CardEffect {
  target: 'self' | 'enemy' | 'allies';
  action: 'damage' | 'heal' | 'draw' | 'buff' | 'status';
  amount?: number;
  statusEffect?: string;
  condition?: string;
}
This allows effects to be modular, scalable, and safe for AI-generated cards.

2. Card Types
   - How will combat cards differ from negotiation cards?
   Combat Cards target enemy ships or crew, dealing damage, applying combat buffs/debuffs, or manipulating ship stats.
Negotiation Cards target arguments or NPC intent, affecting persuasion, resolve, or converting enemies to allies.
While they share structure, their context of play, target resolution, and effect types differ.


   - What unique properties does each card type need?
   Answer:

Type: Unique Properties
Combat: damageType, shieldBypass, targetingRule, aoeRadius
Negotiation: argumentType, resolveImpact, diplomacyModifier, moodChange
Crew Combat: crewRequired, moraleImpact, injuryChance, formationBuffs
Exploration: triggerConditions (e.g., artifact present), skillRequirement, successChance, rewardTypes


   - How will card types interact with each other?
Answer:

Cards don’t directly interact across types in-play, but they influence shared meta-stats (e.g., morale, resources, faction rep).
Example: A negotiation win might add a buff card to the next combat deck.
Crew traits or equipment might unlock synergies: e.g., a diplomat crew member boosts negotiation effects across all decks.
We'll define inter-deck synergies via meta-effects or event triggers (e.g., "Win a negotiation → gain 1 energy in next combat").

3. Card Generation
   - How will new cards be generated?
   Answer:

Base cards are static JSON definitions.
Dynamic cards are AI-assisted (via OpenAI) or scripted templates filled based on deck type, faction, and power budget.
A card generation pipeline will:
Choose a deck type.
Pick 1–3 effects that synergize.
Assign faction alignment based on flavor + effect.
Assign rarity and cost using a scoring algorithm.
Card Generator Function Example:

ts
Copy
Edit
generateCard({
  deckType: 'negotiation',
  faction: 'Zenith Union',
  theme: 'conversion',
  powerLevel: 3
})

   
   - What determines card rarity and power level?
Answer:

Rarity is based on:
Total power score (energy efficiency, number of effects).
Presence of unique or complex effects.
Faction exclusivity.
Power Level Calculation: Each effect has a base score. Synergies (e.g., status + aoe) increase cost. Rare cards have higher ceiling but also drawbacks (e.g., energy overload, backfire chance).
Example:

ts
Copy
Edit
damage (10) = 1.0
+ draw (1) = 0.5
+ burn (1 turn) = 0.75
Total = 2.25 → "Uncommon"
We'll store a card balance matrix to normalize power-to-cost ratios and update over time using analytics.



   - How will faction alignment affect card generation?
Answer:

Faction Themes determine card mechanics. Each faction has:
Preferred keywords (e.g., stealth, diplomacy, status effects).
Color/style for visual cues.
Gameplay tendencies (e.g., glass cannon, tanky, swarm).
During generation, selecting a faction filters effect pools, sets card frame style, and may add flavor-specific traits.
Example:

json
Copy
Edit
{
  "faction": "Red Helix",
  "possibleEffects": ["berserk", "burn", "overload", "rage"],
  "style": "crimson glowing border",
  "dialogueFlavor": "Kill first, ask later."
}
Decks with multiple cards from one faction affect reputation and unlock synergy bonuses.

## Technical Specifications

### Base Card Interface
```typescript
interface BaseCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  cost: number;
  faction?: string;
  effects: CardEffect[];
  requirements?: CardRequirement[];
  metadata: {
    flavorText?: string;
    artist?: string;
    createdAt: Date;
  }
}

type CardType = 'combat' | 'negotiation' | 'exploration' | 'crew';
type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
```

### Card Effect System
```typescript
interface CardEffect {
  type: EffectType;
  value: number;
  target: EffectTarget;
  conditions?: EffectCondition[];
  duration?: number;
}
```

## Development Priorities

### Phase 1 (Weeks 1-2)
- [ ] Implement base card structure
- [ ] Create test suite for card validation
- [ ] Build basic card effect system

### Phase 2 (Weeks 3-4)
- [ ] Implement different card types
- [ ] Create card generation system
- [ ] Add faction alignment logic

### Phase 3 (Weeks 5-6)
- [ ] Balance card effects
- [ ] Implement card rarity system
- [ ] Add card metadata and tracking

## Dependencies
- Card rendering system
- Effect resolution system
- Faction system
- Combat system

## Open Questions
1. Should cards be able to belong to multiple factions?
2. How will card upgrading work?
3. Should there be "neutral" cards available to all factions?
4. How will card discovery and unlocking work in the meta-progression? 