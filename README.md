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

## Ship Physics Mechanics (In Development)

### Current Implementation
- Basic thrust and rotation
- Simple drag-based deceleration
- Basic braking system

### Planned Mechanics

#### 1. Ship Properties
- **Max Speed**: Maximum velocity the ship can achieve
  - Regular max speed: 400 pixels/sec
  - Boost max speed: 600 pixels/sec
- **Acceleration**: Rate of speed increase
  - Regular acceleration: 15 units/sec²
  - Boost acceleration: 25 units/sec²
- **Rotation Speed**: How quickly the ship turns
  - Regular turn rate: 150 degrees/sec
  - Fast turn rate: 250 degrees/sec
- **Brake Power**: How quickly the ship can stop
  - Current: 5% velocity reduction per frame
  - Planned: Variable brake power based on current speed

#### 2. Advanced Movement Features
- **Inertial Dampeners**
  - Toggle between Newtonian and dampened physics
  - Dampeners ON: Current drag-based system
  - Dampeners OFF: Pure inertial movement
- **Boost System**
  - Temporary speed and acceleration increase
  - Limited by boost energy meter
  - Recharge when not in use
- **Precision Mode**
  - Toggle for fine-tuned movement
  - Reduces all movement values by 50%
  - Useful for docking and precise maneuvers

#### 3. Visual Feedback
- Engine thrust particles
- Brake effect indicators
- Speed lines at high velocity
- Boost energy meter
- Current velocity indicator

### Implementation Priority
1. Ship property refinement
   - [ ] Implement proper acceleration
   - [ ] Add max speed limits
   - [ ] Fine-tune rotation speeds
   - [ ] Improve brake system

2. Advanced movement
   - [ ] Inertial dampener system
   - [ ] Boost mechanics
   - [ ] Precision mode

3. Visual feedback
   - [ ] Particle systems
   - [ ] UI indicators
   - [ ] Speed effects

## Physics Implementation Details

### 1. Acceleration System
```typescript
// Planned implementation
acceleration = 15; // units/sec²
maxSpeed = 400;
currentSpeed = Math.sqrt(velocity.x² + velocity.y²);
if (currentSpeed < maxSpeed) {
    // Apply acceleration in ship's facing direction
    // Account for frame delta time
}
```

### 2. Inertial Movement
```typescript
// With dampeners
drag = 50;
angularDrag = 250;

// Without dampeners
drag = 0;
angularDrag = 0;
// Manual deceleration required
```

### 3. Boost System
```typescript
// Boost properties
boostEnergy = 100;
boostDrain = 2;
boostRecharge = 1;
// Activate: Increase acceleration and max speed
// Deactivate: Return to normal values
// Monitor and update energy levels
```

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