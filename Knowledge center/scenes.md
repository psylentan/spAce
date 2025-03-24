Map of Scenes
1. BootScene
Purpose: Initializes core game configurations (e.g., game size, physics settings). It’s the first thing that happens before anything loads.

Responsibilities:

Set up Phaser game settings (canvas size, physics engine, etc.).

Can transition directly into PreloadScene.

2. PreloadScene
Purpose: Loads all assets (images, sounds, spritesheets) before the game starts. You typically show a loading screen here.

Responsibilities:

Preload assets like player ship sprites, enemy assets, backgrounds, sounds.

Display a loading bar to indicate progress.

Once assets are loaded, automatically transition to StartScene or GameScene.

3. StartScene
Purpose: The main menu or title screen of the game.

Responsibilities:

Show game title and buttons (e.g., "Start Game", "Options", "Exit").

Handle button clicks (e.g., start the game, show settings).

Transition to GameScene once the player presses "Start Game".

4. GameScene
Purpose: Core gameplay loop where the player controls the ship, fights enemies, collects loot, etc.

Responsibilities:

Player movement: Control the ship using mouse or keyboard for 360° movement.

Combat: Player can shoot bullets and collide with enemies. Enemies shoot back.

World interaction: Collect power-ups, resources, and interact with environmental hazards (e.g., asteroids, mines).

Spawn enemies: Different types of enemies with varying AI behavior.

Transition: Trigger an encounter when reaching certain areas or interactable stations (i.e., EncounterScene).

Collisions: Manage collisions with bullets, enemies, and environmental objects.

Loot: Drop loot from destroyed enemies, which can be picked up by the player.

5. HUDScene
Purpose: Overlay scene that shows essential player stats (health, XP, score, etc.) during gameplay.

Responsibilities:

Show current player health, score, speed, ammo, and other important stats.

Display effects like buffs, debuffs, power-up timers.

Overlays on top of GameScene and can be launched during any gameplay session.

Update values in real-time as the player progresses.

6. EncounterScene
Purpose: Triggered when the player interacts with a station, anomaly, or enemy group. It initiates a dialog and choice-based interaction, followed by a potential battle or event.

Responsibilities:

Dialog system: Present a conversation or choice screen (e.g., a space station, an NPC, or an enemy group).

Player choices: Allow the player to choose options, which affect the encounter (e.g., flee, engage in combat, negotiate).

Transition: Depending on the choice, transition to CardBattleScene or return to GameScene.

7. CardBattleScene
Purpose: Engage the player in a turn-based card battle, triggered by certain encounters.

Responsibilities:

Card-based combat: Handle a deck-building system where players play cards that represent actions, attacks, or buffs.

Turn-based system: Implement the logic for turns, where both the player and the enemy can use cards and abilities.

Win/loss conditions: Determine whether the player wins or loses the encounter based on the card effects.

Rewards: On victory, provide rewards like new cards, items, or resources.

Transition: After the battle ends, transition back to GameScene.

8. InventoryScene
Purpose: Show the player’s inventory where they can manage items, resources, and equipment.

Responsibilities:

Display a list of collected items (e.g., weapons, resources, power-ups).

Allow the player to equip or use items.

Show item details (e.g., description, stats) when selected.

Allow item categorization (e.g., consumables, equipment, upgrades).

9. ItemDetailScene
Purpose: Displays detailed information about a specific item when the player selects it from their inventory.

Responsibilities:

Show detailed stats and properties of an item (e.g., description, use case, effect).

Provide options to equip, sell, or use the item.

10. ShipScene
Purpose: Show the player's ship and allow the management of ship-related attributes and equipment.

Responsibilities:

Display ship's current stats (e.g., hull, weapons, modules).

Allow the player to modify or upgrade ship components (e.g., swap out weapons, boost engines).

Provide visual feedback on the ship's status (e.g., health, shield levels).

11. ShipEquipScene
Purpose: Manage the equipping and upgrading of the player's ship components.

Responsibilities:

Allow the player to choose new ship parts (weapons, engines, shields).

Equip and swap out parts from the inventory.

Update the ship stats accordingly.

12. CrewScene
Purpose: Show all crew members and their roles in the ship.

Responsibilities:

Display a list of all crew members (e.g., pilot, engineer, gunner).

Allow the player to manage crew assignments or upgrade crew skills.

13. CrewMemberScene
Purpose: Manage an individual crew member’s stats and upgrades.

Responsibilities:

Display detailed information about a specific crew member.

Upgrade skills or assign new roles.

Improve their performance in different areas of the ship (e.g., better piloting, faster repairs).

14. PlayerScene
Purpose: Manage the player's main pilot stats and equipment.

Responsibilities:

Display pilot’s stats (e.g., health, level, skills).

Allow the player to equip items, level up skills, and make narrative choices that impact the story.

15. PilotEquipScene
Purpose: Equip items and gear for the player's pilot.

Responsibilities:

Equip weapons, armor, and gadgets to improve pilot stats and abilities.

16. QuantumLabScene
Purpose: Craft materials and upgrade ship or crew components.

Responsibilities:

Show available crafting recipes and materials.

Allow the player to craft new items or upgrade existing equipment.

17. GameOverScene
Purpose: Show when the player dies, summarizing the run with a score and meta rewards.

Responsibilities:

Show stats from the current run (enemies killed, damage dealt, time played).

Provide options to restart or continue with meta-upgrades.

18. RebirthScene
Purpose: The meta-progression screen after death, where the player can spend meta-currency to improve future runs.

Responsibilities:

Display available upgrades and their costs.

Allow the player to choose meta upgrades to apply to future runs (e.g., better starting equipment, faster leveling).

Transition to StartScene or GameScene after meta-progressions are applied.

19. SettingsScene
Purpose: Adjust game settings such as volume, controls, and graphics.

Responsibilities:

Provide sliders for audio, key remapping, or graphical settings.

Allow the player to save and apply settings.