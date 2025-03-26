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
- Configurable ship properties via ShipConfig
- Real-time debug display showing speed and position
- Proper acceleration and max speed implementation

Current ship configuration:
- Max Speed: 700 pixels/sec
- Acceleration: 30 units/sec²
- Rotation Speed: 150-250 degrees/sec
- Brake Force: 20% velocity reduction per frame
- Mouse Rotation: Dynamic smooth tracking

## Ship Physics Mechanics (In Development)

### ✅ Completed Features
1. Ship Properties
   - [x] Configurable ship attributes
   - [x] Proper acceleration system
   - [x] Max speed limits
   - [x] Fine-tuned rotation
   - [x] Improved brake system
   - [x] Real-time debug display

### 🚀 Next Features to Implement

#### 1. Advanced Movement Features
- **Inertial Dampeners** (Next Up)
  - Toggle between Newtonian and dampened physics
  - Dampeners ON: Current drag-based system
  - Dampeners OFF: Pure inertial movement
  - Keyboard shortcut: 'I' key

- **Boost System**
  - Temporary speed and acceleration increase
  - Limited by boost energy meter
  - Recharge when not in use
  - Keyboard shortcut: 'Shift' key

- **Precision Mode**
  - Toggle for fine-tuned movement
  - Reduces all movement values by 50%
  - Useful for docking and precise maneuvers
  - Keyboard shortcut: 'C' key

#### 2. Visual Feedback
- **Particle Effects**
  - Engine thrust particles
  - Brake effect indicators
  - Direction indicator

- **UI Elements**
  - Speed indicator with max speed warning
  - Boost energy meter
  - Current mode indicators (Dampeners/Precision)
  - Mini-map or position indicator

### Implementation Priority

1. Inertial Dampeners (Next Feature)
   - [ ] Add dampener toggle
   - [ ] Implement pure Newtonian physics mode
   - [ ] Add visual indicator for dampener state
   - [ ] Update debug display with current mode

2. Boost System
   - [ ] Add energy system
   - [ ] Implement boost mechanics
   - [ ] Add energy UI
   - [ ] Add boost particles

3. Visual Feedback
   - [ ] Engine particles
   - [ ] UI overlays
   - [ ] Speed effects

## Development

To run the game locally:

```bash
npm install
npm start
```

The game will be available at http://localhost:3000 

## Testing Plan

### Physics Tests
1. Acceleration
   - Measure time to reach max speed
   - Verify consistent acceleration rate
   - Test at different angles

2. Braking
   - Measure stopping distance
   - Test brake efficiency at different speeds
   - Verify brake behavior with/without dampeners

3. Boost System
   - Verify energy consumption rate
   - Test recharge mechanics
   - Measure speed/acceleration increases

4. Precision Mode
   - Verify all movement values are halved
   - Test fine control in docking scenarios

### Visual Feedback Tests
1. Particle Effects
   - Verify correct orientation
   - Test scaling with speed
   - Check performance impact

2. UI Elements
   - Verify accurate speed display
   - Test boost meter updates
   - Check visibility at all speeds 