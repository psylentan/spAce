import { Scene, GameObjects, Math as PhaserMath, Physics } from 'phaser';

interface MeteoriteConfig {
    depth: number;
    smallCount: number;      // Number of small meteorites (particles)
    largeCount: number;      // Number of large meteorites (sprites)
    minSpeed: number;
    maxSpeed: number;
    minScale: number;
    maxScale: number;
    minRotation: number;
    maxRotation: number;
    colors: number[];
    beltWidth: number;
    beltHeight: number;
    beltAngle: number;      // Angle in degrees
    parallaxFactor: number;
    spawnInterval: number;  // Time between large meteorite spawns
}

const DEFAULT_CONFIG: MeteoriteConfig = {
    depth: -900,
    smallCount: 200,
    largeCount: 10,
    minSpeed: 20,
    maxSpeed: 50,
    minScale: 0.5,
    maxScale: 2,
    minRotation: -1,
    maxRotation: 1,
    colors: [0x8B8B8B, 0x696969, 0xA0522D, 0x8B4513],
    beltWidth: 4000,
    beltHeight: 1000,
    beltAngle: 15,
    parallaxFactor: 0.7,
    spawnInterval: 2000
};

interface LargeMeteor extends Physics.Arcade.Sprite {
    rotationSpeed: number;
    baseVelocity: Phaser.Math.Vector2;
    trailEmitter?: GameObjects.Particles.ParticleEmitter;
}

export class MeteoriteBelt {
    private scene: Scene;
    private config: MeteoriteConfig;
    private smallMeteors!: GameObjects.Particles.ParticleEmitter;
    private largeMeteors!: Physics.Arcade.Group;
    private spawnTimer: number;
    private meteorTextures: string[] = ['meteorSmall', 'meteorMedium', 'meteorLarge'];

    constructor(scene: Scene, config: Partial<MeteoriteConfig> = {}) {
        this.scene = scene;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.spawnTimer = 0;

        this.createMeteoriteTextures();
        this.createSmallMeteorField();
        this.createLargeMeteorSystem();

        // Update loop for large meteorites
        this.scene.events.on('update', this.update, this);
    }

    private createMeteoriteTextures(): void {
        // Create textures for different sizes if they don't exist
        ['Small', 'Medium', 'Large'].forEach((size, index) => {
            const key = `meteor${size}`;
            if (!this.scene.textures.exists(key)) {
                const graphics = this.scene.add.graphics();
                const radius = (index + 1) * 8; // 8, 16, 24 pixels

                // Base shape
                graphics.lineStyle(2, 0xFFFFFF, 0.8);
                graphics.fillStyle(0x888888, 1);
                
                // Create irregular polygon
                const points: number[][] = [];
                const segments = 8 + index * 2;
                for (let i = 0; i < segments; i++) {
                    const angle = (i / segments) * Math.PI * 2;
                    const variance = 0.3;
                    const r = radius * (1 + (Math.random() * variance - variance/2));
                    points.push([
                        Math.cos(angle) * r,
                        Math.sin(angle) * r
                    ]);
                }

                // Draw shape
                graphics.beginPath();
                graphics.moveTo(points[0][0], points[0][1]);
                points.forEach(point => graphics.lineTo(point[0], point[1]));
                graphics.closePath();
                graphics.fill();
                graphics.stroke();

                // Surface details
                graphics.fillStyle(0x666666, 0.8);
                for (let i = 0; i < 3 + index * 2; i++) {
                    const x = PhaserMath.Between(-radius, radius);
                    const y = PhaserMath.Between(-radius, radius);
                    const craterSize = PhaserMath.Between(2, 4 + index);
                    graphics.fillCircle(x, y, craterSize);
                }

                // Generate texture
                graphics.generateTexture(key, radius * 2.5, radius * 2.5);
                graphics.destroy();
            }
        });
    }

    private createSmallMeteorField(): void {
        // Create dense field of small meteorites using particles
        const emitterConfig = {
            x: { min: -this.config.beltWidth/2, max: this.config.beltWidth/2 },
            y: { min: -this.config.beltHeight/2, max: this.config.beltHeight/2 },
            speedX: { min: -this.config.minSpeed, max: this.config.maxSpeed },
            speedY: { min: -this.config.minSpeed * Math.sin(PhaserMath.DegToRad(this.config.beltAngle)),
                     max: this.config.maxSpeed * Math.sin(PhaserMath.DegToRad(this.config.beltAngle)) },
            scale: { min: this.config.minScale * 0.5, max: this.config.maxScale * 0.5 },
            rotate: { min: 0, max: 360 },
            lifespan: { min: 10000, max: 20000 },
            quantity: 1,
            frequency: 100,
            alpha: { start: 0.8, end: 0.8 },
            tint: { random: this.config.colors },
            maxParticles: this.config.smallCount
        };

        this.smallMeteors = this.scene.add.particles(0, 0, 'meteorSmall', emitterConfig);
        this.smallMeteors.setDepth(this.config.depth);
    }

