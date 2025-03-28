import { Scene, Cameras, GameObjects } from 'phaser';

interface CameraConfig {
    // Zoom Settings
    minZoom: number;
    maxZoom: number;
    defaultZoom: number;
    zoomSpeed: number;

    // Follow Settings
    lerpX: number;
    lerpY: number;
    offsetX: number;
    offsetY: number;

    // Deadzone
    deadzoneWidth: number;
    deadzoneHeight: number;
}

export class CameraController {
    private scene: Scene;
    private camera: Cameras.Scene2D.Camera;
    private target: GameObjects.Sprite;
    private config: CameraConfig;
    private minZoom: number = 0.5;
    private maxZoom: number = 2.0;
    private zoomSpeed: number = 0.001;

    constructor(scene: Scene, target: GameObjects.Sprite) {
        this.scene = scene;
        this.target = target;
        this.camera = scene.cameras.main;
        
        // Default configuration
        this.config = {
            minZoom: 0.5,
            maxZoom: 2.0,
            defaultZoom: 1.0,
            zoomSpeed: 0.001,
            lerpX: 0.09,
            lerpY: 0.09,
            offsetX: 0,
            offsetY: 0,
            deadzoneWidth: Math.floor(this.camera.width * 0.3),
            deadzoneHeight: Math.floor(this.camera.height * 0.3)
        };

        this.setupCamera();
        this.setupZoom();
        this.setupEvents();
    }

    private setupCamera(): void {
        // Set initial zoom
        this.camera.setZoom(this.config.defaultZoom);

        // Setup camera to follow target with deadzone
        this.camera.startFollow(
            this.target,
            true, // Round pixels
            this.config.lerpX,
            this.config.lerpY,
            this.config.offsetX,
            this.config.offsetY
        );

        // Set deadzone
        this.camera.setDeadzone(
            this.config.deadzoneWidth,
            this.config.deadzoneHeight
        );

        // Enable culling for performance
        this.camera.setBackgroundColor(0x000000);
        this.camera.setRoundPixels(true);
    }

    private setupZoom(): void {
        // Add mouse wheel zoom functionality
        this.scene.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
            const zoomDelta = deltaY * this.zoomSpeed * 0.001;
            const newZoom = this.camera.zoom - zoomDelta;
            
            // Clamp zoom level
            this.camera.setZoom(
                Math.max(
                    this.minZoom,
                    Math.min(this.maxZoom, newZoom)
                )
            );
        });
    }

    private setupEvents(): void {
        // Handle window resize
        this.scene.scale.on('resize', this.handleResize, this);
    }

    private handleResize(gameSize: any): void {
        // Update deadzone based on new size
        this.config.deadzoneWidth = Math.floor(gameSize.width * 0.3);
        this.config.deadzoneHeight = Math.floor(gameSize.height * 0.3);
        this.camera.setDeadzone(this.config.deadzoneWidth, this.config.deadzoneHeight);
    }

    // Public methods for external control
    public setConfig(config: Partial<CameraConfig>): void {
        this.config = { ...this.config, ...config };
        this.setupCamera();
    }

    public getZoom(): number {
        return this.camera.zoom;
    }

    public setZoom(zoom: number): void {
        const clampedZoom = Math.max(
            this.minZoom,
            Math.min(this.maxZoom, zoom)
        );
        this.camera.setZoom(clampedZoom);
    }

    public handleMouseWheel(deltaY: number): void {
        const newZoom = this.camera.zoom - (deltaY * this.zoomSpeed);
        this.camera.setZoom(
            Math.max(
                this.minZoom,
                Math.min(this.maxZoom, newZoom)
            )
        );
    }

    // Cleanup
    public destroy(): void {
        this.scene.scale.off('resize', this.handleResize, this);
        this.scene.input.off('wheel');
        this.camera.stopFollow();
    }
} 