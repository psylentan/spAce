import 'phaser';

export class Player extends Phaser.GameObjects.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private maxForwardSpeed: number = 800;
    private verticalSpeed: number = 400;
    private controlSensitivity: number = 1;
    private maxRightPosition: number; // Right border - 75% of screen width
    private minLeftPosition: number = 0; // Left border - neutral point (0 speed)
    private currentSpeed: number = 0;
    private currentVerticalSpeed: number = 0;
    private speedText!: Phaser.GameObjects.Text;
    private thrusterParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
    private engineSound!: Phaser.Sound.BaseSound;
    private engineStartSound!: Phaser.Sound.BaseSound;
    private engineStopSound!: Phaser.Sound.BaseSound;
    private lastSpeedPercentage: number = 0;
    public body!: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'player_ship') {
        super(scene, x, y, texture);
        
        // Add to scene and enable physics
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Calculate position limits based on world bounds
        this.minLeftPosition = 0;
        this.maxRightPosition = scene.cameras.main.width * 0.75;
        
        // Set up input
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Configure physics body
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(false);
            this.body.setDrag(200, 200);
            this.body.setMaxVelocity(this.maxForwardSpeed, this.verticalSpeed);
            
            // Set collision box relative to sprite size
            const collisionWidth = this.width * 0.4;
            const collisionHeight = this.height * 0.4;
            this.body.setSize(collisionWidth, collisionHeight);
            this.body.setOffset(
                (this.width - collisionWidth) / 2,
                (this.height - collisionHeight) / 2
            );
        }

        // Set up engine sounds
        this.engineSound = scene.sound.add('engine_loop', { loop: true, volume: 0 });
        this.engineStartSound = scene.sound.add('engine_start', { volume: 0.5 });
        this.engineStopSound = scene.sound.add('engine_stop', { volume: 0.5 });

        // Create thruster particles
        this.createThrusterEffect();

        // Set the ship's display properties
        this.setScale(0.2);
        this.setAngle(0);
        this.setDepth(10);
        this.setAlpha(1);

        // Create speed indicator
        this.speedText = scene.add.text(10, 40, 'Speed: 0', {
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.speedText.setScrollFactor(0);
        this.speedText.setDepth(20);
    }

    private createThrusterEffect(): void {
        // Create particle effect for thrusters
        this.thrusterParticles = this.scene.add.particles(0, 0, 'thruster', {
            speed: { min: 200, max: 400 },
            angle: { min: 160, max: 200 },
            scale: { start: 0.6, end: 0 },
            lifespan: { min: 100, max: 300 },
            blendMode: 'ADD',
            frequency: 20,
            alpha: { start: 0.8, end: 0 },
            tint: [0x00ffff, 0x1a75ff],
            emitting: false
        });
        
        this.thrusterParticles.setDepth(this.depth - 1);
        this.thrusterParticles.startFollow(this, -this.width * 0.25, 0);
    }

    public setControlSensitivity(sensitivity: number): void {
        this.controlSensitivity = sensitivity;
    }

    public getCurrentSpeed(): number {
        return this.currentSpeed;
    }

    public getVerticalSpeed(): number {
        return this.currentVerticalSpeed;
    }

    private calculateSpeedFromPosition(): number {
        // Calculate speed based on position
        // At left edge (0), speed is 0
        // At maxRightPosition, speed is maxForwardSpeed
        const normalizedPosition = (this.x - this.minLeftPosition) / (this.maxRightPosition - this.minLeftPosition);
        return this.maxForwardSpeed * Phaser.Math.Clamp(normalizedPosition, 0, 1);
    }

    private updateEngineEffects(speedPercentage: number): void {
        // Emit events for sound management
        if (speedPercentage > 0 && this.lastSpeedPercentage === 0) {
            this.scene.events.emit('player-accelerate');
        } else if (speedPercentage === 0 && this.lastSpeedPercentage > 0) {
            this.scene.events.emit('player-stop');
        }

        // Update thruster particles based on speed
        if (speedPercentage > 0) {
            this.thrusterParticles.start();
            const particleSpeed = 100 + (speedPercentage * 200);
            const particleLifespan = 100 + (speedPercentage * 200);
            const particleScale = 0.5 + (speedPercentage * 0.5);
            
            this.thrusterParticles.setConfig({
                speed: particleSpeed,
                lifespan: particleLifespan,
                scale: { start: particleScale, end: particleScale * 0.5 }
            });
        } else {
            this.thrusterParticles.stop();
        }

        this.lastSpeedPercentage = speedPercentage;
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        const deltaSeconds = delta / 1000;
        const moveSpeed = 300; // Base movement speed

        // Vertical movement (up/down) with minimal margins
        if (this.cursors.up.isDown) {
            this.body.setVelocityY(-this.verticalSpeed * this.controlSensitivity);
        } else if (this.cursors.down.isDown) {
            this.body.setVelocityY(this.verticalSpeed * this.controlSensitivity);
        } else {
            // Smooth vertical stop
            this.body.setVelocityY(this.body.velocity.y * 0.9);
        }

        // Store current vertical speed
        this.currentVerticalSpeed = this.body.velocity.y;

        // Horizontal position control with proper bounds checking
        if (this.cursors.right.isDown) {
            this.x = Math.min(this.x + moveSpeed * deltaSeconds, this.maxRightPosition);
        } else if (this.cursors.left.isDown) {
            this.x = Math.max(this.x - moveSpeed * deltaSeconds, this.minLeftPosition);
        }

        // Calculate and apply speed based on position
        this.currentSpeed = this.calculateSpeedFromPosition();
        this.body.setVelocityX(0); // We're not using physics for horizontal movement

        // Keep the ship within vertical bounds of the screen with minimal margins
        const verticalMargin = 5; // Reduced from 20 to 5 pixels
        if (this.y < verticalMargin) {
            this.y = verticalMargin;
            this.body.setVelocityY(0);
        } else if (this.y > this.scene.cameras.main.height - verticalMargin) {
            this.y = this.scene.cameras.main.height - verticalMargin;
            this.body.setVelocityY(0);
        }

        // Update speed indicator
        const speedPercentage = Math.round((this.currentSpeed / this.maxForwardSpeed) * 100);
        this.speedText.setText(`Speed: ${speedPercentage}%`);

        // Update engine effects
        this.updateEngineEffects(speedPercentage);
    }
} 