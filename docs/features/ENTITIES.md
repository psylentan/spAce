# Game Entities Documentation

## Overview
This document details all the core entities in the game, their attributes, and how they interact with each other.

## 1. Player Ship

### Attributes
```typescript
interface Ship {
  id: string;
  name: string;
  type: ShipType;
  stats: {
    hull: number;
    maxHull: number;
    shields: number;
    maxShields: number;
    energy: number;
    maxEnergy: number;
    speed: number;
    maneuverability: number;
  };
  systems: {
    weapons: WeaponSystem[];
    defenses: DefenseSystem[];
    engines: EngineSystem;
    special: SpecialSystem[];
  };
  cargo: {
    capacity: number;
    used: number;
    items: CargoItem[];
  };
  crew: CrewMember[];
  modules: ShipModule[];
}
```

### Systems
1. **Weapon Systems**
   - Type
   - Damage
   - Energy cost
   - Range
   - Special effects

2. **Defense Systems**
   - Shield type
   - Protection value
   - Energy cost
   - Special abilities

3. **Engine Systems**
   - Speed
   - Maneuverability
   - Energy efficiency
   - Special features

4. **Special Systems**
   - Unique abilities
   - Energy requirements
   - Cooldown periods
   - Effects

## 2. Card

### Attributes
```typescript
interface Card {
  id: string;
  name: string;
  type: CardType;
  faction: string;
  rarity: Rarity;
  energyCost: number;
  effects: Effect[];
  tags: string[];
  art: string;
  description: string;
  flavor: string;
}
```

### Types
1. **Combat Cards**
   - Attack cards
   - Defense cards
   - Utility cards
   - Special ability cards

2. **Negotiation Cards**
   - Persuasion cards
   - Trade cards
   - Information cards
   - Influence cards

3. **Crew Cards**
   - Action cards
   - Skill cards
   - Equipment cards
   - Special ability cards

4. **Exploration Cards**
   - Discovery cards
   - Resource cards
   - Survival cards
   - Investigation cards

## 3. Crew Member

### Attributes
```typescript
interface CrewMember {
  id: string;
  name: string;
  class: CrewClass;
  level: number;
  experience: number;
  skills: Skill[];
  traits: Trait[];
  equipment: Equipment[];
  status: CrewStatus;
  relationships: Relationship[];
  specialAbilities: SpecialAbility[];
}
```

### Classes
1. **Engineer**
   - Ship repair
   - System optimization
   - Energy management
   - Technical skills

2. **Soldier**
   - Combat skills
   - Weapon expertise
   - Tactical knowledge
   - Survival skills

3. **Pilot**
   - Navigation
   - Ship control
   - Evasive maneuvers
   - Sensor operations

4. **Medic**
   - Healing
   - Medical knowledge
   - Biological expertise
   - Emergency response

5. **Diplomat**
   - Negotiation
   - Cultural knowledge
   - Influence
   - Information gathering

## 4. Faction

### Attributes
```typescript
interface Faction {
  id: string;
  name: string;
  type: FactionType;
  territory: Territory[];
  resources: Resource[];
  military: MilitaryForce[];
  technology: Technology[];
  culture: Culture;
  relationships: FactionRelationship[];
}
```

### Types
1. **Major Factions**
   - Galactic Empire
   - Rebel Alliance
   - Corporate Consortium
   - Alien Federation

2. **Minor Factions**
   - Mercenary Guilds
   - Research Organizations
   - Criminal Syndicates
   - Independent Colonies

## 5. Location

### Attributes
```typescript
interface Location {
  id: string;
  name: string;
  type: LocationType;
  coordinates: Coordinates;
  faction: string;
  resources: Resource[];
  events: Event[];
  inhabitants: Inhabitant[];
  facilities: Facility[];
  hazards: Hazard[];
}
```

### Types
1. **Planets**
   - Terrestrial
   - Gas Giant
   - Ice World
   - Desert World

2. **Space Stations**
   - Trading Hub
   - Military Base
   - Research Facility
   - Mining Station

3. **Anomalies**
   - Cosmic Phenomena
   - Ancient Ruins
   - Strange Objects
   - Natural Hazards

## 6. Item

### Attributes
```typescript
interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  value: number;
  weight: number;
  effects: Effect[];
  requirements: Requirement[];
  description: string;
  art: string;
}
```

### Types
1. **Equipment**
   - Weapons
   - Armor
   - Tools
   - Special Devices

2. **Consumables**
   - Medical Supplies
   - Repair Kits
   - Fuel
   - Food

3. **Artifacts**
   - Ancient Relics
   - Strange Objects
   - Faction Items
   - Quest Items

## 7. Event

### Attributes
```typescript
interface Event {
  id: string;
  name: string;
  type: EventType;
  location: string;
  requirements: Requirement[];
  choices: Choice[];
  consequences: Consequence[];
  rewards: Reward[];
  story: string;
}
```

### Types
1. **Story Events**
   - Main plot events
   - Character events
   - Faction events
   - World events

2. **Random Events**
   - Encounters
   - Discoveries
   - Hazards
   - Opportunities

3. **Quest Events**
   - Mission events
   - Objective events
   - Reward events
   - Failure events 