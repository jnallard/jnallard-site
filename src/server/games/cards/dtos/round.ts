import { Card } from './card';
import { Player } from './player';

export class Round {
  public playedCards: Card[][];
  public chosenCards: Card[];
  public winner: string;
  constructor(public roundNumber: number, public blackCard: Card, public czar: Player) {}
}
