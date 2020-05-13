import { Socket } from 'socket.io';
import { Card } from '../dtos/card';

export class Player {
  public whiteCards: Card[] = [];
  public playedWhiteCards: Card[];
  constructor(public username: string, public socket: Socket) {}

  sendUpdate(currentBlackCard: Card) {
    this.socket.emit('my-player-update', this.whiteCards);
    this.socket.emit('current-black-card', currentBlackCard);
  }
}
