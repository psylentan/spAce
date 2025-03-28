import { Scene } from 'phaser';
import { ShipConfig, DEFAULT_SHIP_CONFIG } from '../../config/ShipConfig';
import { CameraController } from '../../controllers/CameraController';
import { StarField } from '../../systems/StarField';
import { MeteoriteBelt } from '../../systems/MeteoriteBelt';
import { LayerManager, LayerConfig } from '../../systems/LayerManager';
import { WeaponSystem } from '../../systems/weapons/WeaponSystem';
import { PlanetManager } from '../../systems/space-objects/PlanetManager';

declare module 'phaser' {
    interface Scene {
        ship: Phaser.Physics.Arcade.Sprite;
    }
}

export class FlightScene extends Scene {
    public ship!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private mouseControl: boolean = true;
    private config: ShipConfig;
    private debugText!: Phaser.GameObjects.Text;
    private cameraController!: CameraController;
    private starField!: StarField;
    private meteoriteBelt!: MeteoriteBelt;
    private layerManager!: LayerManager;
    private layerText!: Phaser.GameObjects.Text;
    private layerTransitionParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
    private denseStarField!: StarField;
    private weaponSystem!: WeaponSystem;
    private planetManager!: PlanetManager;

    constructor() {
        super({ key: 'FlightScene' });
        this.config = DEFAULT_SHIP_CONFIG;
    }

    preload(): void {
        // Load ship sprite
        this.load.image('ship', 'assets/sprites/starship200.png');

        // Generate and preload weapon sounds
        const { plasmaFire, weaponReady, rocketFire, cloakActivate } = WeaponSystem.generateWeaponSounds();
        
        // Create Blobs from the ArrayBuffers
        const plasmaBlob = new Blob([plasmaFire], { type: 'audio/wav' });
        const readyBlob = new Blob([weaponReady], { type: 'audio/wav' });
        const rocketBlob = new Blob([rocketFire], { type: 'audio/wav' });
        const cloakBlob = new Blob([cloakActivate], { type: 'audio/wav' });

        // Create object URLs for the Blobs
        const plasmaUrl = URL.createObjectURL(plasmaBlob);
        const readyUrl = URL.createObjectURL(readyBlob);
        const rocketUrl = URL.createObjectURL(rocketBlob);
        const cloakUrl = URL.createObjectURL(cloakBlob);

        // Load the sounds
        this.load.audio('plasma_fire', plasmaUrl);
        this.load.audio('weapon_ready', readyUrl);
        this.load.audio('rocket_fire', rocketUrl);
        this.load.audio('cloak_activate', cloakUrl);

        // Clean up URLs after loading
        this.load.once('complete', () => {
            URL.revokeObjectURL(plasmaUrl);
            URL.revokeObjectURL(readyUrl);
            URL.revokeObjectURL(rocketUrl);
            URL.revokeObjectURL(cloakUrl);
        });

        // Load planet texture
        this.load.image('planet_earth', 'assets/sprites/Zerion.png');
    }

    create(): void {
        // Create background layers first
        this.setupBackgroundLayers();

        // Create ship with guaranteed loaded texture
        this.setupShip();

        // Setup camera and controls after ship
        this.setupCameraAndControls();

        // Setup weapons after ship and controls
        this.weaponSystem = new WeaponSystem(this);

        // Setup UI elements last
        this.setupUIElements();

        // Initialize planet manager after ship creation
        this.planetManager = new PlanetManager(this, this.ship);

        // Create a test planet
        this.planetManager.createTestPlanet(1000, 1000);

        // Debug log
        console.log('Scene setup complete. Controls and weapons initialized.');
    }

    private setupShip(): void {
        // Create ship in the center with adjusted properties for the new detailed design
        this.ship = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'ship'
        );

        // Force immediate scale update
        this.ship.setScale(0.15);
        
        // Ensure scale is applied after next frame
        this.time.delayedCall(0, () => {
            this.ship.setScale(0.15);
            console.log('Ship scale after delay:', this.ship.scale);
        });

        // Configure ship appearance and physics
        this.ship.setDepth(100);   // Ensure ship renders above background elements
        this.ship.setAngle(90);
        
        // Apply enhanced physics properties
        this.ship.setDrag(this.config.drag);
        this.ship.setAngularDrag(this.config.angularDrag);
        this.ship.setMass(1.5);
        this.ship.setMaxVelocity(this.config.maxSpeed);
        
