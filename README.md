# Space Exploration & Card Battle Game

This is a Phaser 3 based game that combines space exploration with card-based battles. Players pilot a spaceship through an endless scrolling space environment, fighting enemies, collecting loot, and engaging in card battles when encountering special triggers.

## Game Features

- **Space Flight Scene**: Arcade-style spaceship flying with shooting and dodging mechanics
- **Card Battle Scene**: Turn-based card battles with energy management and strategic card play
- **Multiple Entity Types**: Fight enemy ships, avoid asteroids, collect loot crates, interact with mining stations
- **Deckbuilding**: Collect new cards to build and customize your deck
- **Progression**: Score-based progression with increasing difficulty

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd space-game

# Install dependencies
npm install

# Start the development server
npm start
```

The game will be available at `http://localhost:3000`.

## Development

### Project Structure

```
/src
  /scenes          # Game scenes (Boot, Preloader, MainMenu, SpaceFlight, CardBattle, GameOver)
  /objects         # Game objects (Player, Enemy, Card, etc.)
  /systems         # Game systems (DeckManager, SpawnerSystem, etc.)
  /utils           # Utility functions
  /assets          # Game assets (sprites, sounds)
  /config          # Game configuration
```

### Building the Project

```bash
# Build for production
npm run build
```

The built files will be available in the `/dist` directory.

## Technologies Used

- **Phaser 3**: Game framework
- **TypeScript**: For type-safe development
- **Webpack**: For bundling and development server

## Features

- Dynamic space environment with parallax star backgrounds
- Ship movement and acceleration mechanics
- Engine sound effects with multiple variations
- Encounter system for space events (derelicts, pirates, trading)
- Interactive UI for encounters

## Controls

- Arrow keys to control ship movement
- Click on screen to enable sound
- Home key to trigger random encounters

## License

MIT 