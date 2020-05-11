import { Card } from '../dtos/card';

export class DeckManager {
  private undealtCards: Card[] = [];
  private cardsInHands: Card[] = [];
  private playedCards: Card[] = [];

  constructor(cards: Card[]) {
    this.undealtCards = cards;
  }

  getCards(count = 1) {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(this.drawCard());
    }
    return cards;
  }

  private drawCard() {
    if (this.undealtCards.length === 0) {
      this.undealtCards = this.playedCards;
      this.playedCards = [];
    }
    const drawnCard = this.undealtCards[0];
    this.moveCard(drawnCard, this.undealtCards, this.cardsInHands);
    return drawnCard;
  }

  private moveCard(card: Card, from: Card[], to: Card[]) {
    from.splice(from.indexOf(card), 1);
    to.push(card);
  }
}
