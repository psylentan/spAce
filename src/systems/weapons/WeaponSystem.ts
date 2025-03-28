import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';
import { PlasmaBlaster } from './PlasmaBlaster';
import { RocketLauncher } from './RocketLauncher';
import { CloakingDevice } from './CloakingDevice';

export class WeaponSystem {
    private scene: Scene;
    private primaryWeapon: PlasmaBlaster;
    private secondaryWeapon: RocketLauncher;
    private specialWeapon: CloakingDevice;
    private weaponUI: WeaponUI;

    constructor(scene: Scene) {
        this.scene = scene;
        
        // Initialize primary weapon (Plasma Blaster)
        const plasmaConfig: IWeaponConfig = {
            damage: 10,
            cooldown: 300, // 0.3 seconds
            projectileSpeed: 600,
            projectileLifespan: 1000, // 1 second
            sounds: {
                fire: 'plasma_fire',
                ready: 'weapon_ready'
            }
        };
        
        // Initialize secondary weapon (Rocket Launcher)
        const rocketConfig: IWeaponConfig = {
            damage: 50,
            cooldown: 1000, // 1 second
            projectileSpeed: 400,
            projectileLifespan: 2000, // 2 seconds
            sounds: {
                fire: 'rocket_fire',
                ready: 'weapon_ready'
            }
        };

        // Initialize special weapon (Cloaking Device)
        const cloakConfig: IWeaponConfig = {
            damage: 0,
            cooldown: 15000, // 15 seconds
            projectileSpeed: 0,
            projectileLifespan: 0,
            sounds: {
                fire: 'cloak_activate',
                ready: 'weapon_ready'
            }
        };
        
        this.primaryWeapon = new PlasmaBlaster(plasmaConfig);
        this.secondaryWeapon = new RocketLauncher(rocketConfig);
        this.specialWeapon = new CloakingDevice(cloakConfig);
        
        this.primaryWeapon.initialize(scene);
        this.secondaryWeapon.initialize(scene);
        this.specialWeapon.initialize(scene);

        // Create weapon UI
        this.weaponUI = new WeaponUI(scene);

        // Set up input handlers
        this.setupInputHandlers();
    }

    private setupInputHandlers(): void {
        // Primary weapon (left mouse button)
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.fireWeapon('primary');
            }
        });

        // Secondary weapon (left shift)
        this.scene.input.keyboard?.addKey('SHIFT').on('down', () => {
            this.fireWeapon('secondary');
        });

        // Special weapon (spacebar)
        this.scene.input.keyboard?.addKey('SPACE').on('down', () => {
            this.fireWeapon('special');
        });
    }

    // Static method to generate weapon sound data
    static generateWeaponSounds(): { plasmaFire: ArrayBuffer, weaponReady: ArrayBuffer, rocketFire: ArrayBuffer, cloakActivate: ArrayBuffer } {
        const ctx = new AudioContext();

        // Generate plasma fire sound
        const plasmaBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
        const plasmaData = plasmaBuffer.getChannelData(0);
        for (let i = 0; i < plasmaBuffer.length; i++) {
            const t = i / ctx.sampleRate;
            plasmaData[i] = Math.sin(2000 * Math.PI * t) * Math.exp(-8 * t);
        }

        // Generate rocket fire sound
        const rocketBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
        const rocketData = rocketBuffer.getChannelData(0);
        for (let i = 0; i < rocketBuffer.length; i++) {
            const t = i / ctx.sampleRate;
            rocketData[i] = (
                Math.sin(400 * Math.PI * t) * 0.5 +
                Math.sin(200 * Math.PI * t) * 0.3 +
                Math.sin(600 * Math.PI * t) * 0.2
            ) * Math.exp(-4 * t);
        }

        // Generate cloak activate sound (ethereal whoosh)
        const cloakBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const cloakData = cloakBuffer.getChannelData(0);
        for (let i = 0; i < cloakBuffer.length; i++) {
            const t = i / ctx.sampleRate;
            // Mix of frequencies for an ethereal sound
            cloakData[i] = (
                Math.sin(300 * Math.PI * t) * 0.3 +
                Math.sin(600 * Math.PI * t * (1 + t)) * 0.4 +
                Math.sin(900 * Math.PI * t * (1 - t * 0.5)) * 0.3
            ) * Math.exp(-2 * t);
        }

        // Generate weapon ready sound
        const readyBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const readyData = readyBuffer.getChannelData(0);
        for (let i = 0; i < readyBuffer.length; i++) {
            const t = i / ctx.sampleRate;
            readyData[i] = Math.sin(1500 * Math.PI * t) * Math.exp(-12 * t);
        }

        return {
            plasmaFire: this.audioBufferToWav(plasmaBuffer),
            rocketFire: this.audioBufferToWav(rocketBuffer),
            cloakActivate: this.audioBufferToWav(cloakBuffer),
            weaponReady: this.audioBufferToWav(readyBuffer)
        };
    }

    // Static helper to convert AudioBuffer to WAV format
    private static audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
        const numChannels = 1;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = buffer.length * blockAlign;
        const headerSize = 44;
        const totalSize = headerSize + dataSize;
        
        const arrayBuffer = new ArrayBuffer(totalSize);
        const dataView = new DataView(arrayBuffer);
        const channelData = buffer.getChannelData(0);
        
        // Write WAV header
        const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                dataView.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        dataView.setUint32(4, totalSize - 8, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        dataView.setUint32(16, 16, true);
        dataView.setUint16(20, format, true);
        dataView.setUint16(22, numChannels, true);
        dataView.setUint32(24, sampleRate, true);
        dataView.setUint32(28, byteRate, true);
        dataView.setUint16(32, blockAlign, true);
        dataView.setUint16(34, bitDepth, true);
        writeString(36, 'data');
        dataView.setUint32(40, dataSize, true);
        
        // Write audio data
        let offset = 44;
        for (let i = 0; i < buffer.length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            dataView.setInt16(offset, value, true);
            offset += 2;
        }
        
        return arrayBuffer;
    }

    fireWeapon(type: 'primary' | 'secondary' | 'special'): void {
        if (!this.scene.ship) return;

        const ship = this.scene.ship;
        switch (type) {
            case 'primary':
                this.primaryWeapon.fire(
                    this.scene,
                    ship.x,
                    ship.y,
                    ship.angle
                );
                break;
            case 'secondary':
                this.secondaryWeapon.fire(
                    this.scene,
                    ship.x,
                    ship.y,
                    ship.angle
                );
                break;
            case 'special':
                this.specialWeapon.fire(
                    this.scene,
                    ship.x,
                    ship.y,
                    ship.angle
                );
                break;
        }
    }

    update(delta: number): void {
        // Update weapons
        this.primaryWeapon.update(delta);
        this.secondaryWeapon.update(delta);
        this.specialWeapon.update(delta);

        // Update UI
        this.weaponUI.updateCooldowns({
            primary: this.primaryWeapon.getCooldownProgress(),
            secondary: this.secondaryWeapon.getCooldownProgress(),
            special: this.specialWeapon.getCooldownProgress()
        });
    }
}

