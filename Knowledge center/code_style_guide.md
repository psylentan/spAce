# Code Style Guide

## TypeScript/JavaScript Conventions
- Use **camelCase** for variables and function names.
- **PascalCase** for classes and types (`PlayerShip`, `EffectManager`).
- Use **`const`** for variables that won’t change, and **`let`** for those that will.
- Always define types explicitly for clarity (e.g., `PlayerStats` for player stats object).

## File Naming Conventions
- **Classes**: `PlayerShip.ts`, `Enemy.ts`, `Card.ts`
- **Scenes**: `MainMenuScene.ts`, `GameScene.ts`
- **Managers**: `EffectManager.ts`, `InventoryManager.ts`
- **Helper Functions**: `utils.ts`

## Comment Requirements
- Use **JSDoc** comments for public methods and classes.
- Provide a **description** of the function's purpose, **parameters**, and **return type**.

## Code Organization Rules
- Group classes by functionality (e.g., all `entities/` together, all `scenes/` together).
- Keep files **modular**: Break large classes into smaller ones when possible.
