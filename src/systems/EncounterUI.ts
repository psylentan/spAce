import { Scene } from 'phaser';
import { BaseEncounter, EncounterType } from './EncounterSystem';

export class EncounterUI {
    private scene: Scene;
    private container: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Rectangle;
    private titleText: Phaser.GameObjects.Text;
    private descriptionText: Phaser.GameObjects.Text;
    private optionsContainer: Phaser.GameObjects.Container;
    private timerText?: Phaser.GameObjects.Text;
    private timerEvent?: Phaser.Time.TimerEvent;

    constructor(scene: Scene) {
        this.scene = scene;
        
        // Create main container
        this.container = scene.add.container(0, 0);
        this.container.setDepth(1000);
        
        // Create semi-transparent background
        this.background = scene.add.rectangle(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY,
            scene.cameras.main.width,
            scene.cameras.main.height,
            0x000000,
            0.7
        );
        
        // Create text elements
        this.titleText = scene.add.text(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY - 150,
            '',
            {
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.descriptionText = scene.add.text(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY - 50,
            '',
            {
                fontSize: '18px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 400 }
            }
        ).setOrigin(0.5);
        
        // Create options container
        this.optionsContainer = scene.add.container(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY + 50
        );
        
        // Add all elements to main container
        this.container.add([
            this.background,
            this.titleText,
            this.descriptionText,
            this.optionsContainer
        ]);
        
        // Hide by default
        this.hide();
    }

    public show(encounter: BaseEncounter): void {
        // Update content
        this.titleText.setText(encounter.title);
        this.descriptionText.setText(encounter.description);
        
        // Clear previous options
        this.optionsContainer.removeAll(true);
        
        // Add encounter-specific options
        this.createOptions(encounter);
        
        // Show timer if needed
        if (encounter.timeLimit) {
            this.startTimer(encounter.timeLimit);
        }
        
        // Show the UI
        this.container.setVisible(true);
        
        // Make container interactive to prevent click-through
        this.background.setInteractive();
    }

    private createOptions(encounter: BaseEncounter): void {
        let yOffset = 0;
        
        // Add encounter-specific options based on type
        switch (encounter.type) {
            case EncounterType.DERELICT:
                this.addOption('Explore', () => this.handleOption('explore', encounter), yOffset);
                yOffset += 50;
                this.addOption('Scan', () => this.handleOption('scan', encounter), yOffset);
                break;
                
            case EncounterType.PIRATE:
                this.addOption('Fight', () => this.handleOption('fight', encounter), yOffset);
                yOffset += 50;
                this.addOption('Negotiate', () => this.handleOption('negotiate', encounter), yOffset);
                break;
                
            case EncounterType.TRADING:
                this.addOption('Trade', () => this.handleOption('trade', encounter), yOffset);
                yOffset += 50;
                this.addOption('Request Services', () => this.handleOption('services', encounter), yOffset);
                break;
        }
        
        // Add skip option if available
        if (encounter.isSkippable) {
            yOffset += 50;
            this.addOption('Skip', () => this.handleOption('skip', encounter), yOffset);
        }
    }

    private addOption(text: string, callback: () => void, yOffset: number): void {
        const option = this.scene.add.text(0, yOffset, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            // Call the callback and make the option non-interactive
            callback();
            option.setInteractive(false);
            option.setAlpha(0.5);
        })
        .on('pointerover', () => {
            option.setStyle({ color: '#ffff00', backgroundColor: '#666666' });
            this.scene.game.canvas.style.cursor = 'pointer';
        })
        .on('pointerout', () => {
            option.setStyle({ color: '#ffffff', backgroundColor: '#444444' });
            this.scene.game.canvas.style.cursor = 'default';
        });
        
        this.optionsContainer.add(option);
    }

    private handleOption(action: string, encounter: BaseEncounter): void {
        // Emit event for the encounter system to handle
        if (action === 'skip') {
            this.scene.game.events.emit('encounterSkip');
        } else {
            this.scene.game.events.emit('encounterAction', { action, encounter });
        }
    }

    private startTimer(duration: number): void {
        // Create timer text if it doesn't exist
        if (!this.timerText) {
            this.timerText = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 200,
                '',
                {
                    fontSize: '24px',
                    color: '#ff0000'
                }
            ).setOrigin(0.5);
            this.container.add(this.timerText);
        }
        
        // Clear existing timer if any
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }
        
        let timeLeft = duration;
        
        // Update timer text
        const updateTimer = () => {
            timeLeft--;
            this.timerText?.setText(`Time remaining: ${timeLeft}s`);
            
            if (timeLeft <= 0) {
                if (this.timerEvent) {
                    this.timerEvent.destroy();
                    this.timerEvent = undefined;
                }
                this.scene.game.events.emit('encounterTimeout');
                // Disable all options
                this.optionsContainer.list.forEach((option) => {
                    if (option instanceof Phaser.GameObjects.Text) {
                        option.setInteractive(false);
                        option.setAlpha(0.5);
                    }
                });
            }
        };
        
        // Create timer event
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: updateTimer,
            callbackScope: this,
            loop: true
        });

        // Initial display
        this.timerText.setText(`Time remaining: ${timeLeft}s`);
    }

    public hide(): void {
        // Stop timer if running
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = undefined;
        }
        
        // Hide the UI
        this.container.setVisible(false);
    }

    public destroy(): void {
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }
        this.container.destroy();
    }
} 