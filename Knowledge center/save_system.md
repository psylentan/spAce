# Save System

## Save Data Structure
- **Player Data**: Health, level, inventory, ship stats.
- **Progress Data**: Current scene, completed quests, encounter history.

## Storage Methods
- Use **localStorage** for saving progress in web games.
- Use a **cloud storage service** (e.g., Firebase) for cross-device saves.

## Save/Load Flow
1. Save data is captured every X minutes or when major progress occurs (e.g., after an encounter).
2. Load the save file when the player returns to the game.

## Data Migration Strategy
- Ensure the save data format is backward-compatible with future updates to avoid loss of progress when updating the game.
