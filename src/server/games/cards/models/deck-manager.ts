import { Card } from '../dtos/card';

export class DeckManager {
  private undealtCards: Card[] = [];
  private cardsInHands: Card[] = [];
  private playedCards: Card[] = [];

  constructor(cards: Card[]) {
    this.undealtCards = cards;
    this.shuffle(this.undealtCards);
  }

  getCards(count = 1, drawToHand: boolean = true) {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(this.drawCard(drawToHand));
    }
    return cards;
  }

  cardPlayed(playedCardText: string) {
    const playedCard = this.cardsInHands.find(card => card.displayText === playedCardText);
    this.moveCard(playedCard, this.cardsInHands, this.playedCards);
  }

  private drawCard(drawToHand: boolean) {
    if (this.undealtCards.length === 0) {
      this.undealtCards = this.playedCards;
      this.playedCards = [];
      this.shuffle(this.undealtCards);
    }
    const drawnCard = this.undealtCards[0];
    this.moveCard(drawnCard, this.undealtCards, this.cardsInHands);
    if (!drawToHand) {
      this.cardPlayed(drawnCard.displayText);
    }
    return drawnCard;
  }

  private moveCard(card: Card, from: Card[], to: Card[]) {
    from.splice(from.indexOf(card), 1);
    to.push(card);
  }

  /**
   * Shuffles an array of cards
   * https://stackoverflow.com/a/12646864
   */
  private shuffle(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}
