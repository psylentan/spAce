export const GAME_CONSTANTS = {
    WINDOW: {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight,
        BACKGROUND_COLOR: '#000033'
    },
    PLAYER: {
        SPEED: 300,
        INITIAL_HEALTH: 100,
        MAX_HP: 100,
        FIRE_RATE: 250, // milliseconds between shots
        PROJECTILE_SPEED: 400
    },
    ENEMY: {
        SPAWN_RATE: 2000, // milliseconds
        SPEED: 150,
        DAMAGE: 10,
        PROJECTILE_SPEED: 300,
        FIRE_RATE: 2000
    },
    SPACE_OBJECTS: {
        SPAWN_RATE: 1000,
        METEOR: {
            HEALTH: 3,
            DAMAGE: 20,
            SCORE: 150
        },
        DEBRIS: {
            HEALTH: 1,
            DAMAGE: 15,
            SCORE: 50
        },
        COMET: {
            HEALTH: 5,
            DAMAGE: 30,
            SCORE: 200
        },
        STATION: {
            HEALTH: 10,
            HEAL_AMOUNT: 30,
            SCORE: 500
        },
        POWERUP: {
            DURATION: 10000, // milliseconds
            SCORE: 100
        },
        CRATE: {
            HEALTH: 1,
            SCORE: 150
        },
        BOSS: {
            HEALTH: 100,
            DAMAGE: 25,
            SCORE: 1000,
            SPAWN_INTERVAL: 60000 // milliseconds (1 minute)
        }
    },
    CARD_BATTLE: {
        HAND_SIZE: 5,
        CARDS_PER_HAND: 5,
        ENERGY_PER_TURN: 3,
        MAX_ENERGY: 10,
        TURN_DURATION: 30000, // milliseconds
        ENEMY_DAMAGE: 15
    },
    SCORE: {
        ENEMY_DESTROY: 100,
        CARD_BATTLE_WIN: 500
    },
    POWERUPS: {
        RAPID_FIRE: {
            DURATION: 5000,
            FIRE_RATE_MULTIPLIER: 2
        },
        SHIELD: {
            DURATION: 8000,
            DAMAGE_REDUCTION: 0.5
        },
        SPEED_BOOST: {
            DURATION: 6000,
            SPEED_MULTIPLIER: 1.5
        }
    }
} as const; 