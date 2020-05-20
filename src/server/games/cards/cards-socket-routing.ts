import { ISocketRouting } from 'src/server/i-socket-routing';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { Game } from './dtos/game';
import { CardService } from './card-service';
import { CardCastDeck } from './dtos/card-cast-deck';
import { CreateGameRequest } from './dtos/create-game-request';
import { JoinGameRequest } from './dtos/join-game-request';
import { GameController } from './models/game-controller';
import { Card } from './dtos/card';

export class CardsSocketRouting implements ISocketRouting {
  private gameDtos: Game[] = [];
  private cardCast = new CardService();
  private knownDecks: CardCastDeck[];
  private games: Map<string, GameController> = new Map();
  private sockets: Map<string, GameController> = new Map();

  constructor() {
    this.cardCast.loadDecks().subscribe(decks => this.knownDecks = decks);
  }

  handleEvent(socket: Socket, event: SocketEvent): void {
    const eventType = event.data.type;
    if (eventType.startsWith('game.')) {
      const game = this.sockets.get(event.sessionId);
      game.handleEvent(socket, event);
      return;
    }
    switch (eventType) {
      case 'loaded':
        this.updateGamesList(socket);
        this.getKnownDecks(socket);
        break;
      case 'request-reload':
        this.updateGamesList(socket);
        break;
      case 'create-game':
        this.createGame(socket, event.data.data as CreateGameRequest, event.sessionId);
        break;
      case 'join-game':
        this.joinGame(socket, event.data.data as JoinGameRequest, event.sessionId);
        break;
    }
  }

  updateGamesList(socket: Socket) {
    socket.emit('game-list', this.gameDtos);
  }

  getKnownDecks(socket: Socket) {
    socket.emit('known-decks', this.knownDecks);
  }

  createGame(socket: Socket, request: CreateGameRequest, sessionId: string) {
    const gameId = (this.gameDtos.length + 1).toString();
    const decks = request.deckIds.map(deckId => this.cardCast.getDeck(deckId));
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

  joinGame(socket: Socket, request: JoinGameRequest, sessionId: string) {
    const foundGame = this.games.get(request.gameId);
    foundGame.addPlayer(request.username, socket, sessionId);
    this.sockets.set(sessionId, foundGame);
    socket.emit('game-joined', foundGame.gameDto);
  }
}
