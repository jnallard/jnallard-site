import { ISocketRouting } from 'src/server/i-socket-routing';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { Game } from './dtos/game';
import { CardCastWrapper } from './card-cast-wrapper';
import { CardCastDeck } from './dtos/card-cast-deck';
import { forkJoin } from 'rxjs';
import { CreateGameRequest } from './dtos/create-game-request';
import { JoinGameRequest } from './dtos/join-game-request';
import { GameController } from './models/game-controller';
import { Card } from './dtos/card';

export class CardsSocketRouting implements ISocketRouting {
  private gameDtos: Game[] = [];
  private cardCast = new CardCastWrapper();
  private knownDeckIds = ['4WHKA'];
  private knownDecks: CardCastDeck[];
  private games: Map<string, GameController> = new Map();
  private sockets: Map<Socket, GameController> = new Map();

  constructor() {
    forkJoin(this.knownDeckIds.map(deckId => this.cardCast.getDeck(deckId)))
      .subscribe(decks => this.knownDecks = decks.filter(deck => deck != null));
  }

  handleEvent(socket: Socket, event: SocketEvent): void {
    switch (event.data.type) {
      case 'loaded':
        this.updateGamesList(socket);
        this.getKnownDecks(socket);
        break;
      case 'request-reload':
        this.updateGamesList(socket);
        break;
      case 'create-game':
        this.createGame(socket, event.data.data as CreateGameRequest);
        break;
      case 'join-game':
        this.joinGame(socket, event.data.data as JoinGameRequest);
        break;
      case 'play-white-cards':
        const game = this.sockets.get(socket);
        game.playWhiteCards(socket, event.data.data as Card[]);
        break;
    }
  }

  updateGamesList(socket: Socket) {
    socket.emit('game-list', this.gameDtos);
  }

  getKnownDecks(socket: Socket) {
    socket.emit('known-decks', this.knownDecks);
  }

  createGame(socket: Socket, request: CreateGameRequest) {
    const gameId = (this.gameDtos.length + 1).toString();
    const decks = request.deckIds.map(deckId => this.knownDecks.find(deck => deck.id === deckId));
    const whiteCards = decks.reduce((array, currentValue) => {
      array.push(...currentValue.whiteCards);
      return array;
    }, [] as Card[]);
    const blackCards = decks.reduce((array, currentValue) => {
      array.push(...currentValue.blackCards);
      return array;
    }, [] as Card[]);
    const newGame = new GameController(new Game(gameId, request.name), whiteCards, blackCards);
    this.games.set(gameId, newGame);
    this.gameDtos.push(newGame.gameDto);
    this.updateGamesList(socket);
    socket.emit('game-created', newGame.gameDto);
  }

  joinGame(socket: Socket, request: JoinGameRequest) {
    const foundGame = this.games.get(request.gameId);
    foundGame.addPlayer(request.username, socket);
    this.sockets.set(socket, foundGame);
    socket.emit('game-joined', foundGame.gameDto);
  }
}
