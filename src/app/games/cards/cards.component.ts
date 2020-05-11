import { Component, OnInit } from '@angular/core';
import { GameEntry } from '../models/game-entry';
import { Socket } from 'ngx-socket-io';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { SocketData } from 'src/app/shared/models/socket-data';
import { Game } from 'src/server/games/cards/dtos/game';
import { CardCastDeck } from 'src/server/games/cards/dtos/card-cast-deck';
import { CreateGameComponent } from './create-game/create-game.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CreateGameModalRequest } from './create-game/create-game-modal-request.model';
import { CreateGameRequest } from 'src/server/games/cards/dtos/create-game-request';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  public knownGames: Game[];
  public knownDecks: CardCastDeck[];
  public currentGame: Game;

  constructor(
    private modalService: ModalService,
    private socket: Socket
  ) {
    this.socket.emit('event', new SocketEvent('games', 'cards', new SocketData('loaded')));
    this.socket.on('game-list', (gameList: Game[]) => {
      this.knownGames = gameList;
    });
    this.socket.on('known-decks', (knownDecks: CardCastDeck[]) => {
      this.knownDecks = knownDecks;
    });
  }

  public static getGameEntry() {
    return new GameEntry('Cards Against Josh',
      'cards',
      'Play this rip off of a game where you pick answers cards to play alongside prompt cards.',
      'placeholder.png',
      CardsComponent);
  }

  ngOnInit() {
  }

  createGame() {
    this.modalService.open(CreateGameComponent, new CreateGameModalRequest(this.knownDecks)).subscribe(data => {
      console.log(data);
      this.sendEvent('create-game', new CreateGameRequest(data.name, data.selectedDecks.map(deck => deck.id)));
    }, console.error);
  }

  selectGame(selectedGame: Game) {
    this.currentGame = selectedGame;
  }

  sendEvent(eventType: string, data: any) {
    this.socket.emit('event', new SocketEvent('games', 'cards', new SocketData(eventType, data)));
  }

}
