import { Socket } from 'socket.io';
import { Card } from '../dtos/card';
import { Round } from '../dtos/round';
import { PlayerStatus } from '../dtos/player-status';
import { Player } from '../dtos/player';
import { PlayerUpdate } from '../dtos/player-update';

export class PlayerController {
  public whiteCards: Card[] = [];
  public playedWhiteCards: Card[];
  public state = PlayerStatus.Selecting;
  public score = 0;
  constructor(public username: string, public socket: Socket, public sessionId: string) {
  }

  isConnected() {
    return this.socket.connected;
  }

  sendPrivatePlayerUpdate() {
    this.sendMessage('my-player-update', new PlayerUpdate(this.whiteCards, this.state));
  }

  sendPlayersUpdate(players: Player[]) {
    this.sendMessage('players-update', players);
  }

  sendAllRounds(allRounds: Round[]) {
    this.sendMessage('all-rounds', allRounds);
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

  getPlayerDto() {
    return new Player(this.username, this.score, this.state);
  }
}
