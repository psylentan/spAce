Map of Entities and Objects
1. PlayerShip
Class: PlayerShip (extends Phaser.Physics.Arcade.Sprite)

Attributes:

health: number (Current health)

maxHealth: number (Max health)

speed: number (Movement speed)

rotationSpeed: number (Rotation speed)

primaryWeapon: Weapon (Current weapon)

secondaryWeapon: Weapon (Secondary weapon, if available)

activeEffects: Effect[] (Array of currently active effects, like buffs or debuffs)

shield: number (Shield value, if available)

Methods:

move() (Move player ship based on input)

shoot() (Fires the primary/secondary weapon)

takeDamage() (Handles player damage)

applyEffect() (Applies a temporary effect, like a speed boost)

update() (Handles the player’s state each frame)

2. Enemy
Class: Enemy (extends Phaser.Physics.Arcade.Sprite)

Attributes:

health: number (Current health)

attackPattern: string (AI attack behavior)

lootTable: Item[] (Items that may drop on death)

scoreValue: number (Points for killing the enemy)

aiType: string (AI behavior type, e.g., "Chaser", "Shooter")

Methods:

move() (Move based on AI behavior)

attack() (Attack the player or nearby entities)

die() (When enemy health reaches 0, execute death logic)

3. Bullet
Class: Bullet (extends Phaser.Physics.Arcade.Image)

Attributes:

damage: number (Damage dealt by the bullet)

owner: PlayerShip | Enemy (The owner of the bullet—either player or enemy)

speed: number (Bullet speed)

lifetime: number (Duration before the bullet is destroyed)

Methods:

move() (Move the bullet based on velocity)

checkCollision() (Checks if the bullet collides with anything)

4. PowerUp
Class: PowerUp (extends Phaser.Physics.Arcade.Sprite)

Attributes:

type: string (Type of the power-up, e.g., "speedBoost", "healthRegen")

value: number (The effect of the power-up, like how much health to heal or speed to add)

effect: Effect (The actual effect applied when picked up)

Methods:

activate() (Activates the effect when picked up by the player)

5. LootItem
Class: LootItem (extends Phaser.Physics.Arcade.Sprite)

Attributes:

item: Item (Item associated with the loot drop, like a weapon or resource)

pickupType: string (Type of loot drop, e.g., "health", "weapon")

Methods:

pickUp() (Allow player to collect the loot item)

6. SpaceStation
Class: SpaceStation (extends Phaser.GameObjects.Sprite)

Attributes:

stationId: string (Unique identifier for the space station)

dialogueTree: string[] (Predefined dialogues for NPC interaction)

hasEncounter: boolean (True if this station triggers an encounter)

Methods:

triggerEncounter() (Initiates the encounter system when the player interacts with the station)

7. Card
Class: Card (Custom Class)

Attributes:

name: string (Name of the card)

type: string (Type of card, e.g., "attack", "buff", "debuff")

energyCost: number (Energy required to use the card)

effects: Effect[] (Effects applied when the card is played)

rarity: string (Rarity of the card)

Methods:

play() (Applies the card’s effects)

8. Deck
Class: Deck (Custom Class)

Attributes:

deckId: string (Unique ID for the deck)

name: string (Deck name)

cards: Card[] (Array of cards in the deck)

deckType: string (Type of deck, e.g., "Combat", "Tech", "Diplomacy")

Methods:

shuffle() (Shuffles the deck)

drawCard() (Draws a card from the deck)

addCard() (Adds a card to the deck)

9. Item
Class: Item (Custom Class)

Attributes:

itemId: string (Unique ID for the item)

name: string (Name of the item)

type: string (Item type, e.g., "weapon", "health", "tech")

stats: StatBlock (Associated stats for the item, e.g., damage for weapons)

rarity: string (Rarity, e.g., "common", "rare", "epic")

Methods:

use() (Used in combat, healing, or other situations)

equip() (Equips the item on a character or ship)

10. Effect
Class: Effect (Custom Class)

Attributes:

name: string (Name of the effect, e.g., "Speed Boost", "Poison")

stat: string (What stat it modifies, e.g., "speed", "health")

modifier: number (The change value, like +2 for buffs or *0.5 for debuffs)

duration: number (How long the effect lasts in milliseconds)

isMultiplier: boolean (Whether it multiplies the stat or adds to it)

Methods:

apply(target) (Applies the effect to the target, whether it's a buff or debuff)

remove(target) (Removes the effect when the duration expires)

isExpired() (Checks if the effect has expired)

11. CrewMember
Class: CrewMember (Custom Class)

Attributes:

name: string (Name of the crew member)

role: string (The role of the crew member, e.g., "Pilot", "Engineer", "Gunner")

level: number (Current level or experience)

skills: Skill[] (Skills assigned to the crew member)

morale: number (Morale of the crew member, affects performance)

Methods:

assignSkill() (Assign a skill to the crew member)

levelUp() (Increase the crew member’s level)

12. Skill
Class: Skill (Custom Class)

Attributes:

name: string (Name of the skill, e.g., "Repair", "Fire Accuracy")

level: number (Skill level, determining effectiveness)

description: string (Text description of what the skill does)

cooldown: number (Cooldown time in seconds)

Methods:

apply(target) (Apply the skill's effect to a target, like increasing fire accuracy)

13. Ship
Class: Ship (Custom Class)

Attributes:

hullIntegrity: number (Current hull health)

engineLevel: number (Level of engine upgrades)

weapons: EquipmentSlot[] (List of equipped weapons)

crew: CrewMember[] (List of crew members assigned to the ship)

modules: Item[] (List of items equipped to the ship)

Methods:

upgrade() (Upgrade ship components)

equipItem() (Equip a new item on the ship)

14. GameStatsManager
Class: GameStatsManager (Custom Class)

Attributes:

killsByType: Record<string, number> (How many enemies of each type were killed)

totalDamage: number (Total damage dealt in the game)

accuracy: number (Shooting accuracy)

playtime: number (Time spent playing)

Methods:

logKill(type: string) (Logs an enemy kill)

logDamage(amount: number) (Logs damage dealt)

getStats() (Returns all tracked stats)

15. EffectManager
Class: EffectManager (Custom Class)

Attributes:

activeEffects: Effect[] (Array of active effects applied to the target)

Methods:

addEffect(effect: Effect) (Adds a new effect to the target)

update() (Checks and expires effects when necessary)

clearAll() (Clears all effects from the target)