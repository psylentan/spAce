export interface ShipConfig {
    // Movement
    maxSpeed: number;          // Maximum velocity in pixels/sec
    acceleration: number;      // Acceleration rate in units/sec²
    drag: number;             // Base drag force when dampeners are on
    
    // Rotation
    rotationSpeed: number;    // Keyboard rotation speed in degrees/sec
    mouseRotationSpeed: number; // Mouse follow rotation multiplier
    angularDrag: number;      // Angular drag force
    
    // Braking
    brakeForce: number;       // Brake force multiplier (0-1)
    
    // Boost
    boostMultiplier: number;  // Speed/acceleration multiplier when boosting
    boostEnergy: number;      // Maximum boost energy
    boostDrain: number;       // Energy drain per second while boosting
    boostRecharge: number;    // Energy recharge per second when not boosting
    
    // Precision Mode
    precisionModeDivisor: number; // Divides all movement values in precision mode
}

export const DEFAULT_SHIP_CONFIG: ShipConfig = {
    // Movement
    maxSpeed: 700,           // pixels/sec 400
    acceleration: 120,        // units/sec² 15
    drag: 75,               // Base drag force 50
    
    // Rotation
    rotationSpeed: 250,      // degrees/sec 150
    mouseRotationSpeed: 300, // Multiplier for mouse rotation 200
    angularDrag: 350,       // Angular drag force 250
    
    // Braking
    brakeForce: 0.2,       // 5% velocity reduction per frame 0.05
    
    // Boost
    boostMultiplier: 1.9,   // 50% increase in speed/acceleration 1.5
    boostEnergy: 500,       // Maximum energy 100
    boostDrain: 1,          // Units per second 2
    boostRecharge: 3,       // Units per second 1
    
    // Precision Mode
    precisionModeDivisor: 3 // Halves all movement values 2
};

// Different ship configurations can be added here
export const FAST_SHIP_CONFIG: ShipConfig = {
    ...DEFAULT_SHIP_CONFIG,
    maxSpeed: 600,
    acceleration: 25,
    rotationSpeed: 200
};

export const PRECISE_SHIP_CONFIG: ShipConfig = {
    ...DEFAULT_SHIP_CONFIG,
    maxSpeed: 300,
    acceleration: 10,
    rotationSpeed: 100,
    mouseRotationSpeed: 150,
    brakeForce: 0.08
}; 