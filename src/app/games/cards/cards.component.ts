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
import { PickUsernameComponent } from './pick-username/pick-username.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { JoinGameRequest } from 'src/server/games/cards/dtos/join-game-request';
import { interval } from 'rxjs';
import { Card } from 'src/server/games/cards/dtos/card';
import { Round } from 'src/server/games/cards/dtos/round';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  public knownGames: Game[];
  public knownDecks: CardCastDeck[];
  public currentGame: Game;
  public username: string;
  public messages: string[] = [];

  public currentRound: Round;
  public whiteCards: {selected: boolean, card: Card}[];
  public czarChosenWords: Card[];

  public cardsAreEqual = Card.cardsAreEqual;

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
    this.socket.on('game-created', (game: Game) => {
      this.joinGame(game);
    });
    this.socket.on('game-joined', (game: Game) => {
      this.messages = [];
      this.currentGame = game;
      this.messages.push(`Welcome to game '${game.name}'`);
    });
    this.socket.on('my-player-update', (whiteCards: Card[]) => {
      this.whiteCards = whiteCards.map(card => ({ selected: false, card}));
    });
    this.socket.on('start-round', (round: Round) => {
      this.reset();
      this.currentRound = round;
    });
    this.socket.on('judge-round', (round: Round) => {
      this.currentRound = round;
    });
    this.socket.on('end-round', (round: Round) => {
      this.currentRound = round;
      this.messages.unshift(`${round.winner} won round ${round.roundNumber}.
        "${round.blackCard.displayText}" -> ${round.chosenCards.map(card => `"${card.displayText}"`).join(', ')}`);
      console.log(round);
    });
    interval(1000).subscribe(() => this.sendEvent('request-reload', null));
  }

  public static getGameEntry() {
    return new GameEntry('Cards Against Josh',
      'cards',
      'Play this rip off of a game where you pick answers cards to play alongside prompt cards.',
      'placeholder.png',
      CardsComponent);
  }

  ngOnInit() {
    this.getUsername();
  }

  reset() {
    this.czarChosenWords = [];
    this.currentRound = null;
  }

  getUsername() {
    this.modalService.open(PickUsernameComponent, null).subscribe(username => {
      this.username = username;
    });
  }

  changeUsername() {
    this.modalService.open(ConfirmationModalComponent, 'Are you sure you want to change your username?').subscribe(result => {
      if (result) {
        this.username = null;
        this.getUsername();
      }
    });
  }

  leaveGame() {
    this.modalService.open(ConfirmationModalComponent, 'Are you sure you want to leave this game?').subscribe(result => {
      if (result) {
        this.currentGame = null;
      }
    });
  }

  createGame() {
    this.modalService.open(CreateGameComponent, new CreateGameModalRequest(this.knownDecks)).subscribe(data => {
      console.log(data);
      this.sendEvent('create-game', new CreateGameRequest(data.name, data.selectedDecks.map(deck => deck.id)));
    }, console.error);
  }

  joinGame(selectedGame: Game) {
    this.sendEvent('join-game', new JoinGameRequest(this.username, selectedGame.id));
  }

  sendEvent(eventType: string, data: any) {
    this.socket.emit('event', new SocketEvent('games', 'cards', new SocketData(eventType, data)));
  }

  getSelectedWhiteCards() {
    return this.whiteCards.filter(card => card.selected).map(card => card.card);
  }

  canSubmitCards() {
    return this.currentRound.blackCard.underscores === this.getSelectedWhiteCards().length;
  }

  playCards() {
    this.sendEvent('game.play-white-cards', this.getSelectedWhiteCards());
  }

  pickWinningCards() {
    this.sendEvent('game.pick-winning-cards', this.czarChosenWords);
    this.czarChosenWords = null;
  }
}
