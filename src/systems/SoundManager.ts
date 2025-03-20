export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  variation?: number;
}

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement[]>;
  private currentEngineLoop: HTMLAudioElement | null;
  private bgMusic: HTMLAudioElement | null;
  private basePath: string = '/sounds/';
  private audioContextInitialized: boolean = false;

  private constructor() {
    this.sounds = new Map();
    this.currentEngineLoop = null;
    this.bgMusic = null;
    this.loadSounds();
    console.log('SoundManager constructor called');
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
      console.log('Created new SoundManager instance');
    }
    return SoundManager.instance;
  }

  /**
   * Initialize audio context - must be called after user interaction
   * This unlocks audio on browsers with autoplay restrictions
   */
  public initAudio(): void {
    if (this.audioContextInitialized) return;
    
    // Create and resume AudioContext (for modern browsers)
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('AudioContext resumed successfully');
          this.audioContextInitialized = true;
          // Start background music after initialization
          this.playBackgroundMusic({ volume: 0.4 });
        });
      } else {
        this.audioContextInitialized = true;
      }
    }
    
    // Also try to play a silent sound to unlock audio on iOS
    const silentSound = new Audio();
    silentSound.play().catch(err => console.log('Silent sound failed:', err));
    
    console.log('Audio initialization attempted');
  }

  private loadSounds() {
    try {
      console.log('Loading sounds...');
      
      // Engine start sounds (4 variations)
      this.sounds.set('engineStart', [
        'engine-start1.mp3',
        'engine-start2.mp3',
        'engine-start3.mp3',
        'engine-start4.mp3'
      ].map(src => {
        const fullPath = this.basePath + src;
        console.log('Loading engine start sound:', fullPath);
        const audio = new Audio(fullPath);
        audio.onerror = (e) => console.error(`Error loading sound ${fullPath}:`, e);
        return audio;
      }));

      // Engine loop sounds (2 variations)
      this.sounds.set('engineLoop', [
        'engine-loop1.mp3',
        'engine-loop2.mp3'
      ].map(src => {
        const fullPath = this.basePath + src;
        console.log('Loading engine loop sound:', fullPath);
        const audio = new Audio(fullPath);
        audio.onerror = (e) => console.error(`Error loading sound ${fullPath}:`, e);
        return audio;
      }));

      // Background music
      const bgPath = this.basePath + 'space-arcade.mp3';
      console.log('Loading background music:', bgPath);
      const bgAudio = new Audio(bgPath);
      bgAudio.onerror = (e) => console.error('Error loading background music:', e);
      this.sounds.set('bgMusic', [bgAudio]);

      console.log('Sound manager initialized successfully');
    } catch (error) {
      console.error('Error initializing sound manager:', error);
    }
  }

  public playEngineStart(options: SoundOptions = {}): void {
    try {
      console.log('Attempting to play engine start sound...');
      const variations = this.sounds.get('engineStart') || [];
      const index = options.variation !== undefined 
        ? options.variation 
        : Math.floor(Math.random() * variations.length);
      const sound = variations[index];
      
      if (sound) {
        console.log('Playing engine start sound, variation:', index);
        sound.volume = options.volume || 1;
        sound.play()
          .then(() => console.log('Engine start sound played successfully'))
          .catch(error => console.warn('Error playing engine start sound:', error));
        
        // Automatically transition to engine loop after start sound
        sound.onended = () => this.playEngineLoop(options);
      } else {
        console.warn('No engine start sound found');
      }
    } catch (error) {
      console.error('Error playing engine start sound:', error);
    }
  }

  public playEngineLoop(options: SoundOptions = {}): void {
    try {
      console.log('Attempting to play engine loop sound...');
      if (this.currentEngineLoop) {
        this.currentEngineLoop.pause();
      }

      const variations = this.sounds.get('engineLoop') || [];
      const index = options.variation !== undefined 
        ? options.variation 
        : Math.floor(Math.random() * variations.length);
      const sound = variations[index];
      
      if (sound) {
        console.log('Playing engine loop sound, variation:', index);
        sound.volume = options.volume || 1;
        sound.loop = true;
        sound.play()
          .then(() => console.log('Engine loop sound played successfully'))
          .catch(error => console.warn('Error playing engine loop sound:', error));
        this.currentEngineLoop = sound;
      } else {
        console.warn('No engine loop sound found');
      }
    } catch (error) {
      console.error('Error playing engine loop sound:', error);
    }
  }

  public playBackgroundMusic(options: SoundOptions = {}): void {
    try {
      console.log('Attempting to play background music...');
      if (this.bgMusic) {
        this.bgMusic.pause();
      }

      const music = this.sounds.get('bgMusic')?.[0];
      if (music) {
        console.log('Playing background music');
        music.volume = options.volume || 0.5;
        music.loop = true;
        music.play()
          .then(() => console.log('Background music played successfully'))
          .catch(error => console.warn('Error playing background music:', error));
        this.bgMusic = music;
      } else {
        console.warn('No background music found');
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  public stopEngineLoop(): void {
    console.log('Stopping engine loop sound');
    if (this.currentEngineLoop) {
      this.currentEngineLoop.pause();
      this.currentEngineLoop = null;
    }
  }

  public stopAll(): void {
    console.log('Stopping all sounds');
    this.stopEngineLoop();
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
  }
}

export default SoundManager; 