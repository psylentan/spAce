export interface CardEffect {
    action: 'damage' | 'heal' | 'shield';
    amount: number;
    target: 'self' | 'enemy';
}

export interface CardData {
    id: string;
    name: string;
    cost: number;
    effects: CardEffect[];
    type: 'combat';
    description: string;
}

export class Card {
    private data: CardData;
    
    constructor(data: CardData) {
        this.data = data;
    }
    
    public getId(): string {
        return this.data.id;
    }
    
    public getName(): string {
        return this.data.name;
    }
    
    public getCost(): number {
        return this.data.cost;
    }
    
    public getEffects(): CardEffect[] {
        return this.data.effects;
    }
    
    public getType(): string {
        return this.data.type;
    }
    
    public getDescription(): string {
        return this.data.description;
    }
    
    // Apply card effects to targets
    public applyEffects(player: any, enemy: any): void {
        this.data.effects.forEach(effect => {
            const target = effect.target === 'self' ? player : enemy;
            
            switch (effect.action) {
                case 'damage':
                    target.takeDamage(effect.amount);
                    break;
                case 'heal':
                    target.heal(effect.amount);
                    break;
                case 'shield':
                    target.addShield(effect.amount);
                    break;
            }
        });
    }
} 