        // Set collision body size to match the visible ship (after scaling)
        const scaledWidth = this.ship.displayWidth;
        const scaledHeight = this.ship.displayHeight;
        this.ship.setSize(scaledWidth * 0.8, scaledHeight * 0.8);
        this.ship.setOffset(scaledWidth * 0.1, scaledHeight * 0.1);
    }

    private setupBackgroundLayers(): void {
        // Create background layers
        this.starField = new StarField(this, {
            depth: -1000,
            layerCount: 2,
            starsPerLayer: 200,
            minSpeed: 0.2,
            maxSpeed: 0.8,
            minStarSize: 1,
            maxStarSize: 3,
            colors: [0xFFFFFF, 0x87CEEB],
            backgroundColor: 0x000000,
            width: 4000,
            height: 4000
        });
        this.starField.setVisible(true);
        this.starField.setAlpha(1);

        this.denseStarField = new StarField(this, {
            depth: -900,
            layerCount: 2,
            starsPerLayer: 800,
            minSpeed: 0.4,
            maxSpeed: 1.2,
            minStarSize: 1,
            maxStarSize: 5,
            colors: [0xFF4444, 0xFF8866, 0xFFAA88],
            backgroundColor: 0x110000,
            width: 4000,
            height: 4000
        });
        this.denseStarField.setVisible(true);
        this.denseStarField.setAlpha(0);

        this.meteoriteBelt = new MeteoriteBelt(this, {
            depth: -950,
            smallCount: 150,
            largeCount: 8,
            beltWidth: 3000,
            beltHeight: 800,
            beltAngle: 20,
            parallaxFactor: 0.8
        });
        this.meteoriteBelt.setVisible(true);

        // Initialize layer system
        const layerConfig: LayerConfig = {
            totalLayers: 2,
            transitionDuration: 800,
            depthSpacing: 1000,
            scaleRange: { min: 0.6, max: 1.4 },
            alphaRange: { min: 0.3, max: 1.0 },
            layerEffects: [
                { tint: 0xFFFFFF },  // Normal space
                { tint: 0xFF9966 }   // Orange-red tint for dense layer
            ]
        };
        
        this.layerManager = new LayerManager(this, layerConfig);

        // Add layer indicator
        this.layerText = this.add.text(16, 180, 'Layer: Base', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(1000);

        // Add keyboard controls for layer movement
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-Q', () => this.moveLayer('up'));
            this.input.keyboard.on('keydown-E', () => this.moveLayer('down'));
        }
    }

    private setupCameraAndControls(): void {
        // Initialize camera controller with adjusted zoom
        this.cameraController = new CameraController(this, this.ship);
        this.cameras.main.setZoom(1);

        // Setup controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Add control toggle (use Z instead of SPACE to avoid conflict with weapon system)
        this.input.keyboard!.addKey('Z').on('down', () => {
            this.mouseControl = !this.mouseControl;
            console.log('Control mode:', this.mouseControl ? 'Mouse' : 'Keyboard');
        });

        // Add mouse wheel zoom
        this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
            this.cameraController.handleMouseWheel(deltaY);
        });
    }

    private setupUIElements(): void {
        // Add instructions text
        const instructions = this.add.text(16, 16, 
            'Mouse: Aim ship\n' +
            '↑ (Up Arrow): Thrust forward\n' +
            '↓ (Down Arrow): Brake/Reverse\n' +
            'Space: Toggle mouse/keyboard control\n' +
            'Mouse Wheel: Zoom in/out', 
            { 
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 10 }
            }
        );
        instructions.setScrollFactor(0);
        instructions.setDepth(1000);

        // Add debug text
        this.debugText = this.add.text(16, 140, '', { 
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 10 }
        });
        this.debugText.setScrollFactor(0);
        this.debugText.setDepth(1000);

        // Setup debug info updates
        const updateDebugInfo = () => {
            if (this.ship && this.ship.body && this.debugText) {
                const velocity = this.ship.body.velocity;
                const speed = velocity ? Math.sqrt(velocity.x ** 2 + velocity.y ** 2) : 0;
                
                this.debugText.setText(
                    `Ship Scale: ${this.ship.scale}\n` +
                    `Width: ${this.ship.displayWidth.toFixed(1)}px\n` +
                    `Height: ${this.ship.displayHeight.toFixed(1)}px\n` +
                    `Speed: ${speed.toFixed(1)} px/s`
                );
            }
        };
        
        updateDebugInfo();
        this.time.addEvent({
            delay: 100,
            callback: updateDebugInfo,
            loop: true
        });
    }

    private async moveLayer(direction: 'up' | 'down'): Promise<void> {
        if (this.layerManager.isTransitioning()) return;

        const currentLayer = this.layerManager.getCurrentLayer();
        const targetLayer = direction === 'up' ? 1 : 0;

        if (currentLayer === targetLayer) return;

        // Toggle star field visibility with a dramatic fade
        const fadeOutField = direction === 'up' ? this.starField : this.denseStarField;
        const fadeInField = direction === 'up' ? this.denseStarField : this.starField;
        
        if (fadeOutField && fadeInField) {
            // Flash effect on the ship
            this.tweens.add({
                targets: this.ship,
                alpha: 0.3,
                yoyo: true,
                duration: 200,
                ease: 'Cubic.easeInOut'
            });

            // Camera shake effect
            this.cameras.main.shake(300, 0.003);

            // Dramatic zoom effect
            this.tweens.add({
                targets: this.cameras.main,
                zoom: direction === 'up' ? 1.1 : 0.9,
                duration: 400,
                yoyo: true,
                ease: 'Quad.easeInOut'
            });

            // Fade transition between star fields with different timing
            this.tweens.add({
                targets: fadeOutField,
                alpha: 0,
                duration: 600,
                ease: 'Power2'
            });

            this.tweens.add({
                targets: fadeInField,
                alpha: 1,
                duration: 600,
                ease: 'Power2'
            });

            // Update layer text with color
            this.layerText.setText(`Layer: ${direction === 'up' ? 'Dense' : 'Base'}`);
            this.layerText.setColor(direction === 'up' ? '#ff9966' : '#ffffff');
            
            // Move game objects to new layer
            await this.layerManager.moveToLayer(targetLayer);

            // Update physics for the new layer
            this.updateLayerPhysics(targetLayer);
        }
    }

    private updateLayerPhysics(layer: number): void {
        // More dramatic physics changes between layers
        const physics = layer === 0 ? {
            // Base layer - normal physics
            drag: 0.99,
            maxVelocity: 300,
            acceleration: 200
        } : {
            // Dense layer - much more resistance
            drag: 0.95,           // More drag
            maxVelocity: 200,     // Lower max speed
            acceleration: 150      // Lower acceleration
        };

        // Apply physics settings
        this.ship.setDrag(physics.drag);
        this.ship.setMaxVelocity(physics.maxVelocity);
        this.config.acceleration = physics.acceleration;
    }

    update(): void {
        if (!this.ship || !this.ship.body) return;

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
                    acceleration * 60,
                    body.acceleration
                );
            } else {
                body.setAcceleration(0, 0);
            }
        } else {
            body.setAcceleration(0, 0);
        }

        // Handle braking and reverse
        if (this.cursors.down.isDown) {
            const currentSpeed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
            
            if (currentSpeed > 0) {
                body.setVelocity(
                    body.velocity.x * (1 - this.config.brakeForce),
                    body.velocity.y * (1 - this.config.brakeForce)
                );
            } else {
                const reverseAcceleration = this.config.reverseAcceleration * deltaTime;
                if (currentSpeed > -this.config.maxReverseSpeed) {
                    this.physics.velocityFromRotation(
                        this.ship.rotation - Math.PI/2,
                        -reverseAcceleration * 60,
                        body.acceleration
                    );
                } else {
                    body.setAcceleration(0, 0);
                }
            }
        }

        // Update debug text
        const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        this.debugText.setText([
            `Speed: ${Math.round(speed)} px/s`,
            `Max Speed: ${this.config.maxSpeed} px/s`,
            `Acceleration: ${this.config.acceleration} units/s²`,
            `Control: ${this.mouseControl ? 'Mouse' : 'Keyboard'}`,
            `Position: (${Math.round(this.ship.x)}, ${Math.round(this.ship.y)})`,
            `Zoom: ${this.cameraController.getZoom().toFixed(2)}x`
        ].join('\n'));

        // Update layer transition particles if they exist
        if (this.layerManager?.isTransitioning() && this.layerTransitionParticles && this.ship) {
            this.layerTransitionParticles.setPosition(this.ship.x, this.ship.y);
        }

        // Update weapon system
        this.weaponSystem.update(this.game.loop.delta);

        // Update planet system
        this.planetManager.update();
    }

    shutdown(): void {
        // Clean up camera controller
        this.cameraController.destroy();
        // Clean up star field
        this.starField.destroy();
        if (this.meteoriteBelt) {
            this.meteoriteBelt.destroy();
        }
    }
} 