import { Scene, GameObjects } from 'phaser';

export interface DebugPanelConfig {
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

interface ExtendedPerformance extends Performance {
    memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    };
}

export class DebugPanel {
    private scene: Scene;
    private container: GameObjects.Container;
    private background: GameObjects.Rectangle;
    private config: DebugPanelConfig;
    private metrics: Map<string, GameObjects.Text> = new Map();
    private isVisible: boolean = true;

    constructor(scene: Scene, config: DebugPanelConfig) {
        this.scene = scene;
        this.config = {
            padding: 10,
            background: {
                color: 0x000000,
                alpha: 0.7
            },
            ...config
        };

        // Initialize container and background in constructor
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
        // Add default metrics
        this.addMetric('fps', 'FPS: 0', 10, 20);
        this.addMetric('entities', 'Entities: 0', 10, 40);
        this.addMetric('memory', 'Memory: 0 MB', 10, 60);
    }

    public addMetric(key: string, initialValue: string, x: number, y: number): void {
        const text = this.scene.add.text(x, y, initialValue, {
            fontSize: '16px',
            color: '#ffffff'
        });
        this.metrics.set(key, text);
        this.container.add(text);
    }

    public updateMetric(key: string, value: string): void {
        const metric = this.metrics.get(key);
        if (metric) {
            metric.setText(value);
        }
    }

    public toggle(): void {
        this.isVisible = !this.isVisible;
        this.container.setVisible(this.isVisible);
    }

    public update(): void {
        // Update FPS
        this.updateMetric('fps', `FPS: ${Math.round(this.scene.game.loop.actualFps)}`);

        // Update memory usage if available
        const performance = window.performance as ExtendedPerformance;
        if (performance.memory) {
            const memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            this.updateMetric('memory', `Memory: ${memory} MB`);
        }
    }

    public setPosition(x: number, y: number): void {
        this.container.setPosition(x, y);
    }

    public getContainer(): GameObjects.Container {
        return this.container;
    }
} 