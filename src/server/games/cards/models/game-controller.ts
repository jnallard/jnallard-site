import { Game } from '../dtos/game';
import { Socket } from 'socket.io';
import { DeckManager } from './deck-manager';
import { Card } from '../dtos/card';
import { Round } from '../dtos/round';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { PlayerController } from './player-controller';
import { PlayerStatus } from '../dtos/player-status';

export class GameController {
  public players: PlayerController[] = [];
  public whiteCards: DeckManager;
  public blackCards: DeckManager;
  public rounds: Round[] = [];

  private currentRound: Round;
  private czar: PlayerController;
  private playedWhiteCards: Map<PlayerController, Card[]> = new Map();
  private isOver = false;
  private startedTime = new Date();

  constructor(public gameId, public gameName: string,  whiteCards: Card[], blackCards: Card[]) {
    this.whiteCards = new DeckManager(whiteCards);
    this.blackCards = new DeckManager(blackCards);
  }

  handleEvent(event: SocketEvent) {
    const player = this.players.find(p => p.sessionId === event.sessionId);
    switch (event.data.type) {
      case 'game.play-white-cards':
        this.playWhiteCards(event.data.data as Card[], player);
        break;
      case 'game.pick-winning-cards':
        this.finishRound(event.data.data as Card[]);
        break;
      case 'game.force-reveal':
        if (player.isHost) {
          this.forceRevealWhiteCards(player);
        }
        break;
      case 'game.force-round-end':
        if (player.isHost) {
          const currentRoundNumber = this.currentRound.roundNumber;
          this.skipRound();
          this.sendMessage(`Host ${player.username} has skipped Round ${currentRoundNumber}`);
        }
        break;
    }
  }

  forceRevealWhiteCards(host: PlayerController) {
    const revealedPlayers = this.players.filter(p => p.state === PlayerStatus.Played);
    const unrevealedPlayers = this.players.filter(p => p.state === PlayerStatus.Selecting);
    if (unrevealedPlayers.length > 0 && revealedPlayers.length > 0) {
      this.revealWhiteCards();
      this.sendMessage(`Host ${host.username} has skipped waiting for others
        (${unrevealedPlayers.map(p => p.username).join(', ')}) to play white cards`);
    }
  }

  isGameOver() {
    const timeSurpassedMs: number = new Date().getTime() - this.startedTime.getTime();
    return this.isOver || (this.players.every(player => !player.isConnected()) && (timeSurpassedMs > 10000));
  }

  leaveGame(player: PlayerController) {
    this.players.splice(this.players.indexOf(player), 1);
    if (this.players.length === 0) {
      this.isOver = true;
    } else if (player === this.czar) {
      this.startRound();
    }  else {
      this.checkAllCardsPlayed();
    }
    this.sendMessage(`${player.username} has left the game with ${player.score} point(s)`);
  }

  addPlayer(username: string, socket: Socket, sessionId: string) {
    const isHost = this.players.length === 0;
    const player = new PlayerController(username, socket, sessionId, isHost);
    this.players.push(player);
    if (this.players.length === 1) {
      this.startRound();
    }
    const startingCards = this.whiteCards.getCards(7);
    player.whiteCards.push(...startingCards);
    player.sendPrivatePlayerUpdate();
    player.sendRoundStart(this.currentRound);
    player.sendAllRounds(this.rounds);
    this.sendPlayerUpdates();
    this.sendMessage(`${player.username} has joined the game`);
  }

  reconnectPlayer(socket: Socket, sessionId: string) {
    const player = this.players.find(p => p.sessionId === sessionId);
    player.socket = socket;
    player.sendPrivatePlayerUpdate();
    player.sendRoundStart(this.currentRound);
    player.sendAllRounds(this.rounds);
    this.sendPlayerUpdates();
  }

  playWhiteCards(playedCards: Card[], player: PlayerController) {
    player.playedWhiteCards = playedCards;
    player.whiteCards = player.whiteCards.filter(card => !playedCards.find(playedCard => card.id === playedCard.id));
    player.whiteCards.push(...this.whiteCards.getCards(playedCards.length));
    this.playedWhiteCards.set(player, playedCards);
    player.state = PlayerStatus.Played;
    this.checkAllCardsPlayed();
    player.sendPrivatePlayerUpdate();
    this.sendPlayerUpdates();
  }

  checkAllCardsPlayed() {
    const isDone = this.players.every(player => player.playedWhiteCards || player === this.czar);
    if (isDone) {
      this.revealWhiteCards();
    }
  }

  revealWhiteCards() {
    this.currentRound.playedCards = [...this.playedWhiteCards.values()];
    this.players.forEach(player => player.sendRoundJudge(this.currentRound));
  }

  finishRound(winningCards: Card[]) {
    this.currentRound.chosenCards = winningCards;
    const winner = [...this.playedWhiteCards].find(mapping => Card.cardsAreEqual(mapping[1], winningCards))[0];
    this.currentRound.winner = winner.username;
    winner.score++;
    this.players.forEach(player => {
      if (player.playedWhiteCards) {
        player.playedWhiteCards.forEach(card => this.whiteCards.cardPlayed(card.displayText));
        player.playedWhiteCards = null;
      }
      player.sendRoundEnd(this.currentRound);
    });
    this.sendPlayerUpdates();
    this.playedWhiteCards.clear();
    of(true).pipe(delay(5000)).subscribe(() => this.startRound());
  }

  skipRound() {
    this.players.forEach(player => {
      if (player.playedWhiteCards) {
        player.playedWhiteCards.forEach(card => this.whiteCards.cardPlayed(card.displayText));
        player.playedWhiteCards = null;
      }
    });
    this.playedWhiteCards.clear();
    this.startRound();
  }

  getNextCzar(lastCzar: PlayerController) {
    if (!lastCzar) {
      return this.players[0];
    }
    const index = this.players.indexOf(lastCzar);
    if (index >= this.players.length - 1 || index < 0) {
      return this.players[0];
    }
    return this.players[index + 1];
  }

  startRound() {
    const currentBlackCard = this.blackCards.getCards(1, false)[0];
    this.czar = this.getNextCzar(this.czar);
    this.currentRound = new Round(this.rounds.length + 1, currentBlackCard, this.czar.getPlayerDto());
    this.rounds.push(this.currentRound);
    this.players.forEach(player => {
      player.sendRoundStart(this.currentRound);
      player.state = PlayerStatus.Selecting;
    });
    this.czar.state = PlayerStatus.CardCzar;
    this.sendPlayerUpdates();
  }

  sendPlayerUpdates() {
    const players = this.players.map(player => player.getPlayerDto());
    this.players.forEach(player => {
      player.sendPlayersUpdate(players);
      player.sendPrivatePlayerUpdate();
    });
  }

  getGameDto() {
    const gameDto = new Game(this.gameId, this.gameName);
    gameDto.players = this.players.map(p => p.username);
    return gameDto;
  }

  sendMessage(message: string) {
    this.players.forEach(player => player.sendMessage(message));
  }
}
