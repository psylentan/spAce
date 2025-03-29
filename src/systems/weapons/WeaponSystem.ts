import { Scene } from 'phaser';
import { IWeapon, IWeaponConfig } from './WeaponInterfaces';
import { PlasmaBlaster } from './PlasmaBlaster';
import { RocketLauncher } from './RocketLauncher';
import { CloakingDevice } from './CloakingDevice';
import { WeaponUI } from './WeaponUI';

export class WeaponSystem {
    private scene: Scene;
    private primaryWeapon: PlasmaBlaster;
    private secondaryWeapon: RocketLauncher;
    private specialWeapon: CloakingDevice;
    private weaponUI: WeaponUI;

    constructor(scene: Scene) {
        this.scene = scene;
        
        // Initialize weapons with configurations
        const plasmaConfig: IWeaponConfig = {
            damage: 10,
            cooldown: 300, // 0.3 seconds
            projectileSpeed: 600,
            projectileLifespan: 1000,
            sounds: {
                fire: 'plasma_fire',
                ready: 'weapon_ready'
            }
        };

        const rocketConfig: IWeaponConfig = {
            damage: 50,
            cooldown: 1000, // 1 second
            projectileSpeed: 400,
            projectileLifespan: 2000,
            sounds: {
                fire: 'rocket_fire',
                ready: 'weapon_ready'
            }
        };

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

        // Create weapons with configs
        this.primaryWeapon = new PlasmaBlaster(plasmaConfig);
        this.secondaryWeapon = new RocketLauncher(rocketConfig);
        this.specialWeapon = new CloakingDevice(cloakConfig);

        // Initialize weapons with scene
        this.primaryWeapon.initialize(scene);
        this.secondaryWeapon.initialize(scene);
        this.specialWeapon.initialize(scene);

        // Create weapon UI
        this.weaponUI = new WeaponUI(scene);

        // Setup input handlers
        this.setupInputHandlers();

        // Debug log
        console.log('WeaponSystem initialized with all weapons and UI');
    }

    private setupInputHandlers(): void {
        // Primary weapon (Left Mouse Button)
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                console.log('Left mouse button pressed - firing primary weapon');
                this.fireWeapon('primary');
            }
        });

        // Secondary weapon (Left Shift)
        const shiftKey = this.scene.input.keyboard!.addKey('SHIFT');
        shiftKey.on('down', () => {
            console.log('Shift pressed - firing secondary weapon');
            this.fireWeapon('secondary');
        });

        // Special weapon (Space)
        const spaceKey = this.scene.input.keyboard!.addKey('SPACE');
        spaceKey.on('down', () => {
            console.log('Space pressed - activating special weapon');
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

        const weapon = type === 'primary' ? this.primaryWeapon :
                      type === 'secondary' ? this.secondaryWeapon :
                      this.specialWeapon;

        weapon.fire(this.scene.ship);
    }

    update(delta: number): void {
        // Update all weapons
        this.primaryWeapon.update(delta);
        this.secondaryWeapon.update(delta);
        this.specialWeapon.update(delta);

        // Update UI with cooldown progress
        this.weaponUI.updateCooldowns({
            primary: this.primaryWeapon.getCooldownProgress(),
            secondary: this.secondaryWeapon.getCooldownProgress(),
            special: this.specialWeapon.getCooldownProgress()
        });
    }

    public getProjectileGroup(): Phaser.Physics.Arcade.Group {
        // Create a combined group for all weapon projectiles
        const combinedGroup = this.scene.physics.add.group();
        
        // Add projectiles from plasma blaster
        const plasmaGroup = this.primaryWeapon.getProjectileGroup();
        if (plasmaGroup) {
            combinedGroup.addMultiple(plasmaGroup.getChildren());
        }

        // Add projectiles from rocket launcher if it has a projectile group
        const rocketGroup = this.secondaryWeapon.getProjectileGroup();
        if (rocketGroup) {
            combinedGroup.addMultiple(rocketGroup.getChildren());
        }
        
        return combinedGroup;
    }
} 