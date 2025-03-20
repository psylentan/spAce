import 'phaser';
import { Player } from '../components/Player';
import { EncounterSystem, EncounterType, BaseEncounter } from '../systems/EncounterSystem';
import { EncounterUI } from '../systems/EncounterUI';
import { AssetGeneratorMCP } from '../utils/asset-generator-mcp';
import SoundManager from '../systems/SoundManager';

// Default configuration
const DEFAULT_ASSET_SERVER_URL = 'http://localhost:3001';

export class GameScene extends Phaser.Scene {
    private player!: Player;
    private encounterSystem!: EncounterSystem;
    private backgrounds: Phaser.GameObjects.TileSprite[] = [];
    private scrollSpeed: number = 2;
    private distanceText!: Phaser.GameObjects.Text;
    private debugGraphics!: Phaser.GameObjects.Graphics;
    private encounterWarning!: Phaser.GameObjects.Container;
    private encounterUI!: EncounterUI;
    private distanceTraveled: number = 0;
    private background!: Phaser.GameObjects.TileSprite;
    private assetGenerator: AssetGeneratorMCP;
    private speedText!: Phaser.GameObjects.Text;
    private soundManager: SoundManager;
    private audioInitialized: boolean = false;
    private instructionText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });
        this.assetGenerator = new AssetGeneratorMCP({
            assetServerUrl: DEFAULT_ASSET_SERVER_URL
        });
        this.soundManager = SoundManager.getInstance();
    }

    private async createQuasarTexture(): Promise<void> {
        // Create distant star/quasar texture
        const quasarGraphics = this.add.graphics();
        const textureSize = 256;
        const centerX = textureSize / 2;
        const centerY = textureSize / 2;
        
        // Dark background
        quasarGraphics.fillStyle(0x000000, 0.8);
        quasarGraphics.fillRect(0, 0, textureSize, textureSize);
        
        // Create a glowing quasar effect with multiple layers
        const layers = [
            { radius: 64, color: 0xffffff, alpha: 1.0 },   // Core
            { radius: 80, color: 0x4444ff, alpha: 0.8 },   // Inner glow
            { radius: 96, color: 0x000066, alpha: 0.5 },   // Outer glow
            { radius: 128, color: 0x000000, alpha: 0.0 }   // Edge fade
        ];

        // Draw from outside in for better blending
        for (let i = layers.length - 1; i >= 0; i--) {
            const layer = layers[i];
            quasarGraphics.fillStyle(layer.color, layer.alpha);
            quasarGraphics.fillCircle(centerX, centerY, layer.radius);
        }

        // Add some distant stars
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, textureSize);
            const y = Phaser.Math.Between(0, textureSize);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.3, 0.8);
            quasarGraphics.fillStyle(0xffffff, alpha);
            quasarGraphics.fillCircle(x, y, size);
        }

        // Generate the texture and clean up
        quasarGraphics.generateTexture('quasar', textureSize, textureSize);
        quasarGraphics.destroy();
    }

    private async createStarfieldTexture(): Promise<void> {
        // Create starfield texture
        const starGraphics = this.add.graphics();
        const textureSize = 128;
        
        // Clear background
        starGraphics.fillStyle(0x000000, 0);
        starGraphics.fillRect(0, 0, textureSize, textureSize);
        
        // Add stars with different sizes and brightnesses
        for (let i = 0; i < 16; i++) {
            const x = Phaser.Math.Between(0, textureSize);
            const y = Phaser.Math.Between(0, textureSize);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.3, 1);
            
            starGraphics.fillStyle(0xffffff, alpha);
            starGraphics.fillCircle(x, y, size);
        }

        // Generate the texture and clean up
        starGraphics.generateTexture('starfield', textureSize, textureSize);
        starGraphics.destroy();
    }

    private async createThrusterTexture(): Promise<void> {
        const thrusterGraphics = this.add.graphics();
        const textureSize = 24;
        const gradientSteps = 15; // More steps for smoother gradient
        
        for (let i = 0; i < gradientSteps; i++) {
            const alpha = 1 - (i / gradientSteps);
            thrusterGraphics.fillStyle(0x00ffff, alpha);
            thrusterGraphics.fillCircle(textureSize/2, textureSize/2, textureSize/2 - (i * textureSize/2 / gradientSteps));
        }
        
        thrusterGraphics.generateTexture('thruster', textureSize, textureSize);
        thrusterGraphics.destroy();
    }

    public async preload(): Promise<void> {
        // Load assets
        this.load.image('player_ship', 'assets/sprites/player_ship.png');
        
        // Load the background image
        this.load.image('background', '/s1-bg.jpg');
        
        // Create textures
        await this.createStarfieldTexture();
        await this.createThrusterTexture();
        await this.createQuasarTexture();
    }

    create(): void {
        // Set the game canvas size to match the window
        const { width, height } = this.scale;
        this.scale.resize(width, height);

        // Create fake sounds (silent) since we don't have the audio files yet
        const dummySound = {
            play: () => {},
            stop: () => {},
            isPlaying: false,
            volume: 0,
            loop: false
        };

        // Add dummy sounds to the scene's sound manager
        this.sound.add = (key: string) => dummySound as any;

        // Initialize speed text
        this.speedText = this.add.text(10, 40, 'Speed: 0%', {
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.speedText.setScrollFactor(0);
        this.speedText.setDepth(20);

        // Create background layers
        
        // Main background (no repeat)
        const mainBg = this.add.image(0, 0, 'background');
        mainBg.setOrigin(0, 0);
        mainBg.setScrollFactor(0);
        mainBg.setDepth(0);
        
        // Scale to cover the entire screen while maintaining aspect ratio
        const scaleX = this.cameras.main.width / mainBg.width;
        const scaleY = this.cameras.main.height / mainBg.height;
        const scale = Math.max(scaleX, scaleY);
        mainBg.setScale(scale);
        
        // Center the background if it's larger than the screen
        mainBg.x = (this.cameras.main.width - mainBg.displayWidth) / 2;
        mainBg.y = (this.cameras.main.height - mainBg.displayHeight) / 2;

        // Star layers (faster parallax)
        for (let i = 0; i < 3; i++) {
            const bg = this.add.tileSprite(
                0, 0,
                this.cameras.main.width,
                this.cameras.main.height,
                'starfield'
            );
            bg.setOrigin(0, 0);
            bg.setScrollFactor(0);
            bg.setAlpha(0.3 - (i * 0.05));
            bg.setScale(1 + i * 0.5);
            bg.setDepth(1);
            this.backgrounds.push(bg);
        }

        // Add click/tap handler to initialize audio
        this.addAudioInitializationMessage();

        // Create player in the center of the screen
        this.player = new Player(
            this,
            this.cameras.main.width * 0.2,  // 20% from the left
            this.cameras.main.height * 0.5   // Center vertically
        );

        // Configure camera to follow player
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setFollowOffset(-this.cameras.main.width * 0.3, 0);

        // Initialize debug graphics
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(5);

        // Initialize encounter system
        this.encounterSystem = new EncounterSystem(this);
        this.encounterUI = new EncounterUI(this);

        // Register sample encounters
        this.registerSampleEncounters();

        // Setup encounter event listeners
        this.game.events.on('showEncounterUI', this.handleShowEncounter, this);
        this.game.events.on('hideEncounterUI', this.handleHideEncounter, this);
        this.game.events.on('encounterAction', this.handleEncounterAction, this);
        this.game.events.on('encounterTimeout', this.handleEncounterTimeout, this);
        this.game.events.on('pauseGame', this.handlePauseGame, this);
        this.game.events.on('resumeGame', this.handleResumeGame, this);

        // Add Home key for force encounter
        this.input.keyboard.on('keydown-HOME', () => {
            this.encounterSystem.triggerRandomEncounter();
        });

        // Create distance counter
        this.distanceText = this.add.text(10, 10, '', {
            fontSize: '16px',
            color: '#ffffff'
        });

        // Create encounter warning container
        this.createEncounterWarning();

        // We'll initialize audio after user interaction instead of automatically
        // this.soundManager.playBackgroundMusic({ volume: 0.4 });

        // Add event listeners for player movement
        this.events.on('player-accelerate', () => {
            if (this.audioInitialized) {
                this.soundManager.playEngineStart({ volume: 0.7 });
            }
        });

        this.events.on('player-stop', () => {
            if (this.audioInitialized) {
                this.soundManager.stopEngineLoop();
            }
        });

        // Add pointer down event for entire scene
        this.input.on('pointerdown', this.handlePointerDown, this);
    }

    private addAudioInitializationMessage(): void {
        // Create an instruction text overlay
        this.instructionText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Click or Tap to enable game sounds',
            {
                fontSize: '24px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }
        );
        this.instructionText.setOrigin(0.5);
        this.instructionText.setScrollFactor(0);
        this.instructionText.setDepth(100);
    }

    private handlePointerDown(): void {
        if (!this.audioInitialized) {
            console.log('Initializing audio after user interaction');
            this.soundManager.initAudio();
            
            // Remove the instruction text
            if (this.instructionText) {
                this.instructionText.destroy();
            }
            
            this.audioInitialized = true;
            
            // Start background music now that audio is initialized
            this.soundManager.playBackgroundMusic({ volume: 0.4 });
        }
    }

    private createEncounterWarning(): void {
        this.encounterWarning = this.add.container(this.cameras.main.centerX, 50);
        
        const warningBg = this.add.rectangle(0, 0, 300, 40, 0xff0000, 0.3);
        const warningText = this.add.text(0, 0, 'ENCOUNTER IMMINENT', {
            fontSize: '24px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.encounterWarning.add([warningBg, warningText]);
        this.encounterWarning.setAlpha(0);
        this.encounterWarning.setDepth(100);
    }

    private registerSampleEncounters(): void {
        // Register a derelict ship encounter
        this.encounterSystem.registerEncounter({
            id: 'derelict-1',
            type: EncounterType.DERELICT,
            title: 'Abandoned Vessel',
            description: 'A derelict ship floats silently in space. Its systems appear to be offline, but it might contain valuable resources.',
            isSkippable: true,
            skipCost: [{ type: 'fuel', amount: 10 }],
            conditions: [],
            timeLimit: 60,
            difficulty: 1
        });

        // Register a pirate encounter
        this.encounterSystem.registerEncounter({
            id: 'pirate-1',
            type: EncounterType.PIRATE,
            title: 'Space Pirates!',
            description: 'A group of pirates has appeared! Their weapons are charged, but they seem open to negotiation.',
            isSkippable: true,
            skipCost: [{ type: 'credits', amount: 100 }],
            conditions: [],
            timeLimit: 30,
            difficulty: 2
        });

        // Register a trading encounter
        this.encounterSystem.registerEncounter({
            id: 'trading-1',
            type: EncounterType.TRADING,
            title: 'Trading Station',
            description: 'A well-maintained trading station. They might have supplies and services available.',
            isSkippable: true,
            skipCost: [{ type: 'fuel', amount: 5 }],
            conditions: [],
            difficulty: 1
        });
    }

    private handleShowEncounter(encounter: BaseEncounter): void {
        this.encounterUI.show(encounter);
    }

    private handleHideEncounter(): void {
        this.encounterUI.hide();
    }

    private handleEncounterAction(data: { action: string; encounter: BaseEncounter }): void {
        const { action, encounter } = data;
        
        // Handle different actions based on encounter type
        switch (encounter.type) {
            case EncounterType.DERELICT:
                this.handleDerelictAction(action, encounter);
                break;
            case EncounterType.PIRATE:
                this.handlePirateAction(action, encounter);
                break;
            case EncounterType.TRADING:
                this.handleTradingAction(action, encounter);
                break;
        }
    }

    private handleDerelictAction(action: string, encounter: BaseEncounter): void {
        switch (action) {
            case 'explore':
                // Show exploration UI
                const explorationUI = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
                const explorationBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
                const explorationTitle = this.add.text(0, -150, 'Exploring Derelict Ship', {
                    fontSize: '28px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                const progressBar = this.add.rectangle(-150, 0, 300, 20, 0x666666);
                const progress = this.add.rectangle(-150, 0, 0, 20, 0x00ff00);
                progress.setOrigin(0, 0.5);
                
                explorationUI.add([explorationBg, explorationTitle, progressBar, progress]);
                explorationUI.setDepth(1001); // Above encounter UI
                
                // Simulate exploration progress
                let progressValue = 0;
                const progressTimer = this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        progressValue += 0.05;
                        progress.width = Math.min(progressValue * 300, 300);
                        
                        if (progressValue >= 1) {
                            progressTimer.destroy();
                            explorationUI.destroy();
                            this.encounterUI.hide(); // Hide the encounter UI
                            this.game.events.emit('encounterEnd', {
                                success: true,
                                rewards: [
                                    { type: 'fuel', amount: 20 },
                                    { type: 'scrap', amount: 15 }
                                ]
                            });
                        }
                    },
                    loop: true
                });
                break;

            case 'scan':
                // Show scan UI
                const scanUI = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
                const scanBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
                const scanTitle = this.add.text(0, -150, 'Scanning...', {
                    fontSize: '28px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                const scanLines = Array(5).fill(null).map((_, i) => {
                    return this.add.rectangle(
                        -200,
                        -100 + (i * 40),
                        0,
                        10,
                        0x00ff00
                    );
                });
                
                scanUI.add([scanBg, scanTitle, ...scanLines]);
                scanUI.setDepth(1001);
                
                let scanComplete = 0;
                scanLines.forEach((line, index) => {
                    this.tweens.add({
                        targets: line,
                        width: 400,
                        duration: 1000,
                        delay: index * 200,
                        ease: 'Linear',
                        onComplete: () => {
                            scanComplete++;
                            if (scanComplete === scanLines.length) {
                                this.time.delayedCall(500, () => {
                                    scanUI.destroy();
                                    this.encounterUI.hide(); // Hide the encounter UI
                                    this.game.events.emit('encounterEnd', {
                                        success: true,
                                        rewards: [
                                            { type: 'data', amount: 5 }
                                        ]
                                    });
                                });
                            }
                        }
                    });
                });
                break;

            case 'skip':
                this.encounterUI.hide(); // Hide the encounter UI
                this.game.events.emit('encounterSkip');
                break;
        }
    }

    private handlePirateAction(action: string, encounter: BaseEncounter): void {
        switch (action) {
            case 'fight':
                // Show combat UI
                const combatUI = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
                const combatBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
                const combatTitle = this.add.text(0, -150, 'Combat Engaged', {
                    fontSize: '28px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Add player and enemy ships
                const playerShip = this.add.rectangle(-100, 0, 50, 30, 0x00ff00);
                const enemyShip = this.add.rectangle(100, 0, 50, 30, 0xff0000);
                
                combatUI.add([combatBg, combatTitle, playerShip, enemyShip]);
                combatUI.setDepth(1001);
                
                // Animate combat sequence
                this.tweens.add({
                    targets: playerShip,
                    x: '+50',
                    yoyo: true,
                    duration: 500,
                    repeat: 2,
                    onComplete: () => {
                        // Flash effect
                        this.tweens.add({
                            targets: enemyShip,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => {
                                this.time.delayedCall(500, () => {
                                    combatUI.destroy();
                                    this.encounterUI.hide(); // Hide the encounter UI
                                    this.game.events.emit('encounterEnd', {
                                        success: true,
                                        rewards: [
                                            { type: 'credits', amount: 100 },
                                            { type: 'scrap', amount: 10 }
                                        ]
                                    });
                                });
                            }
                        });
                    }
                });
                break;

            case 'negotiate':
                // Show negotiation UI
                const negotiationUI = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
                const negotiationBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
                const negotiationTitle = this.add.text(0, -150, 'Negotiating...', {
                    fontSize: '28px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                const messages = [
                    "Establishing communication...",
                    "Presenting terms...",
                    "Awaiting response...",
                    "Agreement reached!"
                ];
                
                const messageText = this.add.text(0, 0, '', {
                    fontSize: '20px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                negotiationUI.add([negotiationBg, negotiationTitle, messageText]);
                negotiationUI.setDepth(1001);
                
                // Animate messages
                let messageIndex = 0;
                const showNextMessage = () => {
                    if (messageIndex < messages.length) {
                        messageText.setText(messages[messageIndex]);
                        messageIndex++;
                        this.time.delayedCall(500, showNextMessage);
                    } else {
                        this.time.delayedCall(500, () => {
                            negotiationUI.destroy();
                            this.encounterUI.hide(); // Hide the encounter UI
                            this.game.events.emit('encounterEnd', {
                                success: true,
                                rewards: [
                                    { type: 'credits', amount: 50 }
                                ]
                            });
                        });
                    }
                };
                
                showNextMessage();
                break;

            case 'skip':
                this.encounterUI.hide(); // Hide the encounter UI
                this.game.events.emit('encounterSkip');
                break;
        }
    }

    private handleTradingAction(action: string, encounter: BaseEncounter): void {
        switch (action) {
            case 'trade':
                // Show trading UI
                const tradeUI = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
                const tradeBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
                const tradeTitle = this.add.text(0, -150, 'Trading Station', {
                    fontSize: '28px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                const items = [
                    { name: 'Fuel Cells', price: 50 },
                    { name: 'Shield Battery', price: 75 },
                    { name: 'Repair Kit', price: 100 }
                ];
                
                const itemTexts = items.map((item, index) => {
                    return this.add.text(
                        -200,
                        -50 + (index * 40),
                        `${item.name} - ${item.price} credits`,
                        {
                            fontSize: '20px',
                            color: '#ffffff'
                        }
                    );
                });
                
                tradeUI.add([tradeBg, tradeTitle, ...itemTexts]);
                tradeUI.setDepth(1001);
                
                // Simulate trade completion
                this.time.delayedCall(2000, () => {
                    tradeUI.destroy();
                    this.encounterUI.hide(); // Hide the encounter UI
                    this.game.events.emit('encounterEnd', {
                        success: true,
                        rewards: [
                            { type: 'supplies', amount: 3 }
                        ]
                    });
                });
                break;

            case 'services':
                // Show services UI
                const servicesUI = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
                const servicesBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
                const servicesTitle = this.add.text(0, -150, 'Station Services', {
                    fontSize: '28px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                const services = [
                    { name: 'Ship Repair', cost: 100 },
                    { name: 'Shield Recharge', cost: 50 },
                    { name: 'Weapon Upgrade', cost: 200 }
                ];
                
                const serviceTexts = services.map((service, index) => {
                    return this.add.text(
                        -200,
                        -50 + (index * 40),
                        `${service.name} - ${service.cost} credits`,
                        {
                            fontSize: '20px',
                            color: '#ffffff'
                        }
                    );
                });
                
                servicesUI.add([servicesBg, servicesTitle, ...serviceTexts]);
                servicesUI.setDepth(1001);
                
                // Simulate service completion
                this.time.delayedCall(2000, () => {
                    servicesUI.destroy();
                    this.encounterUI.hide(); // Hide the encounter UI
                    this.game.events.emit('encounterEnd', {
                        success: true,
                        rewards: [
                            { type: 'repair', amount: 1 }
                        ]
                    });
                });
                break;

            case 'skip':
                this.encounterUI.hide(); // Hide the encounter UI
                this.game.events.emit('encounterSkip');
                break;
        }
    }

    private handleEncounterTimeout(): void {
        // Handle timeout by ending encounter with failure
        this.game.events.emit('encounterEnd', { success: false });
    }

    private handlePauseGame(): void {
        // Pause only game systems, not the scene
        this.player.setActive(false);
        this.player.setVisible(false);
    }

    private handleResumeGame(): void {
        // Resume game systems
        this.player.setActive(true);
        this.player.setVisible(true);
    }

    update(time: number, delta: number): void {
        // Update player
        this.player.update(time, delta);

        // Get player movement data
        const playerSpeed = this.player.getCurrentSpeed();
        const verticalSpeed = this.player.getVerticalSpeed();
        const baseScrollSpeed = (playerSpeed / 800) * 8;

        // Update star layers (parallax)
        for (let i = 0; i < this.backgrounds.length; i++) {
            const bg = this.backgrounds[i];
            const layerSpeed = baseScrollSpeed * (i + 1) * 0.3;
            bg.tilePositionX += layerSpeed;

            // Twinkling effect
            const timeFactor = time / 1000;
            const alphaOffset = Math.sin(timeFactor * (i + 1) * 0.5) * 0.05;
            bg.alpha = (0.3 - (i * 0.05)) + alphaOffset;
        }

        // Update speed text with player's speed
        const speedPercentage = Math.round((playerSpeed / 800) * 100);
        this.speedText.setText(`Speed: ${speedPercentage}%`);
    }
} 