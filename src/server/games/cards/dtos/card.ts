export class Card {
  public underscores: number;

  constructor(public displayText: string, public id: string) {
    this.underscores = displayText.split('_').length - 1 || 1;
  }

  public static cardsAreEqual(aCards: Card[], bCards: Card[]) {
    if (!aCards || !bCards) {
      return false;
    }
    if (aCards === bCards) {
      return true;
    }
    return aCards.every(aCard => bCards.some(bCard => bCard.id === aCard.id))
      && bCards.every(bCard => aCards.some(aCard => bCard.id === aCard.id));
  }
}
