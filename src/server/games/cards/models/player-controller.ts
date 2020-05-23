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
  constructor(public username: string, public socket: Socket, public sessionId: string, public isHost: boolean = false) {
  }

  isConnected() {
    return this.socket.connected;
  }

  sendPrivatePlayerUpdate() {
    this.sendEvent('my-player-update', new PlayerUpdate(this.whiteCards, this.state, this.isHost));
  }

  sendPlayersUpdate(players: Player[]) {
    this.sendEvent('players-update', players);
  }

  sendAllRounds(allRounds: Round[]) {
    this.sendEvent('all-rounds', allRounds);
  }

  sendRoundStart(currentRound: Round) {
    this.sendEvent('start-round', currentRound);
  }

  sendRoundJudge(currentRound: Round) {
    this.sendEvent('judge-round', currentRound);
  }

  sendRoundEnd(currentRound: Round) {
    this.sendEvent('end-round', currentRound);
  }

  sendMessage(message: string) {
    this.sendEvent('message', message);
  }

  sendEvent(key: string, value: any) {
    this.socket.emit(key, value);
  }

  getPlayerDto() {
    return new Player(this.username, this.score, this.state);
  }
}
