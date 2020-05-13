import { Game } from '../dtos/game';
import { Socket } from 'socket.io';
import { Player } from './player';
import { DeckManager } from './deck-manager';
import { Card } from '../dtos/card';

export class GameController {
  public players: Player[] = [];
  public whiteCards: DeckManager;
  public blackCards: DeckManager;

  private currentBlackCard: Card;

  constructor(public gameDto: Game, whiteCards: Card[], blackCards: Card[]) {
    this.whiteCards = new DeckManager(whiteCards);
    this.blackCards = new DeckManager(blackCards);
    this.pickBlackCard();
  }

  addPlayer(username: string, socket: Socket) {
    const player = new Player(username, socket);
    this.players.push(player);
    this.gameDto.players.push(username);
    const startingCards = this.whiteCards.getCards(7);
    player.whiteCards.push(...startingCards);
    player.sendUpdate(this.currentBlackCard);
    socket.on('play-white-cards', (cards: Card[]) => {
    });
  }

  playWhiteCards(socket: Socket, playedCards: Card[]) {
    const player = this.players.find(p => p.socket = socket);
    player.playedWhiteCards = playedCards;
    player.whiteCards = player.whiteCards.filter(card => !playedCards.find(playedCard => card.displayText === playedCard.displayText));
    player.whiteCards.push(...this.whiteCards.getCards(playedCards.length));
    playedCards.forEach(card => this.whiteCards.cardPlayed(card.displayText));
    this.checkRoundDone();
  }

  checkRoundDone() {
    const isDone = this.players.every(player => player.playedWhiteCards);
    if (isDone) {
      this.finishRound();
    }
  }

  finishRound() {
    this.players.forEach(player => player.playedWhiteCards = null);
    this.pickBlackCard();
  }

  pickBlackCard() {
    this.currentBlackCard = this.blackCards.getCards(1, false)[0];
    this.players.forEach(player => player.sendUpdate(this.currentBlackCard));
  }
}
