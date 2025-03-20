import { MCPClient } from './mcp-client';

export interface ShipConfig {
    type: 'player' | 'enemy' | 'derelict' | 'station';
    style: 'sleek' | 'bulky' | 'damaged' | 'alien';
    color: string;
    size: [number, number];
}

export interface AssetGeneratorMCPConfig {
    assetServerUrl: string;
}

export class AssetGeneratorMCP {
    private mcpClient: MCPClient;

    constructor(config: AssetGeneratorMCPConfig) {
        this.mcpClient = new MCPClient({
            assetServerUrl: config.assetServerUrl
        });
    }

    async generateShip(config: ShipConfig): Promise<string> {
        const prompt = this.buildShipPrompt(config);
        return await this.mcpClient.generateSprite({
            prompt,
            size: config.size
        });
    }

    private buildShipPrompt(config: ShipConfig): string {
        const basePrompt = `Generate a ${config.style} ${config.type} spaceship`;
        const colorPrompt = config.color ? ` with ${config.color} accents` : '';
        
        let specificDetails = '';
        switch (config.type) {
            case 'player':
                specificDetails = ' featuring sleek lines, visible thrusters, and a cockpit';
                break;
            case 'enemy':
                specificDetails = ' with aggressive angles, weapon mounts, and intimidating design';
                break;
            case 'derelict':
                specificDetails = ' showing battle damage, exposed internal structure, and dim lighting';
                break;
            case 'station':
                specificDetails = ' with multiple docking ports, habitat sections, and communication arrays';
                break;
        }

        return `${basePrompt}${colorPrompt}${specificDetails}. Use a pixel art style with clean edges and good contrast.`;
    }

    async generateBackground(theme: string, size: [number, number]): Promise<string> {
        return await this.mcpClient.generateSprite({
            prompt: `Generate a space ${theme} background with stars and nebula effects in pixel art style`,
            size
        });
    }

    async generateEffect(type: string, size: [number, number]): Promise<string> {
        return await this.mcpClient.generateSprite({
            prompt: `Generate a ${type} effect sprite sheet in pixel art style`,
            size
        });
    }

    async generateUI(type: string, size: [number, number]): Promise<string> {
        return await this.mcpClient.generateSprite({
            prompt: `Generate a sci-fi ${type} UI element with glowing edges and holographic effects`,
            size
        });
    }
} 