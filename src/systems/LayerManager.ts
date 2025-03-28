import { Scene, GameObjects, Tweens } from 'phaser';

export interface LayerConfig {
    totalLayers: number;
    transitionDuration: number;
    depthSpacing: number;
    scaleRange: {
        min: number;
        max: number;
    };
    alphaRange: {
        min: number;
        max: number;
    };
    layerEffects?: {
        tint?: number;
        blur?: number;
        particleCount?: number;
    }[];
}

const DEFAULT_CONFIG: LayerConfig = {
    totalLayers: 5,
    transitionDuration: 750,
    depthSpacing: 1000,
    scaleRange: {
        min: 0.5,
        max: 1.5
    },
    alphaRange: {
        min: 0.3,
        max: 1.0
    }
};

export class LayerManager {
    private scene: Scene;
    private config: LayerConfig;
    private currentLayer: number;
    private transitioning: boolean;
    private layerObjects: Map<number, GameObjects.GameObject[]>;
    private transitionTween?: Tweens.Tween;

    constructor(scene: Scene, config: Partial<LayerConfig> = {}) {
        this.scene = scene;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.currentLayer = Math.floor(this.config.totalLayers / 2); // Start in middle layer
        this.transitioning = false;
        this.layerObjects = new Map();

        // Initialize layer object arrays
        for (let i = 0; i < this.config.totalLayers; i++) {
            this.layerObjects.set(i, []);
        }

        // Listen for scene shutdown
        this.scene.events.on('shutdown', this.destroy, this);
    }

    public getCurrentLayer(): number {
        return this.currentLayer;
    }

    public isTransitioning(): boolean {
        return this.transitioning;
    }

    public addToLayer(gameObject: GameObjects.GameObject, layer: number): void {
        if (layer < 0 || layer >= this.config.totalLayers) {
            console.warn(`Layer ${layer} is out of bounds`);
            return;
        }

        const layerObjects = this.layerObjects.get(layer);
        if (layerObjects) {
            layerObjects.push(gameObject);
            this.updateObjectProperties(gameObject, layer);
        }
    }

    public removeFromLayer(gameObject: GameObjects.GameObject, layer: number): void {
        const layerObjects = this.layerObjects.get(layer);
        if (layerObjects) {
            const index = layerObjects.indexOf(gameObject);
            if (index !== -1) {
                layerObjects.splice(index, 1);
            }
        }
    }

    public async moveToLayer(targetLayer: number): Promise<boolean> {
        if (this.transitioning || targetLayer === this.currentLayer) {
            return false;
        }

        if (targetLayer < 0 || targetLayer >= this.config.totalLayers) {
            console.warn(`Target layer ${targetLayer} is out of bounds`);
            return false;
        }

        this.transitioning = true;
        const direction = targetLayer > this.currentLayer ? 1 : -1;
        const oldLayer = this.currentLayer;
        this.currentLayer = targetLayer;

        // Stop any existing transition
        if (this.transitionTween) {
            this.transitionTween.stop();
        }

        // Create transition data for interpolation
        const transitionData = { progress: 0 };
        
        return new Promise((resolve) => {
            this.transitionTween = this.scene.tweens.add({
                targets: transitionData,
                progress: 1,
                duration: this.config.transitionDuration,
                ease: 'Cubic.easeInOut',
                onUpdate: () => {
                    // Update all layers during transition
                    for (let i = 0; i < this.config.totalLayers; i++) {
                        const layerObjects = this.layerObjects.get(i);
                        if (layerObjects) {
                            layerObjects.forEach(obj => {
                                this.updateObjectProperties(obj, i, transitionData.progress);
                            });
                        }
                    }
                },
                onComplete: () => {
                    this.transitioning = false;
                    // Apply any layer-specific effects
                    if (this.config.layerEffects?.[targetLayer]) {
                        this.applyLayerEffects(targetLayer);
                    }
                    resolve(true);
                }
            });
        });
    }

    private updateObjectProperties(
        gameObject: Phaser.GameObjects.GameObject,
        layer: number,
        transitionProgress: number = 1
    ): void {
        const layerDiff = layer - this.currentLayer;
        const baseDepth = layer * this.config.depthSpacing;

        // Calculate scale based on layer distance
        const scaleFactor = this.calculateScaleFactor(layerDiff);
        const targetScale = this.config.scaleRange.min + 
            (this.config.scaleRange.max - this.config.scaleRange.min) * scaleFactor;

        // Calculate alpha based on layer distance
        const alphaFactor = this.calculateAlphaFactor(layerDiff);
        const targetAlpha = this.config.alphaRange.min + 
            (this.config.alphaRange.max - this.config.alphaRange.min) * alphaFactor;

        // Apply properties with transition interpolation
        if ('setScale' in gameObject) {
            (gameObject as Phaser.GameObjects.Sprite).setScale(targetScale);
        }
        if ('setAlpha' in gameObject) {
            (gameObject as Phaser.GameObjects.Sprite).setAlpha(targetAlpha);
        }
        if ('setDepth' in gameObject) {
            (gameObject as Phaser.GameObjects.Sprite).setDepth(baseDepth);
        }
    }

    private calculateScaleFactor(layerDiff: number): number {
        // Objects in current layer are at max scale, decreasing with distance
        return Math.max(0, 1 - Math.abs(layerDiff) * 0.25);
    }

    private calculateAlphaFactor(layerDiff: number): number {
        // Objects in current layer are fully visible, fading with distance
        return Math.max(0, 1 - Math.abs(layerDiff) * 0.3);
    }

    private applyLayerEffects(layer: number): void {
        const effects = this.config.layerEffects?.[layer];
        if (!effects) return;

        const layerObjects = this.layerObjects.get(layer);
        if (!layerObjects) return;

        layerObjects.forEach(obj => {
            if (effects.tint && 'setTint' in obj) {
                (obj as GameObjects.Sprite).setTint(effects.tint);
            }
            // Add more effect applications as needed
        });
    }

    public destroy(): void {
        if (this.transitionTween) {
            this.transitionTween.stop();
        }
        this.scene.events.off('shutdown', this.destroy, this);
        this.layerObjects.clear();
    }
} 