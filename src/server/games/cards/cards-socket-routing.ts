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
  private lastGameId = 0;
  private cardCast = new CardService();
  private knownDecks: CardCastDeck[];
  private games: Map<string, GameController> = new Map();
  private gamesforSession: Map<string, GameController> = new Map();

  constructor() {
    this.cardCast.loadDecks().subscribe(decks => this.knownDecks = decks);
  }

  getGames() {
    return [...this.games.values()];
  }

  handleEvent(socket: Socket, event: SocketEvent): void {
    const eventType = event.data.type;
    const game = this.gamesforSession.get(event.sessionId);
    if (eventType.startsWith('game.')) {
      game.handleEvent(event);
    } else {
      switch (eventType) {
        case 'loaded':
          this.updateGamesList(socket);
          this.getKnownDecks(socket);
          if (game) {
            game.reconnectPlayer(socket, event.sessionId);
            this.sendGameJoined(socket, game);
          }
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
        case 'leave-game':
          game.leaveGame(event.sessionId);
          this.gamesforSession.delete(event.sessionId);
          break;
      }
    }
    this.getGames().filter(g => g.isGameOver()).forEach(finishedGame => {
      this.games.delete(finishedGame.gameId);
    });
  }

  updateGamesList(socket: Socket) {
    socket.emit('game-list', this.getGames().filter(game => !game.isGameOver()).map(game => game.getGameDto()));
  }

  getKnownDecks(socket: Socket) {
    socket.emit('known-decks', this.knownDecks);
  }

  createGame(socket: Socket, request: CreateGameRequest, sessionId: string) {
    const gameId = (++this.lastGameId).toString();
    const decks = request.deckIds.map(deckId => this.cardCast.getDeck(deckId));
    const whiteCards = decks.reduce((array, currentValue) => {
      array.push(...currentValue.whiteCards);
      return array;
    }, [] as Card[]);
    const blackCards = decks.reduce((array, currentValue) => {
      array.push(...currentValue.blackCards);
      return array;
    }, [] as Card[]);
    const newGame = new GameController(gameId, request.name, whiteCards, blackCards);
    this.games.set(gameId, newGame);
    this.updateGamesList(socket);
    socket.emit('game-created', newGame.getGameDto());
  }

  joinGame(socket: Socket, request: JoinGameRequest, sessionId: string) {
    const foundGame = this.games.get(request.gameId);
    foundGame.addPlayer(request.username, socket, sessionId);
    this.gamesforSession.set(sessionId, foundGame);
    this.sendGameJoined(socket, foundGame);
  }

  sendGameJoined(socket: Socket, game: GameController) {
    socket.emit('game-joined', game.getGameDto());
  }
}