class WeaponUI {
    private scene: Scene;
    private primaryCooldownBar: Phaser.GameObjects.Graphics;
    private secondaryCooldownBar: Phaser.GameObjects.Graphics;
    private specialCooldownBar: Phaser.GameObjects.Graphics;

    constructor(scene: Scene) {
        this.scene = scene;
        this.primaryCooldownBar = scene.add.graphics();
        this.secondaryCooldownBar = scene.add.graphics();
        this.specialCooldownBar = scene.add.graphics();
        
        this.primaryCooldownBar.setScrollFactor(0);
        this.secondaryCooldownBar.setScrollFactor(0);
        this.specialCooldownBar.setScrollFactor(0);
        
        this.primaryCooldownBar.setDepth(1000);
        this.secondaryCooldownBar.setDepth(1000);
        this.specialCooldownBar.setDepth(1000);
    }

    updateCooldowns(progress: { primary: number, secondary: number, special: number }): void {
        // Clear all bars
        this.primaryCooldownBar.clear();
        this.secondaryCooldownBar.clear();
        this.specialCooldownBar.clear();

        // Draw primary weapon cooldown bar
        this.primaryCooldownBar.fillStyle(0x444444);
        this.primaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 30, 100, 10);
        
        this.primaryCooldownBar.fillStyle(0x4444ff);
        this.primaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 30, 100 * progress.primary, 10);

        // Draw secondary weapon cooldown bar
        this.secondaryCooldownBar.fillStyle(0x444444);
        this.secondaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 50, 100, 10);
        
        this.secondaryCooldownBar.fillStyle(0xff4444);
        this.secondaryCooldownBar.fillRect(10, this.scene.cameras.main.height - 50, 100 * progress.secondary, 10);

        // Draw special weapon cooldown bar
        this.specialCooldownBar.fillStyle(0x444444);
        this.specialCooldownBar.fillRect(10, this.scene.cameras.main.height - 70, 100, 10);
        
        this.specialCooldownBar.fillStyle(0x44ffff);
        this.specialCooldownBar.fillRect(10, this.scene.cameras.main.height - 70, 100 * progress.special, 10);

        // Show ready effects
        if (progress.primary === 1) {
            this.primaryCooldownBar.lineStyle(2, 0xffffff);
            this.primaryCooldownBar.strokeRect(10, this.scene.cameras.main.height - 30, 100, 10);
        }
        if (progress.secondary === 1) {
            this.secondaryCooldownBar.lineStyle(2, 0xffffff);
            this.secondaryCooldownBar.strokeRect(10, this.scene.cameras.main.height - 50, 100, 10);
        }
        if (progress.special === 1) {
            this.specialCooldownBar.lineStyle(2, 0xffffff);
            this.specialCooldownBar.strokeRect(10, this.scene.cameras.main.height - 70, 100, 10);
        }
    }
} 