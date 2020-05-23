import { PlayerStatus } from './player-status';
import { Card } from './card';

export class PlayerUpdate {
  constructor(public whiteCards: Card[], public state: PlayerStatus, public isHost: boolean) {}
}
