import { Card, CardData } from '../objects/Card';

export class DeckManager {
    private deck: Card[] = [];
    private hand: Card[] = [];
    private discardPile: Card[] = [];
    private maxHandSize: number = 5;
    
    constructor(initialCards?: CardData[]) {
        if (initialCards) {
            this.initializeDeck(initialCards);
        }
    }
    
    // Initialize the deck with card data
    public initializeDeck(cardDataList: CardData[]): void {
        this.deck = cardDataList.map(cardData => new Card(cardData));
        this.shuffleDeck();
    }
    
    // Shuffle the deck
    public shuffleDeck(): void {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    // Draw a card from the deck to the hand
    public drawCard(): Card | null {
        if (this.deck.length === 0) {
            // If deck is empty, reshuffle discard pile
            if (this.discardPile.length === 0) {
                return null; // No cards left to draw
            }
            this.reshuffleDiscardPile();
        }
        
        if (this.hand.length >= this.maxHandSize) {
            return null; // Hand is full
        }
        
        const card = this.deck.pop();
        if (card) {
            this.hand.push(card);
        }
        return card;
    }
    
    // Draw cards until hand is full
    public drawToMaxHand(): Card[] {
        const drawnCards: Card[] = [];
        while (this.hand.length < this.maxHandSize) {
            const card = this.drawCard();
            if (!card) break;
            drawnCards.push(card);
        }
        return drawnCards;
    }
    
    // Play a card from hand
    public playCard(index: number): Card | null {
        if (index < 0 || index >= this.hand.length) {
            return null;
        }
        
        const card = this.hand.splice(index, 1)[0];
        this.discardPile.push(card);
        return card;
    }
    
    // Reshuffle discard pile into deck
    private reshuffleDiscardPile(): void {
        this.deck = [...this.discardPile];
        this.discardPile = [];
        this.shuffleDeck();
    }
    
    // Add a card to the deck
    public addCard(cardData: CardData): void {
        const card = new Card(cardData);
        this.deck.push(card);
        this.shuffleDeck();
    }
    
    // Getters
    public getDeck(): Card[] {
        return this.deck;
    }
    
    public getHand(): Card[] {
        return this.hand;
    }
    
    public getDiscardPile(): Card[] {
        return this.discardPile;
    }
    
    // Reset everything
    public reset(): void {
        this.deck = [];
        this.hand = [];
        this.discardPile = [];
    }
} 