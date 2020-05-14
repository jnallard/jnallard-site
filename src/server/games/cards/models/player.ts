import { Socket } from 'socket.io';
import { Card } from '../dtos/card';
import { Round } from '../dtos/round';

export class Player {
  public whiteCards: Card[] = [];
  public playedWhiteCards: Card[];
  constructor(public username: string, public socket: Socket) {}

  sendPlayerHand() {
    this.socket.emit('my-player-update', this.whiteCards);
  }

  sendRoundStart(currentRound: Round) {
    this.socket.emit('start-round', currentRound);
  }

  sendRoundJudge(currentRound: Round) {
    this.socket.emit('judge-round', currentRound);
  }

  sendRoundEnd(currentRound: Round) {
    this.socket.emit('end-round', currentRound);
  }
}
