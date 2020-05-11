import { ISocketRouting } from 'src/server/i-socket-routing';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { Game } from './dtos/game';
import { CardCastWrapper } from './card-cast-wrapper';
import { CardCastDeck } from './dtos/card-cast-deck';
import { forkJoin } from 'rxjs';
import { CreateGameRequest } from './dtos/create-game-request';

export class CardsSocketRouting implements ISocketRouting {
  private games: Game[] = [new Game('1', 'test-game')];
  private cardCast = new CardCastWrapper();
  private knownDeckIds = ['7RTVN', '4WHKA'];
  private knownDecks: CardCastDeck[];

  constructor() {
    forkJoin(this.knownDeckIds.map(deckId => this.cardCast.getDeck(deckId))).subscribe(decks => this.knownDecks = decks);
  }

  handleEvent(socket: Socket, event: SocketEvent): void {
    this.cardCast.getDeck('4WHKA').subscribe(a => console.log(a));
    switch (event.data.type) {
      case 'loaded':
        this.updateGamesList(socket);
        this.getKnownDecks(socket);
        break;
      case 'create-game':
        this.createGame(socket, event.data.data as CreateGameRequest);
        break;
    }
  }

  updateGamesList(socket: Socket) {
    socket.emit('game-list', this.games);
  }

  getKnownDecks(socket: Socket) {
    socket.emit('known-decks', this.knownDecks);
  }

  createGame(socket: Socket, request: CreateGameRequest) {
    this.games.push(new Game('2', request.name));
    this.updateGamesList(socket);
  }
}
