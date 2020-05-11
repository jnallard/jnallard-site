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
  }

  pickBlackCard() {
    this.currentBlackCard = this.blackCards.getCards(1)[0];
    this.players.forEach(player => player.sendUpdate(this.currentBlackCard));
  }
}
