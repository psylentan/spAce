# Space Game

A simple space game built with Phaser 3.

## Controls

The ship can be controlled using either mouse + keyboard or keyboard only:

### Mouse + Keyboard (Default)
- **Mouse Movement**: Aim the ship (ship will rotate to follow mouse)
- `↑` (Up Arrow): Thrust forward in the direction the ship is facing
- `↓` (Down Arrow): Brake (reduces current velocity)
- `Space`: Toggle between mouse/keyboard control modes

### Keyboard Only Mode
- `←` (Left Arrow): Rotate ship counter-clockwise
- `→` (Right Arrow): Rotate ship clockwise
- `↑` (Up Arrow): Thrust forward in the direction the ship is facing
- `↓` (Down Arrow): Brake (reduces current velocity)
- `Space`: Toggle between mouse/keyboard control modes

## Movement System

The movement system uses Phaser's arcade physics with the following characteristics:

- Zero gravity environment (space-like)
- Ship has drag (50) to slow down when not thrusting
- Angular drag (250) for smooth rotation stop
- Forward thrust speed of 200 pixels per second
- Rotation speed varies:
  - Keyboard: 150 degrees per second
  - Mouse: Dynamic (smoothly rotates to follow mouse)
- Brake: Reduces current velocity by 5% per frame

## Development

To run the game locally:

```bash
npm install
npm start
```

The game will be available at http://localhost:3000 