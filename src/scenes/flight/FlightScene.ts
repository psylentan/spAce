import { Scene } from 'phaser';

export class FlightScene extends Scene {
    private ship!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private mouseControl: boolean = true; // Toggle between mouse/keyboard rotation

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
        this.add.text(16, 16, 
            'Mouse: Aim ship\n' +
            '↑ (Up Arrow): Thrust forward\n' +
            '↓ (Down Arrow): Brake\n' +
            'Space: Toggle mouse/keyboard control', 
            { color: '#ffffff' }
        );

        // Add control toggle
        this.input.keyboard!.addKey('SPACE').on('down', () => {
            this.mouseControl = !this.mouseControl;
        });
    }

    update(): void {
        const body = this.ship.body as Phaser.Physics.Arcade.Body;

        if (this.mouseControl) {
            // Mouse rotation
            const pointer = this.input.activePointer;
            const angle = Phaser.Math.Angle.Between(
                this.ship.x, this.ship.y,
                pointer.x + this.cameras.main.scrollX,
                pointer.y + this.cameras.main.scrollY
            );
            // Smooth rotation towards mouse
            const targetAngle = angle + Math.PI/2; // Adjust for sprite orientation
            const currentAngle = this.ship.rotation;
            const angleDiff = Phaser.Math.Angle.Wrap(targetAngle - currentAngle);
            if (Math.abs(angleDiff) > 0.01) {
                this.ship.setAngularVelocity(angleDiff * 200);
            } else {
                this.ship.setAngularVelocity(0);
            }
        } else {
            // Keyboard rotation
            if (this.cursors.left.isDown) {
                this.ship.setAngularVelocity(-150);
            } else if (this.cursors.right.isDown) {
                this.ship.setAngularVelocity(150);
            } else {
                this.ship.setAngularVelocity(0);
            }
        }

        // Forward thrust
        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(
                this.ship.rotation - Math.PI/2, // Adjust for sprite orientation
                200,
                body.velocity
            );
        }

        // Brake
        if (this.cursors.down.isDown) {
            // Apply braking force (reduce current velocity)
            body.setVelocity(
                body.velocity.x * 0.95,
                body.velocity.y * 0.95
            );
        }
    }
} 