import { Game } from '../dtos/game';
import { Socket } from 'socket.io';
import { Player } from './player';
import { DeckManager } from './deck-manager';
import { Card } from '../dtos/card';
import { Round } from '../dtos/round';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { SocketEvent } from 'src/app/shared/models/socket-event';

export class GameController {
  public players: Player[] = [];
  public whiteCards: DeckManager;
  public blackCards: DeckManager;
  public rounds: Round[] = [];

  private currentRound: Round;
  private playedWhiteCards: Map<Player, Card[]> = new Map();

  constructor(public gameDto: Game, whiteCards: Card[], blackCards: Card[]) {
    this.whiteCards = new DeckManager(whiteCards);
    this.blackCards = new DeckManager(blackCards);
    this.startRound();
  }

  handleEvent(socket: Socket, event: SocketEvent) {
    switch (event.data.type) {
      case 'game.play-white-cards':
        this.playWhiteCards(socket, event.data.data as Card[], event.sessionId);
        break;
      case 'game.pick-winning-cards':
        this.finishRound(event.data.data as Card[]);
        break;
    }
  }

  addPlayer(username: string, socket: Socket, sessionId: string) {
    const player = new Player(username, socket, sessionId);
    this.players.push(player);
    this.gameDto.players.push(username);
    const startingCards = this.whiteCards.getCards(7);
    player.whiteCards.push(...startingCards);
    player.sendPlayerHand();
    player.sendRoundStart(this.currentRound);
  }

  playWhiteCards(socket: Socket, playedCards: Card[], sessionId: string) {
    const player = this.players.find(p => p.sessionId = sessionId);
    player.playedWhiteCards = playedCards;
    player.whiteCards = player.whiteCards.filter(card => !playedCards.find(playedCard => card.id === playedCard.id));
    player.whiteCards.push(...this.whiteCards.getCards(playedCards.length));
    this.playedWhiteCards.set(player, playedCards);
    this.checkAllCardsPlayed();
    player.sendPlayerHand();
  }

  checkAllCardsPlayed() {
    const isDone = this.players.every(player => player.playedWhiteCards);
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
    this.players.forEach(player => {
      player.playedWhiteCards.forEach(card => this.whiteCards.cardPlayed(card.displayText));
      player.playedWhiteCards = null;
      player.sendRoundEnd(this.currentRound);
    });
    of(true).pipe(delay(5000)).subscribe(() => this.startRound());
  }

  startRound() {
    const currentBlackCard = this.blackCards.getCards(1, false)[0];
    this.currentRound = new Round(this.rounds.length + 1, currentBlackCard);
    this.players.forEach(player => player.sendRoundStart(this.currentRound));
  }
}
