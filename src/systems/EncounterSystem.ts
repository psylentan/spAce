import { Scene } from 'phaser';

export enum EncounterType {
    DERELICT = 'DERELICT',
    PIRATE = 'PIRATE',
    TRADING = 'TRADING'
}

export interface BaseEncounter {
    id: string;
    type: EncounterType;
    title: string;
    description: string;
    isSkippable: boolean;
    skipCost?: Resource[];
    conditions: Condition[];
    timeLimit?: number;
    difficulty: number;
}

export interface Resource {
    type: string;
    amount: number;
}

export interface Condition {
    type: string;
    value: any;
    comparison: 'EQUALS' | 'GREATER' | 'LESS' | 'HAS';
}

export interface EncounterResult {
    success: boolean;
    rewards?: Resource[];
    consequences?: Consequence[];
}

export interface Consequence {
    type: string;
    value: any;
}

export class EncounterSystem {
    private scene: Scene;
    private activeEncounter: BaseEncounter | null = null;
    private encounters: Map<string, BaseEncounter> = new Map();
    private eventEmitter: Phaser.Events.EventEmitter;

    constructor(scene: Scene) {
        this.scene = scene;
        this.eventEmitter = scene.game.events;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Listen for encounter triggers
        this.eventEmitter.on('encounterStart', this.startEncounter, this);
        this.eventEmitter.on('encounterEnd', this.endEncounter, this);
        this.eventEmitter.on('encounterSkip', this.skipEncounter, this);
    }

    public registerEncounter(encounter: BaseEncounter): void {
        this.encounters.set(encounter.id, encounter);
    }

    public triggerRandomEncounter(): void {
        const availableEncounters = Array.from(this.encounters.values());
        if (availableEncounters.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableEncounters.length);
        const selectedEncounter = availableEncounters[randomIndex];
        
        this.eventEmitter.emit('encounterStart', selectedEncounter);
    }

    private startEncounter(encounter: BaseEncounter): void {
        this.activeEncounter = encounter;
        // Pause game systems
        this.scene.game.events.emit('pauseGame');
        // Show encounter UI
        this.scene.game.events.emit('showEncounterUI', encounter);
    }

    private endEncounter(result: EncounterResult): void {
        if (!this.activeEncounter) return;

        // Process results
        if (result.success) {
            this.processRewards(result.rewards);
        } else {
            this.processConsequences(result.consequences);
        }

        this.activeEncounter = null;
        // Resume game systems
        this.scene.game.events.emit('resumeGame');
        // Hide encounter UI
        this.scene.game.events.emit('hideEncounterUI');
    }

    private skipEncounter(): void {
        this.activeEncounter = null;
        // Resume game systems
        this.scene.game.events.emit('resumeGame');
        // Hide encounter UI
        this.scene.game.events.emit('hideEncounterUI');
    }

    private processRewards(rewards?: Resource[]): void {
        if (!rewards) return;
        // Implement reward processing
        this.scene.game.events.emit('addResources', rewards);
    }

    private processConsequences(consequences?: Consequence[]): void {
        if (!consequences) return;
        // Implement consequence processing
        this.scene.game.events.emit('applyConsequences', consequences);
    }

    public getActiveEncounter(): BaseEncounter | null {
        return this.activeEncounter;
    }

    public destroy(): void {
        this.eventEmitter.removeAllListeners();
    }
} 