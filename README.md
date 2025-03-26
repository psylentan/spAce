# Space Game

A simple space game built with Phaser 3.

## Basic Controls

The ship can be controlled using the arrow keys:

- `←` (Left Arrow): Rotate ship counter-clockwise
- `→` (Right Arrow): Rotate ship clockwise
- `↑` (Up Arrow): Move ship forward in the direction it's facing

## Movement System

The movement system uses Phaser's arcade physics with the following characteristics:

- Zero gravity environment (space-like)
- Ship has drag (50) to slow down when not thrusting
- Angular drag (250) for smooth rotation stop
- Forward thrust speed of 200 pixels per second
- Rotation speed of 150 degrees per second

## Development

To run the game locally:

```bash
npm install
npm start
```

The game will be available at http://localhost:3000 