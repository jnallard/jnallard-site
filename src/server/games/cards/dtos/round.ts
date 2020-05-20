import { Card } from './card';

export class Round {
  public playedCards: Card[][];
  public chosenCards: Card[];
  public winner: string;
  constructor(public roundNumber: number, public blackCard: Card) {}
}
