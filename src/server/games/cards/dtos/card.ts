export class Card {
  public displayText: string;
  public underscores: number;

  constructor(card: {text: string[]}) {
    this.displayText = card.text.join('_');
    this.underscores = card.text.length - 1;
  }

  public static cardsAreEqual(aCards: Card[], bCards: Card[]) {
    if (!aCards || !bCards) {
      return false;
    }
    if (aCards === bCards) {
      return true;
    }
    return aCards.every(aCard => bCards.some(bCard => bCard.displayText === aCard.displayText))
      && bCards.every(bCard => aCards.some(aCard => bCard.displayText === aCard.displayText));
  }
}
