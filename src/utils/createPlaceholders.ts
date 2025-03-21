import Phaser from 'phaser';
import { createPlaceholder } from './assetPreloader';

/**
 * Creates all placeholder assets for development
 */
export const createAllPlaceholders = (scene: Phaser.Scene): void => {
    // UI Assets
    createPlaceholder(scene, 'loading-background', 400, 50, 0x222222);
    createPlaceholder(scene, 'loading-bar', 398, 48, 0x00ff00);
    createPlaceholder(scene, 'title', 400, 100, 0x333333);
    createPlaceholder(scene, 'button', 200, 50, 0x444444);

    // Ship Assets - Only create placeholders for projectiles since we have real ship assets
    createPlaceholder(scene, 'projectile', 8, 8, 0x00ffff);
    createPlaceholder(scene, 'enemy-projectile', 8, 8, 0xff6666);

    // Environment Assets
    createPlaceholder(scene, 'asteroid', 48, 48, 0x888888);
    createPlaceholder(scene, 'loot-crate', 32, 32, 0xffff00);
    createPlaceholder(scene, 'mining-station', 96, 96, 0x0088ff);
    createPlaceholder(scene, 'encounter-trigger', 48, 48, 0xff00ff);

    // Create explosion frames
    for (let i = 0; i < 6; i++) {
        createPlaceholder(scene, `explosion-${i}`, 64, 64, 0xffaa00 + (i * 0x001100));
    }

    // Card Assets
    createPlaceholder(scene, 'card-back', 120, 180, 0x222266);
    createPlaceholder(scene, 'card-frame', 120, 180, 0x222266);

    // Create placeholder sounds
    createPlaceholderSound(scene, 'shoot');
    createPlaceholderSound(scene, 'explosion');
    createPlaceholderSound(scene, 'collect');
    createPlaceholderSound(scene, 'card-play');
};

/**
 * Creates a placeholder sound that just beeps at different frequencies
 */
const createPlaceholderSound = (scene: Phaser.Scene, key: string): void => {
    if (!scene.cache.audio.exists(key)) {
        // Create an audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const duration = 0.1; // 100ms
        const frequency = getFrequencyForSound(key);
        
        // Create buffer
        const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Fill buffer with sine wave
        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
        }
        
        // Convert to WAV
        const wav = audioBufferToWav(buffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        // Load into Phaser
        scene.load.audio(key, url);
        scene.load.start(); // This will load the sound immediately
    }
};

/**
 * Get appropriate frequency for different sound types
 */
const getFrequencyForSound = (key: string): number => {
    switch (key) {
        case 'shoot':
            return 880; // A5 note
        case 'explosion':
            return 110; // A2 note
        case 'collect':
            return 1760; // A6 note
        case 'card-play':
            return 440; // A4 note
        default:
            return 440;
    }
};

/**
 * Convert AudioBuffer to WAV format
 */
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const data = new Float32Array(buffer.getChannelData(0));
    const dataSize = data.length * bytesPerSample;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, totalSize - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Audio data
    const offset = 44;
    for (let i = 0; i < data.length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        view.setInt16(offset + i * bytesPerSample, sample * 0x7FFF, true);
    }
    
    return arrayBuffer;
};

/**
 * Helper to write strings to DataView
 */
const writeString = (view: DataView, offset: number, string: string): void => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}; 