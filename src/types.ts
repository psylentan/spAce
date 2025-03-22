export interface Card {
    id: string;
    name: string;
    cost: number;
    effects: CardEffect[];
    type: 'combat';
}

export interface CardEffect {
    action: 'damage' | 'heal';
    amount: number;
    target: 'self' | 'enemy';
}

export interface Encounter {
    id: string;
    enemyName: string;
    enemyHp: number;
    enemyDeck: Card[];
}

export interface PlayerState {
    hp: number;
    shield: number;
    deck: Card[];
    position: { x: number; y: number };
} 