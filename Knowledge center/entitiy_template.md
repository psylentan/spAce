Each template will define:

1. **Class Name**  
2. **Attributes** (properties with types and descriptions)  
3. **Methods** (what actions each entity can perform)

---

## **Entity Templates / Patterns**

### 1. **PlayerShip Template**
```ts
class PlayerShip extends Phaser.Physics.Arcade.Sprite {
  health: number;
  maxHealth: number;
  speed: number;
  rotationSpeed: number;
  primaryWeapon: Weapon;
  secondaryWeapon: Weapon;
  activeEffects: Effect[];
  shield: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // Initialize attributes here
  }

  move() {
    // Move the player ship using mouse or keyboard
  }

  shoot() {
    // Fire primary or secondary weapon
  }

  takeDamage(amount: number) {
    // Deduct health or shield
  }

  applyEffect(effect: Effect) {
    // Apply temporary effect, like a speed boost
  }

  update() {
    // Update the player’s state (movement, shooting, etc.)
  }
}
```

---

### 2. **Enemy Template**
```ts
class Enemy extends Phaser.Physics.Arcade.Sprite {
  health: number;
  attackPattern: string;
  lootTable: Item[];
  scoreValue: number;
  aiType: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // Initialize attributes here
  }

  move() {
    // Move the enemy (chase player, patrol, etc.)
  }

  attack() {
    // Enemy attacks player or nearby entities
  }

  die() {
    // Handle enemy death
  }

  update() {
    // Update the enemy's behavior (AI, movement, etc.)
  }
}
```

---

### 3. **Bullet Template**
```ts
class Bullet extends Phaser.Physics.Arcade.Image {
  damage: number;
  owner: PlayerShip | Enemy;
  speed: number;
  lifetime: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // Initialize attributes here
  }

  move() {
    // Move the bullet in a direction
  }

  checkCollision() {
    // Check if the bullet hits an enemy or player
  }

  destroy() {
    // Destroy the bullet after it collides or expires
  }
}
```

---

### 4. **PowerUp Template**
```ts
class PowerUp extends Phaser.Physics.Arcade.Sprite {
  type: string; // e.g., 'speedBoost', 'healthRegen'
  value: number; // The amount of the effect
  effect: Effect;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // Initialize attributes here
  }

  activate() {
    // Apply the effect when picked up by the player
  }

  update() {
    // Update power-up state (e.g., floating, blinking)
  }
}
```

---

### 5. **LootItem Template**
```ts
class LootItem extends Phaser.Physics.Arcade.Sprite {
  item: Item; // The item dropped
  pickupType: string; // e.g., 'health', 'weapon', 'resource'

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // Initialize attributes here
  }

  pickUp() {
    // Allow the player to collect the loot item
  }

  update() {
    // Update the loot item (e.g., rotating, floating)
  }
}
```

---

### 6. **SpaceStation Template**
```ts
class SpaceStation extends Phaser.GameObjects.Sprite {
  stationId: string;
  dialogueTree: string[];
  hasEncounter: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // Initialize attributes here
  }

  triggerEncounter() {
    // Trigger an encounter scene based on the station
  }

  update() {
    // Update station state (e.g., animate station)
  }
}
```

---

### 7. **Card Template**
```ts
class Card {
  name: string;
  type: string; // e.g., 'attack', 'defense', 'buff'
  energyCost: number;
  effects: Effect[];
  rarity: string;

  constructor(name: string, type: string, energyCost: number, effects: Effect[], rarity: string) {
    this.name = name;
    this.type = type;
    this.energyCost = energyCost;
    this.effects = effects;
    this.rarity = rarity;
  }

  play() {
    // Apply card effects to the player or enemy
  }
}
```

---

### 8. **Deck Template**
```ts
class Deck {
  deckId: string;
  name: string;
  cards: Card[];
  deckType: string;

  constructor(deckId: string, name: string, cards: Card[], deckType: string) {
    this.deckId = deckId;
    this.name = name;
    this.cards = cards;
    this.deckType = deckType;
  }

  shuffle() {
    // Shuffle the deck
  }

  drawCard() {
    // Draw a card from the deck
  }

  addCard(card: Card) {
    // Add a card to the deck
  }
}
```

---

### 9. **Item Template**
```ts
class Item {
  itemId: string;
  name: string;
  type: string; // 'weapon', 'health', 'tech'
  stats: StatBlock; // Stats for the item (e.g., damage, defense)
  rarity: string; // 'common', 'rare', 'epic'

  constructor(itemId: string, name: string, type: string, stats: StatBlock, rarity: string) {
    this.itemId = itemId;
    this.name = name;
    this.type = type;
    this.stats = stats;
    this.rarity = rarity;
  }

  use() {
    // Apply item effect (e.g., heal player)
  }

  equip() {
    // Equip the item to the player or ship
  }
}
```

---

### 10. **Effect Template**
```ts
class Effect {
  name: string;
  stat: string; // The stat to modify (e.g., speed, health)
  modifier: number; // How much to change the stat by
  duration: number; // How long the effect lasts
  isMultiplier: boolean; // Whether it multiplies or adds

  constructor(name: string, stat: string, modifier: number, duration: number, isMultiplier: boolean = false) {
    this.name = name;
    this.stat = stat;
    this.modifier = modifier;
    this.duration = duration;
    this.isMultiplier = isMultiplier;
  }

  apply(target: any) {
    // Apply the effect to the target (e.g., apply speed boost)
  }

  remove(target: any) {
    // Remove the effect from the target (e.g., reverse speed boost)
  }

  isExpired() {
    // Check if the effect's duration is over
  }
}
```

---

### 11. **CrewMember Template**
```ts
class CrewMember {
  name: string;
  role: string; // e.g., 'Pilot', 'Engineer'
  level: number;
  skills: Skill[];
  morale: number;

  constructor(name: string, role: string, level: number, skills: Skill[], morale: number) {
    this.name = name;
    this.role = role;
    this.level = level;
    this.skills = skills;
    this.morale = morale;
  }

  assignSkill(skill: Skill) {
    // Assign a skill to this crew member
  }

  levelUp() {
    // Increase this crew member’s level
  }
}
```

---

### 12. **Skill Template**
```ts
class Skill {
  name: string;
  level: number;
  description: string;
  cooldown: number; // Time in seconds before it can be used again

  constructor(name: string, level: number, description: string, cooldown: number) {
    this.name = name;
    this.level = level;
    this.description = description;
    this.cooldown = cooldown;
  }

  apply(target: any) {
    // Apply the effect of this skill to a target (e.g., "Increase speed")
  }
}
```

---

### 13. **Ship Template**
```ts
class Ship {
  hullIntegrity: number;
  engineLevel: number;
  weapons: EquipmentSlot[];
  crew: CrewMember[];
  modules: Item[];

  constructor(hullIntegrity: number, engineLevel: number, weapons: EquipmentSlot[], crew: CrewMember[], modules: Item[]) {
    this.hullIntegrity = hullIntegrity;
    this.engineLevel = engineLevel;
    this.weapons = weapons;
    this.crew = crew;
    this.modules = modules;
  }

  upgrade() {
    // Upgrade the ship's components
  }

  equipItem(item: Item) {
    // Equip an item on the ship
  }
}
```

---

These **templates and patterns** provide the **blueprints** for your game entities.