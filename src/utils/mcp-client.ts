export interface MCPConfig {
    assetServerUrl: string;
    testServerUrl?: string;
    analyticsServerUrl?: string;
}

export interface GenerateSpriteOptions {
    prompt: string;
    size?: [number, number];
}

export interface GenerateUIOptions {
    type: string;
    size?: [number, number];
    theme?: string;
}

export class MCPClient {
    private config: MCPConfig;

    constructor(config: MCPConfig) {
        this.config = config;
    }

    async generateSprite(options: GenerateSpriteOptions): Promise<string> {
        const response = await fetch(`${this.config.assetServerUrl}/api/generate/sprite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(options),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate sprite: ${response.statusText}`);
        }

        const data = await response.json();
        return data.sprite_path;
    }

    async generateUI(options: GenerateUIOptions): Promise<string> {
        const response = await fetch(`${this.config.assetServerUrl}/api/generate/ui`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(options),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate UI: ${response.statusText}`);
        }

        const data = await response.json();
        return data.ui_path;
    }

    async checkServerHealth(serverUrl: string): Promise<boolean> {
        try {
            const response = await fetch(`${serverUrl}/health`);
            const data = await response.json();
            return data.status === 'healthy';
        } catch (error) {
            console.error(`Health check failed for ${serverUrl}:`, error);
            return false;
        }
    }
} 