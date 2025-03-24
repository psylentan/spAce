Comprehensive Game Entity and Class Map

This document outlines a complete structural hierarchy of all custom classes and entities used in your top-down space shooter RPG game. Each section includes:

Class name

Description

Parent Phaser class (if applicable)

Related scenes

Key properties/attributes

Relationships to other classes

ENTITY HIERARCHY (Top-Down View)

Entity
├── Actor (Base for all game world objects)
│   ├── PlayerShip
│   ├── Enemy
│   ├── Bullet
│   ├── Mine
│   └── Debris
│
├── Pickup
│   ├── PowerUp
│   └── LootItem
│
├── StaticObject
│   └── SpaceStation
│
├── LogicObjects
│   ├── Card
│   ├── Deck
│   ├── Inventory
│   ├── Item
│   ├── EquipmentSlot
│   └── TriggerZone
│
├── Characters
│   ├── PlayerPilot
│   ├── CrewMember
│   └── Ship
│
├── RPG Systems
│   ├── Skill
│   ├── StatBlock
│   ├── Effect
│   └── Upgrade
│
├── Systems
│   ├── GameStatsManager
│   ├── MetaProgressionManager
│   ├── DialogueManager
│   └── ShipAI

CLASS DEFINITIONS AND ATTRIBUTE TEMPLATES

PlayerShip

Extends: Phaser.Physics.Arcade.Sprite

Scenes: GameScene, HUDScene

Attributes:

health: number

maxHealth: number

speed: number

rotationSpeed: number

primaryWeapon: Weapon

secondaryWeapon: Weapon

equipment: EquipmentSlot[]

activeEffects: Effect[]

Enemy

Extends: Phaser.Physics.Arcade.Sprite

Scenes: GameScene

Attributes:

health: number

aiType: string

attackPattern: string

lootTable: Item[]

scoreValue: number

Bullet

Extends: Phaser.Physics.Arcade.Image

Scenes: GameScene

Attributes:

damage: number

owner: PlayerShip | Enemy

speed: number

lifetime: number

Mine

Extends: Phaser.Physics.Arcade.Sprite

Scenes: GameScene

Attributes:

triggerRadius: number

damage: number

explosionEffect: string

PowerUp / LootItem

Extends: Phaser.Physics.Arcade.Sprite

Scenes: GameScene

Attributes:

type: string

value: number

effect: Effect

SpaceStation

Extends: Phaser.GameObjects.Sprite

Scenes: GameScene, EncounterScene

Attributes:

stationId: string

dialogueTree: string[]

hasEncounter: boolean

Card

Extends: Object

Scenes: CardBattleScene, DeckScene

Attributes:

name: string

type: string

energyCost: number

effects: Effect[]

rarity: string

Deck

Extends: Object

Scenes: DecksScene, DeckScene

Attributes:

deckId: string

name: string

cards: Card[]

deckType: string

Inventory

Extends: Object

Scenes: InventoryScene, ItemDetailScene

Attributes:

items: Item[]

capacity: number

credits: number

Item

Extends: Object

Scenes: ItemDetailScene, EquipScene

Attributes:

itemId: string

name: string

type: string

stats: StatBlock

rarity: string

EquipmentSlot

Extends: Object

Scenes: EquipScene, ShipEquipScene

Attributes:

slotType: string

item: Item | null

PlayerPilot

Extends: Object

Scenes: PlayerScene, PilotEquipScene

Attributes:

name: string

level: number

xp: number

traits: string[]

equipment: EquipmentSlot[]

CrewMember

Extends: Object

Scenes: CrewScene, CrewMemberScene

Attributes:

name: string

role: string

level: number

skills: Skill[]

morale: number

Ship

Extends: Object

Scenes: ShipScene, ShipEquipScene

Attributes:

hullIntegrity: number

engineLevel: number

weapons: EquipmentSlot[]

crew: CrewMember[]

modules: Item[]

Skill

Extends: Object

Scenes: PlayerScene, CrewMemberScene

Attributes:

name: string

level: number

description: string

cooldown: number

Effect

Extends: Object

Scenes: GameScene, EnvironmentalEffect, CardBattleScene

Attributes:

effectId: string

type: string (buff/debuff/damage/etc.)

duration: number

magnitude: number

Upgrade

Extends: Object

Scenes: RebirthScene, MetaProgressionScene

Attributes:

upgradeId: string

name: string

cost: number

description: string

appliesTo: string (ship, player, global)

GameStatsManager

Extends: Singleton

Scenes: All

Attributes:

killsByType: Record<string, number>

shotsFired: number

accuracy: number

sessionsPlayed: number

MetaProgressionManager

Extends: Singleton

Scenes: RebirthScene, VictoryScene

Attributes:

metaCurrency: number

unlockedUpgrades: string[]

lastDeathStats: GameStats

DialogueManager

Extends: Singleton

Scenes: EncounterScene, CardBattleScene, AIInteractionScene

Attributes:

activeDialogueTree: string[]

currentNode: number

responseProfile: string

ShipAI

Extends: AIComponent

Scenes: AIInteractionScene, GameScene

Attributes:

name: string

level: number

personality: string

knowledge: string[]

responseAccuracy: number

Let me know which classes you want to expand or refactor first!