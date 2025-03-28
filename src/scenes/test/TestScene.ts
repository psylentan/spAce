import { Scene, GameObjects, Physics } from 'phaser';
import { EntityGenerator } from '../../utils/generators';
import { DebugPanel } from '../../ui/debug/DebugPanel';
import { ControlPanel } from '../../ui/debug/ControlPanel';
import { PlaceholderAssets } from '../../utils/placeholderAssets';

interface SelectableGameObject extends GameObjects.GameObject {
    setTint(color: number): this;
    x: number;
    y: number;
    rotation: number;
    body: Physics.Arcade.Body;
}

export class TestScene extends Scene {
    private entityGenerator!: EntityGenerator;
    private debugPanel!: DebugPanel;
    private controlPanel!: ControlPanel;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private selectedEntity: SelectableGameObject | null = null;
    private debugGraphic!: GameObjects.Graphics;

    constructor() {
        super({ key: 'TestScene' });
    }

    preload(): void {
        // Load the actual player ship asset
        this.load.image('ship_player', 'assets/sprites/starship200.png');
        
        // Generate other placeholder assets
        const placeholderAssets = new PlaceholderAssets(this);
        placeholderAssets.generatePlaceholders();
    }

    create(): void {
        // Initialize properties
        this.entityGenerator = new EntityGenerator(this);
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.debugGraphic = this.add.graphics();

        // Set up background
        this.createBackground();

        // Initialize UI components with correct positions
        this.debugPanel = new DebugPanel(this, {
            x: this.cameras.main.width - 210,
            y: 10,
            width: 200,
            height: 300
        });

        this.controlPanel = new ControlPanel(this, {
            x: 10,
            y: 10,
            width: 200,
            height: this.cameras.main.height - 20
        }, this.entityGenerator);

        // Set up input
        this.setupInput();

        // Enable physics debug
        this.physics.world.createDebugGraphic();
        this.debugGraphic.setVisible(false);

        // Add instructions text
        this.add.text(10, this.cameras.main.height - 100, [
            'Controls:',
            'F1: Toggle Debug Panel',
            'F2: Toggle Physics Debug',
            'ESC: Toggle Control Panel',
            'Click: Select Entity',
            'Arrow Keys/WASD: Move Selected Entity',
            'Q/E: Rotate Selected Entity',
            'Delete: Remove Selected Entity'
        ].join('\n'), {
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 10 }
        });
    }

    private createBackground(): void {
        // Create a starfield background
        const particles = this.add.particles(0, 0, 'debris_small', {
            x: { min: 0, max: this.cameras.main.width },
            y: -10,
            angle: 90,
            speed: { min: 50, max: 100 },
            gravityY: 0,
            scale: { start: 0.1, end: 0.1 },
            lifespan: 10000,
            quantity: 1,
            frequency: 500
        });
    }

    private setupInput(): void {
        // Set up cursor keys
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Set up entity selection
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const bodies = this.physics.overlapRect(worldPoint.x, worldPoint.y, 1, 1) as Physics.Arcade.Body[];
            
            if (bodies.length > 0 && bodies[0].gameObject) {
                this.selectEntity(bodies[0].gameObject as SelectableGameObject);
            } else {
                this.selectEntity(null);
            }
        });

        const keyboard = this.input.keyboard!;

        // Set up keyboard shortcuts for entity spawning
        keyboard.on('keydown-ONE', () => {
            this.controlPanel.handleButtonClick('ship');
        });
        keyboard.on('keydown-TWO', () => {
            this.controlPanel.handleButtonClick('weapon');
        });
        keyboard.on('keydown-THREE', () => {
            this.controlPanel.handleButtonClick('powerup');
        });
        keyboard.on('keydown-FOUR', () => {
            this.controlPanel.handleButtonClick('mine');
        });
        keyboard.on('keydown-FIVE', () => {
            this.controlPanel.handleButtonClick('debris');
        });
        keyboard.on('keydown-SIX', () => {
            this.controlPanel.handleButtonClick('effect');
        });

        // Add keyboard shortcuts
        keyboard.on('keydown-F1', () => {
            this.debugPanel.toggle();
        });

        keyboard.on('keydown-F2', () => {
            this.debugGraphic.setVisible(!this.debugGraphic.visible);
        });

        keyboard.on('keydown-ESC', () => {
            this.controlPanel.toggle();
        });

        // Set up delete key for selected entity
        keyboard.on('keydown-DELETE', () => {
            if (this.selectedEntity) {
                this.selectedEntity.destroy();
                this.selectEntity(null);
            }
        });
    }

    private selectEntity(entity: SelectableGameObject | null): void {
        // Deselect previous entity
        if (this.selectedEntity) {
            this.selectedEntity.setTint(0xffffff);
        }

        this.selectedEntity = entity;

        // Highlight selected entity
        if (this.selectedEntity) {
            this.selectedEntity.setTint(0x00ff00);
        }
    }

    update(): void {
        // Update debug panel
        this.debugPanel.update();

        // Update selected entity movement
        if (this.selectedEntity && this.cursors) {
            const speed = 5;
            const rotationSpeed = 0.05;

            if (this.cursors.left.isDown) {
                this.selectedEntity.x -= speed;
            }
            if (this.cursors.right.isDown) {
                this.selectedEntity.x += speed;
            }
            if (this.cursors.up.isDown) {
                this.selectedEntity.y -= speed;
            }
            if (this.cursors.down.isDown) {
                this.selectedEntity.y += speed;
            }

            const keyboard = this.input.keyboard!;
            if (keyboard.addKey('Q').isDown) {
                this.selectedEntity.rotation -= rotationSpeed;
            }
            if (keyboard.addKey('E').isDown) {
                this.selectedEntity.rotation += rotationSpeed;
            }
        }
    }
} 