export class Card {
  public displayText: string;
  public underscores: number;

  constructor(card: {text: string[]}) {
    this.displayText = card.text.join('_');
    this.underscores = card.text.length - 1;
    console.log(card, this);
  }
}
