import { Scene, GameObjects } from 'phaser';
import { EntityGenerator } from '../../utils/generators';

export interface ControlPanelConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    padding?: number;
    background?: {
        color: number;
        alpha: number;
    };
}

interface EntityButton {
    button: GameObjects.Rectangle;
    text: GameObjects.Text;
    type: string;
}

export class ControlPanel {
    private scene: Scene;
    private container: GameObjects.Container;
    private background: GameObjects.Rectangle;
    private config: ControlPanelConfig;
    private entityGenerator: EntityGenerator;
    private buttons: EntityButton[] = [];
    private isVisible: boolean = true;

    constructor(scene: Scene, config: ControlPanelConfig, entityGenerator: EntityGenerator) {
        this.scene = scene;
        this.entityGenerator = entityGenerator;
        this.config = {
            padding: 10,
            background: {
                color: 0x000000,
                alpha: 0.7
            },
            ...config
        };

        // Initialize container and background
        this.container = this.scene.add.container(this.config.x, this.config.y);
        this.background = this.scene.add.rectangle(
            0,
            0,
            this.config.width,
            this.config.height,
            this.config.background!.color,
            this.config.background!.alpha
        );
        this.container.add(this.background);

        this.initialize();
    }

    private initialize(): void {
        this.createEntityButtons();
        this.createControlButtons();
    }

    private createEntityButtons(): void {
        const entities = [
            { type: 'ship', label: 'Spawn Ship' },
            { type: 'weapon', label: 'Spawn Weapon' },
            { type: 'powerup', label: 'Spawn PowerUp' },
            { type: 'mine', label: 'Spawn Mine' },
            { type: 'debris', label: 'Spawn Debris' },
            { type: 'effect', label: 'Add Effect' }
        ];

        entities.forEach((entity, index) => {
            const y = this.config.padding! + (index * 40);
            this.createButton(entity.type, entity.label, 10, y);
        });
    }

    private createControlButtons(): void {
        const controls = [
            { type: 'clear', label: 'Clear All' },
            { type: 'reset', label: 'Reset Scene' },
            { type: 'test', label: 'Run Tests' }
        ];

        const startY = this.config.height - (controls.length * 40) - this.config.padding!;
        controls.forEach((control, index) => {
            const y = startY + (index * 40);
            this.createButton(control.type, control.label, 10, y);
        });
    }

    private createButton(type: string, label: string, x: number, y: number): void {
        const buttonWidth = this.config.width - (this.config.padding! * 2);
        const buttonHeight = 30;

        const button = this.scene.add.rectangle(x, y, buttonWidth, buttonHeight, 0x444444);
        button.setOrigin(0, 0);
        button.setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setFillStyle(0x666666))
            .on('pointerout', () => button.setFillStyle(0x444444))
            .on('pointerdown', () => this.handleButtonClick(type));

        const text = this.scene.add.text(
            x + buttonWidth / 2,
            y + buttonHeight / 2,
            label,
            {
                fontSize: '16px',
                color: '#ffffff'
            }
        );
        text.setOrigin(0.5, 0.5);

        this.container.add([button, text]);
        this.buttons.push({ button, text, type });
    }

    public handleButtonClick(type: string): void {
        switch (type) {
            case 'ship':
                this.spawnShip();
                break;
            case 'weapon':
                this.spawnWeapon();
                break;
            case 'powerup':
                this.spawnPowerUp();
                break;
            case 'mine':
                this.spawnMine();
                break;
            case 'debris':
                this.spawnDebris();
                break;
            case 'effect':
                this.addEffect();
                break;
            case 'clear':
                this.clearAll();
                break;
            case 'reset':
                this.resetScene();
                break;
            case 'test':
                this.runTests();
                break;
        }
    }

    private spawnShip(): void {
        const ship = this.entityGenerator.generateShip({
            type: 'player',
            name: 'Test Ship',
            stats: {
                health: 100,
                shield: 50,
                speed: 300,
                rotationSpeed: 150
            },
            weapon: {
                name: 'Basic Laser',
                damage: 20,
                cooldown: 200,
                projectileSpeed: 500
            }
        });

        ship.setPosition(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY
        );
    }

    private spawnWeapon(): void {
        const weapon = this.entityGenerator.generateWeapon({
            name: 'Test Weapon',
            damage: 25,
            cooldown: 300,
            projectileSpeed: 400
        });
    }

    private spawnPowerUp(): void {
        const powerUp = this.entityGenerator.generatePowerUp({
            type: 'speed',
            value: 1.5,
            duration: 5000,
            visualEffect: 'blue_glow'
        });

        powerUp.setPosition(
            this.scene.cameras.main.centerX + 100,
            this.scene.cameras.main.centerY
        );
    }

    private spawnMine(): void {
        const mine = this.entityGenerator.generateMine({
            damage: 75,
            triggerRadius: 100,
            explosionDelay: 500,
            explosionRadius: 150
        });

        mine.setPosition(
            this.scene.cameras.main.centerX - 100,
            this.scene.cameras.main.centerY
        );
    }

    private spawnDebris(): void {
        const debris = this.entityGenerator.generateDebris({
            size: 'medium',
            health: 50,
            resourceValue: 25,
            damageOnCollision: 15
        });

        debris.setPosition(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100
        );
    }

    private addEffect(): void {
        const effect = this.entityGenerator.generateEffect({
            type: 'slow',
            value: 0.7,
            duration: 3000,
            stackable: true,
            maxStacks: 2
        });
    }

    private clearAll(): void {
        // Implementation will be added when we have entity tracking
    }

    private resetScene(): void {
        this.scene.scene.restart();
    }

    private runTests(): void {
        // Implementation will be added when we have test system
    }

    public toggle(): void {
        this.isVisible = !this.isVisible;
        this.container.setVisible(this.isVisible);
    }

    public setPosition(x: number, y: number): void {
        this.container.setPosition(x, y);
    }

    public getContainer(): GameObjects.Container {
        return this.container;
    }
} 