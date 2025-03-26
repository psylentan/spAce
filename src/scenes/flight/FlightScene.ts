import { Scene } from 'phaser';

export class FlightScene extends Scene {
    private ship!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'FlightScene' });
    }

    preload(): void {
        // Load the ship sprite
        this.load.image('ship', '/assets/sprites/ship_placeholder.png');
    }

    create(): void {
        // Create ship in the center
        this.ship = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'ship'
        );

        // Simple physics setup
        this.ship.setDrag(50);
        this.ship.setAngularDrag(250);

        // Setup controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Add instructions text
        this.add.text(16, 16, 'Arrow keys to rotate and move ship', {
            color: '#ffffff'
        });
    }

    update(): void {
        // Rotation controls
        if (this.cursors.left.isDown) {
            this.ship.setAngularVelocity(-150);
        } else if (this.cursors.right.isDown) {
            this.ship.setAngularVelocity(150);
        } else {
            this.ship.setAngularVelocity(0);
        }

        // Forward/backward movement
        const body = this.ship.body as Phaser.Physics.Arcade.Body;
        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(
                this.ship.rotation,
                200,
                body.velocity
            );
        }
    }
} 