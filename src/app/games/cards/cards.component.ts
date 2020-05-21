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
import { Player } from 'src/server/games/cards/dtos/player';
import { PlayerStatus } from 'src/server/games/cards/dtos/player-status';

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
  public players: Player[] = [];
  public PlayerStatus = PlayerStatus;

  public currentRound: Round;
  public whiteCards: Card[];
  public selectedWhiteCards: Card[];
  public czarChosenCards: Card[];
  public areCardsPlayed = false;

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
      this.whiteCards = whiteCards;
      this.selectedWhiteCards = [];
    });
    this.socket.on('players-update', (players: Player[]) => {
      this.players = players;
    });
    this.socket.on('start-round', (round: Round) => {
      this.reset();
      this.currentRound = round;
      this.areCardsPlayed = false;
    });
    this.socket.on('judge-round', (round: Round) => {
      this.currentRound = round;
    });
    this.socket.on('end-round', (round: Round) => {
      this.currentRound = round;
      this.addWinningCardsMessage(round);
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

  addWinningCardsMessage(round: Round) {
    let html = `<strong>${round.winner} won round ${round.roundNumber}.</strong><br/>`;
    const blackCardSplit = round.blackCard.displayText.split('_');
    const newArray = [] as string[];
    for (let i = 0; i < blackCardSplit.length; i++) {
      newArray.push(`${blackCardSplit[i].trim()} `);
      if (round.chosenCards[i]) {
        newArray.push(`<span class="white-text">${round.chosenCards[i].displayText.trim()}</span> `);
      }
    }
    html += `<p class="black-text">${newArray.join('')}</p>`;
    this.messages.unshift(html);
  }

  isRoundDone() {
    return this.currentRound && this.currentRound.winner;
  }

  reset() {
    this.czarChosenCards = null;
    this.currentRound = null;
  }

  getUsername() {
    const localStorageKey = 'caj-username';
    const storedUsername = localStorage.getItem(localStorageKey);
    if (storedUsername) {
      this.username = storedUsername;
      return;
    }

    this.modalService.open(PickUsernameComponent, null).subscribe(username => {
      this.username = username;
      localStorage.setItem(localStorageKey, username);
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

  toggleWhiteCard(whiteCard: Card) {
    if (this.selectedWhiteCards.includes(whiteCard)) {
      this.selectedWhiteCards.splice(this.selectedWhiteCards.indexOf(whiteCard), 1);
    } else {
      this.selectedWhiteCards.push(whiteCard);
    }
  }

  canSubmitCards() {
    return this.currentRound.blackCard.underscores === this.selectedWhiteCards.length && !this.isRoundDone() && !this.areCardsPlayed;
  }

  canChooseWinningCards() {
    return this.czarChosenCards && !this.isRoundDone(); // && is czar
  }

  playCards() {
    this.sendEvent('game.play-white-cards', this.selectedWhiteCards);
    this.areCardsPlayed = true;
  }

  pickWinningCards() {
    this.sendEvent('game.pick-winning-cards', this.czarChosenCards);
    this.czarChosenCards = null;
  }
}
