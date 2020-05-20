import { Socket } from 'socket.io';
import { Card } from '../dtos/card';
import { Round } from '../dtos/round';

export class Player {
  public whiteCards: Card[] = [];
  public playedWhiteCards: Card[];
  constructor(public username: string, private socket: Socket, public sessionId: string) {
  }

  sendPlayerHand() {
    this.sendMessage('my-player-update', this.whiteCards);
  }

  sendRoundStart(currentRound: Round) {
    this.sendMessage('start-round', currentRound);
  }

  sendRoundJudge(currentRound: Round) {
    this.sendMessage('judge-round', currentRound);
  }

  sendRoundEnd(currentRound: Round) {
    this.sendMessage('end-round', currentRound);
  }

  sendMessage(key: string, value: any) {
    this.socket.emit(key, value);
  }
}
