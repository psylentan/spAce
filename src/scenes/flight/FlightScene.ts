import { Scene } from 'phaser';
import { ShipConfig, DEFAULT_SHIP_CONFIG } from '../../config/ShipConfig';

export class FlightScene extends Scene {
    private ship!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private mouseControl: boolean = true;
    private config: ShipConfig;
    private debugText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'FlightScene' });
        this.config = DEFAULT_SHIP_CONFIG;
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

        // Apply physics properties from config
        this.ship.setDrag(this.config.drag);
        this.ship.setAngularDrag(this.config.angularDrag);

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

        // Add debug text for ship properties
        this.debugText = this.add.text(16, 120, '', { 
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 10 }
        });

        // Add control toggle
        this.input.keyboard!.addKey('SPACE').on('down', () => {
            this.mouseControl = !this.mouseControl;
        });
    }

    update(): void {
        const body = this.ship.body as Phaser.Physics.Arcade.Body;
        const deltaTime = this.game.loop.delta / 1000; // Convert to seconds

        // Handle rotation
        if (this.mouseControl) {
            const pointer = this.input.activePointer;
            const angle = Phaser.Math.Angle.Between(
                this.ship.x, this.ship.y,
                pointer.x + this.cameras.main.scrollX,
                pointer.y + this.cameras.main.scrollY
            );
            const targetAngle = angle + Math.PI/2;
            const currentAngle = this.ship.rotation;
            const angleDiff = Phaser.Math.Angle.Wrap(targetAngle - currentAngle);
            
            if (Math.abs(angleDiff) > 0.01) {
                this.ship.setAngularVelocity(angleDiff * this.config.mouseRotationSpeed);
            } else {
                this.ship.setAngularVelocity(0);
            }
        } else {
            if (this.cursors.left.isDown) {
                this.ship.setAngularVelocity(-this.config.rotationSpeed);
            } else if (this.cursors.right.isDown) {
                this.ship.setAngularVelocity(this.config.rotationSpeed);
            } else {
                this.ship.setAngularVelocity(0);
            }
        }

        // Handle thrust with acceleration
        if (this.cursors.up.isDown) {
            const currentSpeed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
            if (currentSpeed < this.config.maxSpeed) {
                const acceleration = this.config.acceleration * deltaTime;
                this.physics.velocityFromRotation(
                    this.ship.rotation - Math.PI/2,
                    acceleration * 60, // Convert to pixels per frame
                    body.acceleration
                );
            } else {
                body.setAcceleration(0, 0);
            }
        } else {
            body.setAcceleration(0, 0);
        }

        // Handle braking
        if (this.cursors.down.isDown) {
            body.setVelocity(
                body.velocity.x * (1 - this.config.brakeForce),
                body.velocity.y * (1 - this.config.brakeForce)
            );
        }

        // Update debug text
        const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        this.debugText.setText([
            `Speed: ${Math.round(speed)} px/s`,
            `Max Speed: ${this.config.maxSpeed} px/s`,
            `Acceleration: ${this.config.acceleration} units/s²`,
            `Control: ${this.mouseControl ? 'Mouse' : 'Keyboard'}`,
            `Position: (${Math.round(this.ship.x)}, ${Math.round(this.ship.y)})`
        ].join('\n'));
    }
} 