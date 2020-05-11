import { Card } from './card';

export class CardCastDeck {
  constructor(public name: string, public id: string, public blackCards: Card[], public whiteCards: Card[]) {}
}