    private createLargeMeteorSystem(): void {
        // Create physics group for large meteorites
        this.largeMeteors = this.scene.physics.add.group({
            classType: Physics.Arcade.Sprite,
            maxSize: this.config.largeCount,
            runChildUpdate: true
        });

        // Initial spawn of large meteorites
        for (let i = 0; i < this.config.largeCount / 2; i++) {
            this.spawnLargeMeteor();
        }
    }

    private spawnLargeMeteor(): void {
        // Calculate spawn position along the belt
        const angle = PhaserMath.DegToRad(this.config.beltAngle);
        const spawnDistance = this.config.beltWidth / 2;
        const side = Math.random() > 0.5 ? 1 : -1;
        
        const x = side * spawnDistance;
        const y = (Math.random() - 0.5) * this.config.beltHeight;

        // Create meteor sprite
        const texture = PhaserMath.RND.pick(this.meteorTextures.slice(1)); // Medium or Large only
        const meteor = this.largeMeteors.create(x, y, texture) as LargeMeteor;
        
        if (meteor) {
            const scale = PhaserMath.FloatBetween(this.config.minScale, this.config.maxScale);
            meteor.setScale(scale);
            
            // Set random rotation speed
            meteor.rotationSpeed = PhaserMath.FloatBetween(
                this.config.minRotation,
                this.config.maxRotation
            );

            // Set velocity based on belt angle
            const speed = PhaserMath.FloatBetween(this.config.minSpeed, this.config.maxSpeed);
            meteor.baseVelocity = new PhaserMath.Vector2(
                -side * speed * Math.cos(angle),
                speed * Math.sin(angle)
            );
            meteor.setVelocity(meteor.baseVelocity.x, meteor.baseVelocity.y);

            // Add trail effect for large meteorites
            if (texture === 'meteorLarge') {
                this.addMeteorTrail(meteor);
            }

            meteor.setDepth(this.config.depth + 1);
        }
    }

    private addMeteorTrail(meteor: LargeMeteor): void {
        const trailConfig = {
            follow: meteor,
            frequency: 50,
            scale: { start: 0.5, end: 0.1 },
            alpha: { start: 0.6, end: 0 },
            tint: this.config.colors,
            lifespan: 1000,
            quantity: 1,
            blendMode: 'ADD' as const
        };

        meteor.trailEmitter = this.scene.add.particles(0, 0, 'meteorSmall', trailConfig);
        meteor.trailEmitter.setDepth(this.config.depth);
    }

    private update(time: number, delta: number): void {
        // Spawn new large meteorites periodically
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.config.spawnInterval) {
            this.spawnTimer = 0;
            if (this.largeMeteors.countActive() < this.config.largeCount) {
                this.spawnLargeMeteor();
            }
        }

        // Update large meteorites
        this.largeMeteors.getChildren().forEach((gameObject: GameObjects.GameObject) => {
            const meteor = gameObject as LargeMeteor;
            // Apply rotation
            meteor.rotation += meteor.rotationSpeed * (delta / 1000);

            // Check if meteor is out of bounds
            const bounds = this.config.beltWidth;
            if (Math.abs(meteor.x) > bounds || Math.abs(meteor.y) > bounds) {
                if (meteor.trailEmitter) {
                    meteor.trailEmitter.destroy();
                }
                meteor.destroy();
            }
        });

        // Update parallax effect
        const camera = this.scene.cameras.main;
        const parallaxX = camera.scrollX * (1 - this.config.parallaxFactor);
        const parallaxY = camera.scrollY * (1 - this.config.parallaxFactor);
        
        this.smallMeteors.setPosition(parallaxX, parallaxY);
    }

    public setDepth(depth: number): void {
        this.config.depth = depth;
        this.smallMeteors.setDepth(depth);
        this.largeMeteors.setDepth(depth + 1);
    }

    public setVisible(visible: boolean): void {
        this.smallMeteors.setVisible(visible);
        this.largeMeteors.setVisible(visible);
    }

    public destroy(): void {
        this.scene.events.off('update', this.update, this);
        this.smallMeteors.destroy();
        this.largeMeteors.clear(true, true);
        this.largeMeteors.destroy();
    }
} 